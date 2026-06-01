import { GetObjectCommand, GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { S3Context } from '../types';

export interface GetObjectInput {
    bucket: string;
    key: string;
}

export interface GetObjectOutput {
    body: string;
    contentType?: string;
    result: GetObjectCommandOutput;
}

export const getObject =
    (context: S3Context) =>
    async (input: GetObjectInput): Promise<GetObjectOutput> => {
        const { client, logger } = context;
        const { bucket, key } = input;

        logger?.debug('getObject:start', { data: { bucket, key } });

        try {
            const command: GetObjectCommand = new GetObjectCommand({
                Bucket: bucket,
                Key: key,
            });
            const result: GetObjectCommandOutput = await client.send(command);
            const body: string = await result.Body!.transformToString();
            logger?.debug('getObject:success');
            return {
                body,
                contentType: result.ContentType,
                result,
            };
        } catch (error) {
            logger?.debug('getObject:error', { error });
            throw error;
        }
    };
