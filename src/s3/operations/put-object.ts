import { PutObjectCommand, PutObjectCommandOutput } from '@aws-sdk/client-s3';
import { S3Context } from '../types';

export interface PutObjectInput {
    bucket: string;
    key: string;
    body: string | Uint8Array | Buffer;
    contentType?: string;
}

export const putObject =
    (context: S3Context) =>
    async (input: PutObjectInput): Promise<PutObjectCommandOutput> => {
        const { client, logger } = context;
        const { bucket, key, body, contentType } = input;

        logger?.debug('putObject:start', { data: { bucket, key } });

        try {
            const command: PutObjectCommand = new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: body,
                ContentType: contentType,
            });
            const result: PutObjectCommandOutput = await client.send(command);
            logger?.debug('putObject:success');
            return result;
        } catch (error) {
            logger?.debug('putObject:error', { error });
            throw error;
        }
    };
