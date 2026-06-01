import { SNSClientConfig } from '@aws-sdk/client-sns';
import { createSnsClient } from './client';
import { SnsContext, Logger } from './types';
import { publish } from './operations/publish';
import { createTopic } from './operations/create-topic';
import { deleteTopic } from './operations/delete-topic';
import { subscribe } from './operations/subscribe';
import { unsubscribe } from './operations/unsubscribe';
import { listTopics } from './operations/list-topics';
import { listSubscriptionsByTopic } from './operations/list-subscriptions-by-topic';

export const createAdapter = (config: SNSClientConfig, logger?: Logger) => {
    const client = createSnsClient(config);
    const context: SnsContext = { client, logger };

    return {
        client,
        publish: publish(context),
        createTopic: createTopic(context),
        deleteTopic: deleteTopic(context),
        subscribe: subscribe(context),
        unsubscribe: unsubscribe(context),
        listTopics: listTopics(context),
        listSubscriptionsByTopic: listSubscriptionsByTopic(context),
    };
};
