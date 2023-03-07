const { getParser } = require('codemod-cli').jscodeshift;

module.exports = function transformer(file, api) {
  const j = getParser(api);

  const fileSource = j(file.source);

  // Find all instances of `this.isDestroying` in the file
  const isDestroyingProperties = fileSource.find(j.MemberExpression, {
    object: {
      type: 'ThisExpression',
    },
    property: {
      type: 'Identifier',
      name: 'isDestroying',
    },
  });

  // Replace each instance of `this.isDestroying` with `isDestroying(this)`
  isDestroyingProperties.replaceWith(() => {
    return j.callExpression(j.identifier('isDestroying'), [j.thisExpression()]);
  });

  if (isDestroyingProperties.length > 0) {
    // All existing imports from `@ember/destroyable`
    const destroyableImports = fileSource
      .find(j.ImportDeclaration)
      .filter((path) => path.node.source.value === '@ember/destroyable');

    // New import statement for `isDestroying` if it doesn't exist
    const importDeclaration = j.importDeclaration(
      [j.importSpecifier(j.identifier('isDestroying'))],
      j.literal('@ember/destroyable')
    );

    // TODO: if the import already exists, add to the import statement instead of adding a new one

    // If there are no existing imports from `@ember/destroyable`, add the import statement
    if (!destroyableImports.size() > 0) {
      const lastImport = fileSource.find(j.ImportDeclaration).at(-1);

      // If there are any existing imports, add the new import after the last one
      if (lastImport.size() > 0) {
        lastImport.insertAfter(importDeclaration);
      } else {
        // FIXME: this adds 4 new lines for some reason, prettier should take care of the formatting post-transform.
        j(fileSource.find(j.Program).get('body', 0)).insertBefore([
          importDeclaration,
          '\n',
        ]);
      }
    }

    return fileSource.toSource();
  }

  return file.source;
};

module.exports.type = 'js';
