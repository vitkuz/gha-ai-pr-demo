import { GetFunctionConfigurationCommand, FunctionConfiguration } from '@aws-sdk/client-lambda';
import { LambdaContext } from '../types';

export interface GetFunctionConfigurationInput {
    functionName: string;
}

export const getFunctionConfiguration =
    (context: LambdaContext) =>
    async (input: GetFunctionConfigurationInput): Promise<FunctionConfiguration> => {
        const { client, logger } = context;
        const { functionName } = input;

        logger?.debug('get-function-configuration:start', { data: { functionName } });

        try {
            const command: GetFunctionConfigurationCommand = new GetFunctionConfigurationCommand({
                FunctionName: functionName,
            });
            const result: FunctionConfiguration = await client.send(command);

            logger?.debug('get-function-configuration:success');

            return result;
        } catch (error) {
            logger?.debug('get-function-configuration:error', { error });
            throw error;
        }
    };
