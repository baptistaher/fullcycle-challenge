module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "js"],
  verbose: true,
  logHeapUsage: true,

  // maxWorkers: "50%",

  // testEnvironmentOptions: {
  //   globalCleanup: "on",
  // },
};
// import type { Config } from 'jest';

// const config: Config = {

//     preset: 'ts-jest',
//     testEnvironment: 'node',
//     testMatch: ["**/*.test.ts"],
//     moduleFileExtensions: ['ts','js'],
//     verbose: true

// };

// export default config;
