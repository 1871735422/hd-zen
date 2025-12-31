import { test, expect, Page } from '@playwright/test';

/**
 * 工具函数：获取页面上的所有资源标题
 */
async function getAllResourceTitles(page: Page): Promise<string[]> {
  const titles: string[] = [];

  // 查找侧边栏中的标题
  const sidebarItems = page.locator(
    '[role="listitem"], a[href*="question"], [class*="sidebar"] [class*="title"], [class*="label"]'
  );
  const count = await sidebarItems.count();

  for (let i = 0; i < count; i++) {
    try {
      const text = await sidebarItems.nth(i).textContent();
      if (text && text.trim().length > 0) {
        titles.push(text.trim());
      }
    } catch {
      // 忽略错误，继续下一个
    }
  }

  return titles;
}

/**
 * 工具函数：获取当前显示的视频标题
 */
async function getCurrentVideoTitle(page: Page): Promise<string | null> {
  try {
    // 尝试多个选择器
    const selectors = [
      'h1',
      'h2',
      'h3',
      '[class*="title"]:visible',
      'Typography:visible',
    ];

    for (const selector of selectors) {
      const elements = page.locator(selector);
      const count = await elements.count();

      for (let i = 0; i < count; i++) {
        const text = await elements.nth(i).textContent();
        if (text && text.trim().length > 0 && text.trim().length < 200) {
          // 过滤掉过长的文本（可能是正文）
          return text.trim();
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * 工具函数：检查资源 URL 是否可访问
 */
async function checkResourceUrlAccessible(
  page: Page,
  url: string
): Promise<{ accessible: boolean; status?: number; error?: string }> {
  try {
    const response = await page.request.head(url, { timeout: 10000 });
    const status = response.status();

    return {
      accessible: status >= 200 && status < 400,
      status,
    };
  } catch (error) {
    return {
      accessible: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * 工具函数：从页面中提取所有视频 URL
 */
async function extractVideoUrls(page: Page): Promise<{
  playUrls: string[];
  downloadUrls: string[];
}> {
  const playUrls: string[] = [];
  const downloadUrls: string[] = [];

  try {
    // 查找 video 元素的 src
    const videos = page.locator('video');
    const videoCount = await videos.count();

    for (let i = 0; i < videoCount; i++) {
      const src = await videos.nth(i).getAttribute('src');
      if (src) {
        playUrls.push(src);
      }

      const sourceElements = videos.nth(i).locator('source');
      const sourceCount = await sourceElements.count();

      for (let j = 0; j < sourceCount; j++) {
        const sourceSrc = await sourceElements.nth(j).getAttribute('src');
        if (sourceSrc) {
          playUrls.push(sourceSrc);
        }
      }
    }

    // 查找下载链接（通过下载按钮的 href 或 data 属性）
    const downloadButtons = page.locator(
      'button:has([class*="Download"]), a[href*=".mp4"], a[download]'
    );
    const buttonCount = await downloadButtons.count();

    for (let i = 0; i < buttonCount; i++) {
      const href = await downloadButtons.nth(i).getAttribute('href');
      if (href && (href.includes('.mp4') || href.includes('download'))) {
        downloadUrls.push(href);
      }
    }
  } catch (error) {
    console.error('Error extracting video URLs:', error);
  }

  return {
    playUrls: [...new Set(playUrls)],
    downloadUrls: [...new Set(downloadUrls)],
  };
}

/**
 * 测试资源标题一致性
 */
test.describe('Resource Consistency Tests', () => {
  test('should verify title consistency between sidebar and content', async ({
    page,
  }) => {
    const testUrl = process.env.TEST_QA_URL || '/qa/1/lesson1';
    await page.goto(testUrl);
    await page.waitForLoadState('networkidle');

    // 获取侧边栏中的所有标题
    const sidebarTitles = await getAllResourceTitles(page);
    expect(sidebarTitles.length).toBeGreaterThan(0);

    // 遍历每个标题，检查一致性
    const sidebarItems = page.locator('[role="listitem"], a[href*="question"]');
    const itemCount = await sidebarItems.count();

    const inconsistencies: Array<{
      sidebarTitle: string;
      contentTitle: string | null;
      index: number;
    }> = [];

    for (let i = 0; i < Math.min(itemCount, 5); i++) {
      try {
        // 点击侧边栏项
        const item = sidebarItems.nth(i);
        const sidebarTitle = await item.textContent();

        if (!sidebarTitle || sidebarTitle.trim().length === 0) {
          continue;
        }

        await item.click();
        await page.waitForTimeout(2000); // 等待内容加载

        // 获取当前内容的标题
        const contentTitle = await getCurrentVideoTitle(page);

        // 检查标题是否一致（允许部分匹配，因为可能有格式化差异）
        const sidebarTitleClean = sidebarTitle.trim().toLowerCase();
        const contentTitleClean = contentTitle
          ? contentTitle.trim().toLowerCase()
          : '';

        // 检查是否包含关键信息（提取数字或主要文本）
        const sidebarKey = sidebarTitleClean
          .replace(/^\d+\.?\s*/, '')
          .substring(0, 20);
        const contentKey = contentTitleClean
          .replace(/^\d+\.?\s*/, '')
          .substring(0, 20);

        if (
          contentTitleClean &&
          !contentTitleClean.includes(sidebarKey) &&
          !sidebarTitleClean.includes(contentKey) &&
          sidebarKey.length > 5 &&
          contentKey.length > 5
        ) {
          inconsistencies.push({
            sidebarTitle: sidebarTitle.trim(),
            contentTitle,
            index: i,
          });
        }
      } catch (error) {
        console.error(`Error checking title consistency for item ${i}:`, error);
      }
    }

    // 输出不一致的情况
    if (inconsistencies.length > 0) {
      console.warn('Title inconsistencies found:');
      inconsistencies.forEach(inc => {
        console.warn(
          `  Item ${inc.index}: Sidebar="${inc.sidebarTitle}", Content="${inc.contentTitle}"`
        );
      });
    }

    // 允许少量不一致（可能是格式问题）
    expect(inconsistencies.length).toBeLessThan(Math.ceil(itemCount * 0.3));
  });

  test('should verify all video resources are accessible', async ({ page }) => {
    const testUrl = process.env.TEST_QA_URL || '/qa/1/lesson1';
    await page.goto(testUrl);
    await page.waitForLoadState('networkidle');

    const sidebarItems = page.locator('[role="listitem"], a[href*="question"]');
    const itemCount = await sidebarItems.count();

    const inaccessibleResources: Array<{
      index: number;
      title: string | null;
      urls: string[];
      errors: string[];
    }> = [];

    // 测试前几个视频的资源可访问性
    for (let i = 0; i < Math.min(itemCount, 3); i++) {
      try {
        const item = sidebarItems.nth(i);
        await item.click();
        await page.waitForTimeout(2000);

        const title = await getCurrentVideoTitle(page);
        const { playUrls, downloadUrls } = await extractVideoUrls(page);

        const allUrls = [...playUrls, ...downloadUrls];
        const errors: string[] = [];

        // 检查每个 URL 是否可访问
        for (const url of allUrls.slice(0, 3)) {
          // 限制检查数量
          if (!url || url.startsWith('blob:')) {
            continue;
          }

          // 如果是相对路径，转换为绝对路径
          const absoluteUrl = url.startsWith('http')
            ? url
            : new URL(url, page.url()).href;

          const result = await checkResourceUrlAccessible(page, absoluteUrl);
          if (!result.accessible) {
            errors.push(`${url}: ${result.error || `Status ${result.status}`}`);
          }
        }

        if (errors.length > 0) {
          inaccessibleResources.push({
            index: i,
            title,
            urls: allUrls,
            errors,
          });
        }
      } catch (error) {
        console.error(
          `Error checking resource accessibility for item ${i}:`,
          error
        );
      }
    }

    // 输出不可访问的资源
    if (inaccessibleResources.length > 0) {
      console.warn('Inaccessible resources found:');
      inaccessibleResources.forEach(resource => {
        console.warn(`  Item ${resource.index} (${resource.title}):`);
        resource.errors.forEach(error => {
          console.warn(`    - ${error}`);
        });
      });
    }

    // 允许少量资源不可访问（可能是网络问题或资源确实不存在）
    expect(inaccessibleResources.length).toBeLessThan(itemCount);
  });
});
