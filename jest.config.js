/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 5000,
  roots: ["./"],
  modulePaths: ["./"],
  moduleDirectories: ["node_modules"],
};
