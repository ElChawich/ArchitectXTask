module.exports = {
  preset: 'react-native',
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-reanimated|react-native-worklets|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|react-native-mmkv|react-native-haptic-feedback|i18next|react-i18next|@tanstack)/)',
  ],
  moduleNameMapper: {
    'react-native-mmkv': '<rootDir>/__mocks__/react-native-mmkv.ts',
    'react-native-haptic-feedback': '<rootDir>/__mocks__/react-native-haptic-feedback.ts',
    'react-native-worklets': '<rootDir>/__mocks__/react-native-worklets.ts',
    'react-native-reanimated': '<rootDir>/__mocks__/react-native-reanimated.ts',
  },
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
};
