import { UnsubscribeCommand, UnsubscribeCommandOutput } from '@aws-sdk/client-sns';
import { SnsContext } from '../types';

export interface UnsubscribeInput {
    subscriptionArn: string;
}

export const unsubscribe =
    (context: SnsContext) =>
    async (input: UnsubscribeInput): Promise<UnsubscribeCommandOutput> => {
        const { client, logger } = context;
        const { subscriptionArn } = input;

        logger?.debug('unsubscribe:start', { data: { subscriptionArn } });

        try {
            const command: UnsubscribeCommand = new UnsubscribeCommand({ SubscriptionArn: subscriptionArn });
            const result: UnsubscribeCommandOutput = await client.send(command);
            logger?.debug('unsubscribe:success');
            return result;
        } catch (error) {
            logger?.debug('unsubscribe:error', { error });
            throw error;
        }
    };
