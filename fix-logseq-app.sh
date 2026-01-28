#!/bin/bash

# 修复 Logseq 应用的 macOS 安全限制
# 使用方法: ./fix-logseq-app.sh <Logseq.app路径>

APP_PATH="$1"

if [ -z "$APP_PATH" ]; then
    echo "使用方法: $0 <Logseq.app路径>"
    echo "示例: $0 ~/Downloads/Logseq.app"
    echo "或者: $0 /Applications/Logseq.app"
    exit 1
fi

if [ ! -d "$APP_PATH" ]; then
    echo "错误: 找不到应用 $APP_PATH"
    exit 1
fi

echo "正在修复 Logseq 应用..."
echo "应用路径: $APP_PATH"

# 移除隔离属性
echo "1. 移除隔离属性 (quarantine)..."
xattr -dr com.apple.quarantine "$APP_PATH" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "   ✓ 已移除隔离属性"
else
    echo "   ⚠ 未找到隔离属性（可能已经移除）"
fi

# 移除其他可能的安全属性
echo "2. 清理其他安全属性..."
xattr -dr com.apple.provenance "$APP_PATH" 2>/dev/null

# 设置执行权限
echo "3. 设置执行权限..."
chmod +x "$APP_PATH/Contents/MacOS/Logseq" 2>/dev/null

echo ""
echo "✓ 修复完成！"
echo ""
echo "如果仍然无法打开，请尝试："
echo "1. 右键点击应用 -> 打开（而不是双击）"
echo "2. 在系统设置 -> 隐私与安全性 -> 允许运行"
echo "3. 或者运行: sudo spctl --master-disable (不推荐，会禁用所有安全保护)"
