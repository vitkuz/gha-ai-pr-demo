import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { DynamoContext, BaseItem } from '../types';

export interface QueryByPkInput {
    tableName: string;
    pk: string;
    limit?: number;
    nextToken?: string;
}

export interface QueryByPkOutput<T> {
    items: T[];
    nextToken?: string;
}

export const queryByPk =
    (context: DynamoContext) =>
    async <T extends BaseItem>(input: QueryByPkInput): Promise<QueryByPkOutput<T>> => {
        const { client, logger } = context;
        const { tableName, pk, limit, nextToken } = input;

        const commandInput: QueryCommandInput = {
            TableName: tableName,
            KeyConditionExpression: 'pk = :pk',
            ExpressionAttributeValues: {
                ':pk': pk,
            },
        };

        if (limit !== undefined) {
            commandInput.Limit = limit;
        }

        if (nextToken) {
            try {
                const decoded = Buffer.from(nextToken, 'base64').toString('utf-8');
                commandInput.ExclusiveStartKey = JSON.parse(decoded);
            } catch {
                throw new Error('Invalid nextToken');
            }
        }

        logger?.debug('queryByPk:start', { data: { tableName, pk, limit } });

        try {
            const command: QueryCommand = new QueryCommand(commandInput);
            const result = await client.send(command);

            const items = (result.Items || []) as T[];
            let responseNextToken: string | undefined;

            if (result.LastEvaluatedKey) {
                responseNextToken = Buffer.from(
                    JSON.stringify(result.LastEvaluatedKey),
                ).toString('base64');
            }

            logger?.debug('queryByPk:success', { data: { count: items.length } });
            return { items, nextToken: responseNextToken };
        } catch (error) {
            logger?.debug('queryByPk:error', { error });
            throw error;
        }
    };
