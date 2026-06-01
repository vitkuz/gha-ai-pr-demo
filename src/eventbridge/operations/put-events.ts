import { PutEventsCommand, PutEventsCommandOutput } from '@aws-sdk/client-eventbridge';
import { EventBridgeContext } from '../types';

export interface PutEventsEntry {
    source: string;
    detailType: string;
    detail: Record<string, any>;
    eventBusName?: string;
    resources?: string[];
}

export interface PutEventsInput {
    entries: PutEventsEntry[];
}

export const putEvents =
    (context: EventBridgeContext) =>
    async (input: PutEventsInput): Promise<PutEventsCommandOutput> => {
        const { client, logger } = context;
        const { entries } = input;

        logger?.debug('putEvents:start', { data: { entryCount: entries.length } });

        try {
            const command: PutEventsCommand = new PutEventsCommand({
                Entries: entries.map((entry) => ({
                    Source: entry.source,
                    DetailType: entry.detailType,
                    Detail: JSON.stringify(entry.detail),
                    EventBusName: entry.eventBusName,
                    Resources: entry.resources,
                })),
            });
            const result: PutEventsCommandOutput = await client.send(command);
            logger?.debug('putEvents:success');
            return result;
        } catch (error) {
            logger?.debug('putEvents:error', { error });
            throw error;
        }
    };
