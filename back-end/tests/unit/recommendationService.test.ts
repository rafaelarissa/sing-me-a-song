import { jest } from "@jest/globals";
import { conflictError, notFoundError } from "../../src/utils/errorUtils";
import { recommendationRepository } from "./../../src/repositories/recommendationRepository";
import {
  CreateRecommendationData,
  recommendationService,
} from "./../../src/services/recommendationsService";
import recommendationsFactory from "../factory/recommendationsFactory.js";

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

  it("should not found recommendation upvote", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValue(null);

    expect(async () => {
      await recommendationService.upvote(1);
    }).rejects.toEqual(notFoundError());
  });

  it("should not found recommendation downvote", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValue(null);

    expect(async () => {
      await recommendationService.downvote(1);
    }).rejects.toEqual(notFoundError());
  });

  it("should remove recommendation downvote", async () => {
    const recommendation = recommendationsFactory();

    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValue(recommendation[2]);
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockResolvedValue(recommendation[2]);

    const remove = jest
      .spyOn(recommendationRepository, "remove")
      .mockResolvedValue(null);

    await recommendationService.downvote(recommendation[2].id);

    expect(recommendationRepository.updateScore).toBeCalledWith(
      recommendation[2].id,
      "decrement"
    );
    expect(recommendationRepository.remove).toBeCalledWith(
      recommendation[2].id
    );
    expect(remove).toHaveBeenCalledTimes(1);
  });
});
