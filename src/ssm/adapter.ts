import { SSMClientConfig } from '@aws-sdk/client-ssm';
import { createSsmClient } from './client';
import { SsmContext, Logger } from './types';
import { getParameter } from './operations/get-parameter';
import { putParameter } from './operations/put-parameter';
import { deleteParameter } from './operations/delete-parameter';
import { getParametersByPath } from './operations/get-parameters-by-path';

export const createAdapter = (config: SSMClientConfig, logger?: Logger) => {
    const client = createSsmClient(config);
    const context: SsmContext = { client, logger };

    return {
        client,
        getParameter: getParameter(context),
        putParameter: putParameter(context),
        deleteParameter: deleteParameter(context),
        getParametersByPath: getParametersByPath(context),
    };
};
