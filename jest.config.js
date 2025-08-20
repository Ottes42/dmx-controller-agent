module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.js', '**/*.(test|spec).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    'devices/**/*.js',
    '!src/index.js', // Exclude main entry point from coverage as it's integration
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  verbose: true,
  testEnvironmentOptions: {
    env: {
      NODE_ENV: 'test'
    }
  }
}