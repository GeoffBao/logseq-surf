#!/bin/bash
# Logseq 临时测试应用编译脚本

set -e  # 遇到错误立即退出

echo "🚀 开始编译 Logseq 测试应用..."
echo ""

# 检查环境
echo "📋 检查编译环境..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi
NODE_VERSION=$(node --version)
echo "✅ Node.js: $NODE_VERSION"

# 检查 Yarn
if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn 未安装，请先安装 Yarn"
    exit 1
fi
YARN_VERSION=$(yarn --version)
echo "✅ Yarn: $YARN_VERSION"

# 检查 Java (通过 Clojure 检查，因为 Clojure 可能自带 Java)
if ! clojure -M -e "(println \"Java OK\")" &> /dev/null; then
    echo "⚠️  Java 未安装或配置不正确，Clojure 编译需要 Java"
    echo ""
    echo "📥 安装 Java 的方法："
    echo "   方法 1 (推荐): brew install openjdk@17"
    echo "   方法 2: 下载安装 https://www.oracle.com/java/technologies/downloads/"
    echo "   方法 3: 使用 SDKMAN: curl -s \"https://get.sdkman.io\" | bash && sdk install java"
    echo ""
    echo "   安装后需要设置 JAVA_HOME 环境变量"
    exit 1
fi
JAVA_VERSION=$(clojure -M -e "(println (System/getProperty \"java.version\"))" 2>&1 | grep -v "WARNING" | head -1)
echo "✅ Java: $JAVA_VERSION"

# 检查 Clojure
if ! command -v clojure &> /dev/null; then
    echo "⚠️  Clojure CLI 未安装"
    echo "   安装方法: https://clojure.org/guides/getting_started"
    echo "   或使用: brew install clojure/tools/clojure"
    exit 1
fi
echo "✅ Clojure CLI 已安装"

echo ""
echo "📦 安装依赖..."
yarn install

echo ""
echo "📦 安装 static 目录依赖..."
cd static
yarn install
cd ..

echo ""
echo "🔨 开始编译（这可能需要几分钟）..."
echo "   编译类型: 桌面应用 (Electron)"
echo ""

# 编译生产版本
yarn release-electron

echo ""
echo "✅ 编译完成！"
echo ""
echo "📁 编译产物位置: static/out/"
echo ""
echo "💡 提示："
echo "   - macOS: 查看 static/out/mac/ 目录"
echo "   - Windows: 查看 static/out/win-unpacked/ 目录"
echo "   - Linux: 查看 static/out/linux-unpacked/ 目录"
echo ""
