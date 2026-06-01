import { SubscribeCommand, SubscribeCommandOutput } from '@aws-sdk/client-sns';
import { SnsContext } from '../types';

export interface SubscribeInput {
    topicArn: string;
    protocol: string;
    endpoint: string;
}

export const subscribe =
    (context: SnsContext) =>
    async (input: SubscribeInput): Promise<SubscribeCommandOutput> => {
        const { client, logger } = context;
        const { topicArn, protocol, endpoint } = input;

        logger?.debug('subscribe:start', { data: { topicArn, protocol, endpoint } });

        try {
            const command: SubscribeCommand = new SubscribeCommand({
                TopicArn: topicArn,
                Protocol: protocol,
                Endpoint: endpoint,
            });
            const result: SubscribeCommandOutput = await client.send(command);
            logger?.debug('subscribe:success');
            return result;
        } catch (error) {
            logger?.debug('subscribe:error', { error });
            throw error;
        }
    };
