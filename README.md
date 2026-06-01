# @vitkuz/aws-demo-adapters

Functional, no-class adapters for AWS — **DynamoDB, S3, SNS, SQS, Lambda** — built
as a demo of an AI agent (**Pi** on DeepSeek) writing real code and opening PRs
through GitHub Actions, with **zero local editing**.

Every adapter follows the same shape: a curried `createAdapter(config, logger?)`
that wires per-operation functions `(context) => (input) => Promise<output>`.

## Layout

```
src/
  index.ts            # namespaced barrel: dynamodb, s3, sns, sqs, lambda
  <service>/
    client.ts         # create<Service>Client(config)
    adapter.ts        # createAdapter(config, logger?)
    types.ts          # Logger + <Service>Context
    operations/*.ts   # one curried operation per file
    index.ts          # service barrel
```

## Usage

```ts
import { dynamodb, s3, sns, sqs, lambda } from '@vitkuz/aws-demo-adapters';

const db = dynamodb.createAdapter({ region: 'us-east-1' });
await db.createOne({ tableName: 't', item: { sk: 'PROFILE', name: 'Ada' } });
await db.queryByPk({ tableName: 't', pk: 'USER#1' });

const bucket = s3.createAdapter({ region: 'us-east-1' });
await bucket.putObject({ bucket: 'b', key: 'k.json', body: '{}' });
const url = await bucket.getSignedUrl({ bucket: 'b', key: 'k.json' });

const topic = sns.createAdapter({ region: 'us-east-1' });
await topic.publish({ topicArn, message: 'hi' });

const queue = sqs.createAdapter({ region: 'us-east-1' });
await queue.sendMessage({ queueUrl, body: 'job-1' });

const fn = lambda.createAdapter({ region: 'us-east-1' });
const res = await fn.invoke({ functionName: 'my-fn', payload: { x: 1 } });
```

### Operations per adapter

- **dynamodb** — createOne, getOne, deleteOne, patchOne, queryByPk, scan
- **s3** — putObject, getObject, deleteObject, listObjects, headObject, copyObject, getSignedUrl
- **sns** — publish, createTopic, deleteTopic, subscribe, unsubscribe, listTopics, listSubscriptionsByTopic
- **sqs** — sendMessage, sendMessageBatch, receiveMessages, deleteMessage, deleteMessageBatch, getQueueUrl, getQueueAttributes, purgeQueue
- **lambda** — invoke, invokeAsync, listFunctions, getFunction, getFunctionConfiguration

## Let the AI agent extend it

Pi (DeepSeek `deepseek-reasoner`) writes code and opens PRs. Prereqs: repo secret
`DEEPSEEK_API_KEY` and Settings → Actions → General → "Allow GitHub Actions to
create and approve pull requests".

- **`/pi` in an issue/comment** → the `pi.yml` workflow implements it and opens a PR.
- **Actions → Pi Dispatch → Run workflow** → free-text prompt, opens a PR.

Pi only edits files; the workflow branches, commits, and opens the PR via `gh`.

## Local build

```bash
npm install
npm run build   # dist/ (ESM + CJS + .d.ts) via tsup
```
