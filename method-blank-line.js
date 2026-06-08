export default {
  meta: {
    type: 'layout',
    docs: { description: '类方法之间空一行' },
    fixable: 'whitespace',
    schema: [],
  },
  create(context) {
    const sourceCode = context.sourceCode;
    return {
      ClassBody(node) {
        const members = node.body;
        for (let i = 1; i < members.length; i++) {
          const prev = members[i - 1];
          const curr = members[i];
          if (curr.type !== 'MethodDefinition' || prev.type !== 'MethodDefinition') continue;

          const prevEnd = sourceCode.getLastToken(prev);
          const currStart = sourceCode.getFirstToken(curr);
          const gap = currStart.loc.start.line - prevEnd.loc.end.line;
          const blankLines = gap - 1;

          if (gap !== 2) {
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
