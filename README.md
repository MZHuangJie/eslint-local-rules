# eslint-local-rules

> ESLint 自定义格式化规则集 — 补齐 Prettier 管不到的空白行规范

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 为什么需要这套规则？

**Prettier 只管"好看"，不管"空白行结构"。** 这套规则填补裂痕：

| 场景 | Prettier | 本规则 |
|------|:-------:|:-----:|
| import 后空行 | ❌ 不管 | ✅ 强制一行 |
| 类方法间空行 | ❌ 不管 | ✅ 强制一行 |
| 顶层 class / function 间空行 | ❌ 不管 | ✅ 强制两行 |
| 文件末尾空行 | ✅ 加 `\n` | ✅ 强制空行 |
| 属性间空行 | ❌ | ✅ 不强制 |

---

## 规则一览

| 规则 | 说明 | 可修复 |
|------|------|:-----:|
| `local/import-blank-lines` | `import` 语句块后必须空一行 | ✅ |
| `local/method-blank-line` | 类方法之间空一行，属性之间不强制 | ✅ |
| `local/top-level-blank-lines` | 顶层 class / function 之间空两行 | ✅ |
| `local/eof-blank-line` | 文件最后一行必须是空行 | ✅ |

---

## 效果演示

### 修复前

```typescript
import { Vec3 } from 'cc';
import { Player } from './Player';
@ccclass('GameManager')
export class GameManager extends Component {
  name: string;
  hp: number;
  start() {}
  update(dt: number) {
    this.move();
  }
  die() {}
}
export class Enemy extends Component {
  atk: number;
  attack() {}
}
```

### 修复后

```typescript
import { Vec3 } from 'cc';
import { Player } from './Player';
                                  // ← import 后空一行
@ccclass('GameManager')
export class GameManager extends Component {
  name: string;                   // ← 属性间不强制空行
  hp: number;

  public start() {}               // ← 方法间空一行

  public update(dt: number) {
    this.move();
  }

  public die() {}
}
                                  // ← 顶层声明间空两行
export class Enemy extends Component {
  atk: number;

  public attack() {}
}
                                  // ← 文件末尾空行
```

---

## 快速开始

### 安装依赖

```bash
npm install --save-dev eslint typescript-eslint typescript
```

### 配置 `eslint.config.js`

```javascript
import tseslint from 'typescript-eslint';
import importBlankLines from './eslint-local-rules/import-blank-lines.js';
import methodBlankLine from './eslint-local-rules/method-blank-line.js';
import topLevelBlankLines from './eslint-local-rules/top-level-blank-lines.js';
import eofBlankLine from './eslint-local-rules/eof-blank-line.js';

export default tseslint.config({
  files: ['**/*.ts'],
  extends: [tseslint.configs.recommended],
  plugins: {
    local: {
      rules: {
        'import-blank-lines': importBlankLines,
        'method-blank-line': methodBlankLine,
        'top-level-blank-lines': topLevelBlankLines,
        'eof-blank-line': eofBlankLine,
      },
    },
  },
  rules: {
    // 可选：TS 推荐规则
    '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'explicit' }],

    // 必选：空白行规则
    'local/import-blank-lines': 'error',
    'local/method-blank-line': 'error',
    'local/top-level-blank-lines': 'error',
    'local/eof-blank-line': 'error',
  },
});
```

### 运行

```bash
# 仅检查
npx eslint .

# 自动修复
npx eslint --fix .
```

---

## VS Code 保存时自动修复

用户设置 (`settings.json`)：

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

保存文件 → 自动格式化 → 空白行自动到位。

---

## 目录结构

```
项目根目录/
├── eslint-local-rules/
│   ├── import-blank-lines.js     ← import 后空一行
│   ├── method-blank-line.js      ← 类方法间空一行
│   ├── top-level-blank-lines.js  ← 顶层声明间空两行
│   └── eof-blank-line.js         ← 文件末尾空行
├── eslint.config.js              ← ESLint 配置
├── package.json
└── README.md
```

---

## 常见问题

### 为什么不用 `padding-line-between-statements`？

ESLint 内置规则区分不了"属性"和"方法"——对 AST 来说它们都是 `ClassBody` 的子节点。内置规则只能统一要求空行或不空行。这套自定义规则**精确区分 MethodDefinition 和 PropertyDefinition**。

### 和 Prettier 冲突吗？

不冲突。本规则只管理**语句之间的空白行**，Prettier 管代码内部的格式（缩进、分号、引号）。两者先后顺序：`Prettier → ESLint --fix`。

### 支持哪些 ESLint 版本？

ESLint 9.x+（flat config 模式）。

---

## License

MIT
