import { ListFunctionsCommand, ListFunctionsCommandOutput, FunctionConfiguration } from '@aws-sdk/client-lambda';
import { LambdaContext } from '../types';

export interface ListFunctionsInput {
    marker?: string;
    maxItems?: number;
}

export interface ListFunctionsOutput {
    functions: FunctionConfiguration[];
    nextMarker: string | undefined;
}

export const listFunctions =
    (context: LambdaContext) =>
    async (input: ListFunctionsInput): Promise<ListFunctionsOutput> => {
        const { client, logger } = context;
        const { marker, maxItems } = input;

        logger?.debug('list-functions:start', { data: { marker, maxItems } });

        try {
            const command: ListFunctionsCommand = new ListFunctionsCommand({
                Marker: marker,
                MaxItems: maxItems,
            });
            const result: ListFunctionsCommandOutput = await client.send(command);

            logger?.debug('list-functions:success');

            return {
                functions: result.Functions ?? [],
                nextMarker: result.NextMarker,
            };
        } catch (error) {
            logger?.debug('list-functions:error', { error });
            throw error;
        }
    };
