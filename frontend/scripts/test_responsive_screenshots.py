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
        
        # 补全协议
        if not url.startswith('http://') and not url.startswith('https://'):
            url = 'https://' + url
            
        # 简单的命名生成逻辑
        try:
            from urllib.parse import urlparse
            parsed = urlparse(url)
            # 用域名+路径作为名称，替换特殊字符
            domain = parsed.netloc.replace('www.', '')
            path = parsed.path.strip('/').replace('/', '_')
            if path:
                name = f"{domain}_{path}"
            else:
                name = domain
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
    {"name": "Mac_Air_11_Legacy_1366w", "width": 1366, "height": 768},
    
    # 2. 12" MacBook / 13" Old Pro (16:10)
    {"name": "Mac_Small_1280w", "width": 1280, "height": 800},
    
    # 3. 13.3" Air/Pro Retina Default (16:10) - Most Common
    {"name": "Mac_Std_1440w", "width": 1440, "height": 900},
    
    # 4. 14" MacBook Pro M-Series (Notch)
    {"name": "Mac_Pro_14_1512w", "width": 1512, "height": 982},
    
    # 5. 15.4" Pro Legacy Scaled (More Space)
    {"name": "Mac_Pro_15_Legacy_1680w", "width": 1680, "height": 1050},
    
    # 6. 16" MacBook Pro M-Series (Notch)
    {"name": "Mac_Pro_16_1728w", "width": 1728, "height": 1117},

    # --- Mac Desktops (iMac & Displays) ---
    # 7. 21.5" iMac Non-Retina / FHD External
    {"name": "Mac_Desktop_FHD_1920w", "width": 1920, "height": 1080},
    
    # 8. 21.5" iMac 4K Retina Default
    {"name": "Mac_Desktop_4K_2048w", "width": 2048, "height": 1152},
    
    # 9. 24" iMac M-Series 4.5K Default
    {"name": "Mac_Desktop_24_2240w", "width": 2240, "height": 1260},
    
    # 10. 27" iMac 5K / Studio Display Default
    {"name": "Mac_Desktop_5K_2560w", "width": 2560, "height": 1440},
    
    # 11. 32" Pro Display XDR 6K Default
    {"name": "Mac_Desktop_XDR_3008w", "width": 3008, "height": 1692},

    # --- Windows Laptops (Samsung, Dell, Lenovo, Microsoft 2010-2025) ---
    # 12. 13.5" Surface Laptop (3:2 Aspect Ratio) @ 150% Scale
    # Native: 2256x1504 -> Logical: 1504x1002
    {"name": "Win_Surface_Laptop_1504w", "width": 1504, "height": 1002},

    # 13. 12.3"-13" Surface Pro (3:2 Aspect Ratio) @ 200% Scale
    # Native: 2736x1824 (Pro 7) / 2880x1920 (Pro 8/9/X) -> Logical: ~1368x912 or 1440x960
    # Using common Pro 7 logical:
    {"name": "Win_Surface_Pro_1368w", "width": 1368, "height": 912},

    # 14. 13.4" Dell XPS 13 / Modern 16:10 Ultrabooks (FHD+)
    # Native: 1920x1200 @ 100% (or 3840x2400 @ 200%)
    {"name": "Win_XPS_16_10_1920w", "width": 1920, "height": 1200},

    # 15. 14" Lenovo ThinkPad X1 Carbon / T-Series (16:10)
    # Native: 2240x1400 @ 150% -> Logical: ~1493x933
    # Or Standard FHD+ 1920x1200
    {"name": "Win_ThinkPad_16_10_1920w", "width": 1920, "height": 1200},

    # 16. Standard 15.6" Laptop (FHD 16:9) @ 125% Scale (Very Common)
    # Native: 1920x1080 -> Logical: 1536x864
    {"name": "Win_FHD_Scaled_125_1536w", "width": 1536, "height": 864},

    # 17. Standard 13.3"/14" Laptop (FHD 16:9) @ 150% Scale
    # Native: 1920x1080 -> Logical: 1280x720
    {"name": "Win_FHD_Scaled_150_1280w", "width": 1280, "height": 720},

    # 18. Legacy Business Laptop (14" 1600x900)
    # Common in 2010-2015 era (ThinkPad T420/T440)
    {"name": "Win_Legacy_1600w", "width": 1600, "height": 900},

    # 19. Legacy Budget Laptop (15.6" 1366x768)
    # The dominant resolution for 2010-2018 budget laptops
    {"name": "Win_Legacy_1366w", "width": 1366, "height": 768},

    # 20. Samsung Galaxy Book / High-End OLED (16:10 3K)
    # Native: 2880x1800 @ 200% -> Logical: 1440x900 (Same as Mac default)
    # Native: 2880x1800 @ 175% -> Logical: ~1645x1028
    {"name": "Win_OLED_3K_Scaled_1440w", "width": 1440, "height": 900},

    # --- Standard External Monitors (PC/Windows Default) ---
    # 21. Standard 1080p Monitor (100% Scale)
    {"name": "PC_Monitor_1080p_1920w", "width": 1920, "height": 1080},

    # 22. Standard 2K QHD Monitor (100% Scale)
    {"name": "PC_Monitor_2K_2560w", "width": 2560, "height": 1440},

    # 23. Standard 4K UHD Monitor (150% Scale - Very Common Windows setting)
    # Native: 3840x2160 -> Logical: 2560x1440
    {"name": "PC_Monitor_4K_Scaled_150_2560w", "width": 2560, "height": 1440},

    # 24. Standard 4K UHD Monitor (200% Scale - "Retina" style)
    # Native: 3840x2160 -> Logical: 1920x1080
    {"name": "PC_Monitor_4K_Scaled_200_1920w", "width": 1920, "height": 1080},

    # 25. Standard 4K UHD Monitor (100% Scale - Massive Workspace)
    {"name": "PC_Monitor_4K_Native_3840w", "width": 3840, "height": 2160},
]

# 2. 移动设备基础数据 (名称, 竖屏逻辑宽, 竖屏逻辑高)
# Playwright 使用 CSS 逻辑像素，而非物理像素
MOBILE_DEVICE_SPECS = [
    # =========================================================================
    # 1. Apple iPhone Series (2010-2025)
    # =========================================================================
    # 1.1. 3.5"/4.0" Legacy Small (iPhone 4S/5/5S/SE1)
    ("Apple_iPhone_Small_320w", 320, 568),
    
    # 1.2. 4.7" Classic Retina (iPhone 6/7/8/SE2/SE3)
    ("Apple_iPhone_Classic_375w", 375, 667),
    
    # 1.3. 5.5" Classic Plus (iPhone 6/7/8 Plus)
    ("Apple_iPhone_Plus_414w", 414, 736),
    
    # 1.4. 5.8"/5.4" Notch Small (iPhone X/XS/11Pro, iPhone 12/13 Mini)
    ("Apple_iPhone_Notch_Small_375w_Tall", 375, 812),
    
    # 1.5. 6.1" Notch/Dynamic Standard (iPhone 12/13/14/15/16 Pro)
    # Note: 12/13/14Pro are 390w; 14Pro/15/16 are 393w. Merged as 393w.
    ("Apple_iPhone_Modern_Std_393w", 393, 852),
    
    # 1.6. 6.1"/6.5" Notch Large Legacy (iPhone XR/11/XS Max)
    ("Apple_iPhone_Notch_Large_414w_Tall", 414, 896),
    
    # 1.7. 6.7"/6.9" Modern Max (iPhone 12/13/14 Plus, 13-16 Pro Max)
    # Note: 12/13/14Plus are 428w; 14-16 Pro Max are 430w. Merged as 430w.
    ("Apple_iPhone_Modern_Max_430w", 430, 932),

    # =========================================================================
    # 2. Huawei & Honor Series (High-End Android)
    # =========================================================================
    # 2.1. Huawei Mate 60/50 Pro, P60 Pro (Massive Screen)
    # Logic Width: 432px (Very common for modern Huawei flagships)
    ("Huawei_Mate_Pro_432w", 432, 960),
    
    # 2.2. Huawei P40/P50 / Honor Magic Standard
    # Logic Width: 360px (Legacy standard) or 393px (Modern standard)
    # We use 360px here to represent the "Standard Android" baseline heavily used by Huawei/Honor mid-range
    ("Huawei_Honor_Std_360w", 360, 780),
    
    # 2.3. Huawei Mate X3/X5 Foldable (Inner Screen)
    # ~2200x2480 physical -> ~420dpi -> ~ 5.3" aspect
    # Logic: ~970px width unfolded (Approximate)
    ("Huawei_Mate_X_Inner_970w", 970, 1100),

    # =========================================================================
    # 3. Samsung Galaxy Series
    # =========================================================================
    # 3.1. Samsung Galaxy S20/S21/S22/S23 Ultra (The "Phablet" King)
    # Logic Width: 412px (Distinctive Samsung Width)
    ("Samsung_Ultra_412w", 412, 915),
    
    # 3.2. Samsung Galaxy S20/S21/S22/S23 Base & Plus
    # Logic Width: 360px (Samsung strictly adheres to 360dp for non-Ultra usually, though newer Plus models creep up)
    # Covered by "Android_Std_360w" generally, but listed for clarity
    ("Samsung_S_Base_360w", 360, 800),
    
    # 3.3. Samsung Galaxy Z Fold 4/5/6 (Outer Screen - Narrow)
    # 904x2316 physical -> Logic ~344px to 400px depending on model
    # Fold 4/5 are notoriously narrow: ~344px or 320px in older models
    ("Samsung_Fold_Outer_344w", 344, 900),
    
    # 3.4. Samsung Galaxy Z Fold 4/5/6 (Inner Screen - Boxy)
    ("Samsung_Fold_Inner_900w", 900, 1080),

    # =========================================================================
    # 4. Xiaomi, Oppo, Vivo, Google Pixel
    # =========================================================================
    # 4.1. Xiaomi 13/14, Pixel 7/8, Oppo Find X6/X7
    # Modern Android Flagship Standard: 393px (Matches iPhone Pro width)
    ("Android_Flagship_Modern_393w", 393, 851),
    
    # 4.2. Oppo Find N2/N3 (Foldable Outer - Wide)
    # Oppo's foldable outer screen is wider/shorter than Samsung's
    # Logic: ~410px - 430px
    ("Oppo_Find_N_Outer_412w", 412, 800),

    # 4.3. Generic Budget/Mid-Range Android (Redmi Note, Galaxy A, Honor X)
    # The absolute most common viewport on the web for Android
    ("Android_Universal_360w", 360, 800),

    # =========================================================================
    # 5. Tablets (Apple & Android)
    # =========================================================================
    # 5.1. iPad Mini 6 / 8.3" (New Aspect)
    ("iPad_Mini_New_744w", 744, 1133),
    
    # 5.2. iPad Standard 10.2" / Legacy 9.7" (4:3)
    ("iPad_Classic_768w", 768, 1024),
    
    # 5.3. iPad Air/Pro 11" (Modern Standard)
    ("iPad_Air_Pro_820w", 820, 1180),
    
    # 5.4. iPad Pro 12.9" (Legacy Large)
    ("iPad_Pro_Large_1024w", 1024, 1366),
    
    # 5.5. iPad Pro 13" M4 (2024 Ultimate)
    ("iPad_Pro_M4_1032w", 1032, 1376),
    
    # 5.6. Android Tablet Standard (11" 16:10) - Huawei MatePad, Samsung Tab S
    ("Android_Tab_11_800w", 800, 1280),
    
    # 5.7. Android Tablet Large (12.4"+) - Samsung Tab S8+/Ultra
    # Logic often scales to ~900-1000px width
    ("Android_Tab_Large_960w", 960, 1440),
]

# 构建最终测试列表
DEVICES = []

# 添加 PC
for pc in PC_DEVICES:
    DEVICES.append({
        "name": pc["name"],
        "width": pc["width"],
        "height": pc["height"],
        "is_mobile": False,
        "has_touch": False
    })

# 添加移动设备 (自动生成横竖屏)
for name, w, h in MOBILE_DEVICE_SPECS:
    # 竖屏 (Portrait)
    DEVICES.append({
        "name": f"{name}_Portrait",
        "width": w,
        "height": h,
        "is_mobile": True,
        "has_touch": True
    })
    # 横屏 (Landscape) - 宽高互换
    DEVICES.append({
        "name": f"{name}_Landscape",
        "width": h,
        "height": w,
        "is_mobile": True,
        "has_touch": True
    })

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

    print(f"🚀 开始响应式截图测试...")
    print(f"📅 时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🔗 目标页面数: {len(TARGET_URLS)}")
    print(f"📱 模拟设备数: {len(DEVICES)}")
    if args.url:
        print(f"📌 模式: 自定义 URL 测试")
    else:
        print(f"📌 模式: 默认全站测试")
    print("="*50)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        for device_conf in DEVICES:
            print(f"\n📱 正在模拟设备: {device_conf['name']} ({device_conf['width']}x{device_conf['height']})")
            
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

            page = await context.new_page()

            for target in TARGET_URLS:
                url = target["url"]
                page_name = target["name"]
                
                print(f"  📸 正在截图: {page_name} ...", end="", flush=True)
                
                try:
                    # 延长超时时间到 60秒，避免高清大图加载超时
                    await page.goto(url, wait_until="networkidle", timeout=60000)
                    await page.wait_for_timeout(300)
                    search_info = await try_fill_search_input(page, "三殊胜")
                    
                    # 创建页面专属文件夹
                    page_dir = os.path.join(OUTPUT_DIR, page_name)
                    if not os.path.exists(page_dir):
                        os.makedirs(page_dir, exist_ok=True)

                    # 1. 截取首屏 (Viewport) - 能直观看到横竖屏区别
                    viewport_filename = f"{device_conf['name']}_View_{device_conf['width']}x{device_conf['height']}.png"
                    viewport_filepath = os.path.join(page_dir, viewport_filename)
                    await page.screenshot(path=viewport_filepath, full_page=False)
                    
                    # 2. 截取全长图 (Full Page)
                    full_filename = f"{device_conf['name']}_Full_{device_conf['width']}x{device_conf['height']}.png"
                    full_filepath = os.path.join(page_dir, full_filename)
                    await page.screenshot(path=full_filepath, full_page=True)
                    
                    # 获取实际视口宽度用于验证
                    actual_width = await page.evaluate("window.innerWidth")
                    if search_info:
                        m = search_info["metrics"]
                        print(
                            f" ✅ [w:{actual_width}px] [search:{m['fontSize']}, {m['width']}x{m['height']}] -> {page_name}/{viewport_filename}"
                        )
                    else:
                        print(f" ✅ [w:{actual_width}px] [search:not_found] -> {page_name}/{viewport_filename}")
                    
                except Exception as e:
                    print(f" ❌ 失败: {e}")

            await context.close()

        await browser.close()

    print("\n" + "="*50)
    print(f"🎉 所有截图任务完成！请查看目录: {OUTPUT_DIR}")

if __name__ == "__main__":
    asyncio.run(capture_screenshots())
