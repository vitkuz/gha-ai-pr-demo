import { GetFunctionCommand, GetFunctionCommandOutput } from '@aws-sdk/client-lambda';
import { LambdaContext } from '../types';

export interface GetFunctionInput {
    functionName: string;
}

export interface GetFunctionOutput {
    configuration: GetFunctionCommandOutput['Configuration'];
    code: GetFunctionCommandOutput['Code'];
    tags: Record<string, string> | undefined;
}

export const getFunction =
    (context: LambdaContext) =>
    async (input: GetFunctionInput): Promise<GetFunctionOutput> => {
        const { client, logger } = context;
        const { functionName } = input;

        logger?.debug('get-function:start', { data: { functionName } });

        try {
            const command: GetFunctionCommand = new GetFunctionCommand({ FunctionName: functionName });
            const result: GetFunctionCommandOutput = await client.send(command);

            logger?.debug('get-function:success');

            return {
                configuration: result.Configuration,
                code: result.Code,
                tags: result.Tags,
            };
        } catch (error) {
            logger?.debug('get-function:error', { error });
            throw error;
        }
    };
