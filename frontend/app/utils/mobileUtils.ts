/**
 * 移动端工具函数
 * 375px 设计稿转 vw 的辅助函数
 */

/**
 * 将设计稿 px 转换为 vw
 * @param px 设计稿像素值（基于 375px 宽度）
 * @returns vw 字符串
 *
 * @example
 * pxToVw(20) // '5.333vw'
 * pxToVw(340) // '90.667vw'
 */
export function pxToVw(px: number): string {
  return `${(px / 375) * 100}vmin`;
}

/**
 * 将设计稿 px 转换为 rem（可选方案）
 * @param px 设计稿像素值
 * @param baseFontSize 基准字体大小（默认 16px）
 * @returns rem 字符串
 *
 * @example
 * pxToRem(24) // '1.5rem'
 */
export function pxToRem(px: number, baseFontSize = 16): string {
  return `${px / baseFontSize}rem`;
}

/**
 * 移动端常用尺寸映射
 *
 * 💡 使用说明：
 * 1. 如果你知道设计稿的 px 值，直接用 pxToVw(具体值)
 * 2. 如果需要固定尺寸，用 mobileSizes 预定义的值
 *
 * 字体大小对照表（可选，按需使用）：
 * - xs (12px): 标签、辅助说明
 * - sm (14px): 次要说明文字
 * - base (16px): 正文、默认文字
 * - lg (18px): 小标题
 * - xl (20px): 中等标题
 * - xxl (24px): 大标题
 * - xxxl (28px): 主标题
 */
export const mobileSizes = {
  spacing: {
    xs: pxToVw(8), // 8px - 极小间距
    sm: pxToVw(12), // 12px - 小间距
    md: pxToVw(16), // 16px - 中等间距
    lg: pxToVw(20), // 20px - 标准间距
    xl: pxToVw(24), // 24px - 大间距
    xxl: pxToVw(32), // 32px - 特大间距
  },
  fontSize: {
    xs: pxToVw(12), // 12px - 标签、辅助说明
    sm: pxToVw(14), // 14px - 次要说明文字
    base: pxToVw(16), // 16px - 正文、默认文字
    lg: pxToVw(18), // 18px - 小标题
    xl: pxToVw(20), // 20px - 中等标题
    xxl: pxToVw(24), // 24px - 大标题
    xxxl: pxToVw(28), // 28px - 主标题
  },
  borderRadius: {
    sm: pxToVw(4), // 4px - 小圆角
    md: pxToVw(8), // 8px - 中等圆角
    lg: pxToVw(12), // 12px - 大圆角
    full: '9999px', // 全圆角（圆形）
  },
};
