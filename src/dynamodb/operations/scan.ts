import { ScanCommand, ScanCommandOutput } from '@aws-sdk/lib-dynamodb';
import { DynamoContext } from '../types';

export interface ScanInput {
    tableName: string;
}

export interface ScanOutput {
    items: Record<string, any>[];
    count: number;
    scannedCount: number;
}

export const scan =
    (context: DynamoContext) =>
    async (input: ScanInput): Promise<ScanOutput> => {
        const { client, logger } = context;
        const { tableName } = input;

        logger?.debug('scan:start', { data: { tableName } });

        try {
            const items: Record<string, any>[] = [];
            let count: number = 0;
            let scannedCount: number = 0;
            let exclusiveStartKey: Record<string, any> | undefined = undefined;

            do {
                const command: ScanCommand = new ScanCommand({
                    TableName: tableName,
                    ExclusiveStartKey: exclusiveStartKey,
                });
                const result: ScanCommandOutput = await client.send(command);

                if (result.Items) {
                    items.push(...result.Items);
                }
                count += result.Count || 0;
                scannedCount += result.ScannedCount || 0;
                exclusiveStartKey = result.LastEvaluatedKey;
            } while (exclusiveStartKey);

            logger?.debug('scan:success', { data: { count, scannedCount } });
            return { items, count, scannedCount };
        } catch (error) {
            logger?.debug('scan:error', { error });
            throw error;
        }
    };
