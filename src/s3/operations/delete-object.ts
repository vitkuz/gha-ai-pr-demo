import { DeleteObjectCommand, DeleteObjectCommandOutput } from '@aws-sdk/client-s3';
import { S3Context } from '../types';

export interface DeleteObjectInput {
    bucket: string;
    key: string;
}

export const deleteObject =
    (context: S3Context) =>
    async (input: DeleteObjectInput): Promise<DeleteObjectCommandOutput> => {
        const { client, logger } = context;
        const { bucket, key } = input;

        logger?.debug('deleteObject:start', { data: { bucket, key } });

        try {
            const command: DeleteObjectCommand = new DeleteObjectCommand({
                Bucket: bucket,
                Key: key,
            });
            const result: DeleteObjectCommandOutput = await client.send(command);
            logger?.debug('deleteObject:success');
            return result;
        } catch (error) {
            logger?.debug('deleteObject:error', { error });
            throw error;
        }
    };
