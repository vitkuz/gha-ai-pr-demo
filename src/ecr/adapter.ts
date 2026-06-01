import { ECRClientConfig } from '@aws-sdk/client-ecr';
import { createEcrClient } from './client';
import { EcrContext, Logger } from './types';
import { createRepository } from './operations/create-repository';
import { deleteRepository } from './operations/delete-repository';
import { describeRepositories } from './operations/describe-repositories';
import { listImages } from './operations/list-images';
import { describeImages } from './operations/describe-images';
import { batchDeleteImage } from './operations/batch-delete-image';
import { getAuthorizationToken } from './operations/get-authorization-token';

export const createAdapter = (config: ECRClientConfig, logger?: Logger) => {
    const client = createEcrClient(config);
    const context: EcrContext = { client, logger };

    return {
        client,
        createRepository: createRepository(context),
        deleteRepository: deleteRepository(context),
        describeRepositories: describeRepositories(context),
        listImages: listImages(context),
        describeImages: describeImages(context),
        batchDeleteImage: batchDeleteImage(context),
        getAuthorizationToken: getAuthorizationToken(context),
    };
};
