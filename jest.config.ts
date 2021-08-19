import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^~/(.*)$": "<rootDir>/$1",
  },
  moduleFileExtensions: ["js", "ts", "tsx", "json"],
  transform: {
    "^.+\\.ts$": "ts-jest", // todo add `x?` => `^.+\\.tsx?$` ?
  },
  collectCoverage: false,
  collectCoverageFrom: ["<rootDir>/api/**/*.ts"],
  testEnvironment: "node",
};

export default config;
