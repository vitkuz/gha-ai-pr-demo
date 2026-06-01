import { RunTaskCommand, RunTaskCommandOutput, LaunchType, AssignPublicIp } from '@aws-sdk/client-ecs';
import { EcsContext } from '../types';

export interface RunTaskInput {
    cluster?: string;
    taskDefinition: string;
    count?: number;
    launchType?: LaunchType;
    networkConfiguration?: {
        awsvpcConfiguration?: {
            subnets: string[];
            securityGroups?: string[];
            assignPublicIp?: AssignPublicIp;
        };
    };
    overrides?: {
        containerOverrides?: {
            name: string;
            command?: string[];
            environment?: { name: string; value: string }[];
            cpu?: number;
            memory?: number;
            memoryReservation?: number;
        }[];
        taskRoleArn?: string;
        executionRoleArn?: string;
    };
}

export interface RunTaskOutput {
    tasks: RunTaskCommandOutput['tasks'];
    failures: RunTaskCommandOutput['failures'];
}

export const runTask =
    (context: EcsContext) =>
    async (input: RunTaskInput): Promise<RunTaskOutput> => {
        const { client, logger } = context;
        const { cluster, taskDefinition, count, launchType, networkConfiguration, overrides } = input;

        logger?.debug('run-task:start', { data: { cluster, taskDefinition } });

        try {
            const command = new RunTaskCommand({
                cluster,
                taskDefinition,
                count,
                launchType,
                networkConfiguration,
                overrides,
            });
            const result: RunTaskCommandOutput = await client.send(command);

            logger?.debug('run-task:success');

            return {
                tasks: result.tasks,
                failures: result.failures,
            };
        } catch (error) {
            logger?.debug('run-task:error', { error });
            throw error;
        }
    };
