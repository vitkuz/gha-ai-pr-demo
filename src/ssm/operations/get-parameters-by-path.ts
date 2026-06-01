import {
    GetParametersByPathCommand,
    GetParametersByPathCommandOutput,
} from '@aws-sdk/client-ssm';
import { SsmContext } from '../types';

export interface GetParametersByPathInput {
    path: string;
    recursive?: boolean;
    withDecryption?: boolean;
    nextToken?: string;
}

export const getParametersByPath =
    (context: SsmContext) =>
    async (input: GetParametersByPathInput): Promise<GetParametersByPathCommandOutput> => {
        const { client, logger } = context;
        const { path, recursive, withDecryption, nextToken } = input;

        logger?.debug('getParametersByPath:start', { data: { path, recursive } });

        try {
            const command: GetParametersByPathCommand = new GetParametersByPathCommand({
                Path: path,
                Recursive: recursive,
                WithDecryption: withDecryption,
                NextToken: nextToken,
            });
            const result: GetParametersByPathCommandOutput = await client.send(command);
            logger?.debug('getParametersByPath:success');
            return result;
        } catch (error) {
            logger?.debug('getParametersByPath:error', { error });
            throw error;
        }
    };
