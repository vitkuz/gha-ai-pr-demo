import { UpdateCommand, UpdateCommandOutput } from '@aws-sdk/lib-dynamodb';
import { DynamoContext } from '../types';

export interface PatchOneInput {
    tableName: string;
    pk: string;
    sk: string;
    patch: Record<string, any>;
}

const SKIP_KEYS: string[] = ['id', 'pk', 'sk'];

export const patchOne =
    (context: DynamoContext) =>
    async (input: PatchOneInput): Promise<UpdateCommandOutput> => {
        const { client, logger } = context;
        const { tableName, pk, sk, patch } = input;

        if (!pk || !sk) {
            throw new Error('pk and sk are required');
        }

        const keys: string[] = Object.keys(patch).filter(
            (key: string): boolean => !SKIP_KEYS.includes(key),
        );

        if (keys.length === 0) {
            throw new Error('No updatable attributes provided');
        }

        const expressionAttributeNames: Record<string, string> = {};
        const expressionAttributeValues: Record<string, any> = {};
        const assignments: string[] = keys.map((key: string): string => {
            const nameKey: string = `#${key}`;
            const valueKey: string = `:${key}`;
            expressionAttributeNames[nameKey] = key;
            expressionAttributeValues[valueKey] = patch[key];
            return `${nameKey} = ${valueKey}`;
        });

        const updateExpression: string = `SET ${assignments.join(', ')}`;

        logger?.debug('patchOne:start', { data: { tableName, pk, sk } });

        try {
            const command: UpdateCommand = new UpdateCommand({
                TableName: tableName,
                Key: { pk, sk },
                UpdateExpression: updateExpression,
                ExpressionAttributeNames: expressionAttributeNames,
                ExpressionAttributeValues: expressionAttributeValues,
                ReturnValues: 'ALL_NEW',
            });
            const result: UpdateCommandOutput = await client.send(command);
            logger?.debug('patchOne:success');
            return result;
        } catch (error) {
            logger?.debug('patchOne:error', { error });
            throw error;
        }
    };
