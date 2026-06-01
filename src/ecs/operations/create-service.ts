import { CreateServiceCommand, CreateServiceCommandOutput, LaunchType, AssignPublicIp } from '@aws-sdk/client-ecs';
import { EcsContext } from '../types';

export interface CreateServiceInput {
    cluster?: string;
    serviceName: string;
    taskDefinition: string;
    desiredCount?: number;
    launchType?: LaunchType;
    networkConfiguration?: {
        awsvpcConfiguration?: {
            subnets: string[];
            securityGroups?: string[];
            assignPublicIp?: AssignPublicIp;
        };
    };
}

export interface CreateServiceOutput {
    service: CreateServiceCommandOutput['service'];
}

export const createService =
    (context: EcsContext) =>
    async (input: CreateServiceInput): Promise<CreateServiceOutput> => {
        const { client, logger } = context;
        const { cluster, serviceName, taskDefinition, desiredCount, launchType, networkConfiguration } = input;

        logger?.debug('create-service:start', { data: { cluster, serviceName } });

        try {
            const command = new CreateServiceCommand({
                cluster,
                serviceName,
                taskDefinition,
                desiredCount,
                launchType,
                networkConfiguration,
            });
            const result: CreateServiceCommandOutput = await client.send(command);

            logger?.debug('create-service:success');

            return {
                service: result.service,
            };
        } catch (error) {
            logger?.debug('create-service:error', { error });
            throw error;
        }
    };
