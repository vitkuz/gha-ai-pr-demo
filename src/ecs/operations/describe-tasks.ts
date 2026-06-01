import { DescribeTasksCommand, DescribeTasksCommandOutput } from '@aws-sdk/client-ecs';
import { EcsContext } from '../types';

export interface DescribeTasksInput {
    cluster?: string;
    tasks: string[];
}

export interface DescribeTasksOutput {
    tasks: DescribeTasksCommandOutput['tasks'];
    failures: DescribeTasksCommandOutput['failures'];
}

export const describeTasks =
    (context: EcsContext) =>
    async (input: DescribeTasksInput): Promise<DescribeTasksOutput> => {
        const { client, logger } = context;
        const { cluster, tasks } = input;

        logger?.debug('describe-tasks:start', { data: { cluster, tasks } });

        try {
            const command = new DescribeTasksCommand({
                cluster,
                tasks,
            });
            const result: DescribeTasksCommandOutput = await client.send(command);

            logger?.debug('describe-tasks:success');

            return {
                tasks: result.tasks,
                failures: result.failures,
            };
        } catch (error) {
            logger?.debug('describe-tasks:error', { error });
            throw error;
        }
    };
