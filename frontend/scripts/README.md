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
  - **默认只测试 2015 年以后的设备**（可通过 `--all-devices` 测试所有机型）。
  - **默认只测试 View 视图**（可通过 `--full-page` 同时测试 Full Page 视图）。
  - **支持设备类型过滤**：可只测试手机、平板或桌面设备。
  - **并行处理**：默认同时处理 8 个设备，大幅提升测试速度。
  - **断点续传**：支持跳过已存在的截图，中断后可继续执行。
  - **智能缓存策略**：HTML 文档使用 5 分钟缓存，平衡速度与内容新鲜度。

**使用方法 (Usage)：**

- **模式 A：自定义 URL 测试（推荐）**

  ```bash
  # 测试单个页面（默认：2015年以后的设备，只测试View视图）
  python scripts/test_responsive_screenshots.py -url "google.com"

  # 测试多个页面（使用分号分隔）
  python scripts/test_responsive_screenshots.py -url "baidu.com;bing.com"

  # 测试本地开发环境
  python scripts/test_responsive_screenshots.py -url "localhost:3000"

  # 只测试平板设备（使用简短的参数名 --DT）
  python scripts/test_responsive_screenshots.py -url "localhost:3000" --DT tablet

  # 只测试手机设备
  python scripts/test_responsive_screenshots.py -url "localhost:3000" --DT mobile

  # 只测试桌面设备
  python scripts/test_responsive_screenshots.py -url "localhost:3000" --DT pc

  # 启用断点续传（跳过已存在的截图）
  python scripts/test_responsive_screenshots.py -url "localhost:3000" --skip-existing

  # 自定义并行数量（如果机器性能足够，可以提高并行数加速）
  python scripts/test_responsive_screenshots.py -url "localhost:3000" --parallel 10

  # 自定义缓存时间（10分钟，600秒）
  python scripts/test_responsive_screenshots.py -url "localhost:3000" --cache-max-age 600

  # 禁用缓存（每次获取最新内容）
  python scripts/test_responsive_screenshots.py -url "localhost:3000" --cache-max-age 0

  # 组合使用多个参数
  python scripts/test_responsive_screenshots.py -url "localhost:3000" --DT tablet --skip-existing --parallel 5

  # 测试所有机型（包括2015年以前的旧设备）
  python scripts/test_responsive_screenshots.py -url "google.com" --all-devices

  # 同时测试View和Full Page视图
  python scripts/test_responsive_screenshots.py -url "google.com" --full-page

  # 测试所有机型 + Full Page视图
  python scripts/test_responsive_screenshots.py -url "google.com" --all-devices --full-page
  ```

- **模式 B：默认列表测试**
  如果不带参数运行，将测试脚本内预置的默认页面列表（通常为测试环境页面）。

  ```bash
  # 默认模式：2015年以后的设备，只测试View视图
  python scripts/test_responsive_screenshots.py

  # 只测试平板设备，启用断点续传
  python scripts/test_responsive_screenshots.py --DT tablet --skip-existing

  # 测试所有机型，启用并行加速
  python scripts/test_responsive_screenshots.py --all-devices --parallel 10

  # 同时测试Full Page视图
  python scripts/test_responsive_screenshots.py --full-page

  # 测试所有机型 + Full Page视图
  python scripts/test_responsive_screenshots.py --all-devices --full-page
  ```

**命令行参数说明：**

| 参数                     | 说明                                                                                  | 默认值                       |
| :----------------------- | :------------------------------------------------------------------------------------ | :--------------------------- |
| `-url`                   | 自定义测试 URL，多个 URL 用分号 `;` 分隔                                              | 使用默认页面列表             |
| `--all-devices`          | 测试所有机型（包括 2015 年以前的旧设备）                                              | 仅测试 2015 年以后的设备     |
| `--full-page`            | 同时测试 Full Page 视图（完整页面截图）                                               | 仅测试 View 视图（首屏截图） |
| `--DT` / `--device-type` | 只测试指定类型的设备：`mobile`（手机）、`tablet`（平板）、`pc`（桌面）、`all`（全部） | `all`                        |
| `--skip-existing`        | 跳过已存在的截图文件，实现断点续传                                                    | 重新生成所有截图             |
| `--cache-max-age`        | HTML 文档缓存时间（秒），设置为 0 禁用缓存                                            | `300`（5分钟）               |
| `--parallel`             | 并行处理的设备数量，增加此值可提高速度，但会消耗更多内存和 CPU                        | `8`                          |

**参数使用技巧：**

- **设备类型过滤**：使用 `--DT tablet` 可以只测试平板设备，大幅减少测试时间，适合快速验证特定设备类型。
- **断点续传**：使用 `--skip-existing` 可以在脚本中断后继续执行，只生成缺失的截图，节省时间。
- **并行处理**：默认并行数为 8，如果机器性能足够（内存 16GB+，CPU 8 核+），可以提高到 10-15 以加速。如果遇到内存不足，可以降低到 3-5。
- **缓存策略**：默认 5 分钟缓存既能保证内容相对新鲜，又能在同一次运行中让不同设备共享缓存，提高速度。如果测试环境内容频繁变化，可以设置为 0 禁用缓存。

**输出**：截图保存在 `scripts/screenshots/` 目录下，按页面名称分类。每个页面包含：

- `{设备名}_View_{宽}x{高}.png` - View 视图（首屏截图）
- `{设备名}_Full_{宽}x{高}.png` - Full Page 视图（完整页面截图，仅在启用 `--full-page` 时生成）

**性能优化：**

- **并行处理**：脚本默认使用 8 个并行任务，可以显著提升测试速度。根据机器性能调整 `--parallel` 参数。
- **智能缓存**：HTML 文档使用 5 分钟缓存，同一脚本运行期间不同设备可以共享缓存，减少网络请求。
- **断点续传**：使用 `--skip-existing` 参数可以在中断后继续执行，避免重复生成已完成的截图。

---

## 输出说明 (Output)

| 目录/文件              | 说明                                              |
| :--------------------- | :------------------------------------------------ |
| `scripts/screenshots/` | `test_responsive_screenshots.py` 的截图输出目录。 |
| `控制台日志`           | 检查结果直接输出到终端。                          |

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
