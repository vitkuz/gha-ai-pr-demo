import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoContext, BaseItem } from '../types';

export interface ScanInput {
    tableName: string;
}

export interface ScanOutput<T> {
    items: T[];
    count: number;
    scannedCount: number;
}

export const scan =
    (context: DynamoContext) =>
    async <T extends BaseItem>(input: ScanInput): Promise<ScanOutput<T>> => {
        const { client, logger } = context;
        const { tableName } = input;

        logger?.debug('scan:start', { data: { tableName } });

        try {
            const allItems: T[] = [];
            let lastEvaluatedKey: Record<string, any> | undefined;

            do {
                const command: ScanCommand = new ScanCommand({
                    TableName: tableName,
                    ExclusiveStartKey: lastEvaluatedKey,
                });
                const result = await client.send(command);

                if (result.Items) {
                    allItems.push(...(result.Items as T[]));
                }

                lastEvaluatedKey = result.LastEvaluatedKey;
            } while (lastEvaluatedKey);

            logger?.debug('scan:success', {
                data: { count: allItems.length, scannedCount: allItems.length },
            });
            return { items: allItems, count: allItems.length, scannedCount: allItems.length };
        } catch (error) {
            logger?.debug('scan:error', { error });
            throw error;
        }
    };
