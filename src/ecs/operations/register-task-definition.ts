import {
    RegisterTaskDefinitionCommand,
    RegisterTaskDefinitionCommandOutput,
    NetworkMode,
    Compatibility,
} from '@aws-sdk/client-ecs';
import { EcsContext } from '../types';

export interface RegisterTaskDefinitionInput {
    family: string;
    containerDefinitions: Record<string, unknown>[];
    cpu?: string;
    memory?: string;
    networkMode?: NetworkMode;
    requiresCompatibilities?: Compatibility[];
    executionRoleArn?: string;
    taskRoleArn?: string;
}

export interface RegisterTaskDefinitionOutput {
    taskDefinition: RegisterTaskDefinitionCommandOutput['taskDefinition'];
    tags: RegisterTaskDefinitionCommandOutput['tags'];
}

export const registerTaskDefinition =
    (context: EcsContext) =>
    async (input: RegisterTaskDefinitionInput): Promise<RegisterTaskDefinitionOutput> => {
        const { client, logger } = context;
        const {
            family,
            containerDefinitions,
            cpu,
            memory,
            networkMode,
            requiresCompatibilities,
            executionRoleArn,
            taskRoleArn,
        } = input;

        logger?.debug('register-task-definition:start', { data: { family } });

        try {
            const command = new RegisterTaskDefinitionCommand({
                family,
                containerDefinitions: containerDefinitions as any,
                cpu,
                memory,
                networkMode,
                requiresCompatibilities,
                executionRoleArn,
                taskRoleArn,
            });
            const result: RegisterTaskDefinitionCommandOutput = await client.send(command);

            logger?.debug('register-task-definition:success');

            return {
                taskDefinition: result.taskDefinition,
                tags: result.tags,
            };
        } catch (error) {
            logger?.debug('register-task-definition:error', { error });
            throw error;
        }
    };
