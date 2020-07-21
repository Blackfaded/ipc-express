module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/example-app'],
  "moduleNameMapper": {
    "^electron$": "<rootDir>/src/spec/mock/electron-mock.ts"
  }
};
