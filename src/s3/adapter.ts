import { S3ClientConfig } from '@aws-sdk/client-s3';
import { createS3Client } from './client';
import { S3Context, Logger } from './types';
import { putObject } from './operations/put-object';
import { getObject } from './operations/get-object';
import { deleteObject } from './operations/delete-object';
import { listObjects } from './operations/list-objects';
import { headObject } from './operations/head-object';
import { copyObject } from './operations/copy-object';
import { createGetSignedUrl } from './operations/get-signed-url';

export const createAdapter = (config: S3ClientConfig, logger?: Logger) => {
    const client = createS3Client(config);
    const context: S3Context = { client, logger };

    return {
        client,
        putObject: putObject(context),
        getObject: getObject(context),
        deleteObject: deleteObject(context),
        listObjects: listObjects(context),
        headObject: headObject(context),
        copyObject: copyObject(context),
        getSignedUrl: createGetSignedUrl(context),
    };
};
