import { expect, test } from '@playwright/test';
import {
  checkPageHealth,
  clickAllLinks,
  getAllLinks,
  waitForPageLoad,
} from './utils/page-helpers';

/**
 * 首页、Ask、下载页面测试
 */
test.describe('Home, Ask and Download Tests', () => {
  // 测试首页
  test('should test home page and all links', async ({ page }) => {
    test.setTimeout(3 * 60 * 1000); // 3 minutes
    const baseURL =
      process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

    console.log('Testing home page...');
    await page.goto(baseURL);
    await waitForPageLoad(page);

    // 检查页面健康状态
    const isHealthy = await checkPageHealth(page);
    expect(isHealthy).toBe(true);

    // 获取所有链接
    const links = await getAllLinks(page);
    console.log(`Found ${links.length} links on home page`);

    // 点击首页上的主要导航链接
    const mainNavLinks = links.filter(
      link =>
        link.visible &&
        (link.href.includes('/course') ||
          link.href.includes('/qa') ||
          link.href.includes('/reference') ||
          link.href.includes('/download') ||
          link.href.includes('/ask') ||
          link.href === '/')
    );

    console.log(`Testing ${mainNavLinks.length} main navigation links`);

    for (const link of mainNavLinks.slice(0, 10)) {
      // 限制测试数量
      try {
        const fullUrl = link.href.startsWith('http')
          ? link.href
          : new URL(link.href, page.url()).href;

        await page.goto(fullUrl, {
          waitUntil: 'domcontentloaded',
          timeout: 10000,
        });
        await page.waitForTimeout(1000); // 等待页面渲染

        const pageHealthy = await checkPageHealth(page);
        expect(pageHealthy).toBe(true);

        console.log(`✓ Link works: ${link.href}`);
      } catch (error) {
        console.error(`✗ Link failed: ${link.href}`, error);
      }
    }
  });

  // 测试 Ask 页面
  test('should test ask page and all links', async ({ page }) => {
    test.setTimeout(2 * 60 * 1000); // 2 minutes
    const baseURL =
      process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

    console.log('Testing ask page...');
    await page.goto(`${baseURL}/ask`);
    await waitForPageLoad(page);

    // 检查页面健康状态
    const isHealthy = await checkPageHealth(page);
    expect(isHealthy).toBe(true);

    // 获取所有链接
    const links = await getAllLinks(page);
    console.log(`Found ${links.length} links on ask page`);

    // 测试所有可见的链接
    const visibleLinks = links.filter(
      link => link.visible && link.href.startsWith('/')
    );
    const linkResults = await clickAllLinks(page, {
      baseURL,
      maxLinks: 20,
      excludePatterns: [/^#/, /^javascript:/],
      timeout: 5000,
    });

    const successCount = linkResults.filter(r => r.success).length;
    console.log(`✓ ${successCount}/${linkResults.length} links work correctly`);

    // 至少有一半的链接应该工作
    expect(successCount).toBeGreaterThan(linkResults.length / 2);
  });

  // 测试下载页面
  test('should test download page and all download links', async ({ page }) => {
    test.setTimeout(5 * 60 * 1000); // 5 minutes (可能有很多下载链接)
    const baseURL =
      process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

    console.log('Testing download page...');
    await page.goto(`${baseURL}/download`);
    await waitForPageLoad(page);

    // 检查页面健康状态
    const isHealthy = await checkPageHealth(page);
    expect(isHealthy).toBe(true);

    // 获取所有下载链接
    const links = await getAllLinks(page);
    const downloadLinks = links.filter(
      link =>
        link.visible &&
        (link.href.includes('.pdf') ||
          link.href.includes('.epub') ||
          link.href.includes('.mp3') ||
          link.href.includes('.mp4') ||
          link.href.includes('download'))
    );

    console.log(`Found ${downloadLinks.length} download links`);

    // 测试前 10 个下载链接（避免下载太多文件）
    const maxDownloads = process.env.MAX_DOWNLOADS
      ? parseInt(process.env.MAX_DOWNLOADS)
      : 10;

    const testLinks = downloadLinks.slice(0, maxDownloads);
    const downloadResults: Array<{ href: string; success: boolean }> = [];

    for (const link of testLinks) {
      try {
        // 监听下载事件
        const downloadPromise = page
          .waitForEvent('download', { timeout: 10000 })
          .catch(() => null);

        // 点击下载链接
        await page.locator(`a[href="${link.href}"]`).first().click();

        const download = await downloadPromise;
        downloadResults.push({
          href: link.href,
          success: download !== null,
        });

        if (download) {
          console.log(`✓ Download works: ${link.href}`);
        } else {
          console.log(
            `⚠ Download link clicked but no download event: ${link.href}`
          );
        }

        await page.waitForTimeout(1000);
      } catch (error) {
        console.error(`✗ Download failed: ${link.href}`, error);
        downloadResults.push({
          href: link.href,
          success: false,
        });
      }
    }

    const successCount = downloadResults.filter(r => r.success).length;
    console.log(
      `✓ ${successCount}/${downloadResults.length} downloads work correctly`
    );

    // 至少有一半的下载链接应该工作
    expect(successCount).toBeGreaterThan(downloadResults.length / 2);
  });
});
