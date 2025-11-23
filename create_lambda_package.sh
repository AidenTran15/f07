#!/bin/bash
# Bash script để tạo Lambda deployment package cho Linux/Mac

echo "🚀 Tạo Lambda deployment package..."

# Tạo thư mục tạm
TEMP_DIR="lambda-deployment"
if [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
fi
mkdir "$TEMP_DIR"

echo "📁 Copy lambda_function.py..."
cp lambda_function.py "$TEMP_DIR/"

echo "📦 Cài đặt dependencies (boto3)..."
cd "$TEMP_DIR"
pip install boto3 -t . --quiet
cd ..

echo "📦 Tạo zip file..."
ZIP_FILE="lambda-function.zip"
if [ -f "$ZIP_FILE" ]; then
    rm "$ZIP_FILE"
fi

# Zip nội dung thư mục (không zip thư mục)
cd "$TEMP_DIR"
zip -r "../$ZIP_FILE" . -q
cd ..

echo "🧹 Dọn dẹp..."
rm -rf "$TEMP_DIR"

echo "✅ Hoàn tất! File: $ZIP_FILE"
echo "📤 Bây giờ bạn có thể upload file này lên Lambda Console"

