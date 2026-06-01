import { InvokeCommand, InvokeCommandOutput } from '@aws-sdk/client-lambda';
import { LambdaContext } from '../types';

export interface InvokeAsyncInput {
    functionName: string;
    payload?: unknown;
}

export const invokeAsync =
    (context: LambdaContext) =>
    async (input: InvokeAsyncInput): Promise<InvokeCommandOutput> => {
        const { client, logger } = context;
        const { functionName, payload } = input;

        logger?.debug('invokeAsync:start', { data: { functionName } });

        try {
            const command: InvokeCommand = new InvokeCommand({
                FunctionName: functionName,
                InvocationType: 'Event',
                Payload: payload === undefined ? undefined : Buffer.from(JSON.stringify(payload)),
            });
            const result: InvokeCommandOutput = await client.send(command);
            logger?.debug('invokeAsync:success', { data: { statusCode: result.StatusCode } });
            return result;
        } catch (error) {
            logger?.debug('invokeAsync:error', { error });
            throw error;
        }
    };
