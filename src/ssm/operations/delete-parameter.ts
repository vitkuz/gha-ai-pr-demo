import { DeleteParameterCommand, DeleteParameterCommandOutput } from '@aws-sdk/client-ssm';
import { SsmContext } from '../types';

export interface DeleteParameterInput {
    name: string;
}

export const deleteParameter =
    (context: SsmContext) =>
    async (input: DeleteParameterInput): Promise<DeleteParameterCommandOutput> => {
        const { client, logger } = context;
        const { name } = input;

        logger?.debug('deleteParameter:start', { data: { name } });

        try {
            const command: DeleteParameterCommand = new DeleteParameterCommand({
                Name: name,
            });
            const result: DeleteParameterCommandOutput = await client.send(command);
            logger?.debug('deleteParameter:success');
            return result;
        } catch (error) {
            logger?.debug('deleteParameter:error', { error });
            throw error;
        }
    };
