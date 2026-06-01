import { UpdateServiceCommand, UpdateServiceCommandOutput } from '@aws-sdk/client-ecs';
import { EcsContext } from '../types';

export interface UpdateServiceInput {
    cluster?: string;
    service: string;
    desiredCount?: number;
    taskDefinition?: string;
    forceNewDeployment?: boolean;
}

export interface UpdateServiceOutput {
    service: UpdateServiceCommandOutput['service'];
}

export const updateService =
    (context: EcsContext) =>
    async (input: UpdateServiceInput): Promise<UpdateServiceOutput> => {
        const { client, logger } = context;
        const { cluster, service, desiredCount, taskDefinition, forceNewDeployment } = input;

        logger?.debug('update-service:start', { data: { cluster, service } });

        try {
            const command = new UpdateServiceCommand({
                cluster,
                service,
                desiredCount,
                taskDefinition,
                forceNewDeployment,
            });
            const result: UpdateServiceCommandOutput = await client.send(command);

            logger?.debug('update-service:success');

            return {
                service: result.service,
            };
        } catch (error) {
            logger?.debug('update-service:error', { error });
            throw error;
        }
    };
