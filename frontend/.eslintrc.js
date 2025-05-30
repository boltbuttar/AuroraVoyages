module.exports = {
  root: true,
  extends: ["react-app", "react-app/jest"],
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: ["react"],
  rules: {
    // You can add custom rules here if needed
  },
  overrides: [
    {
      files: ["**/*.js", "**/*.jsx"],
      parser: "@babel/eslint-parser",
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
    },
  ],
};
