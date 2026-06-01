import { HeadObjectCommand, HeadObjectCommandOutput } from '@aws-sdk/client-s3';
import { S3Context } from '../types';

export interface HeadObjectInput {
    bucket: string;
    key: string;
}

export const headObject =
    (context: S3Context) =>
    async (input: HeadObjectInput): Promise<HeadObjectCommandOutput> => {
        const { client, logger } = context;
        const { bucket, key } = input;

        logger?.debug('headObject:start', { data: { bucket, key } });

        try {
            const command: HeadObjectCommand = new HeadObjectCommand({
                Bucket: bucket,
                Key: key,
            });
            const result: HeadObjectCommandOutput = await client.send(command);
            logger?.debug('headObject:success');
            return result;
        } catch (error) {
            logger?.debug('headObject:error', { error });
            throw error;
        }
    };
