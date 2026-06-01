import { UpdateCommand, UpdateCommandOutput } from '@aws-sdk/lib-dynamodb';
import { DynamoContext, BaseItem } from '../types';

export interface PatchOneInput {
    tableName: string;
    pk: string;
    sk: string;
    patch: Record<string, any>;
}

export const patchOne =
    (context: DynamoContext) =>
    async <T extends BaseItem>(input: PatchOneInput): Promise<T> => {
        const { client, logger } = context;
        const { tableName, pk, sk, patch } = input;

        const skippedKeys = new Set(['id', 'pk', 'sk']);
        const updatableKeys = Object.keys(patch).filter((k) => !skippedKeys.has(k));

        if (updatableKeys.length === 0) {
            throw new Error('No updatable attributes provided');
        }

        const updateExpressionParts: string[] = [];
        const expressionAttributeValues: Record<string, any> = {};
        const expressionAttributeNames: Record<string, string> = {};

        for (const key of updatableKeys) {
            const attrName = `#${key}`;
            const attrValue = `:${key}`;
            updateExpressionParts.push(`${attrName} = ${attrValue}`);
            expressionAttributeNames[attrName] = key;
            expressionAttributeValues[attrValue] = patch[key];
        }

        const UpdateExpression = `SET ${updateExpressionParts.join(', ')}`;

        logger?.debug('patchOne:start', { data: { tableName, pk, sk, updatableKeys } });

        try {
            const command: UpdateCommand = new UpdateCommand({
                TableName: tableName,
                Key: { pk, sk },
                UpdateExpression,
                ExpressionAttributeNames: expressionAttributeNames,
                ExpressionAttributeValues: expressionAttributeValues,
                ReturnValues: 'ALL_NEW',
            });
            const result: UpdateCommandOutput = await client.send(command);
            logger?.debug('patchOne:success');
            return result.Attributes as T;
        } catch (error) {
            logger?.debug('patchOne:error', { error });
            throw error;
        }
    };
