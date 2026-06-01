import { SecretsManagerClient, SecretsManagerClientConfig } from '@aws-sdk/client-secrets-manager';

export const createSecretsManagerClient = (
    config: SecretsManagerClientConfig,
): SecretsManagerClient => {
    return new SecretsManagerClient(config);
};
