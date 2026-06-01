import { StopTaskCommand, StopTaskCommandOutput } from '@aws-sdk/client-ecs';
import { EcsContext } from '../types';

export interface StopTaskInput {
    cluster?: string;
    task: string;
    reason?: string;
}

export interface StopTaskOutput {
    task: StopTaskCommandOutput['task'];
}

export const stopTask =
    (context: EcsContext) =>
    async (input: StopTaskInput): Promise<StopTaskOutput> => {
        const { client, logger } = context;
        const { cluster, task, reason } = input;

        logger?.debug('stop-task:start', { data: { cluster, task } });

        try {
            const command = new StopTaskCommand({
                cluster,
                task,
                reason,
            });
            const result: StopTaskCommandOutput = await client.send(command);

            logger?.debug('stop-task:success');

            return {
                task: result.task,
            };
        } catch (error) {
            logger?.debug('stop-task:error', { error });
            throw error;
        }
    };
