import { CreateSecretCommand, CreateSecretCommandOutput } from '@aws-sdk/client-secrets-manager';
import { SecretsManagerContext } from '../types';

export interface CreateSecretInput {
    name: string;
    secretString: string;
    description?: string;
}

export const createSecret =
    (context: SecretsManagerContext) =>
    async (input: CreateSecretInput): Promise<CreateSecretCommandOutput> => {
        const { client, logger } = context;
        const { name, secretString, description } = input;

        logger?.debug('createSecret:start', { data: { name, description } });

        try {
            const command: CreateSecretCommand = new CreateSecretCommand({
                Name: name,
                SecretString: secretString,
                Description: description,
            });
            const result: CreateSecretCommandOutput = await client.send(command);

            logger?.debug('createSecret:success');
            return result;
        } catch (error) {
            logger?.debug('createSecret:error', { error });
            throw error;
        }
    };
