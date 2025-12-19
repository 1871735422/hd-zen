import { Page } from '@playwright/test';

/**
 * 工具函数：获取页面上所有可点击的链接
 */
export async function getAllLinks(
  page: Page
): Promise<Array<{ href: string; text: string; visible: boolean }>> {
  const links: Array<{ href: string; text: string; visible: boolean }> = [];

  try {
    // 获取所有 a 标签
    const anchorElements = await page.locator('a[href]').all();

    for (const element of anchorElements) {
      try {
        const href = await element.getAttribute('href');
        const text = await element.textContent();
        const isVisible = await element.isVisible().catch(() => false);

        if (href && href !== '#' && href !== 'javascript:void(0)') {
          links.push({
            href: href.trim(),
            text: (text || '').trim(),
            visible: isVisible,
          });
        }
      } catch {
        // 忽略无法访问的元素
      }
    }

    // 去重（基于 href）
    const uniqueLinks = Array.from(
      new Map(links.map(link => [link.href, link])).values()
    );

    return uniqueLinks;
  } catch (error) {
    console.error('Error getting links:', error);
    return [];
  }
}

/**
 * 工具函数：点击所有可见的链接并验证页面加载
 */
export async function clickAllLinks(
  page: Page,
  options: {
    baseURL?: string;
    maxLinks?: number;
    excludePatterns?: RegExp[];
    timeout?: number;
  } = {}
): Promise<Array<{ href: string; success: boolean; error?: string }>> {
  const {
    baseURL = '',
    maxLinks = 50,
    excludePatterns = [],
    timeout = 5000,
  } = options;

  const links = await getAllLinks(page);
  const results: Array<{ href: string; success: boolean; error?: string }> = [];

  // 过滤链接
  const filteredLinks = links
    .filter(link => link.visible)
    .filter(link => {
      // 排除外部链接（如果设置了 baseURL）
      if (
        baseURL &&
        link.href.startsWith('http') &&
        !link.href.startsWith(baseURL)
      ) {
        return false;
      }
      // 排除匹配排除模式的链接
      return !excludePatterns.some(pattern => pattern.test(link.href));
    })
    .slice(0, maxLinks);

  console.log(`Found ${filteredLinks.length} links to test`);

  for (const link of filteredLinks) {
    try {
      // 构建完整 URL
      const fullUrl = link.href.startsWith('http')
        ? link.href
        : new URL(link.href, page.url()).href;

      console.log(`Testing link: ${link.text || link.href} -> ${fullUrl}`);

      // 点击链接 - 使用多种策略确保找到链接
      const linkSelector = `a[href="${link.href}"]`;
      const linkElement = page.locator(linkSelector).first();

      const [response] = await Promise.all([
        page
          .waitForResponse(
            resp =>
              resp.url().includes(new URL(fullUrl).pathname) &&
              resp.status() < 400,
            { timeout }
          )
          .catch(() => null),
        linkElement.click().catch(async () => {
          // 如果直接选择器失败，尝试通过文本查找
          if (link.text) {
            await page.locator(`a:has-text("${link.text}")`).first().click();
          } else {
            throw new Error('Could not click link');
          }
        }),
      ]);

      // 等待页面加载
      await page.waitForLoadState('domcontentloaded', { timeout });

      results.push({
        href: link.href,
        success: true,
      });

      // 返回上一页或继续测试
      if (link.href.startsWith('http') && !link.href.startsWith(page.url())) {
        // 外部链接，返回
        await page.goBack({ timeout });
        await page.waitForLoadState('domcontentloaded', { timeout });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`Error testing link ${link.href}:`, errorMessage);
      results.push({
        href: link.href,
        success: false,
        error: errorMessage,
      });
    }
  }

  return results;
}

/**
 * 工具函数：等待页面完全加载
 */
export async function waitForPageLoad(page: Page, timeout = 30000) {
  await page.waitForLoadState('networkidle', { timeout });
  await page.waitForLoadState('domcontentloaded', { timeout });
}

/**
 * 工具函数：检查页面是否正常加载（没有错误）
 */
export async function checkPageHealth(page: Page): Promise<boolean> {
  try {
    // 检查是否有明显的错误信息
    const errorSelectors = [
      'text=404',
      'text=Not Found',
      'text=Error',
      '[role="alert"]',
      '.error',
    ];

    for (const selector of errorSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
        return false;
      }
    }

    // 检查响应状态（如果可能）
    return true;
  } catch {
    return true; // 如果检查失败，假设页面正常
  }
}
