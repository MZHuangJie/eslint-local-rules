export default {
  meta: {
    type: 'layout',
    docs: { description: '文件最后一行必须是空行' },
    fixable: 'whitespace',
    schema: [],
  },
  create(context) {
    const sourceCode = context.sourceCode;
    return {
      'Program:exit'() {
        const text = sourceCode.getText();
        if (!text) return;

        const endsWithBlank = /\n$/.test(text) || /\r\n$/.test(text);
        if (endsWithBlank) return;

        const cleaned = text.replace(/[\r\n]+$/, '');
        context.report({
          loc: { line: sourceCode.lines.length, column: 0 },
          message: '文件最后一行必须是空行',
          fix(fixer) {
            return fixer.replaceTextRange([0, text.length], cleaned + '\n');
          },
        });
      },
    };
  },
};
