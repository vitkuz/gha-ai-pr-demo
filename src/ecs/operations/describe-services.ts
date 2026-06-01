import { DescribeServicesCommand, DescribeServicesCommandOutput } from '@aws-sdk/client-ecs';
import { EcsContext } from '../types';

export interface DescribeServicesInput {
    cluster?: string;
    services: string[];
}

export interface DescribeServicesOutput {
    services: DescribeServicesCommandOutput['services'];
    failures: DescribeServicesCommandOutput['failures'];
}

export const describeServices =
    (context: EcsContext) =>
    async (input: DescribeServicesInput): Promise<DescribeServicesOutput> => {
        const { client, logger } = context;
        const { cluster, services } = input;

        logger?.debug('describe-services:start', { data: { cluster, services } });

        try {
            const command = new DescribeServicesCommand({
                cluster,
                services,
            });
            const result: DescribeServicesCommandOutput = await client.send(command);

            logger?.debug('describe-services:success');

            return {
                services: result.services,
                failures: result.failures,
            };
        } catch (error) {
            logger?.debug('describe-services:error', { error });
            throw error;
        }
    };
