import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoContext, BaseItem } from '../types';

export interface ScanIteratorInput {
    tableName: string;
    pageSize?: number;
    startToken?: string;
}

export const scanIterator =
    (context: DynamoContext) =>
    async function* <T extends BaseItem>(input: ScanIteratorInput): AsyncGenerator<T> {
        const { client, logger } = context;
        const { tableName, pageSize, startToken } = input;

        let exclusiveStartKey: Record<string, any> | undefined;
        if (startToken) {
            try {
                const decoded = Buffer.from(startToken, 'base64').toString('utf-8');
                exclusiveStartKey = JSON.parse(decoded);
            } catch {
                throw new Error('Invalid startToken');
            }
        }

        logger?.debug('scanIterator:start', { data: { tableName, pageSize } });

        let count = 0;

        try {
            do {
                const command: ScanCommand = new ScanCommand({
                    TableName: tableName,
                    Limit: pageSize,
                    ExclusiveStartKey: exclusiveStartKey,
                });
                const result = await client.send(command);

                if (result.Items) {
                    for (const item of result.Items) {
                        count++;
                        yield item as T;
                    }
                }

                logger?.debug('scanIterator:page', { data: { count } });

                exclusiveStartKey = result.LastEvaluatedKey;
            } while (exclusiveStartKey);

            logger?.debug('scanIterator:done', { data: { totalCount: count } });
        } catch (error) {
            logger?.debug('scanIterator:error', { error });
            throw error;
        }
    };
