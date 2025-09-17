module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Required for nativewind
      [
       'react-native-worklets/plugin',
        {
          globals: ["__scanCodes"],
          strict: false, // Disable strict mode to reduce warnings
        },
      ],
    ],
  };
};
