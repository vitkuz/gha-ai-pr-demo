import { ListFunctionsCommand, ListFunctionsCommandOutput } from '@aws-sdk/client-lambda';
import { LambdaContext } from '../types';

export interface ListFunctionsInput {
    marker?: string;
    maxItems?: number;
}

export const listFunctions =
    (context: LambdaContext) =>
    async (input: ListFunctionsInput = {}): Promise<ListFunctionsCommandOutput> => {
        const { client, logger } = context;
        const { marker, maxItems } = input;

        logger?.debug('listFunctions:start', { data: { marker, maxItems } });

        try {
            const command: ListFunctionsCommand = new ListFunctionsCommand({
                Marker: marker,
                MaxItems: maxItems,
            });
            const result: ListFunctionsCommandOutput = await client.send(command);
            logger?.debug('listFunctions:success', {
                data: { count: result.Functions?.length },
            });
            return result;
        } catch (error) {
            logger?.debug('listFunctions:error', { error });
            throw error;
        }
    };
