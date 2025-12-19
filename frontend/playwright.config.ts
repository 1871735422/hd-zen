import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Maximum time one test can run for */
  timeout: 10 * 60 * 1000, // 10 minutes per test
  /* Run tests in files in parallel */
  fullyParallel: false, // 串行执行以确保完整录制
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1, // 单线程执行，确保完整录制
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    /* Video recording - record all tests for demo */
    video: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        /* 默认使用 headed 模式，可以看到浏览器运行过程，方便录屏 */
        headless: false,
      },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /*
   * webServer 配置说明：
   * - 这个配置是用来启动本地开发服务器的（如果需要的话）
   * - url 字段是用来检查本地服务器是否已启动的，所以必须是 localhost:3000
   * - 测试目标的 URL 在 baseURL 中设置（第29行）
   * - 当测试线上环境时，webServer 为 undefined，不会启动本地服务器
   */
  webServer:
    process.env.PLAYWRIGHT_TEST_BASE_URL?.includes('localhost') ||
    !process.env.PLAYWRIGHT_TEST_BASE_URL
      ? {
          command: 'pnpm dev',
          url: 'http://localhost:3000', // 这是本地开发服务器的地址，用于检查服务器是否启动
          reuseExistingServer: !process.env.CI,
          timeout: 120 * 1000,
        }
      : undefined, // 测试线上环境时，不启动本地服务器
});
