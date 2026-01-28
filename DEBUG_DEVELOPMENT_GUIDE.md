# Logseq 调试开发指南

> 本文档介绍如何调试和开发 Logseq 应用的各种方法和工具。

---

## 📋 目录

1. [开发模式概览](#开发模式概览)
2. [浏览器开发调试](#浏览器开发调试)
3. [桌面应用调试](#桌面应用调试)
4. [REPL 交互式调试](#repl-交互式调试)
5. [日志和调试工具](#日志和调试工具)
6. [测试调试](#测试调试)
7. [常见调试场景](#常见调试场景)

---

## 🚀 开发模式概览

### 三种开发模式

1. **浏览器模式** - 最快，适合前端开发
2. **Electron 桌面模式** - 完整功能，接近生产环境
3. **移动端模式** - iOS/Android 开发

### 核心工具

- **Shadow CLJS** - ClojureScript 编译和热重载
- **nREPL** - 交互式 REPL 调试
- **Chrome DevTools** - 浏览器调试工具
- **Electron DevTools** - 桌面应用调试工具

---

## 🌐 浏览器开发调试

### 1. 启动开发服务器

```bash
# 安装依赖（首次）
yarn install

# 启动开发模式（热重载）
yarn watch
```

等待看到：
```
shadow-cljs - nREPL server started on port 8701
Build Completed.
```

### 2. 打开浏览器

访问：**http://localhost:3001**

### 3. 启用 Chrome DevTools

#### 启用自定义格式化器（重要！）

Logseq 使用 `glogi` 日志库，需要启用 Chrome 自定义格式化器才能正常查看日志：

1. 打开 Chrome DevTools (F12)
2. 进入 **Settings** (⚙️ 图标)
3. 勾选 **"Enable custom formatters"**
4. 刷新页面

**为什么需要这个？**
- 没有启用时，日志会显示为 `[object Object]`
- 启用后可以看到结构化的 ClojureScript 数据

### 4. 使用浏览器控制台

```javascript
// 在浏览器控制台中可以直接访问全局对象
window.logseq  // Logseq API（如果可用）

// 查看 React 组件
$r  // 当前选中的 React 组件（React DevTools）

// 查看 DOM
document.querySelector('.ls-block')  // 查找块元素
```

### 5. React DevTools

安装 Chrome 扩展：**React Developer Tools**

可以：
- 查看组件树
- 检查组件 props 和 state
- 修改 props 实时预览
- 查看组件性能

---

## 💻 桌面应用调试

### 1. 启动 Electron 开发模式

#### 方法一：分步执行

```bash
# 终端 1: 启动编译监听
yarn watch
# 等待看到 Build Completed

# 终端 2: 启动 Electron 应用
yarn dev-electron-app
```

#### 方法二：使用 Babashka（推荐）

```bash
# 需要先安装 babashka
brew install borkdude/brew/babashka

# 一键启动
bb dev:electron-start
```

### 2. 打开 Electron DevTools

在 Electron 应用中：
- **菜单**: `View > Toggle Developer Tools`
- **快捷键**: `Cmd + Option + I` (macOS) 或 `Ctrl + Shift + I` (Windows/Linux)

### 3. Electron 调试技巧

#### 调试主进程

Electron 有两个进程：
- **主进程** (Main Process) - Node.js 环境
- **渲染进程** (Renderer Process) - 浏览器环境

```bash
# 调试主进程，在启动时添加参数
ELECTRON_ENABLE_LOGGING=1 yarn dev-electron-app
```

#### 调试渲染进程

在 DevTools 中：
- **Console** - JavaScript/ClojureScript 控制台
- **Sources** - 源代码调试（可以设置断点）
- **Network** - 网络请求
- **Application** - 存储、缓存等

---

## 🔧 REPL 交互式调试

REPL (Read-Eval-Print Loop) 是 Clojure/ClojureScript 最强大的调试工具。

### 为什么使用 REPL？

- ✅ **实时执行代码** - 修改代码立即生效
- ✅ **交互式调试** - 在运行的应用中执行函数
- ✅ **数据检查** - 查看和修改应用状态
- ✅ **快速测试** - 无需重启应用

### 设置 REPL (VSCode + Calva)

#### 1. 安装 Calva 扩展

在 VSCode 中安装：**Calva** (Clojure & ClojureScript)

#### 2. 启动开发服务器

```bash
yarn watch
```

等待看到：`shadow-cljs - nREPL server started on port 8701`

#### 3. 连接 REPL

1. `Cmd + Shift + P` (macOS) 或 `Ctrl + Shift + P` (Windows/Linux)
2. 输入：`Calva: Connect to a Running REPL Server in the Project`
3. 选择：
   - Project root: `logseq`
   - REPL type: `shadow-cljs`
   - Build: `:app` (浏览器) 或 `:electron` (桌面)
   - Host: `localhost:8701`

#### 4. 加载文件到 REPL

1. 打开要调试的 `.cljs` 文件
2. `Cmd + Shift + P` → `Calva: Load/Evaluate Current File and its Requires/Dependencies`
3. 现在可以在 REPL 中执行该文件的函数了

#### 5. REPL 使用示例

```clojure
;; 在 REPL 中执行

;; 查看当前页面
(frontend.state/get-current-page)

;; 获取当前块
(frontend.state/get-edit-block)

;; 执行函数
(frontend.handler.editor/insert-block! "测试内容" {:page "测试页面"})

;; 查看状态
@frontend.state/state

;; 修改状态
(frontend.state/set-state! :test-key "test-value")
```

### 连接 Web Worker REPL

Logseq 使用 Web Worker 处理数据库操作，也可以连接调试：

```clojure
;; 在 REPL 中执行
(require '[shadow.user :as shadow])

;; 查看可用的 runtime
(shadow/runtime-id-list :db-worker)

;; 连接到 worker
(shadow/worker-repl)
```

或者访问：**http://localhost:9630/runtimes** 查看所有 runtime

### 其他编辑器设置

#### Emacs + Cider

```clojure
;; 连接到 CLJ nREPL 后
(shadow.user/worker-repl)

;; 或使用 runtime ID
(shadow/nrepl-select :app {:runtime-id <id>})
```

#### IntelliJ IDEA / Cursive

1. 创建远程 REPL 配置
2. 连接类型：nREPL
3. 在 REPL 中执行：`(shadow.cljs.devtools.api/repl :app)`

---

## 📊 日志和调试工具

### 1. 日志系统

Logseq 使用 **glogi** 日志库：

```clojure
(ns my.namespace
  (:require [lambdaisland.glogi :as log]))

;; 不同级别的日志
(log/debug :my-event "调试信息" {:data "value"})
(log/info :my-event "信息" {:data "value"})
(log/warn :my-event "警告" {:error "something"})
(log/error :my-event "错误" {:error "something"})
```

### 2. 启用开发者模式

在应用设置中：
1. `Settings > Advanced > Developer mode` ✅
2. 启用后可以使用 Dev Commands

### 3. Dev Commands

启用开发者模式后，在命令面板搜索 `(Dev)`：

- `(Dev) Inspect Block Data` - 检查块数据
- `(Dev) Inspect Page Data` - 检查页面数据
- `(Dev) Inspect AST` - 检查抽象语法树
- `(Dev) Show State` - 显示应用状态

### 4. 浏览器控制台调试

```javascript
// 查看全局状态（如果暴露）
window.__LOGSEQ_STATE__

// 查看 React 组件
$r  // React DevTools 选中的组件

// 查看 DOM
document.querySelectorAll('.ls-block')  // 所有块
```

### 5. Shadow CLJS 监控

访问：**http://localhost:9630**

可以：
- 查看所有构建目标
- 查看 runtime 状态
- 查看编译错误
- 查看依赖关系

---

## 🧪 测试调试

### 1. 单元测试

```bash
# 运行所有测试
yarn test

# 运行特定测试（使用 focus）
# 在测试文件中添加 ^:focus 元数据
(deftest ^:focus my-test ...)

# 然后运行
node static/tests.js -i focus
```

### 2. 在 REPL 中运行测试

```clojure
;; 加载测试文件
(require '[frontend.db.model-test :as test])

;; 运行测试
(cljs.test/run-tests 'frontend.db.model-test)
```

### 3. 自动运行测试

```bash
# 监听文件变化，自动运行测试
clojure -M:test watch test --config-merge '{:autorun true}'

# 只运行特定命名空间的测试
clojure -M:test watch test --config-merge '{:autorun true :ns-regexp "frontend.db.query-dsl-test"}'
```

### 4. 数据库测试

```clojure
;; 使用测试辅助函数
(require '[frontend.test.helper :as test-helper])

;; 创建测试数据库
(let [db (test-helper/test-db)]
  ;; 测试代码
  )
```

---

## 🎯 常见调试场景

### 场景 1: 调试 UI 组件

```clojure
;; 1. 在组件中添加日志
(defn my-component []
  (log/debug :component-render {:props props})
  [:div "内容"])

;; 2. 使用 React DevTools 检查组件
;; 3. 在 REPL 中修改组件状态
(frontend.state/set-state! :my-component-state {:key "value"})
```

### 场景 2: 调试数据库查询

```clojure
;; 1. 在 REPL 中执行查询
(require '[frontend.db :as db])

;; 查询所有页面
(d/q '[:find ?page
       :where [?page :block/name _]]
     (db/get-db))

;; 2. 使用 Dev Command: (Dev) Inspect Block Data
;; 3. 查看数据库状态
@frontend.db/conn
```

### 场景 3: 调试事件处理

```clojure
;; 1. 添加事件日志
(defn handle-click [e]
  (log/debug :click-handler {:event e})
  ;; 处理逻辑
  )

;; 2. 在浏览器 DevTools 中查看事件
;; 3. 使用 React DevTools 查看事件绑定
```

### 场景 4: 调试性能问题

```clojure
;; 使用性能测试工具
(require '[frontend.util :as util])

;; 测量执行时间
(util/with-time-number
  (expensive-operation))

;; 使用 Chrome Performance 工具
;; 1. 打开 DevTools > Performance
;; 2. 录制
/// 3. 分析性能瓶颈
```

### 场景 5: 调试插件

```clojure
;; 1. 在插件代码中添加日志
(logseq.App.showMsg "插件加载" "success")

;; 2. 在浏览器控制台查看插件 API
window.logseq

;; 3. 使用插件 DevTools（如果可用）
```

---

## 🛠️ 实用调试技巧

### 1. 热重载调试

Shadow CLJS 支持热重载：
- 修改代码后自动重新编译
- 自动刷新浏览器/应用
- 保持应用状态（如果配置正确）

### 2. 断点调试

#### 浏览器中

1. 打开 DevTools > Sources
2. 找到源文件（可能需要 source map）
3. 设置断点
4. 触发代码执行

#### VSCode 中

1. 安装 **Debugger for Chrome** 扩展
2. 创建 `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug Logseq",
      "url": "http://localhost:3001",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

### 3. 网络调试

```javascript
// 在浏览器控制台
// 查看所有网络请求
performance.getEntriesByType('resource')

// 拦截 fetch 请求
const originalFetch = window.fetch
window.fetch = function(...args) {
  console.log('Fetch:', args)
  return originalFetch.apply(this, args)
}
```

### 4. 状态调试

```clojure
;; 在 REPL 中查看完整状态
(require '[frontend.state :as state])

;; 查看所有状态
@state/state

;; 查看特定状态
(state/get-state :current-page)
(state/get-state :editor/editing?)

;; 修改状态
(state/set-state! :debug-mode true)
```

### 5. 数据库调试

```clojure
;; 使用 Dev Commands
;; (Dev) Inspect Block Data
;; (Dev) Inspect Page Data

;; 或在 REPL 中
(require '[frontend.db :as db])
(require '[datascript.core :as d])

;; 查询数据库
(d/q '[:find ?e ?v
       :where [?e :block/title ?v]]
     (db/get-db))
```

---

## 📝 调试最佳实践

### 1. 使用有意义的日志

```clojure
;; ❌ 不好
(log/debug "test")

;; ✅ 好
(log/debug :user-action {:action :create-page :page-name "测试"})
```

### 2. 使用命名空间日志键

```clojure
;; 使用命名空间作为日志键的前缀
(log/debug :frontend.handler.page/create {:page "test"})
```

### 3. 结构化日志数据

```clojure
;; 使用 map 而不是字符串
(log/debug :event {:type :click :target "button" :timestamp (js/Date.now)})
```

### 4. 在开发中启用详细日志

```clojure
;; 在开发模式下启用
(when goog.DEBUG
  (log/debug :detailed-info {...}))
```

### 5. 使用 REPL 快速验证

```clojure
;; 在修改代码前，先在 REPL 中测试
;; 确保逻辑正确后再修改文件
```

---

## 🔍 调试工具总结

| 工具 | 用途 | 适用场景 |
|------|------|----------|
| **Chrome DevTools** | 浏览器调试 | 前端开发、UI 调试 |
| **Electron DevTools** | 桌面应用调试 | Electron 功能调试 |
| **REPL (Calva)** | 交互式调试 | 逻辑调试、数据检查 |
| **React DevTools** | React 组件调试 | 组件状态、Props |
| **Shadow CLJS Monitor** | 编译监控 | 编译错误、依赖 |
| **Dev Commands** | 应用内调试 | 数据检查、状态查看 |
| **单元测试** | 代码验证 | 功能测试、回归测试 |

---

## 🆘 常见问题

### Q: 日志显示为 `[object Object]`

**A**: 需要在 Chrome DevTools 中启用 "Enable custom formatters"

### Q: REPL 连接失败

**A**: 
1. 确保 `yarn watch` 正在运行
2. 检查端口 8701 是否被占用
3. 确认选择了正确的 build (`:app` 或 `:electron`)

### Q: 热重载不工作

**A**:
1. 检查 Shadow CLJS 是否正常编译
2. 查看 http://localhost:9630 确认状态
3. 尝试手动刷新浏览器

### Q: 无法设置断点

**A**:
1. 确保 source maps 已启用
2. 在 DevTools Settings 中启用 source maps
3. 检查文件路径是否正确

---

## 📚 相关资源

- [Shadow CLJS 文档](https://shadow-cljs.github.io/docs/UsersGuide.html)
- [Calva 文档](https://calva.io/)
- [ClojureScript 调试指南](https://clojurescript.org/tools/testing)
- [React DevTools](https://react.dev/learn/react-developer-tools)

---

**Happy Debugging! 🐛🔧**
