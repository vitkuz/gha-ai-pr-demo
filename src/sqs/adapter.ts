import { SQSClientConfig } from '@aws-sdk/client-sqs';
import { createSqsClient } from './client';
import { SqsContext, Logger } from './types';
import { sendMessage } from './operations/send-message';
import { sendMessageBatch } from './operations/send-message-batch';
import { receiveMessages } from './operations/receive-messages';
import { deleteMessage } from './operations/delete-message';
import { deleteMessageBatch } from './operations/delete-message-batch';
import { getQueueUrl } from './operations/get-queue-url';
import { getQueueAttributes } from './operations/get-queue-attributes';
import { purgeQueue } from './operations/purge-queue';

export const createAdapter = (config: SQSClientConfig, logger?: Logger) => {
    const client = createSqsClient(config);
    const context: SqsContext = { client, logger };

    return {
        client,
        sendMessage: sendMessage(context),
        sendMessageBatch: sendMessageBatch(context),
        receiveMessages: receiveMessages(context),
        deleteMessage: deleteMessage(context),
        deleteMessageBatch: deleteMessageBatch(context),
        getQueueUrl: getQueueUrl(context),
        getQueueAttributes: getQueueAttributes(context),
        purgeQueue: purgeQueue(context),
    };
};
