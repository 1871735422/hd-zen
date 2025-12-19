import { expect, test } from '@playwright/test';
import {
  checkPageHealth,
  clickAllLinks,
  getAllLinks,
  waitForPageLoad,
} from './utils/page-helpers';

/**
 * 课程和参考资料页面测试
 */
test.describe('Course and Reference Page Tests', () => {
  // 测试课程列表页面
  test('should test course list page and navigate to lessons', async ({
    page,
  }) => {
    test.setTimeout(5 * 60 * 1000); // 5 minutes
    const baseURL =
      process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
    const testSlug = process.env.TEST_COURSE_SLUG || '1';

    console.log(`Testing course page: /course/${testSlug}`);
    await page.goto(`${baseURL}/course/${testSlug}`);
    await waitForPageLoad(page);

    // 检查页面健康状态
    const isHealthy = await checkPageHealth(page);
    expect(isHealthy).toBe(true);

    // 获取所有链接
    const links = await getAllLinks(page);
    console.log(`Found ${links.length} links on course page`);

    // 查找课程链接
    const courseLinks = links.filter(
      link =>
        link.visible &&
        link.href.includes('/course/') &&
        link.href.includes('lesson')
    );

    console.log(`Found ${courseLinks.length} course lesson links`);

    // 测试前几个课程链接
    const maxLessons = process.env.MAX_COURSE_LESSONS
      ? parseInt(process.env.MAX_COURSE_LESSONS)
      : 5;

    for (const link of courseLinks.slice(0, maxLessons)) {
      try {
        const fullUrl = link.href.startsWith('http')
          ? link.href
          : new URL(link.href, page.url()).href;

        console.log(`Testing course lesson: ${link.text || link.href}`);
        await page.goto(fullUrl, {
          waitUntil: 'domcontentloaded',
          timeout: 15000,
        });
        await page.waitForTimeout(2000); // 等待内容加载

        const pageHealthy = await checkPageHealth(page);
        expect(pageHealthy).toBe(true);

        // 检查是否有视频播放器
        const hasVideo =
          (await page.locator('video, [class*="artplayer"]').count()) > 0;
        if (hasVideo) {
          console.log(`✓ Course lesson page loaded with video: ${link.href}`);
        } else {
          console.log(`✓ Course lesson page loaded: ${link.href}`);
        }
      } catch (error) {
        console.error(`✗ Course lesson failed: ${link.href}`, error);
      }
    }
  });

  // 测试课程详情页面
  test('should test course lesson page and all links', async ({ page }) => {
    test.setTimeout(3 * 60 * 1000); // 3 minutes
    const baseURL =
      process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
    const testUrl = process.env.TEST_COURSE_URL || '/course/1/lesson1';

    console.log(`Testing course lesson page: ${testUrl}`);
    await page.goto(`${baseURL}${testUrl}`);
    await waitForPageLoad(page);

    // 检查页面健康状态
    const isHealthy = await checkPageHealth(page);
    expect(isHealthy).toBe(true);

    // 获取所有链接
    const links = await getAllLinks(page);
    console.log(`Found ${links.length} links on course lesson page`);

    // 测试页面内的链接
    const internalLinks = links.filter(
      link =>
        link.visible &&
        (link.href.startsWith('/') || link.href.startsWith(baseURL)) &&
        !link.href.includes('.pdf') &&
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

  // 测试参考资料列表页面
  test('should test reference list page and navigate to lessons', async ({
    page,
  }) => {
    test.setTimeout(5 * 60 * 1000); // 5 minutes
    const baseURL =
      process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
    const testSlug = process.env.TEST_REFERENCE_SLUG || '1';

    console.log(`Testing reference page: /reference/${testSlug}`);
    await page.goto(`${baseURL}/reference/${testSlug}`);
    await waitForPageLoad(page);

    // 检查页面健康状态
    const isHealthy = await checkPageHealth(page);
    expect(isHealthy).toBe(true);

    // 获取所有链接
    const links = await getAllLinks(page);
    console.log(`Found ${links.length} links on reference page`);

    // 查找参考资料链接
    const referenceLinks = links.filter(
      link =>
        link.visible &&
        (link.href.includes('/reference/') || link.href.includes('lesson'))
    );

    console.log(`Found ${referenceLinks.length} reference lesson links`);

    // 测试前几个参考资料链接
    const maxLessons = process.env.MAX_REFERENCE_LESSONS
      ? parseInt(process.env.MAX_REFERENCE_LESSONS)
      : 5;

    for (const link of referenceLinks.slice(0, maxLessons)) {
      try {
        const fullUrl = link.href.startsWith('http')
          ? link.href
          : new URL(link.href, page.url()).href;

        console.log(`Testing reference lesson: ${link.text || link.href}`);
        await page.goto(fullUrl, {
          waitUntil: 'domcontentloaded',
          timeout: 15000,
        });
        await page.waitForTimeout(2000); // 等待内容加载

        const pageHealthy = await checkPageHealth(page);
        expect(pageHealthy).toBe(true);

        console.log(`✓ Reference lesson page loaded: ${link.href}`);
      } catch (error) {
        console.error(`✗ Reference lesson failed: ${link.href}`, error);
      }
    }
  });

  // 测试参考资料详情页面
  test('should test reference lesson page and all links', async ({ page }) => {
    test.setTimeout(3 * 60 * 1000); // 3 minutes
    const baseURL =
      process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
    const testUrl = process.env.TEST_REFERENCE_URL || '/reference/1/lesson1';

    console.log(`Testing reference lesson page: ${testUrl}`);
    await page.goto(`${baseURL}${testUrl}`);
    await waitForPageLoad(page);

    // 检查页面健康状态
    const isHealthy = await checkPageHealth(page);
    expect(isHealthy).toBe(true);

    // 获取所有链接
    const links = await getAllLinks(page);
    console.log(`Found ${links.length} links on reference lesson page`);

    // 测试页面内的链接
    const internalLinks = links.filter(
      link =>
        link.visible &&
        (link.href.startsWith('/') || link.href.startsWith(baseURL)) &&
        !link.href.includes('.pdf') &&
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
