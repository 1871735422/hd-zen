import { expect, test } from '@playwright/test';
import {
  checkPageHealth,
  clickAllLinks,
  getAllLinks,
  waitForPageLoad,
} from './utils/page-helpers';

/**
 * QA（问答）页面测试
 */
test.describe('QA Page Tests', () => {
  // 测试 QA 列表页面
  test('should test QA list page and navigate to lessons', async ({ page }) => {
    test.setTimeout(5 * 60 * 1000); // 5 minutes
    const baseURL =
      process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
    const testSlug = process.env.TEST_QA_SLUG || '1';

    console.log(`Testing QA page: /qa/${testSlug}`);
    await page.goto(`${baseURL}/qa/${testSlug}`);
    await waitForPageLoad(page);

    // 检查页面健康状态
    const isHealthy = await checkPageHealth(page);
    expect(isHealthy).toBe(true);

    // 获取所有链接
    const links = await getAllLinks(page);
    console.log(`Found ${links.length} links on QA page`);

    // 查找侧边栏中的问答链接
    const qaLinks = links.filter(
      link =>
        link.visible &&
        (link.href.includes('/qa/') || link.href.includes('question'))
    );

    console.log(`Found ${qaLinks.length} QA lesson links`);

    // 测试前几个问答链接
    const maxLessons = process.env.MAX_QA_LESSONS
      ? parseInt(process.env.MAX_QA_LESSONS)
      : 5;

    for (const link of qaLinks.slice(0, maxLessons)) {
      try {
        const fullUrl = link.href.startsWith('http')
          ? link.href
          : new URL(link.href, page.url()).href;

        console.log(`Testing QA lesson: ${link.text || link.href}`);
        await page.goto(fullUrl, {
          waitUntil: 'domcontentloaded',
          timeout: 15000,
        });
        await page.waitForTimeout(2000); // 等待视频加载

        const pageHealthy = await checkPageHealth(page);
        expect(pageHealthy).toBe(true);

        // 检查是否有视频播放器
        const hasVideo =
          (await page.locator('video, [class*="artplayer"]').count()) > 0;
        if (hasVideo) {
          console.log(`✓ QA lesson page loaded with video: ${link.href}`);
        } else {
          console.log(`✓ QA lesson page loaded: ${link.href}`);
        }
      } catch (error) {
        console.error(`✗ QA lesson failed: ${link.href}`, error);
      }
    }
  });

  // 测试 QA 详情页面（单个问答）
  test('should test QA lesson page and all links', async ({ page }) => {
    test.setTimeout(3 * 60 * 1000); // 3 minutes
    const baseURL =
      process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
    const testUrl = process.env.TEST_QA_URL || '/qa/1/lesson1';

    console.log(`Testing QA lesson page: ${testUrl}`);
    await page.goto(`${baseURL}${testUrl}`);
    await waitForPageLoad(page);

    // 检查页面健康状态
    const isHealthy = await checkPageHealth(page);
    expect(isHealthy).toBe(true);

    // 获取所有链接
    const links = await getAllLinks(page);
    console.log(`Found ${links.length} links on QA lesson page`);

    // 测试页面内的链接（排除外部链接）
    const internalLinks = links.filter(
      link =>
        link.visible &&
        (link.href.startsWith('/') || link.href.startsWith(baseURL)) &&
        !link.href.includes('.pdf') &&
        !link.href.includes('.mp4') &&
        !link.href.includes('download')
    );

    console.log(`Testing ${internalLinks.length} internal links`);

    const linkResults = await clickAllLinks(page, {
      baseURL,
      maxLinks: 15,
      excludePatterns: [/^#/, /^javascript:/, /\.(pdf|mp4|mp3)$/],
      timeout: 5000,
    });

    const successCount = linkResults.filter(r => r.success).length;
    console.log(`✓ ${successCount}/${linkResults.length} links work correctly`);

    expect(successCount).toBeGreaterThan(linkResults.length / 2);
  });
});
