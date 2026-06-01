import { CopyObjectCommand, CopyObjectCommandOutput } from '@aws-sdk/client-s3';
import { S3Context } from '../types';

export interface CopyObjectInput {
    bucket: string;
    sourceKey: string;
    destinationKey: string;
    sourceBucket?: string;
}

export const copyObject =
    (context: S3Context) =>
    async (input: CopyObjectInput): Promise<CopyObjectCommandOutput> => {
        const { client, logger } = context;
        const { bucket, sourceKey, destinationKey, sourceBucket } = input;

        const copySource = `${sourceBucket ?? bucket}/${sourceKey}`;

        logger?.debug('copyObject:start', { data: { bucket, copySource, destinationKey } });

        try {
            const command: CopyObjectCommand = new CopyObjectCommand({
                Bucket: bucket,
                CopySource: copySource,
                Key: destinationKey,
            });
            const result: CopyObjectCommandOutput = await client.send(command);
            logger?.debug('copyObject:success');
            return result;
        } catch (error) {
            logger?.debug('copyObject:error', { error });
            throw error;
        }
    };
