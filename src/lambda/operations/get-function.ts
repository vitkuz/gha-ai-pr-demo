import { GetFunctionCommand, GetFunctionCommandOutput } from '@aws-sdk/client-lambda';
import { LambdaContext } from '../types';

export interface GetFunctionInput {
    functionName: string;
}

export const getFunction =
    (context: LambdaContext) =>
    async (input: GetFunctionInput): Promise<GetFunctionCommandOutput> => {
        const { client, logger } = context;
        const { functionName } = input;

        logger?.debug('getFunction:start', { data: { functionName } });

        try {
            const command: GetFunctionCommand = new GetFunctionCommand({
                FunctionName: functionName,
            });
            const result: GetFunctionCommandOutput = await client.send(command);
            logger?.debug('getFunction:success', { data: { functionName } });
            return result;
        } catch (error) {
            logger?.debug('getFunction:error', { error });
            throw error;
        }
    };
