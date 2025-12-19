import { expect, test } from '@playwright/test';
import {
  checkPageHealth,
  getAllLinks,
  waitForPageLoad,
} from './utils/page-helpers';

/**
 * 搜索页面测试
 */
test.describe('Search Page Tests', () => {
  // 测试搜索页面基本功能
  test('should test search page and search functionality', async ({ page }) => {
    test.setTimeout(3 * 60 * 1000); // 3 minutes
    const baseURL =
      process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

    console.log('Testing search page...');
    await page.goto(`${baseURL}/search`);
    await waitForPageLoad(page);

    // 检查页面健康状态
    const isHealthy = await checkPageHealth(page);
    expect(isHealthy).toBe(true);

    // 查找搜索输入框
    const searchInput = page
      .locator(
        'input[type="search"], input[placeholder*="搜索"], input[name*="search"]'
      )
      .first();
    const searchButton = page
      .locator('button[type="submit"], button:has-text("搜索")')
      .first();

    // 测试搜索功能（如果有搜索框）
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Testing search functionality...');

      // 输入搜索关键词
      const testKeywords = ['禅修', '问答', '课程'];

      for (const keyword of testKeywords) {
        try {
          await searchInput.fill(keyword);
          await page.waitForTimeout(500);

          // 点击搜索按钮或按回车
          if (
            await searchButton.isVisible({ timeout: 1000 }).catch(() => false)
          ) {
            await searchButton.click();
          } else {
            await searchInput.press('Enter');
          }

          // 等待搜索结果加载
          await page.waitForLoadState('networkidle', { timeout: 10000 });
          await page.waitForTimeout(1000);

          // 检查是否有搜索结果
          const hasResults =
            (await page
              .locator(
                '[class*="result"], [class*="search"], article, [role="article"]'
              )
              .count()) > 0;

          if (hasResults) {
            console.log(`✓ Search for "${keyword}" returned results`);
          } else {
            console.log(
              `⚠ Search for "${keyword}" completed but no results found`
            );
          }
        } catch (error) {
          console.error(`✗ Search failed for "${keyword}":`, error);
        }
      }
    } else {
      console.log('No search input found, skipping search functionality test');
    }

    // 获取所有链接
    const links = await getAllLinks(page);
    console.log(`Found ${links.length} links on search page`);

    // 测试搜索结果中的链接
    const resultLinks = links.filter(
      link =>
        link.visible &&
        (link.href.includes('/course/') ||
          link.href.includes('/qa/') ||
          link.href.includes('/reference/'))
    );

    console.log(`Found ${resultLinks.length} result links`);

    // 测试前几个结果链接
    const maxResults = process.env.MAX_SEARCH_RESULTS
      ? parseInt(process.env.MAX_SEARCH_RESULTS)
      : 5;

    for (const link of resultLinks.slice(0, maxResults)) {
      try {
        const fullUrl = link.href.startsWith('http')
          ? link.href
          : new URL(link.href, page.url()).href;

        await page.goto(fullUrl, {
          waitUntil: 'domcontentloaded',
          timeout: 10000,
        });
        await page.waitForTimeout(1000);

        const pageHealthy = await checkPageHealth(page);
        expect(pageHealthy).toBe(true);

        console.log(`✓ Result link works: ${link.href}`);
      } catch (error) {
        console.error(`✗ Result link failed: ${link.href}`, error);
      }
    }
  });
});
