module.exports = {
  moduleFileExtensions: [
    'js',
    'json'
  ],
  testMatch: [
    '**/src/**/*.test.js'
  ],
  testEnvironment: 'node',
  resetMocks: true,
  resetModules: true,
  verbose: false,
  collectCoverage: true,
  coverageReporters: [
    'lcov',
    'text',
    'text-summary',
    'html'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ],
  roots: [
    'src/'
  ]
}
