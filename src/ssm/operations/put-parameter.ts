import { ParameterType, PutParameterCommand, PutParameterCommandOutput } from '@aws-sdk/client-ssm';
import { SsmContext } from '../types';

export interface PutParameterInput {
    name: string;
    value: string;
    type?: ParameterType;
    overwrite?: boolean;
}

export const putParameter =
    (context: SsmContext) =>
    async (input: PutParameterInput): Promise<PutParameterCommandOutput> => {
        const { client, logger } = context;
        const { name, value, type, overwrite } = input;

        logger?.debug('putParameter:start', { data: { name, type } });

        try {
            const command: PutParameterCommand = new PutParameterCommand({
                Name: name,
                Value: value,
                Type: type,
                Overwrite: overwrite,
            });
            const result: PutParameterCommandOutput = await client.send(command);
            logger?.debug('putParameter:success');
            return result;
        } catch (error) {
            logger?.debug('putParameter:error', { error });
            throw error;
        }
    };
