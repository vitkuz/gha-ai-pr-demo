import { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { TranslateConfig } from '@aws-sdk/lib-dynamodb';
import { createDynamoClient } from './client';
import { DynamoContext, Logger } from './types';
import { createOne } from './operations/create-one';
import { getOne } from './operations/get-one';
import { deleteOne } from './operations/delete-one';
import { patchOne } from './operations/patch-one';
import { queryByPk } from './operations/query-by-pk';
import { scan } from './operations/scan';
import { scanIterator } from './operations/scan-iterator';
import { queryByPkIterator } from './operations/query-by-pk-iterator';

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
        getOne: getOne(context),
        deleteOne: deleteOne(context),
        patchOne: patchOne(context),
        queryByPk: queryByPk(context),
        scan: scan(context),
        scanIterator: scanIterator(context),
        queryByPkIterator: queryByPkIterator(context),
    };
};
