import { UpdateSecretCommand, UpdateSecretCommandOutput } from '@aws-sdk/client-secrets-manager';
import { SecretsManagerContext } from '../types';

export interface UpdateSecretInput {
    secretId: string;
    secretString?: string;
    description?: string;
}

export const updateSecret =
    (context: SecretsManagerContext) =>
    async (input: UpdateSecretInput): Promise<UpdateSecretCommandOutput> => {
        const { client, logger } = context;
        const { secretId, secretString, description } = input;

        logger?.debug('updateSecret:start', { data: { secretId, description } });

        try {
            const command: UpdateSecretCommand = new UpdateSecretCommand({
                SecretId: secretId,
                SecretString: secretString,
                Description: description,
            });
            const result: UpdateSecretCommandOutput = await client.send(command);

            logger?.debug('updateSecret:success');
            return result;
        } catch (error) {
            logger?.debug('updateSecret:error', { error });
            throw error;
        }
    };
