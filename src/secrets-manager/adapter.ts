import { SecretsManagerClientConfig } from '@aws-sdk/client-secrets-manager';
import { createSecretsManagerClient } from './client';
import { SecretsManagerContext, Logger } from './types';
import { getSecretValue } from './operations/get-secret-value';
import { createSecret } from './operations/create-secret';
import { putSecretValue } from './operations/put-secret-value';
import { updateSecret } from './operations/update-secret';
import { deleteSecret } from './operations/delete-secret';
import { listSecrets } from './operations/list-secrets';

export const createAdapter = (
    config: SecretsManagerClientConfig,
    logger?: Logger,
) => {
    const client = createSecretsManagerClient(config);
    const context: SecretsManagerContext = { client, logger };

    return {
        client,
        getSecretValue: getSecretValue(context),
        createSecret: createSecret(context),
        putSecretValue: putSecretValue(context),
        updateSecret: updateSecret(context),
        deleteSecret: deleteSecret(context),
        listSecrets: listSecrets(context),
    };
};
