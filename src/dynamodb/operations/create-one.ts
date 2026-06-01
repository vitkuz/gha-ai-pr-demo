import { PutCommand, PutCommandOutput } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { DynamoContext, BaseItem } from '../types';

export interface CreateOneInput<T extends BaseItem> {
    tableName: string;
    item: Omit<T, 'id' | 'pk'> & { id?: string; pk?: string };
}

export const createOne =
    (context: DynamoContext) =>
    async <T extends BaseItem>(input: CreateOneInput<T>): Promise<PutCommandOutput> => {
        const { client, logger } = context;
        const { tableName, item } = input;

        const id: string = item.id || uuidv4();
        const pk: string = item.pk || id;

        if (item.id && item.pk && item.id !== item.pk) {
            throw new Error(`Item id (${item.id}) must match pk (${item.pk})`);
        }

        if (!pk || !item.sk) {
            throw new Error('pk and sk are required');
        }

        const finalItem: T = { ...item, id, pk } as T;

        logger?.debug('createOne:start', { data: { tableName, pk, sk: item.sk } });

        try {
            const command: PutCommand = new PutCommand({
                TableName: tableName,
                Item: finalItem,
                ConditionExpression: 'attribute_not_exists(pk) AND attribute_not_exists(sk)',
            });
            const result: PutCommandOutput = await client.send(command);
            logger?.debug('createOne:success');
            return result;
        } catch (error) {
            logger?.debug('createOne:error', { error });
            throw error;
        }
    };
