export default {
  meta: {
    type: 'layout',
    docs: { description: '类方法之间空一行（注释不算空行）' },
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
      ClassBody(node) {
        const members = node.body;
        for (let i = 1; i < members.length; i++) {
          const prev = members[i - 1];
          const curr = members[i];
          if (curr.type !== 'MethodDefinition' || prev.type !== 'MethodDefinition') continue;

          const prevEnd = sourceCode.getLastToken(prev);
          const currStart = sourceCode.getFirstToken(curr);
          const blankLines = countRealBlankLines(prevEnd.loc.end.line, currStart.loc.start.line);

          if (blankLines !== 1) {
            context.report({
              node: curr,
              message:
                blankLines < 1
                  ? `类方法之间需空一行（当前 ${blankLines} 行）`
                  : `类方法之间只需空一行（当前 ${blankLines} 行）`,
              fix(fixer) {
                return fixer.replaceTextRange(
                  [prevEnd.range[1], currStart.range[0]],
                  '\n',
                );
              },
            });
          }
        }
      },
    };
  },
};
