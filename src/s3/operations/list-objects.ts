import { ListObjectsV2Command, ListObjectsV2CommandOutput } from '@aws-sdk/client-s3';
import { S3Context } from '../types';

export interface ListObjectsInput {
    bucket: string;
    prefix?: string;
    maxKeys?: number;
    continuationToken?: string;
}

export const listObjects =
    (context: S3Context) =>
    async (input: ListObjectsInput): Promise<ListObjectsV2CommandOutput> => {
        const { client, logger } = context;
        const { bucket, prefix, maxKeys, continuationToken } = input;

        logger?.debug('listObjects:start', { data: { bucket, prefix, maxKeys } });

        try {
            const command: ListObjectsV2Command = new ListObjectsV2Command({
                Bucket: bucket,
                Prefix: prefix,
                MaxKeys: maxKeys,
                ContinuationToken: continuationToken,
            });
            const result: ListObjectsV2CommandOutput = await client.send(command);
            logger?.debug('listObjects:success');
            return result;
        } catch (error) {
            logger?.debug('listObjects:error', { error });
            throw error;
        }
    };
