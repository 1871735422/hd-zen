export const MAIN_BG_COLOR = 'background: rgba(244, 245, 249, 1)';

export const STANDARD_TEXT_COLOR = 'rgba(68, 68, 68, 1)';

export const INNER_TEXT_COLOR = 'rgba(102, 102, 102, 1)';

export const HELPER_TEXT_COLOR = 'rgba(153, 153, 153, 1)';

export const MAIN_BLUE_COLOR = 'rgba(130, 178, 232, 1)';

// 阅读模式配色方案
export const READING_THEMES = {
  white: {
    background: 'rgba(222, 220, 220, 1)', // 页面背景色
    main: 'rgba(255, 255, 255, 1)', // 文章区域背景色
    sidebar_bg: 'rgba(240, 240, 240, 1)', // 侧边栏背景色
    sidebar_text: 'rgba(66, 66, 66, 1)', // 侧边栏字体色
    sidebar_btn_bg: 'rgba(255, 255, 255, 0.9)', // 侧边栏按钮背景色
    sidebar_back_bg: 'rgba(240, 240, 240, 1)', // 侧边栏返回按钮背景色
    text: 'rgba(0, 0, 0, 1)', // 文字色（默认黑色）
    shadow: 'rgba(181, 180, 179, 1)', // 阴影色
  },
  gray: {
    background: 'rgba(219, 206, 191, 1)', // 棕色主题背景
    main: 'rgba(255, 251, 245, 1)', // 棕色主题内容
    sidebar_bg: 'rgba(240, 235, 230, 1)', // 侧边栏背景色
    sidebar_text: 'rgba(66, 66, 66, 1)', // 侧边栏字体色
    sidebar_btn_bg: 'rgba(255, 255, 255, 0.9)', // 侧边栏按钮背景色
    sidebar_back_bg: 'rgba(240, 235, 230, 1)', // 侧边栏返回按钮背景色
    text: 'rgba(0, 0, 0, 1)', // 文字色（默认黑色）
    shadow: 'rgba(181, 180, 179, 1)', // 阴影色
  },
  dark: {
    background: 'rgba(66, 66, 66, 1)', // 黑色主题背景
    main: 'rgba(219, 215, 215, 1)', // 黑色主题内容
    sidebar_bg: 'rgba(80, 80, 80, 1)', // 侧边栏背景色
    sidebar_text: 'rgba(255, 255, 255, 1)', // 侧边栏字体色
    sidebar_btn_bg: 'rgba(100, 100, 100, 0.9)', // 侧边栏按钮背景色
    sidebar_back_bg: 'rgba(80, 80, 80, 1)', // 侧边栏返回按钮背景色
    text: 'rgba(0, 0, 0, 1)', // 文字色（默认黑色）
    shadow: 'rgba(181, 180, 179, 1)', // 阴影色
  },
  green: {
    background: 'rgba(180, 209, 174, 1)', // 绿色主题背景
    main: 'rgba(242, 250, 240, 1)', // 绿色主题内容
    text: 'rgba(0, 0, 0, 1)', // 文字色（默认黑色）
    shadow: 'rgba(181, 180, 179, 1)', // 阴影色
    sidebar_text: 'rgba(104, 133, 98, 1)', // 侧边栏字体色
    sidebar_bg: 'rgba(229, 240, 226, 1)', // 侧边栏背景色
    sidebar_btn_bg: 'rgba(210, 227, 207, 1)', // 侧边栏背景色
    sidebar_back_bg: 'rgba(196, 224, 191, 1)', // 侧边栏背景色
  },
} as const;

export type ReadingTheme = keyof typeof READING_THEMES;

// 阅读模式文本颜色函数
export const getTextColor = (theme: ReadingTheme) => {
  switch (theme) {
    case 'dark':
      return 'rgba(255, 255, 255, 0.9)';
    case 'gray':
      return 'rgba(66, 66, 66, 0.9)';
    case 'green':
      return 'rgba(66, 66, 66, 0.9)';
    default:
      return 'rgba(66, 66, 66, 0.9)';
  }
};

// 阅读模式标签背景颜色函数
export const getTagBgColor = (theme: ReadingTheme) => {
  switch (theme) {
    case 'dark':
      return 'rgba(255, 255, 255, 0.1)';
    case 'gray':
      return 'rgba(66, 66, 66, 0.1)';
    case 'green':
      return 'rgba(66, 66, 66, 0.1)';
    default:
      return 'rgba(66, 66, 66, 0.1)';
  }
};

// 阅读模式标签文字颜色函数
export const getTagTextColor = (theme: ReadingTheme) => {
  switch (theme) {
    case 'dark':
      return 'rgba(255, 255, 255, 0.8)';
    case 'gray':
      return 'rgba(66, 66, 66, 0.8)';
    case 'green':
      return 'rgba(66, 66, 66, 0.8)';
    default:
      return 'rgba(66, 66, 66, 0.8)';
  }
};
