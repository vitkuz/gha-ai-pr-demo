import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Context } from '../types';

export interface GetSignedUrlInput {
    bucket: string;
    key: string;
    expiresIn?: number;
}

export const createGetSignedUrl =
    (context: S3Context) =>
    async (input: GetSignedUrlInput): Promise<string> => {
        const { client, logger } = context;
        const { bucket, key, expiresIn = 3600 } = input;

        logger?.debug('getSignedUrl:start', { data: { bucket, key, expiresIn } });

        try {
            const command: GetObjectCommand = new GetObjectCommand({
                Bucket: bucket,
                Key: key,
            });
            const url: string = await awsGetSignedUrl(client, command, { expiresIn });
            logger?.debug('getSignedUrl:success');
            return url;
        } catch (error) {
            logger?.debug('getSignedUrl:error', { error });
            throw error;
        }
    };
