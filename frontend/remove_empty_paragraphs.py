#!/usr/bin/env python3
"""
批量删除 Pages 文档中的空段落
使用方法：
1. 在 Pages 中将文档导出为 Word (.docx) 格式
2. 运行此脚本：python3 remove_empty_paragraphs.py your_file.docx
3. 处理后的文件会保存为 your_file_cleaned.docx
4. 在 Pages 中打开处理后的文件
"""

import sys
import os
from pathlib import Path

def remove_empty_paragraphs_from_text(input_file, output_file):
    """处理纯文本文件"""
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 删除多余的空行
    while '\n\n\n' in content:
        content = content.replace('\n\n\n', '\n\n')

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ 已处理完成：{output_file}")

def remove_empty_paragraphs_from_docx(input_file, output_file):
    """处理 Word 文档"""
    try:
        from docx import Document
    except ImportError:
        print("错误：需要安装 python-docx 库")
        print("请运行：pip3 install python-docx")
        sys.exit(1)

    doc = Document(input_file)

    # 删除空段落
    paragraphs_to_remove = []
    for i, para in enumerate(doc.paragraphs):
        if para.text.strip() == '':
            paragraphs_to_remove.append(para)

    for para in paragraphs_to_remove:
        p_element = para._element
        p_element.getparent().remove(p_element)

    doc.save(output_file)
    print(f"✓ 已删除 {len(paragraphs_to_remove)} 个空段落")
    print(f"✓ 已保存到：{output_file}")

def main():
    if len(sys.argv) < 2:
        print("使用方法：")
        print("  python3 remove_empty_paragraphs.py <文件路径>")
        print("\n支持的文件格式：")
        print("  - .txt  (纯文本)")
        print("  - .docx (Word 文档)")
        print("\n示例：")
        print("  python3 remove_empty_paragraphs.py document.docx")
        sys.exit(1)

    input_file = sys.argv[1]

    if not os.path.exists(input_file):
        print(f"错误：文件不存在：{input_file}")
        sys.exit(1)

    # 生成输出文件名
    path = Path(input_file)
    output_file = path.parent / f"{path.stem}_cleaned{path.suffix}"

    # 根据文件类型处理
    if path.suffix.lower() == '.docx':
        remove_empty_paragraphs_from_docx(input_file, str(output_file))
    elif path.suffix.lower() in ['.txt', '.text']:
        remove_empty_paragraphs_from_text(input_file, str(output_file))
    else:
        print(f"错误：不支持的文件格式：{path.suffix}")
        print("请先在 Pages 中导出为 .docx 或 .txt 格式")
        sys.exit(1)

if __name__ == '__main__':
    main()
