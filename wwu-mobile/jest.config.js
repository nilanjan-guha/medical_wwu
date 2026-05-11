module.exports = {
  preset: "jest-expo",
  testMatch: ["**/src/**/*.test.ts", "**/src/**/*.test.tsx"],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"]
};
