import { DeleteSecretCommand, DeleteSecretCommandOutput } from '@aws-sdk/client-secrets-manager';
import { SecretsManagerContext } from '../types';

export interface DeleteSecretInput {
    secretId: string;
    forceDeleteWithoutRecovery?: boolean;
    recoveryWindowInDays?: number;
}

export const deleteSecret =
    (context: SecretsManagerContext) =>
    async (input: DeleteSecretInput): Promise<DeleteSecretCommandOutput> => {
        const { client, logger } = context;
        const { secretId, forceDeleteWithoutRecovery, recoveryWindowInDays } = input;

        logger?.debug('deleteSecret:start', {
            data: { secretId, forceDeleteWithoutRecovery, recoveryWindowInDays },
        });

        try {
            const command: DeleteSecretCommand = new DeleteSecretCommand({
                SecretId: secretId,
                ForceDeleteWithoutRecovery: forceDeleteWithoutRecovery,
                RecoveryWindowInDays: recoveryWindowInDays,
            });
            const result: DeleteSecretCommandOutput = await client.send(command);

            logger?.debug('deleteSecret:success');
            return result;
        } catch (error) {
            logger?.debug('deleteSecret:error', { error });
            throw error;
        }
    };
