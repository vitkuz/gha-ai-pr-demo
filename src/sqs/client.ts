import { SQSClient, SQSClientConfig } from '@aws-sdk/client-sqs';

export const createSqsClient = (config: SQSClientConfig): SQSClient => new SQSClient(config);
