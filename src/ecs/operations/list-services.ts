import { ListServicesCommand, ListServicesCommandOutput, LaunchType } from '@aws-sdk/client-ecs';
import { EcsContext } from '../types';

export interface ListServicesInput {
    cluster?: string;
    launchType?: LaunchType;
    nextToken?: string;
}

export interface ListServicesOutput {
    serviceArns: string[];
    nextToken: string | undefined;
}

export const listServices =
    (context: EcsContext) =>
    async (input: ListServicesInput): Promise<ListServicesOutput> => {
        const { client, logger } = context;
        const { cluster, launchType, nextToken } = input;

        logger?.debug('list-services:start', { data: { cluster, launchType } });

        try {
            const command = new ListServicesCommand({
                cluster,
                launchType,
                nextToken,
            });
            const result: ListServicesCommandOutput = await client.send(command);

            logger?.debug('list-services:success');

            return {
                serviceArns: result.serviceArns ?? [],
                nextToken: result.nextToken,
            };
        } catch (error) {
            logger?.debug('list-services:error', { error });
            throw error;
        }
    };
