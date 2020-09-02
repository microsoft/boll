module.exports = {
  plugins: [
    "jquery", // eslint-plugin-jquery
    "@foo/foo", // @foo/eslint-plugin-foo
    "@bar", // @bar/eslint-plugin
  ],
  extends: ["plugin:@foo/foo/recommended", "plugin:@bar/recommended"],
  rules: {
    "jquery/a-rule": "error",
    "@foo/foo/some-rule": "error",
    "@bar/another-rule": "error",
  },
  env: {
    "jquery/jquery": true,
    "@foo/foo/env-foo": true,
    "@bar/env-bar": true,
  },
};
