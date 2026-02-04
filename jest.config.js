/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': ['ts-jest', { useESM: true }],
  },
  // Це змусить Jest бачити файли .ts як модулі
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    // Якщо у вас помилка в імпортах з аліасами (@/...)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};