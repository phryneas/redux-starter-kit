module.exports = {
  setupFilesAfterEnv: ['./jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/query-old/*'],
  moduleNameMapper: {
    ...(process.env.CI == 'true'
      ? {}
      : {
          '^@reduxjs/toolkit$': '<rootDir>/src/index.ts',
          '^@reduxjs/toolkit/query$': '<rootDir>/src/query/index.ts',
          '^@reduxjs/toolkit/query/react$':
            '<rootDir>/src/query/react/index.ts',
        }),
    // this mapping is disabled as we want `dist` imports in the tests only to be used for "type-only" imports which don't play a role for jest
    //'^@reduxjs/toolkit/dist/(.*)$': '<rootDir>/src/*',
    '^@internal/(.*)$': '<rootDir>/src/$1',
  },
  preset:
    process.env.ESM == 'true'
      ? 'ts-jest/presets/default-esm'
      : 'ts-jest/presets/default',
  globals: {
    'ts-jest': {
      useESM: process.env.ESM == 'true',
      tsconfig: 'tsconfig.test.json',
      diagnostics: {
        ignoreCodes: [6133],
      },
    },
  },
}
