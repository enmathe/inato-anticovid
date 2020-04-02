import { Trial, TrialId, FacetFilters } from "../../domain/trial";
import * as TaskEither from "fp-ts/lib/TaskEither";
import { GenericErrorType, GenericError } from "../../domain/errors";
import { Option } from "fp-ts/lib/Option";

export interface IndexingService {
  indexTrials(
    trials: ReadonlyArray<Trial>
  ): TaskEither.TaskEither<
    GenericError<GenericErrorType.UnknownError>,
    ReadonlyArray<string>
  >;
  setSettings(attributes: {
    searchableAttributes: ReadonlyArray<string>;
    attributesForFaceting: ReadonlyArray<string>;
    customRanking: ReadonlyArray<string>;
  }): TaskEither.TaskEither<GenericError<GenericErrorType.UnknownError>, void>;
  searchTrials({
    searchQuery,
    facetFilters
  }: {
    searchQuery: Option<string>;
    facetFilters: FacetFilters;
  }): TaskEither.TaskEither<
    GenericError<GenericErrorType.UnknownError>,
    ReadonlyArray<TrialId>
  >;
}
