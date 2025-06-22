export const NAV_COLOR = 'rgba(70, 114, 166, 1)'; // MAIN_BLUE_COLOR
export const TEXT_COLOR = 'rgba(68, 68, 68, 1)';
export const LINK_COLOR = 'rgba(42, 130, 228, 1)';

// 菜单数据结构
export const menuData = [
  {
    label: '首页',
    path: '/',
  },
  {
    label: '慧灯禅修课',
    path: '/course',
    children: [
      { label: '禅修课 第一册', path: '/course/1' },
      { label: '禅修课 第二册', path: '/course/2' },
    ],
  },
  {
    label: '禅修课问答',
    path: '/qa',
    children: [
      { label: '问答 第一册', path: '/qa/1' },
      { label: '问答 第二册', path: '/qa/2' },
    ],
  },
  {
    label: '学修参考资料',
    path: '/reference',
    children: [
      { label: '资料一', path: '/reference/1' },
      { label: '资料二', path: '/reference/2' },
    ],
  },
  {
    label: '下载',
    path: '/download',
  },
  {
    label: '问题征集',
    path: '/question-collect',
  },
];

export const downloadItems = [
  {
    id: 1,
    title: '禅修课 第一册',
    date: '2016.11.28',
    files: {
      pdf: '560.2K',
      epub: '18.08M',
      audiobook: '43.33M',
      audio: '360.99M',
      video: '3.0G',
    },
  },
  {
    id: 2,
    title: '禅修课 第二册',
    date: '2016.11.28',
    files: {
      pdf: '560.2K',
      epub: '18.08M',
      audiobook: '43.33M',
      audio: '360.99M',
      video: '3.0G',
    },
  },
  {
    id: 3,
    title: '禅修课 第三册',
    date: '2016.11.28',
    files: {
      pdf: '560.2K',
      epub: '18.08M',
      audiobook: '43.33M',
      audio: '360.99M',
      video: '3.0G',
    },
  },
  {
    id: 4,
    title: '禅修课 第四册',
    date: '2016.11.28',
    files: {
      pdf: '560.2K',
      epub: '18.08M',
      audiobook: '43.33M',
      audio: '360.99M',
      video: '3.0G',
    },
  },
  {
    id: 5,
    title: '寂止的修法',
    date: '2016.11.28',
    files: {
      pdf: '560.2K',
      epub: '18.08M',
      audiobook: '43.33M',
      audio: '360.99M',
      video: '3.0G',
    },
  },
  {
    id: 6,
    title: '空性的修法',
    date: '2016.11.28',
    files: {
      pdf: '560.2K',
      epub: '18.08M',
      audiobook: '43.33M',
      audio: '360.99M',
      video: '3.0G',
    },
  },
  {
    id: 7,
    title: '大圆满前行引导文',
    date: '2016.11.28',
    files: {
      pdf: '560.2K',
      epub: '18.08M',
      audiobook: '43.33M',
      audio: '360.99M',
      video: '3.0G',
    },
  },
  {
    id: 8,
    title: '前行备忘录',
    date: '2016.11.28',
    files: {
      pdf: '560.2K',
      epub: '18.08M',
      audiobook: '43.33M',
      audio: '360.99M',
      video: '3.0G',
    },
  },
  {
    id: 9,
    title: '菩提道次第广论',
    date: '2016.11.28',
    files: {
      pdf: '560.2K',
      epub: '18.08M',
      audiobook: '43.33M',
      audio: '360.99M',
      video: '3.0G',
    },
  },
];
