module.exports = {
  foo: "bar",
  bar: [1, 2, 3],

  // Make sure comments don't cause parsing to fail
  test: { foo: "bar" },
};
