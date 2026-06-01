import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoContext, BaseItem } from '../types';

export interface QueryByPkIteratorInput {
    tableName: string;
    pk: string;
    pageSize?: number;
    startToken?: string;
}

export const queryByPkIterator =
    (context: DynamoContext) =>
    async function* <T extends BaseItem>(input: QueryByPkIteratorInput): AsyncGenerator<T> {
        const { client, logger } = context;
        const { tableName, pk, pageSize, startToken } = input;

        let exclusiveStartKey: Record<string, any> | undefined;
        if (startToken) {
            try {
                const decoded = Buffer.from(startToken, 'base64').toString('utf-8');
                exclusiveStartKey = JSON.parse(decoded);
            } catch {
                throw new Error('Invalid startToken');
            }
        }

        logger?.debug('queryByPkIterator:start', { data: { tableName, pk, pageSize } });

        let count = 0;

        try {
            do {
                const command: QueryCommand = new QueryCommand({
                    TableName: tableName,
                    KeyConditionExpression: 'pk = :pk',
                    ExpressionAttributeValues: {
                        ':pk': pk,
                    },
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

                logger?.debug('queryByPkIterator:page', { data: { count } });

                exclusiveStartKey = result.LastEvaluatedKey;
            } while (exclusiveStartKey);

            logger?.debug('queryByPkIterator:done', { data: { totalCount: count } });
        } catch (error) {
            logger?.debug('queryByPkIterator:error', { error });
            throw error;
        }
    };
