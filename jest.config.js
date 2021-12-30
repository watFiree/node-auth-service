/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 20000,
  roots: ["./"],
  modulePaths: ["./"],
  moduleDirectories: ["node_modules"],
};
