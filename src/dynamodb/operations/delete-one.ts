import { DeleteCommand, DeleteCommandOutput } from '@aws-sdk/lib-dynamodb';
import { DynamoContext } from '../types';

export interface DeleteOneInput {
    tableName: string;
    pk: string;
    sk: string;
}

export const deleteOne =
    (context: DynamoContext) =>
    async (input: DeleteOneInput): Promise<DeleteCommandOutput> => {
        const { client, logger } = context;
        const { tableName, pk, sk } = input;

        if (!pk || !sk) {
            throw new Error('pk and sk are required');
        }

        logger?.debug('deleteOne:start', { data: { tableName, pk, sk } });

        try {
            const command: DeleteCommand = new DeleteCommand({
                TableName: tableName,
                Key: { pk, sk },
            });
            const result: DeleteCommandOutput = await client.send(command);
            logger?.debug('deleteOne:success');
            return result;
        } catch (error) {
            logger?.debug('deleteOne:error', { error });
            throw error;
        }
    };
