# 自动化测试工具集 (Automated Testing Toolkit)

本项目包含一套用于 Web 前端自动化测试的 Python 脚本工具，主要用于**响应式截图测试**、**全站链接健康检查**以及**资源文件匹配度验证**。基于 [Playwright](https://playwright.dev/) 和 `asyncio` 构建。

## 📋 目录 (Table of Contents)

- [自动化测试工具集 (Automated Testing Toolkit)](#自动化测试工具集-automated-testing-toolkit)
  - [📋 目录 (Table of Contents)](#-目录-table-of-contents)
  - [环境准备 (Installation)](#环境准备-installation)
  - [工具列表 (Tools)](#工具列表-tools)
    - [1. 通用响应式截图工具 (`test_responsive_screenshots.py`)](#1-通用响应式截图工具-test_responsive_screenshotspy)
  - [输出说明 (Output)](#输出说明-output)
  - [设备覆盖列表 (Device Coverage)](#设备覆盖列表-device-coverage)

---

## 环境准备 (Installation)

运行本工具集需要 Python 3.7+ 环境。

1. **安装依赖库**

   ```bash
   pip install playwright aiohttp beautifulsoup4
   ```

2. **安装浏览器驱动** (Playwright)
   ```bash
   playwright install chromium
   ```
   _注意：如果脚本运行时检测到缺少驱动，会尝试自动安装。_

---

## 工具列表 (Tools)

### 1. 通用响应式截图工具 (`test_responsive_screenshots.py`)

**核心功能**：支持自定义 URL 的多设备响应式截图工具。包含 25+ PC 分辨率和 27+ 移动设备（自动生成横竖屏）的完整测试覆盖。

- **特点**：
  - 支持通过命令行 `-url` 参数指定测试页面。
  - 支持多 URL 批量测试（分号分隔）。
  - 自动补全 `https://` 协议。
  - 移动端设备包含详细的层级分类（Apple, Huawei, Samsung, Xiaomi 等）。

**使用方法 (Usage)：**

- **模式 A：自定义 URL 测试（推荐）**

  ```bash
  # 测试单个页面
  python _TEST/test_responsive_screenshots.py -url "google.com"

  # 测试多个页面（使用分号分隔）
  python _TEST/test_responsive_screenshots.py -url "baidu.com;bing.com"

  python _TEST/test_responsive_screenshots.py -url "cxk.fohuifayu.com/course/1"
  ```

- **模式 B：默认列表测试**
  如果不带参数运行，将测试脚本内预置的默认页面列表（通常为测试环境页面）。
  ```bash
  python _TEST/test_responsive_screenshots.py
  ```

**输出**：截图保存在 `_TEST/screenshots/` 目录下，按域名/页面名称分类。

---

## 输出说明 (Output)

| 目录/文件              | 说明                                              |
| :--------------------- | :------------------------------------------------ |
| `_TEST/screenshots/`   | `test_responsive_screenshots.py` 的截图输出目录。 |
| `_TEST/screenshotsFH/` | `test_screenshots_fh.py` 的截图输出目录。         |
| `控制台日志`           | `test_all_url.py` 的检查结果直接输出到终端。      |

---

## 设备覆盖列表 (Device Coverage)

截图工具均覆盖以下设备类型：

- **PC/Mac**: 涵盖 11" Air 到 32" Pro Display XDR，以及 Windows 主流分辨率（1366x768 至 4K）。
- **Mobile**:
  - **Apple**: iPhone 4S 至 iPhone 16 Pro Max 全系列。
  - **Huawei**: Mate 60/50, P60, Mate X Fold 等。
  - **Samsung**: S23 Ultra, Z Fold 系列。
  - **Xiaomi/Oppo/Vivo**: 主流旗舰及折叠屏。
  - **Tablets**: iPad 全系列 (Mini, Air, Pro) 及 Android 平板。
