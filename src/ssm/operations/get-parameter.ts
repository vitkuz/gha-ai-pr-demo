import { GetParameterCommand, GetParameterCommandOutput } from '@aws-sdk/client-ssm';
import { SsmContext } from '../types';

export interface GetParameterInput {
    name: string;
    withDecryption?: boolean;
}

export const getParameter =
    (context: SsmContext) =>
    async (input: GetParameterInput): Promise<GetParameterCommandOutput> => {
        const { client, logger } = context;
        const { name, withDecryption } = input;

        logger?.debug('getParameter:start', { data: { name, withDecryption } });

        try {
            const command: GetParameterCommand = new GetParameterCommand({
                Name: name,
                WithDecryption: withDecryption,
            });
            const result: GetParameterCommandOutput = await client.send(command);
            logger?.debug('getParameter:success');
            return result;
        } catch (error) {
            logger?.debug('getParameter:error', { error });
            throw error;
        }
    };
