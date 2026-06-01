import { InvokeCommand, InvokeCommandOutput } from '@aws-sdk/client-lambda';
import { LambdaContext } from '../types';

export interface InvokeAsyncInput {
    functionName: string;
    payload?: unknown;
}

export interface InvokeAsyncOutput {
    statusCode: number;
    functionError: string | undefined;
}

export const invokeAsync =
    (context: LambdaContext) =>
    async (input: InvokeAsyncInput): Promise<InvokeAsyncOutput> => {
        const { client, logger } = context;
        const { functionName, payload } = input;

        logger?.debug('invoke-async:start', { data: { functionName } });

        try {
            const command: InvokeCommand = new InvokeCommand({
                FunctionName: functionName,
                InvocationType: 'Event',
                Payload: payload !== undefined ? Buffer.from(JSON.stringify(payload)) : undefined,
            });
            const result: InvokeCommandOutput = await client.send(command);

            logger?.debug('invoke-async:success');

            return {
                statusCode: result.StatusCode ?? -1,
                functionError: result.FunctionError,
            };
        } catch (error) {
            logger?.debug('invoke-async:error', { error });
            throw error;
        }
    };
