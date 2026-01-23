# Logseq 本地编译指南

本文档说明如何在本地编译和运行 Logseq 测试应用。

---

## 📋 前置要求

### 必需环境

1. **Node.js** (版本要求见 [build.yml](https://github.com/logseq/logseq/blob/master/.github/workflows/build.yml))
   ```bash
   # 检查版本
   node --version
   # 需要 >= 22.20.0 (根据 package.json)
   ```

2. **Yarn** (包管理器)
   ```bash
   npm install -g yarn
   ```

3. **Java & Clojure**
   - 安装 Java JDK
   - 安装 Clojure CLI工具
   - 参考: https://clojure.org/guides/getting_started
   
   ⚠️ **注意**: 如果遇到 `Execution error (FileNotFoundException) at java.io.FileInputStream/open0` 错误，说明 Clojure 版本不正确，需要卸载后重新安装。

4. **Git** (用于克隆项目)

### 可选工具

- **Babashka (bb)**: 用于运行便捷脚本
  ```bash
  # macOS
  brew install borkdude/brew/babashka
  ```

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/logseq/logseq.git
cd logseq
```

### 2. 安装依赖

```bash
yarn install
```

这会安装所有 Node.js 依赖，包括：
- 前端依赖
- UI 组件库 (`packages/ui`)
- 构建工具依赖

---

## 🌐 浏览器版本开发

### 开发模式 (热重载)

```bash
yarn watch
```

等待编译完成，然后打开浏览器访问：
- **开发地址**: http://localhost:3001

### 生产构建

```bash
yarn release
```

构建产物位于 `static/` 目录，可用于部署。

---

## 💻 桌面应用开发 (Electron)

### 开发模式

#### 方法一：分步执行

1. **安装 Electron 依赖**
   ```bash
   yarn install
   cd static
   yarn install
   cd ..
   ```

2. **启动编译监听**
   ```bash
   yarn watch
   ```
   等待看到 `Build Completed.` 提示（`:electron` 和 `:app` 都完成）

3. **启动 Electron 应用** (新终端窗口)
   ```bash
   # 确保已关闭其他 Logseq 实例
   yarn dev-electron-app
   ```

#### 方法二：使用 Babashka (推荐)

```bash
bb dev:electron-start
```

这会自动执行上述所有步骤。

### 生产构建

构建可安装的桌面应用：

```bash
yarn release-electron
```

构建产物位于 `static/out/` 目录：
- **macOS**: `.dmg` 或 `.app`
- **Windows**: `.exe` 安装程序
- **Linux**: `.AppImage` 或 `.deb`/`.rpm`

---

## 📱 移动应用开发

### iOS 开发

#### 前置要求

1. **Xcode 13+** (从 App Store 安装)
2. **CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

   **M1 Mac 特殊处理** (在 `ios/App` 目录下):
   ```bash
   arch -x86_64 sudo gem install ffi
   arch -x86_64 pod install
   ```

#### 开发模式

1. **配置开发服务器** (编辑 `capacitor.config.ts`)
   ```typescript
   server: {
       url: "http://your-local-ip:3001",  // 替换为你的本地IP
       cleartext: true
   }
   ```

2. **启动移动端编译**
   ```bash
   yarn mobile-watch
   ```

3. **同步到 iOS** (新终端)
   ```bash
   npx cap sync ios
   ```

4. **打开 Xcode 项目**
   ```bash
   npx cap open ios
   ```
   在 Xcode 中连接设备并构建运行。

#### 使用 Babashka (推荐)

```bash
bb dev:ios-app
```

#### 生产构建

```bash
# 注释掉 capacitor.config.ts 中的 server 配置
yarn run-ios-release
# 或
bb release:ios-app
```

### Android 开发

#### 前置要求

1. **Android Studio**
2. **Android SDK**
3. **Java JDK**

#### 开发模式

1. **配置开发服务器** (同 iOS)

2. **启动移动端编译**
   ```bash
   yarn mobile-watch
   ```

3. **同步到 Android**
   ```bash
   npx cap sync android
   ```

4. **打开 Android Studio**
   ```bash
   npx cap open android
   ```

#### 使用 Babashka

```bash
bb dev:android-app
```

#### 生产构建

```bash
yarn sync-android-release
```

---

## 🛠️ 常用构建命令

### 开发命令

| 命令 | 说明 |
|------|------|
| `yarn watch` | 浏览器版本开发 (热重载) |
| `yarn electron-watch` | Electron 开发模式 |
| `yarn mobile-watch` | 移动端开发模式 |
| `yarn dev` | 全平台开发模式 |
| `yarn dev-electron-app` | 启动 Electron 开发应用 |

### 构建命令

| 命令 | 说明 |
|------|------|
| `yarn release` | 构建浏览器版本 |
| `yarn release-app` | 构建 Web 应用 |
| `yarn release-electron` | 构建桌面应用 |
| `yarn release-mobile` | 构建移动应用 |

### 其他命令

| 命令 | 说明 |
|------|------|
| `yarn test` | 运行测试 |
| `yarn clean` | 清理构建产物 |
| `yarn cljs:lint` | 代码检查 |
| `yarn style:lint` | 样式检查 |

---

## 🔧 开发工具配置

### VSCode + Calva (ClojureScript REPL)

1. **启动开发服务器**
   ```bash
   yarn watch
   ```
   等待看到: `shadow-cljs - nREPL server started on port 8701`

2. **连接 REPL**
   - `Cmd + Shift + P` (macOS) 或 `Ctrl + Shift + P` (Windows/Linux)
   - 选择: `Calva: Connect to a Running REPL Server in the Project`
   - 选择: `logseq` -> `shadow-cljs` -> `:app` -> `localhost:8701`

3. **加载文件**
   - `Cmd + Shift + P` -> `Calva: Load/Evaluate Current File and its Requires/Dependencies`

### Emacs + Cider

1. 连接到 CLJ nREPL
2. 运行 `(shadow.user/worker-repl)` 或使用 `(shadow/nrepl-select :app {:runtime-id <id>})`
3. 可在 http://localhost:9630/runtimes 查看 runtime ID

### IntelliJ IDEA / Cursive

1. 创建远程 REPL 配置
2. 连接类型: nREPL
3. 在 REPL 中执行: `(shadow.cljs.devtools.api/repl :app)`

---

## 🐳 Docker 部署 (Web 版本)

### 本地运行

```bash
docker pull ghcr.io/logseq/logseq-webapp:latest
docker run -d --rm -p 127.0.0.1:3001:80 ghcr.io/logseq/logseq-webapp:latest
```

访问: http://localhost:3001

### 远程部署 (需要 HTTPS)

参考 `docs/docker-web-app-guide.md` 获取详细说明。

---

## ⚠️ 常见问题

### 1. Clojure 版本错误

**错误**: `Execution error (FileNotFoundException) at java.io.FileInputStream/open0`

**解决**: 
- 卸载现有 Clojure
- 按照官方指南重新安装: https://clojure.org/guides/getting_started

### 2. 端口被占用

**错误**: `Port 3001 already in use`

**解决**:
```bash
# 查找占用进程
lsof -i :3001
# 或 (Linux)
netstat -tulpn | grep 3001
# 杀死进程
kill -9 <PID>
```

### 3. Electron 启动失败

**错误**: `Cannot start Electron app`

**解决**:
- 确保已关闭所有 Logseq 实例
- 检查 `static/` 目录是否存在且包含必要文件
- 重新运行 `yarn watch` 等待完整编译

### 4. 移动端构建失败

**错误**: iOS/Android 构建错误

**解决**:
- 确保已安装所有必需工具 (Xcode/Android Studio)
- 运行 `npx cap sync ios/android` 同步资源
- 检查 `capacitor.config.ts` 配置

### 5. 依赖安装失败

**错误**: `yarn install` 失败

**解决**:
```bash
# 清理缓存
yarn cache clean
rm -rf node_modules
rm yarn.lock
# 重新安装
yarn install
```

---

## 📝 构建产物说明

### 浏览器版本

- **开发模式**: 运行在 http://localhost:3001
- **生产构建**: `static/` 目录
  - `static/index.html` - 入口文件
  - `static/js/` - JavaScript 文件
  - `static/css/` - 样式文件

### 桌面应用

- **开发模式**: Electron 窗口
- **生产构建**: `static/out/`
  - macOS: `Logseq-darwin-x64/Logseq.app`
  - Windows: `Logseq-win32-x64/Logseq.exe`
  - Linux: `Logseq-linux-x64/` 或 `.AppImage`

### 移动应用

- **开发模式**: 通过 Xcode/Android Studio 运行
- **生产构建**: 
  - iOS: `.ipa` 文件
  - Android: `.apk` 或 `.aab` 文件

---

## 🔍 调试技巧

### 1. 查看构建日志

```bash
# 详细日志
yarn watch --verbose
```

### 2. 检查 Shadow CLJS 状态

访问: http://localhost:9630

### 3. 查看构建报告

```bash
yarn cljs:report
```

生成 `report.html` 文件，包含构建详情。

### 4. 调试 Electron

```bash
yarn debug-electron
```

---

## 📚 相关文档

- [开发指南 (macOS/Linux)](docs/develop-logseq.md)
- [Windows 开发指南](docs/develop-logseq-on-windows.md)
- [移动端开发指南](docs/develop-logseq-on-mobile.md)
- [Docker 部署指南](docs/docker-web-app-guide.md)
- [贡献指南](CONTRIBUTING.md)

---

## 🎯 快速参考

### 最常用的开发流程

**浏览器版本**:
```bash
yarn install
yarn watch
# 打开 http://localhost:3001
```

**桌面应用**:
```bash
yarn install
yarn watch  # 等待编译完成
yarn dev-electron-app  # 新终端
```

**移动应用**:
```bash
yarn install
yarn mobile-watch
npx cap sync ios/android
npx cap open ios/android
```

---

**最后更新**: 2026-01-23
