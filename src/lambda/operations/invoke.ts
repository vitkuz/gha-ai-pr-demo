import { InvokeCommand, InvokeCommandOutput } from '@aws-sdk/client-lambda';
import { LambdaContext } from '../types';

export interface InvokeInput {
    functionName: string;
    payload?: unknown;
}

export interface InvokeResult {
    statusCode: number | undefined;
    payload: unknown;
    functionError?: string;
    result: InvokeCommandOutput;
}

export const invoke =
    (context: LambdaContext) =>
    async (input: InvokeInput): Promise<InvokeResult> => {
        const { client, logger } = context;
        const { functionName, payload } = input;

        logger?.debug('invoke:start', { data: { functionName } });

        try {
            const command: InvokeCommand = new InvokeCommand({
                FunctionName: functionName,
                InvocationType: 'RequestResponse',
                Payload: payload === undefined ? undefined : Buffer.from(JSON.stringify(payload)),
            });
            const result: InvokeCommandOutput = await client.send(command);

            const raw: string = result.Payload ? Buffer.from(result.Payload).toString('utf-8') : '';

            let parsedPayload: unknown = raw === '' ? undefined : raw;
            try {
                parsedPayload = raw === '' ? undefined : JSON.parse(raw);
            } catch {
                parsedPayload = raw;
            }

            logger?.debug('invoke:success', { data: { statusCode: result.StatusCode } });

            return {
                statusCode: result.StatusCode,
                payload: parsedPayload,
                functionError: result.FunctionError,
                result,
            };
        } catch (error) {
            logger?.debug('invoke:error', { error });
            throw error;
        }
    };
