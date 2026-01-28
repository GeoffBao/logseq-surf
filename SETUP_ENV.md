# 环境设置指南

## 📋 编译 Logseq 所需环境

### ✅ 已安装
- Node.js: v24.7.0
- Yarn: 1.22.22
- Clojure CLI: 已安装

### ❌ 需要安装
- **Java JDK** (必需)

---

## 🔧 安装 Java

### macOS 方法 1: 使用 Homebrew (推荐)

```bash
# 安装 OpenJDK 17 (LTS 版本)
brew install openjdk@17

# 设置环境变量 (添加到 ~/.zshrc 或 ~/.bash_profile)
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
echo 'export PATH="$JAVA_HOME/bin:$PATH"' >> ~/.zshrc

# 重新加载配置
source ~/.zshrc

# 验证安装
java -version
```

### macOS 方法 2: 使用 SDKMAN

```bash
# 安装 SDKMAN
curl -s "https://get.sdkman.io" | bash

# 重新加载 shell
source "$HOME/.sdkman/bin/sdkman-init.sh"

# 安装 Java 17
sdk install java 17.0.2-tem

# 验证
java -version
```

### macOS 方法 3: 直接下载

1. 访问: https://www.oracle.com/java/technologies/downloads/#java17
2. 下载 macOS 安装包
3. 安装后设置 JAVA_HOME:
   ```bash
   export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
   ```

---

## ✅ 验证环境

运行以下命令验证所有环境：

```bash
# 检查 Node.js
node --version  # 应该 >= 22.20.0

# 检查 Yarn
yarn --version

# 检查 Java
java -version

# 检查 Clojure
clojure --version

# 测试 Clojure 能否运行
clojure -M -e "(println \"Clojure OK\")"
```

---

## 🚀 开始编译

环境配置完成后，运行：

```bash
./build-test-app.sh
```

或手动执行：

```bash
# 1. 安装依赖
yarn install
cd static && yarn install && cd ..

# 2. 编译桌面应用
yarn release-electron

# 编译产物在 static/out/ 目录
```

---

## 📝 注意事项

1. **Java 版本**: 推荐使用 Java 17 (LTS)，兼容性最好
2. **内存**: 编译过程可能需要较多内存，建议至少 8GB RAM
3. **时间**: 首次编译可能需要 10-20 分钟，取决于机器性能
4. **网络**: 需要稳定的网络连接下载依赖

---

## 🆘 常见问题

### Q: Clojure 报错找不到 Java
**A**: 确保 JAVA_HOME 环境变量正确设置，并且 `java -version` 可以正常运行。

### Q: 编译过程中内存不足
**A**: 可以增加 Node.js 内存限制：
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
```

### Q: 依赖下载失败
**A**: 检查网络连接，或使用国内镜像：
```bash
yarn config set registry https://registry.npmmirror.com
```

之后要「更新代码并重新打正式版」，在项目根目录执行：
git pull
./build-release-macos.sh
git pull./build-release-macos.sh
脚本会依次完成：依赖安装 → gulp 构建 → ClojureScript 编译 → webpack → Electron 打包（macOS arm64）。