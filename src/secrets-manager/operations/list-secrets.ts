import { ListSecretsCommand, ListSecretsCommandOutput } from '@aws-sdk/client-secrets-manager';
import { SecretsManagerContext } from '../types';

export interface ListSecretsInput {
    maxResults?: number;
    nextToken?: string;
}

export const listSecrets =
    (context: SecretsManagerContext) =>
    async (input: ListSecretsInput = {}): Promise<ListSecretsCommandOutput> => {
        const { client, logger } = context;
        const { maxResults, nextToken } = input;

        logger?.debug('listSecrets:start', { data: { maxResults, nextToken } });

        try {
            const command: ListSecretsCommand = new ListSecretsCommand({
                MaxResults: maxResults,
                NextToken: nextToken,
            });
            const result: ListSecretsCommandOutput = await client.send(command);
            logger?.debug('listSecrets:success');
            return result;
        } catch (error) {
            logger?.debug('listSecrets:error', { error });
            throw error;
        }
    };
