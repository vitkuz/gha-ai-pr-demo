import {
    PutEventsCommand,
    PutEventsCommandOutput,
    PutEventsRequestEntry,
} from '@aws-sdk/client-eventbridge';
import { EventBridgeContext } from '../types';

export interface PutEventsInputEntry {
    source: string;
    detailType: string;
    detail: unknown;
    eventBusName?: string;
    resources?: string[];
}

export interface PutEventsInput {
    entries: PutEventsInputEntry[];
}

export const putEvents =
    (context: EventBridgeContext) =>
    async (input: PutEventsInput): Promise<PutEventsCommandOutput> => {
        const { client, logger } = context;
        const { entries } = input;

        logger?.debug('putEvents:start', {
            data: { count: entries.length },
        });

        try {
            const command: PutEventsCommand = new PutEventsCommand({
                Entries: entries.map(
                    (entry): PutEventsRequestEntry => ({
                        Source: entry.source,
                        DetailType: entry.detailType,
                        Detail: JSON.stringify(entry.detail),
                        EventBusName: entry.eventBusName,
                        Resources: entry.resources,
                    }),
                ),
            });
            const result: PutEventsCommandOutput = await client.send(command);
            logger?.debug('putEvents:success');
            return result;
        } catch (error) {
            logger?.debug('putEvents:error', { error });
            throw error;
        }
    };
