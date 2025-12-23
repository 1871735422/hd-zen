import asyncio
import os
import sys
import subprocess
import argparse
from datetime import datetime

# 检查并尝试导入 Playwright
try:
    from playwright.async_api import async_playwright
    HAS_PLAYWRIGHT = True
except ImportError:
    HAS_PLAYWRIGHT = False

# -----------------------------------------------------------------------------
# 配置区域
# -----------------------------------------------------------------------------

# 命令行参数解析
parser = argparse.ArgumentParser(description='Responsive Screenshots Tool')
parser.add_argument('-url', type=str, help='自定义测试 URL，多个 URL 用分号 ; 分隔 (例如: "google.com;bing.com")')
parser.add_argument('--all-devices', action='store_true', help='测试所有机型（包括2015年以前的旧设备）')
parser.add_argument('--full-page', action='store_true', help='同时测试 Full Page 视图（默认只测试 View 视图）')
parser.add_argument('--DT', '--device-type', type=str, choices=['mobile', 'tablet', 'pc', 'all'], default='all',
                    dest='device_type', help='只测试指定类型的设备: mobile(手机), tablet(平板), pc(桌面), all(全部，默认)')
parser.add_argument('--skip-existing', action='store_true',
                    help='跳过已存在的截图文件，实现断点续传（默认：重新生成所有截图）')
parser.add_argument('--cache-max-age', type=int, default=300,
                    help='HTML 文档缓存时间（秒），默认 300 秒（5分钟）。设置为 0 禁用缓存')
parser.add_argument('--parallel', type=int, default=8,
                    help='并行处理的设备数量，默认 3。增加此值可提高速度，但会消耗更多内存和 CPU')
args, unknown = parser.parse_known_args()

# 生成目标 URL 列表
TARGET_URLS = []

if args.url:
    print(f"🎯 检测到自定义 URL 参数: {args.url}")
    raw_urls = args.url.split(';')
    for i, raw_url in enumerate(raw_urls):
        url = raw_url.strip()
        if not url:
            continue

        # 补全协议（本地开发通常使用 http://）
        if not url.startswith('http://') and not url.startswith('https://'):
            # 如果是 localhost 或 127.0.0.1，使用 http://，否则使用 https://
            if 'localhost' in url or '127.0.0.1' in url:
                url = 'http://' + url
            else:
                url = 'https://' + url

        # 简单的命名生成逻辑（只使用路径，不包含域名，避免特殊字符问题）
        try:
            from urllib.parse import urlparse
            parsed = urlparse(url)
            # 只使用路径部分，替换特殊字符为安全字符
            path = parsed.path.strip('/').replace('/', '_')
            # 如果路径为空，使用根路径名称
            if path:
                # 只保留路径，不包含域名（避免 localhost:3000 等特殊字符）
                name = path
            else:
                # 如果没有路径，使用根路径标识
                name = "root"
        except:
            name = f"Custom_Page_{i+1}"

        TARGET_URLS.append({"name": name, "url": url})

    if not TARGET_URLS:
        print("⚠️ 提供的 URL 无效，将使用默认列表。")

if not TARGET_URLS:
    # 默认测试列表
    # 1. 首页
    TARGET_URLS.append({"name": "Home", "url": "https://cxk.fohuifayu.com/"})

    # 2. 课程页面 (1-6)
    for i in range(1, 7):
        TARGET_URLS.append({"name": f"Course_{i}", "url": f"https://cxk.fohuifayu.com/course/{i}"})

    # 3. 问答页面 (1-6)
    for i in range(1, 7):
        TARGET_URLS.append({"name": f"QA_{i}", "url": f"https://cxk.fohuifayu.com/qa/{i}"})

    # 4. 参考资料页面 (1-6)
    for i in range(1, 6):
        TARGET_URLS.append({"name": f"Reference_{i}", "url": f"https://cxk.fohuifayu.com/reference/{i}"})

    # 5. 下载页面
    TARGET_URLS.append({"name": "Download", "url": "https://cxk.fohuifayu.com/download"})

# -----------------------------------------------------------------------------
# 设备配置库
# -----------------------------------------------------------------------------

# 1. PC / 桌面显示器 (Mac 2010-2025 主流逻辑分辨率 + Windows)
PC_DEVICES = [
    # --- Mac Laptops (Legacy & Modern) ---
    # 1. 11" MacBook Air Legacy (16:9)
    {"name": "Mac_Air_11_Legacy_1366w", "width": 1366, "height": 768, "year": 2010},

    # 2. 12" MacBook / 13" Old Pro (16:10)
    {"name": "Mac_Small_1280w", "width": 1280, "height": 800, "year": 2010},

    # 3. 13.3" Air/Pro Retina Default (16:10) - Most Common
    {"name": "Mac_Std_1440w", "width": 1440, "height": 900, "year": 2012},

    # 4. 14" MacBook Pro M-Series (Notch)
    {"name": "Mac_Pro_14_1512w", "width": 1512, "height": 982, "year": 2021},

    # 5. 15.4" Pro Legacy Scaled (More Space)
    {"name": "Mac_Pro_15_Legacy_1680w", "width": 1680, "height": 1050, "year": 2010},

    # 6. 16" MacBook Pro M-Series (Notch)
    {"name": "Mac_Pro_16_1728w", "width": 1728, "height": 1117, "year": 2021},

    # --- Mac Desktops (iMac & Displays) ---
    # 7. 21.5" iMac Non-Retina / FHD External
    {"name": "Mac_Desktop_FHD_1920w", "width": 1920, "height": 1080, "year": 2012},

    # 8. 21.5" iMac 4K Retina Default
    {"name": "Mac_Desktop_4K_2048w", "width": 2048, "height": 1152, "year": 2015},

    # 9. 24" iMac M-Series 4.5K Default
    {"name": "Mac_Desktop_24_2240w", "width": 2240, "height": 1260, "year": 2021},

    # 10. 27" iMac 5K / Studio Display Default
    {"name": "Mac_Desktop_5K_2560w", "width": 2560, "height": 1440, "year": 2014},

    # 11. 32" Pro Display XDR 6K Default
    {"name": "Mac_Desktop_XDR_3008w", "width": 3008, "height": 1692, "year": 2019},

    # --- Windows Laptops (Samsung, Dell, Lenovo, Microsoft 2010-2025) ---
    # 12. 13.5" Surface Laptop (3:2 Aspect Ratio) @ 150% Scale
    # Native: 2256x1504 -> Logical: 1504x1002
    {"name": "Win_Surface_Laptop_1504w", "width": 1504, "height": 1002, "year": 2017},

    # 13. 12.3"-13" Surface Pro (3:2 Aspect Ratio) @ 200% Scale
    # Native: 2736x1824 (Pro 7) / 2880x1920 (Pro 8/9/X) -> Logical: ~1368x912 or 1440x960
    # Using common Pro 7 logical:
    {"name": "Win_Surface_Pro_1368w", "width": 1368, "height": 912, "year": 2019},

    # 14. 13.4" Dell XPS 13 / Modern 16:10 Ultrabooks (FHD+)
    # Native: 1920x1200 @ 100% (or 3840x2400 @ 200%)
    {"name": "Win_XPS_16_10_1920w", "width": 1920, "height": 1200, "year": 2018},

    # 15. 14" Lenovo ThinkPad X1 Carbon / T-Series (16:10)
    # Native: 2240x1400 @ 150% -> Logical: ~1493x933
    # Or Standard FHD+ 1920x1200
    {"name": "Win_ThinkPad_16_10_1920w", "width": 1920, "height": 1200, "year": 2018},

    # 16. Standard 15.6" Laptop (FHD 16:9) @ 125% Scale (Very Common)
    # Native: 1920x1080 -> Logical: 1536x864
    {"name": "Win_FHD_Scaled_125_1536w", "width": 1536, "height": 864, "year": 2016},

    # 17. Standard 13.3"/14" Laptop (FHD 16:9) @ 150% Scale
    # Native: 1920x1080 -> Logical: 1280x720
    {"name": "Win_FHD_Scaled_150_1280w", "width": 1280, "height": 720, "year": 2016},

    # 18. Legacy Business Laptop (14" 1600x900)
    # Common in 2010-2015 era (ThinkPad T420/T440)
    {"name": "Win_Legacy_1600w", "width": 1600, "height": 900, "year": 2010},

    # 19. Legacy Budget Laptop (15.6" 1366x768)
    # The dominant resolution for 2010-2018 budget laptops
    {"name": "Win_Legacy_1366w", "width": 1366, "height": 768, "year": 2010},

    # 20. Samsung Galaxy Book / High-End OLED (16:10 3K)
    # Native: 2880x1800 @ 200% -> Logical: 1440x900 (Same as Mac default)
    # Native: 2880x1800 @ 175% -> Logical: ~1645x1028
    {"name": "Win_OLED_3K_Scaled_1440w", "width": 1440, "height": 900, "year": 2021},

    # --- Standard External Monitors (PC/Windows Default) ---
    # 21. Standard 1080p Monitor (100% Scale)
    {"name": "PC_Monitor_1080p_1920w", "width": 1920, "height": 1080, "year": 2010},

    # 22. Standard 2K QHD Monitor (100% Scale)
    {"name": "PC_Monitor_2K_2560w", "width": 2560, "height": 1440, "year": 2012},

    # 23. Standard 4K UHD Monitor (150% Scale - Very Common Windows setting)
    # Native: 3840x2160 -> Logical: 2560x1440
    {"name": "PC_Monitor_4K_Scaled_150_2560w", "width": 2560, "height": 1440, "year": 2016},

    # 24. Standard 4K UHD Monitor (200% Scale - "Retina" style)
    # Native: 3840x2160 -> Logical: 1920x1080
    {"name": "PC_Monitor_4K_Scaled_200_1920w", "width": 1920, "height": 1080, "year": 2016},

    # 25. Standard 4K UHD Monitor (100% Scale - Massive Workspace)
    {"name": "PC_Monitor_4K_Native_3840w", "width": 3840, "height": 2160, "year": 2016},
]

# 2. 移动设备基础数据 (名称, 竖屏逻辑宽, 竖屏逻辑高, 年份)
# Playwright 使用 CSS 逻辑像素，而非物理像素
MOBILE_DEVICE_SPECS = [
    # =========================================================================
    # 1. Apple iPhone Series (2010-2025)
    # =========================================================================
    # 1.1. 3.5"/4.0" Legacy Small (iPhone 4S/5/5S/SE1)
    {"name": "Apple_iPhone_Small_320w", "width": 320, "height": 568, "year": 2010},

    # 1.2. 4.7" Classic Retina (iPhone 6/7/8/SE2/SE3)
    {"name": "Apple_iPhone_Classic_375w", "width": 375, "height": 667, "year": 2014},

    # 1.3. 5.5" Classic Plus (iPhone 6/7/8 Plus)
    {"name": "Apple_iPhone_Plus_414w", "width": 414, "height": 736, "year": 2014},

    # 1.4. 5.8"/5.4" Notch Small (iPhone X/XS/11Pro, iPhone 12/13 Mini)
    {"name": "Apple_iPhone_Notch_Small_375w_Tall", "width": 375, "height": 812, "year": 2017},

    # 1.5. 6.1" Notch/Dynamic Standard (iPhone 12/13/14/15/16 Pro)
    # Note: 12/13/14Pro are 390w; 14Pro/15/16 are 393w. Merged as 393w.
    {"name": "Apple_iPhone_Modern_Std_393w", "width": 393, "height": 852, "year": 2020},

    # 1.6. 6.1"/6.5" Notch Large Legacy (iPhone XR/11/XS Max)
    {"name": "Apple_iPhone_Notch_Large_414w_Tall", "width": 414, "height": 896, "year": 2018},

    # 1.7. 6.7"/6.9" Modern Max (iPhone 12/13/14 Plus, 13-16 Pro Max)
    # Note: 12/13/14Plus are 428w; 14-16 Pro Max are 430w. Merged as 430w.
    {"name": "Apple_iPhone_Modern_Max_430w", "width": 430, "height": 932, "year": 2020},

    # =========================================================================
    # 2. Huawei & Honor Series (High-End Android)
    # =========================================================================
    # 2.1. Huawei Mate 60/50 Pro, P60 Pro (Massive Screen)
    # Logic Width: 432px (Very common for modern Huawei flagships)
    {"name": "Huawei_Mate_Pro_432w", "width": 432, "height": 960, "year": 2022},

    # 2.2. Huawei P40/P50 / Honor Magic Standard
    # Logic Width: 360px (Legacy standard) or 393px (Modern standard)
    # We use 360px here to represent the "Standard Android" baseline heavily used by Huawei/Honor mid-range
    {"name": "Huawei_Honor_Std_360w", "width": 360, "height": 780, "year": 2020},

    # 2.3. Huawei Mate X3/X5 Foldable (Inner Screen)
    # ~2200x2480 physical -> ~420dpi -> ~ 5.3" aspect
    # Logic: ~970px width unfolded (Approximate)
    {"name": "Huawei_Mate_X_Inner_970w", "width": 970, "height": 1100, "year": 2023},

    # =========================================================================
    # 3. Samsung Galaxy Series
    # =========================================================================
    # 3.1. Samsung Galaxy S20/S21/S22/S23 Ultra (The "Phablet" King)
    # Logic Width: 412px (Distinctive Samsung Width)
    {"name": "Samsung_Ultra_412w", "width": 412, "height": 915, "year": 2020},

    # 3.2. Samsung Galaxy S20/S21/S22/S23 Base & Plus
    # Logic Width: 360px (Samsung strictly adheres to 360dp for non-Ultra usually, though newer Plus models creep up)
    # Covered by "Android_Std_360w" generally, but listed for clarity
    {"name": "Samsung_S_Base_360w", "width": 360, "height": 800, "year": 2020},

    # 3.3. Samsung Galaxy Z Fold 4/5/6 (Outer Screen - Narrow)
    # 904x2316 physical -> Logic ~344px to 400px depending on model
    # Fold 4/5 are notoriously narrow: ~344px or 320px in older models
    {"name": "Samsung_Fold_Outer_344w", "width": 344, "height": 900, "year": 2022},

    # 3.4. Samsung Galaxy Z Fold 4/5/6 (Inner Screen - Boxy)
    {"name": "Samsung_Fold_Inner_900w", "width": 900, "height": 1080, "year": 2022},

    # =========================================================================
    # 4. Xiaomi, Oppo, Vivo, Google Pixel
    # =========================================================================
    # 4.1. Xiaomi 13/14, Pixel 7/8, Oppo Find X6/X7
    # Modern Android Flagship Standard: 393px (Matches iPhone Pro width)
    {"name": "Android_Flagship_Modern_393w", "width": 393, "height": 851, "year": 2022},

    # 4.2. Oppo Find N2/N3 (Foldable Outer - Wide)
    # Oppo's foldable outer screen is wider/shorter than Samsung's
    # Logic: ~410px - 430px
    {"name": "Oppo_Find_N_Outer_412w", "width": 412, "height": 800, "year": 2022},

    # 4.3. Generic Budget/Mid-Range Android (Redmi Note, Galaxy A, Honor X)
    # The absolute most common viewport on the web for Android
    {"name": "Android_Universal_360w", "width": 360, "height": 800, "year": 2016},

    # =========================================================================
    # 5. Tablets (Apple & Android)
    # =========================================================================
    # 5.1. iPad Mini 6 / 8.3" (New Aspect)
    {"name": "iPad_Mini_New_744w", "width": 744, "height": 1133, "year": 2021},

    # 5.2. iPad Standard 10.2" / Legacy 9.7" (4:3)
    {"name": "iPad_Classic_768w", "width": 768, "height": 1024, "year": 2010},

    # 5.3. iPad Air/Pro 11" (Modern Standard)
    {"name": "iPad_Air_Pro_820w", "width": 820, "height": 1180, "year": 2018},

    # 5.4. iPad Pro 12.9" (Legacy Large)
    {"name": "iPad_Pro_Large_1024w", "width": 1024, "height": 1366, "year": 2015},

    # 5.5. iPad Pro 13" M4 (2024 Ultimate)
    {"name": "iPad_Pro_M4_1032w", "width": 1032, "height": 1376, "year": 2024},

    # 5.6. Android Tablet Standard (11" 16:10) - Huawei MatePad, Samsung Tab S
    {"name": "Android_Tab_11_800w", "width": 800, "height": 1280, "year": 2020},

    # 5.7. Android Tablet Large (12.4"+) - Samsung Tab S8+/Ultra
    # Logic often scales to ~900-1000px width
    {"name": "Android_Tab_Large_960w", "width": 960, "height": 1440, "year": 2022},
]

# 构建最终测试列表
DEVICES = []

# 年份阈值：默认只处理2015年以后的设备
YEAR_THRESHOLD = 2015

# 判断是否为平板设备（根据设备名称或宽度）
def is_tablet_device(device_name: str, portrait_width: int) -> bool:
    """判断设备是否为平板（基于竖屏宽度）"""
    tablet_keywords = ['iPad', 'Tab', 'Tablet', 'MatePad']
    # 检查设备名称中是否包含平板关键词
    if any(keyword in device_name for keyword in tablet_keywords):
        return True
    # 根据宽度判断：>= 600px 且 <= 1024px 的移动设备通常是平板
    # 手机通常 < 500px（竖屏宽度）
    if 600 <= portrait_width <= 1024:
        return True
    return False

# 判断是否为手机设备
def is_phone_device(device_name: str, portrait_width: int) -> bool:
    """判断设备是否为手机（基于竖屏宽度）"""
    # 如果宽度 < 600px，通常是手机
    if portrait_width < 600:
        return True
    # 检查设备名称中是否包含手机关键词
    phone_keywords = ['iPhone', 'Galaxy_S', 'Huawei_Mate_Pro', 'Huawei_Honor_Std',
                      'Samsung_Ultra', 'Samsung_S_Base', 'Samsung_Fold_Outer',
                      'Android_Flagship', 'Oppo_Find_N_Outer', 'Android_Universal']
    if any(keyword in device_name for keyword in phone_keywords):
        # 排除平板关键词
        if not is_tablet_device(device_name, portrait_width):
            return True
    return False

# 添加 PC
if args.device_type in ['pc', 'all']:
    for pc in PC_DEVICES:
        # 如果未启用 --all-devices，则过滤掉2015年以前的设备
        if not args.all_devices and pc.get("year", 2020) < YEAR_THRESHOLD:
            continue

        DEVICES.append({
            "name": pc["name"],
            "width": pc["width"],
            "height": pc["height"],
            "is_mobile": False,
            "has_touch": False,
            "year": pc.get("year", 2020),
            "device_type": "pc"
        })

# 添加移动设备 (自动生成横竖屏)
if args.device_type in ['mobile', 'tablet', 'all']:
    for mobile in MOBILE_DEVICE_SPECS:
        # 如果未启用 --all-devices，则过滤掉2015年以前的设备
        if not args.all_devices and mobile.get("year", 2020) < YEAR_THRESHOLD:
            continue

        name = mobile["name"]
        w = mobile["width"]  # 竖屏宽度
        h = mobile["height"]  # 竖屏高度
        year = mobile.get("year", 2020)

        # 判断设备类型（基于竖屏宽度）
        is_tablet = is_tablet_device(name, w)
        is_phone = is_phone_device(name, w)
        device_type = "tablet" if is_tablet else ("phone" if is_phone else "mobile")

        # 根据 --device-type 参数过滤
        if args.device_type == 'mobile' and not is_phone:
            continue
        if args.device_type == 'tablet' and not is_tablet:
            continue

        # 竖屏 (Portrait)
        DEVICES.append({
            "name": f"{name}_Portrait",
            "width": w,
            "height": h,
            "is_mobile": True,
            "has_touch": True,
            "year": year,
            "device_type": device_type
        })
        # 横屏 (Landscape) - 宽高互换
        DEVICES.append({
            "name": f"{name}_Landscape",
            "width": h,
            "height": w,
            "is_mobile": True,
            "has_touch": True,
            "year": year,
            "device_type": device_type
        })

# 去重：合并相同宽高的设备（保留第一个设备名称）
seen_devices = {}
deduplicated_devices = []
merged_info = []  # 记录合并信息，稍后统一输出

for device in DEVICES:
    # 使用 (width, height, is_mobile, has_touch) 作为唯一键
    key = (device["width"], device["height"], device["is_mobile"], device["has_touch"])

    if key in seen_devices:
        # 如果已存在相同宽高的设备，跳过并记录合并信息
        existing_device = seen_devices[key]
        merged_info.append({
            "merged": device["name"],
            "kept": existing_device["name"],
            "size": f"{device['width']}x{device['height']}"
        })
    else:
        # 首次出现，添加到结果列表
        seen_devices[key] = device
        deduplicated_devices.append(device)

DEVICES = deduplicated_devices

# 如果有合并的设备，在开始截图前统一输出
if merged_info:
    print("\n" + "="*50)
    print("🔄 设备合并信息（相同宽高的设备已合并）:")
    for info in merged_info:
        print(f"   {info['merged']} -> {info['kept']} ({info['size']})")
    print("="*50 + "\n")

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "screenshots")

# -----------------------------------------------------------------------------
# 功能实现
# -----------------------------------------------------------------------------

async def install_playwright():
    """自动安装 Playwright"""
    print("⚠️ 未检测到 Playwright，正在尝试自动安装...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "playwright"])
        subprocess.check_call(["playwright", "install", "chromium"])
        print("✅ Playwright 安装成功！")
    except Exception as e:
        print("❌ 自动安装 Playwright 失败，请手动执行：")
        print("   pip install playwright")
        print("   playwright install chromium")
        print(f"   详细错误: {e}")
        sys.exit(1)

async def try_fill_search_input(page, text: str):
    """尝试在页面中找到搜索框并填入指定文字，返回匹配信息或 None"""
    selectors = [
        'input[type="search"]',
        'input[placeholder*="搜索"]',
        'input[aria-label*="搜索"]',
        'input[title*="搜索"]',
        'input[placeholder*="Search" i]',
        'input[aria-label*="Search" i]',
        'input[name*="search" i]',
        'input[id*="search" i]',
        'input[class*="search" i]',
        'header input[type="text"]',
        'header input',
        'nav input',
    ]

    for sel in selectors:
        locator = page.locator(sel).first
        try:
            if await locator.count() <= 0:
                continue
            if not await locator.is_visible():
                continue
            await locator.scroll_into_view_if_needed(timeout=3000)
            await locator.click(timeout=3000)
            await locator.fill(text, timeout=3000)
            value = await locator.input_value()
            if value != text:
                await locator.click(timeout=3000)
                await locator.press("ControlOrMeta+A")
                await locator.type(text, delay=30)
                value = await locator.input_value()

            if value != text:
                continue

            metrics = await locator.evaluate(
                """(el) => {
                    const cs = window.getComputedStyle(el);
                    const r = el.getBoundingClientRect();
                    return {
                        fontSize: cs.fontSize,
                        lineHeight: cs.lineHeight,
                        padding: cs.padding,
                        width: Math.round(r.width),
                        height: Math.round(r.height),
                    };
                }"""
            )
            return {"selector": sel, "value": value, "metrics": metrics}
        except Exception:
            continue

    return None

async def process_device(browser, device_conf, index, total_devices, semaphore):
    """处理单个设备的截图任务"""
    async with semaphore:  # 控制并发数量
        print(f"\n📱 正在模拟设备 [{index}/{total_devices}]: {device_conf['name']} ({device_conf['width']}x{device_conf['height']})")

        # 创建上下文，配置视口
        # 显式设置 screen 尺寸，增强横屏模拟效果
        context = await browser.new_context(
            viewport={"width": device_conf["width"], "height": device_conf["height"]},
            screen={"width": device_conf["width"], "height": device_conf["height"]},
            is_mobile=device_conf["is_mobile"],
            has_touch=device_conf["has_touch"],
            device_scale_factor=2 if device_conf["is_mobile"] else 1, # 提升移动端截图清晰度
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1" if device_conf["is_mobile"] else None
        )

        page = None
        try:
            page = await context.new_page()

            # 设置合理的缓存策略：为 HTML 文档设置短期缓存
            # 这样既能确保内容相对新鲜，又能在同一脚本运行期间让不同设备共享缓存，提高速度
            # 注意：只对 HTML 文档拦截并设置缓存，其他资源（JS/CSS/图片）直接使用服务器缓存策略
            cache_max_age = args.cache_max_age
            if cache_max_age > 0:
                async def set_cache_policy(route):
                    if route.request.resource_type == "document":
                        # 对 HTML 文档设置缓存时间
                        # 这样可以确保在脚本运行期间（通常几分钟内）不同设备可以共享缓存
                        response = await route.fetch()
                        headers = dict(response.headers)
                        headers["Cache-Control"] = f"public, max-age={cache_max_age}"
                        await route.fulfill(response=response, headers=headers)
                    else:
                        # 其他资源（JS/CSS/图片等）直接继续，不拦截
                        # 这些资源通常服务器已经设置了合理的缓存策略（如长期缓存），直接使用即可
                        await route.continue_()

                await context.route("**/*", set_cache_policy)

            for target in TARGET_URLS:
                url = target["url"]
                page_name = target["name"]

                # 创建页面专属文件夹
                page_dir = os.path.join(OUTPUT_DIR, page_name)
                if not os.path.exists(page_dir):
                    os.makedirs(page_dir, exist_ok=True)

                # 检查需要截图的文件
                viewport_filename = f"{device_conf['name']}_View_{device_conf['width']}x{device_conf['height']}.png"
                viewport_filepath = os.path.join(page_dir, viewport_filename)

                full_filename = f"{device_conf['name']}_Full_{device_conf['width']}x{device_conf['height']}.png"
                full_filepath = os.path.join(page_dir, full_filename)

                # 断点续传：检查文件是否已存在
                skip_viewport = args.skip_existing and os.path.exists(viewport_filepath)
                skip_full = args.skip_existing and args.full_page and os.path.exists(full_filepath)

                # 如果两个文件都已存在且启用了跳过，则完全跳过这个任务
                if skip_viewport and (not args.full_page or skip_full):
                    print(f"  ⏭️  跳过已存在: {page_name} ({viewport_filename})")
                    continue

                # 构建跳过提示信息
                skip_info = []
                if skip_viewport:
                    skip_info.append("View")
                if skip_full:
                    skip_info.append("Full")
                skip_msg = f" [跳过: {', '.join(skip_info)}]" if skip_info else ""

                print(f"  📸 正在截图: {page_name}{skip_msg} ...", end="", flush=True)

                try:
                    # 只有在需要生成至少一个截图时才加载页面
                    if not skip_viewport or (args.full_page and not skip_full):
                        # 延长超时时间到 60秒，避免高清大图加载超时
                        await page.goto(url, wait_until="networkidle", timeout=60000)
                        await page.wait_for_timeout(300)

                    # 1. 截取首屏 (Viewport) - 能直观看到横竖屏区别
                    if not skip_viewport:
                        await page.screenshot(path=viewport_filepath, full_page=False)

                    # 2. 截取全长图 (Full Page) - 仅在启用 --full-page 时执行
                    if args.full_page and not skip_full:
                        await page.screenshot(path=full_filepath, full_page=True)

                    # 获取实际视口宽度用于验证（如果页面已加载）
                    if not skip_viewport or (args.full_page and not skip_full):
                        actual_width = await page.evaluate("window.innerWidth")
                        print(f" ✅ [w:{actual_width}px] -> {page_name}/{viewport_filename}")
                    else:
                        print(f" ✅ 已跳过")

                except Exception as e:
                    print(f" ❌ 失败: {e}")
                    # 继续处理下一个任务，不中断整个流程
                    continue
        finally:
            # 清理路由拦截，避免关闭 context 时超时
            try:
                await context.unroute("**/*")
            except Exception:
                pass

            # 关闭页面和上下文
            try:
                if page:
                    await page.close()
            except Exception:
                pass

            try:
                await context.close()
            except Exception:
                pass

async def capture_screenshots():
    """执行截图任务"""
    if not HAS_PLAYWRIGHT:
        await install_playwright()
        # 重新导入
        from playwright.async_api import async_playwright as _ap
        globals()["async_playwright"] = _ap

    # 确保输出目录存在
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"📁 创建截图目录: {OUTPUT_DIR}")

    # 统计设备类型
    device_type_counts = {}
    for device in DEVICES:
        device_type = device.get("device_type", "unknown")
        device_type_counts[device_type] = device_type_counts.get(device_type, 0) + 1

    print(f"🚀 开始响应式截图测试...")
    print(f"📅 时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🔗 目标页面数: {len(TARGET_URLS)}")
    print(f"📱 模拟设备数: {len(DEVICES)}")
    if device_type_counts:
        type_info = ", ".join([f"{k}: {v}" for k, v in device_type_counts.items()])
        print(f"📊 设备类型分布: {type_info}")
    print(f"📅 设备筛选: {'所有机型' if args.all_devices else '2015年以后的机型'}")
    print(f"🎯 设备类型过滤: {args.device_type}")
    print(f"📸 截图模式: {'View + Full Page' if args.full_page else 'View 视图'}")
    print(f"🔄 断点续传: {'已启用（跳过已存在的截图）' if args.skip_existing else '已禁用（重新生成所有截图）'}")
    cache_info = f"{args.cache_max_age}秒" if args.cache_max_age > 0 else "已禁用"
    print(f"💾 缓存策略: HTML 文档缓存 {cache_info}，其他资源使用服务器默认缓存")
    print(f"⚡ 并行处理: {args.parallel} 个设备同时运行")
    if args.url:
        print(f"📌 模式: 自定义 URL 测试")
    else:
        print(f"📌 模式: 默认全站测试")
    print("="*50)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        total_devices = len(DEVICES)

        # 创建信号量来控制并发数量
        semaphore = asyncio.Semaphore(args.parallel)

        # 创建所有设备的任务
        tasks = [
            process_device(browser, device_conf, index + 1, total_devices, semaphore)
            for index, device_conf in enumerate(DEVICES)
        ]

        # 并行执行所有任务
        await asyncio.gather(*tasks)

        await browser.close()

    print("\n" + "="*50)
    print(f"🎉 所有截图任务完成！请查看目录: {OUTPUT_DIR}")

if __name__ == "__main__":
    asyncio.run(capture_screenshots())
