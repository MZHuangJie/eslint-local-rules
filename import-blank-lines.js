export default {
  meta: {
    type: 'layout',
    docs: { description: 'import 语句块后需要空一行（注释不算空行）' },
    fixable: 'whitespace',
    schema: [],
  },
  create(context) {
    const sourceCode = context.sourceCode;

    function countRealBlankLines(startLine, endLine) {
      let count = 0;
      for (let l = startLine + 1; l < endLine; l++) {
        if (sourceCode.lines[l - 1].trim() === '') count++;
      }
      return count;
    }

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
        const blankLines = countRealBlankLines(lastImportEnd.loc.end.line, nextStart.loc.start.line);

        if (blankLines !== 1) {
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
