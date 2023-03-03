import { isDestroying } from '@ember/destroyable';




module.exports = class Foo {
  bar() {
    if (isDestroying(this)) {
      return;
    }
  }
};
