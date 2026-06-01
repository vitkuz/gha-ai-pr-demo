import { GetCommand, GetCommandOutput } from '@aws-sdk/lib-dynamodb';
import { DynamoContext, BaseItem } from '../types';

export interface GetOneInput {
    tableName: string;
    pk: string;
    sk: string;
}

export const getOne =
    (context: DynamoContext) =>
    async <T extends BaseItem>(input: GetOneInput): Promise<T | null> => {
        const { client, logger } = context;
        const { tableName, pk, sk } = input;

        logger?.debug('getOne:start', { data: { tableName, pk, sk } });

        try {
            const command: GetCommand = new GetCommand({
                TableName: tableName,
                Key: { pk, sk },
            });
            const result: GetCommandOutput = await client.send(command);

            if (!result.Item) {
                logger?.debug('getOne:not-found', { data: { tableName, pk, sk } });
                return null;
            }

            logger?.debug('getOne:success');
            return result.Item as T;
        } catch (error) {
            logger?.debug('getOne:error', { error });
            throw error;
        }
    };
