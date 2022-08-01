import { jest } from "@jest/globals";
import exp from "constants";
import { conflictError } from "../../src/utils/errorUtils";
import { recommendationRepository } from "./../../src/repositories/recommendationRepository";
import {
  CreateRecommendationData,
  recommendationService,
} from "./../../src/services/recommendationsService";

describe("REcommendation Service Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should return conflict error given name is duplicate", async () => {
    const duplicateRecommendation: CreateRecommendationData = {
      name: "Joji Best Songs Collections - Joji Greatest Hits - Joji Songs Full Playlist - The Best Of Joji",
      youtubeLink: "https://www.youtube.com/watch?v=81AShKbT_TY",
    };
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValueOnce({ id: 1, score: 0, ...duplicateRecommendation });

    expect(async () => {
      await recommendationService.insert(duplicateRecommendation);
    }).rejects.toEqual(conflictError("Recommendations names must be unique"));
  });
});
