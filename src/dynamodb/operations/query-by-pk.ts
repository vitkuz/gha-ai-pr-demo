import { QueryCommand, QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import { DynamoContext, BaseItem } from '../types';

export interface QueryByPkInput {
    tableName: string;
    pk: string;
    limit?: number;
    nextToken?: string;
}

export interface QueryByPkOutput<T extends BaseItem> {
    items: T[];
    nextToken?: string;
}

const decodeToken = (token: string): Record<string, any> =>
    JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));

const encodeToken = (key: Record<string, any>): string =>
    Buffer.from(JSON.stringify(key)).toString('base64');

export const queryByPk =
    (context: DynamoContext) =>
    async <T extends BaseItem>(input: QueryByPkInput): Promise<QueryByPkOutput<T>> => {
        const { client, logger } = context;
        const { tableName, pk, limit, nextToken } = input;

        const exclusiveStartKey: Record<string, any> | undefined = nextToken
            ? decodeToken(nextToken)
            : undefined;

        logger?.debug('queryByPk:start', { data: { tableName, pk, limit } });

        try {
            const command: QueryCommand = new QueryCommand({
                TableName: tableName,
                KeyConditionExpression: 'pk = :pk',
                ExpressionAttributeValues: { ':pk': pk },
                Limit: limit,
                ExclusiveStartKey: exclusiveStartKey,
            });
            const result: QueryCommandOutput = await client.send(command);

            const items: T[] = (result.Items as T[]) || [];
            const responseNextToken: string | undefined = result.LastEvaluatedKey
                ? encodeToken(result.LastEvaluatedKey)
                : undefined;

            logger?.debug('queryByPk:success', { data: { count: items.length } });
            return { items, nextToken: responseNextToken };
        } catch (error) {
            logger?.debug('queryByPk:error', { error });
            throw error;
        }
    };
