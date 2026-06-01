import { DeleteServiceCommand, DeleteServiceCommandOutput } from '@aws-sdk/client-ecs';
import { EcsContext } from '../types';

export interface DeleteServiceInput {
    cluster?: string;
    service: string;
    force?: boolean;
}

export interface DeleteServiceOutput {
    service: DeleteServiceCommandOutput['service'];
}

export const deleteService =
    (context: EcsContext) =>
    async (input: DeleteServiceInput): Promise<DeleteServiceOutput> => {
        const { client, logger } = context;
        const { cluster, service, force } = input;

        logger?.debug('delete-service:start', { data: { cluster, service } });

        try {
            const command = new DeleteServiceCommand({
                cluster,
                service,
                force,
            });
            const result: DeleteServiceCommandOutput = await client.send(command);

            logger?.debug('delete-service:success');

            return {
                service: result.service,
            };
        } catch (error) {
            logger?.debug('delete-service:error', { error });
            throw error;
        }
    };
