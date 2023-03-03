module.exports = class Foo {
  bar() {
    if (this.isDestroying) {
      return;
    }
  }
};
