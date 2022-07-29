import { faker } from "@faker-js/faker";

export default function recommendationBodyFactory() {
  const recommendation = {
    name: faker.music.songName(),
    link: "https://www.youtube.com/watch?v=7aekxC_monc",
  };

  return recommendation;
}
