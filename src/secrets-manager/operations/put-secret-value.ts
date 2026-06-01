import { PutSecretValueCommand, PutSecretValueCommandOutput } from '@aws-sdk/client-secrets-manager';
import { SecretsManagerContext } from '../types';

export interface PutSecretValueInput {
    secretId: string;
    secretString: string;
}

export const putSecretValue =
    (context: SecretsManagerContext) =>
    async (input: PutSecretValueInput): Promise<PutSecretValueCommandOutput> => {
        const { client, logger } = context;
        const { secretId, secretString } = input;

        logger?.debug('putSecretValue:start', { data: { secretId } });

        try {
            const command: PutSecretValueCommand = new PutSecretValueCommand({
                SecretId: secretId,
                SecretString: secretString,
            });
            const result: PutSecretValueCommandOutput = await client.send(command);
            logger?.debug('putSecretValue:success');
            return result;
        } catch (error) {
            logger?.debug('putSecretValue:error', { error });
            throw error;
        }
    };
