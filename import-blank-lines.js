export default {
  meta: {
    type: 'layout',
    docs: { description: 'import 语句块后需要空一行' },
    fixable: 'whitespace',
    schema: [],
  },
  create(context) {
    const sourceCode = context.sourceCode;
    return {
      'Program:exit'() {
        const body = sourceCode.ast.body;
        if (body.length === 0) return;

        let lastImportIndex = -1;
        for (let i = 0; i < body.length; i++) {
          if (body[i].type === 'ImportDeclaration') lastImportIndex = i;
        }

        if (lastImportIndex === -1 || lastImportIndex === body.length - 1) return;

        const lastImportEnd = sourceCode.getLastToken(body[lastImportIndex]);
        const nextStart = sourceCode.getFirstToken(body[lastImportIndex + 1]);
        const gap = nextStart.loc.start.line - lastImportEnd.loc.end.line;
        const blankLines = gap - 1;

        if (gap !== 2) {
          context.report({
            node: body[lastImportIndex + 1],
            message:
              blankLines < 1
                ? `import 后需空一行（当前 ${blankLines} 行）`
                : `import 后只需空一行（当前 ${blankLines} 行）`,
            fix(fixer) {
              return fixer.replaceTextRange(
                [lastImportEnd.range[1], nextStart.range[0]],
                '\n',
              );
            },
          });
        }
      },
    };
  },
};
