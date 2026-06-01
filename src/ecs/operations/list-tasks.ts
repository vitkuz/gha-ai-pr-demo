import { ListTasksCommand, ListTasksCommandOutput, DesiredStatus } from '@aws-sdk/client-ecs';
import { EcsContext } from '../types';

export interface ListTasksInput {
    cluster?: string;
    serviceName?: string;
    desiredStatus?: DesiredStatus;
    nextToken?: string;
}

export interface ListTasksOutput {
    taskArns: string[];
    nextToken: string | undefined;
}

export const listTasks =
    (context: EcsContext) =>
    async (input: ListTasksInput): Promise<ListTasksOutput> => {
        const { client, logger } = context;
        const { cluster, serviceName, desiredStatus, nextToken } = input;

        logger?.debug('list-tasks:start', { data: { cluster, serviceName, desiredStatus } });

        try {
            const command = new ListTasksCommand({
                cluster,
                serviceName,
                desiredStatus,
                nextToken,
            });
            const result: ListTasksCommandOutput = await client.send(command);

            logger?.debug('list-tasks:success');

            return {
                taskArns: result.taskArns ?? [],
                nextToken: result.nextToken,
            };
        } catch (error) {
            logger?.debug('list-tasks:error', { error });
            throw error;
        }
    };
