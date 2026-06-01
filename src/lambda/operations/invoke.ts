import { InvokeCommand, InvokeCommandOutput } from '@aws-sdk/client-lambda';
import { LambdaContext } from '../types';

export interface InvokeInput {
    functionName: string;
    payload?: unknown;
}

export interface InvokeOutput {
    statusCode: number;
    payload: string | undefined;
    functionError: string | undefined;
    result: unknown;
}

export const invoke =
    (context: LambdaContext) =>
    async (input: InvokeInput): Promise<InvokeOutput> => {
        const { client, logger } = context;
        const { functionName, payload } = input;

        logger?.debug('invoke:start', { data: { functionName } });

        try {
            const command: InvokeCommand = new InvokeCommand({
                FunctionName: functionName,
                InvocationType: 'RequestResponse',
                Payload: payload !== undefined ? Buffer.from(JSON.stringify(payload)) : undefined,
            });
            const result: InvokeCommandOutput = await client.send(command);

            const raw: string | undefined = result.Payload
                ? Buffer.from(result.Payload).toString('utf-8')
                : undefined;

            let parsed: unknown = raw;
            if (raw !== undefined) {
                try {
                    parsed = JSON.parse(raw);
                } catch {
                    // fallback — keep raw string
                }
            } else {
                parsed = undefined;
            }

            logger?.debug('invoke:success');

            return {
                statusCode: result.StatusCode ?? -1,
                payload: raw,
                functionError: result.FunctionError,
                result: parsed,
            };
        } catch (error) {
            logger?.debug('invoke:error', { error });
            throw error;
        }
    };
