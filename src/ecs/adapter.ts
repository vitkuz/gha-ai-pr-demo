import { ECSClientConfig } from '@aws-sdk/client-ecs';
import { createEcsClient } from './client';
import { EcsContext, Logger } from './types';
import { runTask } from './operations/run-task';
import { stopTask } from './operations/stop-task';
import { listTasks } from './operations/list-tasks';
import { describeTasks } from './operations/describe-tasks';
import { registerTaskDefinition } from './operations/register-task-definition';
import { createService } from './operations/create-service';
import { updateService } from './operations/update-service';
import { deleteService } from './operations/delete-service';
import { describeServices } from './operations/describe-services';
import { listServices } from './operations/list-services';

export const createAdapter = (config: ECSClientConfig, logger?: Logger) => {
    const client = createEcsClient(config);
    const context: EcsContext = { client, logger };

    return {
        client,
        runTask: runTask(context),
        stopTask: stopTask(context),
        listTasks: listTasks(context),
        describeTasks: describeTasks(context),
        registerTaskDefinition: registerTaskDefinition(context),
        createService: createService(context),
        updateService: updateService(context),
        deleteService: deleteService(context),
        describeServices: describeServices(context),
        listServices: listServices(context),
    };
};
