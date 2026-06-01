import {
    GetFunctionConfigurationCommand,
    GetFunctionConfigurationCommandOutput,
} from '@aws-sdk/client-lambda';
import { LambdaContext } from '../types';

export interface GetFunctionConfigurationInput {
    functionName: string;
}

export const getFunctionConfiguration =
    (context: LambdaContext) =>
    async (
        input: GetFunctionConfigurationInput,
    ): Promise<GetFunctionConfigurationCommandOutput> => {
        const { client, logger } = context;
        const { functionName } = input;

        logger?.debug('getFunctionConfiguration:start', { data: { functionName } });

        try {
            const command: GetFunctionConfigurationCommand = new GetFunctionConfigurationCommand({
                FunctionName: functionName,
            });
            const result: GetFunctionConfigurationCommandOutput = await client.send(command);
            logger?.debug('getFunctionConfiguration:success', { data: { functionName } });
            return result;
        } catch (error) {
            logger?.debug('getFunctionConfiguration:error', { error });
            throw error;
        }
    };
