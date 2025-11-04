export const MAIN_BG_COLOR = 'background: rgba(244, 245, 249, 1)';

export const STANDARD_TEXT_COLOR = 'rgba(68, 68, 68, 1)';

export const INNER_TEXT_COLOR = 'rgba(102, 102, 102, 1)';

export const HELPER_TEXT_COLOR = 'rgba(153, 153, 153, 1)';

export const MAIN_BLUE_COLOR = 'rgba(130, 178, 232, 1)';

export const DOWNLOAD_RED_COLOR = 'rgba(255, 168, 184, 1)';

export const MOBILE_CARDS_BG_COLOR = [
  'linear-gradient(180deg, rgba(237, 248, 255, 1) 0%, rgba(232, 244, 255, 1) 100%)',
  'linear-gradient(180deg, rgba(233, 242, 252, 1) 0%, rgba(225, 243, 252, 1) 100%)',
  'linear-gradient(180deg, rgba(226, 243, 252, 1) 0%, rgba(217, 233, 255, 1) 100%)',
  'linear-gradient(180deg, rgba(224, 238, 255, 1) 0%, rgba(222, 227, 255, 1) 100%)',
  'linear-gradient(180deg, rgba(236, 238, 253, 1) 0.04%, rgba(224, 218, 255, 1) 100%)',
  'linear-gradient(180deg, rgba(236, 235, 252, 1) 0%, rgba(224, 204, 255, 1) 100%)',
];

// 阅读模式配色方案
export const READING_THEMES = {
  white: {
    tagText: 'rgba(102, 102, 102, 1)', // 标签文字色
    tagBg: 'rgba(240, 240, 240, 1)', // 标签背景色
    background: 'rgba(222, 220, 220, 1)', // 页面背景色
    main: 'rgba(255, 255, 255, 1)', // 文章区域背景色
    sidebarBg: 'rgba(240, 240, 240, 1)', // 侧边栏背景色
    sidebarText: 'rgba(115, 115, 115, 1)', // 侧边栏字体色
    sidebarBtnBg: 'rgba(230, 225, 218, 1)', // 侧边栏按钮背景色
    sidebarBackText: 'rgba(255, 255, 255, 1)', // 侧边栏返回按钮字体色
    sidebarBackBg: 'rgba(158, 158, 158, 1)', // 侧边栏返回按钮背景色
    text: 'rgba(68, 68, 68, 1)', // 文字色
    divider: 'rgba(222, 221, 220, 1)', // 分割线颜色
    settingText: 'rgba(115, 115, 115, 1)', // 设置按钮字体色
  },
  brown: {
    background: 'rgba(219, 206, 191, 1)', // 棕色主题背景
    main: 'rgba(255, 251, 245, 1)', // 棕色主题内容
    sidebarBg: 'rgba(245, 231, 209, 1)', // 侧边栏背景色
    sidebarText: 'rgba(66, 66, 66, 1)', // 侧边栏字体色
    sidebarBtnBg: 'rgba(232, 215, 188, 1)', // 侧边栏按钮背景色
    sidebarBackText: 'rgba(145, 97, 65, 1)', // 侧边栏返回按钮字体色
    sidebarBackBg: 'rgba(237, 214, 178, 1)', // 侧边栏返回按钮背景色
    text: 'rgba(102, 102, 102, 1)', // 文字色
    tagBg: 'rgba(242, 231, 223, 1)', // 标签背景色
    tagText: 'rgba(102, 102, 102, 1)', // 标签文字色
    divider: 'rgba(207, 192, 182, 1)', // 分割线颜色
    settingText: 'rgba(140, 111, 90, 1)', // 设置按钮字体色
  },
  dark: {
    background: 'rgba(34, 38, 35, 1)', // 黑色主题背景
    main: 'rgba(66, 66, 66, 1)', // 黑色主题内容
    sidebarBg: 'rgba(80, 80, 80, 1)', // 侧边栏背景色
    sidebarText: 'rgba(255, 255, 255, 1)', // 侧边栏字体色
    sidebarBtnBg: 'rgba(94, 93, 93, 1)', // 侧边栏按钮背景色
    sidebarBackBg: 'rgba(191, 189, 189, 1)', // 侧边栏返回按钮背景色
    sidebarBackText: 'rgba(3, 3, 3, 1)', // 侧边栏返回按钮字体色
    text: 'rgba(219, 215, 215, 1)', // 文字色
    tagBg: 'rgba(201, 201, 201, 1)', // 标签背景色
    tagText: 'rgba(69, 69, 69, 1)', // 标签文字色
    divider: 'rgba(138, 138, 138, 1)', // 分割线颜色
    settingText: 'rgba(209, 209, 209, 1)', // 设置按钮字体色
  },
  green: {
    tagText: 'rgba(102, 102, 102, 1)', // 标签文字色
    tagBg: 'rgba(226, 237, 223, 1)',
    divider: 'rgba(180, 209, 174, 1)', // 分割线颜色
    background: 'rgba(185, 201, 181, 1)', // 绿色主题背景
    main: 'rgba(242, 250, 240, 1)', // 绿色主题内容
    text: 'rgba(68, 68, 68, 1)', // 文字色
    sidebarText: 'rgba(104, 133, 98, 1)', // 侧边栏字体色
    sidebarBg: 'rgba(229, 240, 226, 1)', // 侧边栏背景色
    sidebarBtnBg: 'rgba(210, 227, 207, 1)', // 侧边栏背景色
    sidebarBackBg: 'rgba(196, 224, 191, 1)', // 侧边栏背景色
    sidebarBackText: 'rgba(104, 133, 98, 1)', // 侧边栏返回按钮字体色
    settingText: 'rgba(104, 133, 98, 1)', // 设置按钮字体色
  },
} as const;

export type ReadingTheme = keyof typeof READING_THEMES;
