import {
    GetSecretValueCommand,
    GetSecretValueCommandOutput,
} from '@aws-sdk/client-secrets-manager';
import { SecretsManagerContext } from '../types';

export interface GetSecretValueInput {
    secretId: string;
    versionId?: string;
    versionStage?: string;
}

export interface GetSecretValueOutput {
    secretString?: string;
    json?: Record<string, unknown>;
    result: GetSecretValueCommandOutput;
}

export const getSecretValue =
    (context: SecretsManagerContext) =>
    async (input: GetSecretValueInput): Promise<GetSecretValueOutput> => {
        const { client, logger } = context;
        const { secretId, versionId, versionStage } = input;

        logger?.debug('getSecretValue:start', {
            data: { secretId, versionId, versionStage },
        });

        try {
            const command: GetSecretValueCommand = new GetSecretValueCommand({
                SecretId: secretId,
                VersionId: versionId,
                VersionStage: versionStage,
            });
            const result: GetSecretValueCommandOutput = await client.send(command);

            let json: Record<string, unknown> | undefined;
            if (result.SecretString) {
                try {
                    json = JSON.parse(result.SecretString) as Record<string, unknown>;
                } catch {
                    // Secret string is not valid JSON, keep json undefined
                }
            }

            logger?.debug('getSecretValue:success');
            return { secretString: result.SecretString, json, result };
        } catch (error) {
            logger?.debug('getSecretValue:error', { error });
            throw error;
        }
    };
