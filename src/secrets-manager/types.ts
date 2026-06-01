import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

export interface Logger {
    debug: (message: string, context?: { error?: any; data?: any }) => void;
    [key: string]: any;
}

export interface SecretsManagerContext {
    client: SecretsManagerClient;
    logger?: Logger;
}
