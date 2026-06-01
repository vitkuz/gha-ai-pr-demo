import { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { TranslateConfig } from '@aws-sdk/lib-dynamodb';
import { createDynamoClient } from './client';
import { DynamoContext, Logger } from './types';
import { createOne } from './operations/create-one';

export const createAdapter = (
    config: DynamoDBClientConfig,
    logger?: Logger,
    translateConfig?: TranslateConfig,
) => {
    const client = createDynamoClient(config, translateConfig);
    const context: DynamoContext = { client, logger };

    return {
        client,
        createOne: createOne(context),
    };
};
