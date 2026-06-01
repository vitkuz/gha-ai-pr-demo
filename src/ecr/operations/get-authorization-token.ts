import {
    GetAuthorizationTokenCommand,
    GetAuthorizationTokenCommandOutput,
} from '@aws-sdk/client-ecr';
import { EcrContext } from '../types';

// No input fields — empty object
export interface GetAuthorizationTokenInput {}

export const getAuthorizationToken =
    (context: EcrContext) =>
    async (_input: GetAuthorizationTokenInput): Promise<GetAuthorizationTokenCommandOutput> => {
        const { client, logger } = context;

        logger?.debug('getAuthorizationToken:start');

        try {
            const command: GetAuthorizationTokenCommand = new GetAuthorizationTokenCommand({});
            const result: GetAuthorizationTokenCommandOutput = await client.send(command);
            logger?.debug('getAuthorizationToken:success', {
                data: { count: result.authorizationData?.length },
            });
            return result;
        } catch (error) {
            logger?.debug('getAuthorizationToken:error', { error });
            throw error;
        }
    };
