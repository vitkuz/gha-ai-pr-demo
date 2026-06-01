import { LambdaClientConfig } from '@aws-sdk/client-lambda';
import { createLambdaClient } from './client';
import { LambdaContext, Logger } from './types';
import { invoke } from './operations/invoke';
import { invokeAsync } from './operations/invoke-async';
import { listFunctions } from './operations/list-functions';
import { getFunction } from './operations/get-function';
import { getFunctionConfiguration } from './operations/get-function-configuration';

export const createAdapter = (
    config: LambdaClientConfig,
    logger?: Logger,
) => {
    const client = createLambdaClient(config);
    const context: LambdaContext = { client, logger };

    return {
        client,
        invoke: invoke(context),
        invokeAsync: invokeAsync(context),
        listFunctions: listFunctions(context),
        getFunction: getFunction(context),
        getFunctionConfiguration: getFunctionConfiguration(context),
    };
};
