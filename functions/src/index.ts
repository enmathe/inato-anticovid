import * as functions from "firebase-functions";
import algoliasearch from "algoliasearch";

import {
  setupPostgresClient,
  PostgresTrialRepository,
  serialize
} from "./infrastructure";

const ALGOLIA_CLIENT_ID = "QC98I887KP";
const ALGOLIA_API_KEY = functions.config().algolia.apikey;
const ALGOLIA_INDEX_NAME = functions.config().algolia.index;

const _reduce = async <T, R>(
  array: ReadonlyArray<Promise<T> | T>,
  callback: (acc: R, arg: T, index: number) => R | Promise<R>,
  acc: R,
  index: number
): Promise<R> => {
  if (index >= array.length) {
    return acc;
  }

  return _reduce(
    array,
    callback,
    await callback(acc, await array[index], index),
    index + 1
  );
};

export const reduce = async <T, R>(
  array: ReadonlyArray<Promise<T> | T> | Promise<ReadonlyArray<Promise<T> | T>>,
  callback: (acc: R, arg: T, index: number) => R | Promise<R>,
  acc: R
): Promise<R> => _reduce(await array, callback, acc, 0);

export const forEachSequence = async <T, R>(
  array: ReadonlyArray<Promise<T> | T> | Promise<ReadonlyArray<Promise<T> | T>>,
  callback: (arg: T, index: number) => R | Promise<R>
): Promise<void> => {
  await reduce(
    array,
    async (acc, item, index) => {
      await callback(item, index);

      return acc;
    },
    null
  );
};

const setupAlgoliaIndex = () => {
  console.log(
    "setup Algolia index",
    ALGOLIA_INDEX_NAME,
    ALGOLIA_CLIENT_ID,
    ALGOLIA_API_KEY
  );
  const client = algoliasearch(ALGOLIA_CLIENT_ID, ALGOLIA_API_KEY);
  const index = client.initIndex(ALGOLIA_INDEX_NAME);

  return index;
};

export const uploadToAlgolia = functions
  .runWith({
    timeoutSeconds: 500,
    memory: "1GB"
  })
  .https.onRequest(async (request, response) => {
    const client = await setupPostgresClient();
    const tableName = functions.config().pg.tablename;
    const trialRepository = new PostgresTrialRepository(client, tableName);

    const trials = await trialRepository.findAllTrials();
    const trialsCount = trials.length;
    console.log(`Found ${trialsCount} trials`);

    const algoliaIndex = setupAlgoliaIndex();

    await algoliaIndex.replaceAllObjects(
      trials.map(trial => serialize(trial)),
      {
        safe: true,
        batchSize: 50
      }
    );

    console.log("Replaced all objects");

    await client.end();
    response.send(`Indexed ${trialsCount} trials`);
  });
