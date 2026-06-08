export default {
  meta: {
    type: 'layout',
    docs: { description: '顶层 class/function 之间空两行（注释不算空行）' },
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

    function isTopLevel(node) {
      if (node.type === 'ClassDeclaration' || node.type === 'FunctionDeclaration') return true;
      if (
        node.type === 'ExportNamedDeclaration' &&
        node.declaration &&
        (node.declaration.type === 'ClassDeclaration' ||
          node.declaration.type === 'FunctionDeclaration')
      )
        return true;
      return false;
    }

    function getNode(n) {
      return n.type === 'ExportNamedDeclaration' ? n : n;
    }

    return {
      'Program:exit'() {
        const topLevel = sourceCode.ast.body
          .map((node, index) => ({ node, index }))
          .filter(({ node }) => isTopLevel(node));

        for (let i = 1; i < topLevel.length; i++) {
          const prevEnd = sourceCode.getLastToken(getNode(topLevel[i - 1].node));
          const currStart = sourceCode.getFirstToken(getNode(topLevel[i].node));
          const blankLines = countRealBlankLines(prevEnd.loc.end.line, currStart.loc.start.line);

          if (blankLines !== 2) {
            context.report({
              node: topLevel[i].node,
              message:
                blankLines < 2
                  ? `顶层声明之间需空两行（当前 ${blankLines} 行）`
                  : `顶层声明之间只需空两行（当前 ${blankLines} 行）`,
              fix(fixer) {
                return fixer.replaceTextRange(
                  [prevEnd.range[1], currStart.range[0]],
                  '\n\n',
                );
              },
            });
          }
        }
      },
    };
  },
};
