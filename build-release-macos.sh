#!/bin/bash
# Logseq 正式版 macOS (arm64) 构建脚本
# 请在本地终端执行，确保 Java/Clojure 已配置好

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "==> 使用 Java/Clojure 环境"
export JAVA_HOME="${JAVA_HOME:-$(/usr/libexec/java_home 2>/dev/null)}"
if [ -z "$JAVA_HOME" ]; then
  # Homebrew OpenJDK 常见路径
  for j in /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home \
           /opt/homebrew/Cellar/openjdk@17/*/libexec/openjdk.jdk/Contents/Home \
           /opt/homebrew/Cellar/openjdk/25*/libexec/openjdk.jdk/Contents/Home; do
    if [ -d "$j" ]; then JAVA_HOME="$j"; break; fi
  done
fi
if [ -n "$JAVA_HOME" ]; then
  export PATH="$JAVA_HOME/bin:$PATH"
  echo "    JAVA_HOME=$JAVA_HOME"
fi
java -version 2>&1 | head -1 || { echo "请先安装并配置 Java (推荐 Java 17)"; exit 1; }

echo ""
echo "==> 1/5 安装依赖"
yarn install

echo ""
echo "==> 2/5 前端资源构建 (gulp build)"
yarn gulp:build

echo ""
echo "==> 3/5 ClojureScript 编译 (耗时较长)"
yarn cljs:release-electron

echo ""
echo "==> 4/5 Webpack 构建"
yarn webpack-app-build

echo ""
echo "==> 5/5 打 Electron 包 (macOS arm64)"
# 从 version.cljs 取版本号写入 static/package.json，再在 static 里打包
VERSION=$(grep -oE '[0-9]+\.[0-9]+\.[0-9]+' src/main/frontend/version.cljs 2>/dev/null | head -1)
if [ -z "$VERSION" ]; then VERSION="2.0.0"; fi
node -e "
const p=require('path'),fs=require('fs');
const pkgPath=p.join('$ROOT','static','package.json');
let j=require(pkgPath);
j.version='$VERSION';
fs.writeFileSync(pkgPath, JSON.stringify(j,null,2));
"
cd static
yarn install --prefer-offline --no-progress 2>/dev/null || yarn install
yarn electron:make-macos-arm64
cd "$ROOT"

OUT_DIR="$ROOT/static/out/make"
echo ""
echo "✅ 构建完成"
echo "   DMG: $OUT_DIR/Logseq.dmg"
echo "   ZIP: $OUT_DIR/zip/darwin/arm64/Logseq-darwin-arm64-$VERSION.zip"
echo ""
echo "若首次打开被系统拦截，在应用上执行："
echo "   xattr -dr com.apple.quarantine \"$OUT_DIR/zip/darwin/arm64/Logseq-darwin-arm64-$VERSION.zip\""
echo "   解压后的 Logseq.app 也可同样执行一次 xattr -dr com.apple.quarantine Logseq.app"
