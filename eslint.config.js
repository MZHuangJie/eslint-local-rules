import tseslint from "typescript-eslint";
import importBlankLines from "./eslint-local-rules/import-blank-lines.js";
import methodBlankLine from "./eslint-local-rules/method-blank-line.js";
import topLevelBlankLines from "./eslint-local-rules/top-level-blank-lines.js";
import eofBlankLine from "./eslint-local-rules/eof-blank-line.js";

export default tseslint.config({
	files: ["**/*.ts"],
	extends: [tseslint.configs.recommended],
	plugins: {
		local: {
			rules: {
				"import-blank-lines": importBlankLines,
				"method-blank-line": methodBlankLine,
				"top-level-blank-lines": topLevelBlankLines,
				"eof-blank-line": eofBlankLine,
			},
		},
	},
	rules: {
		"@typescript-eslint/explicit-member-accessibility": [
			"error",
			{ accessibility: "explicit" },
		],
		"local/import-blank-lines": "error",
		"local/method-blank-line": "error",
		"local/top-level-blank-lines": "error",
		"local/eof-blank-line": "error",
	},
});
