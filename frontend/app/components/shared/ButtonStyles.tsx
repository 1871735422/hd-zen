'use client';

/**
 * 共享的按钮样式配置
 * 提供统一的渐变蓝色hover/active效果
 */
export const sharedButtonStyles = {
  borderRadius: '25px',
  textTransform: 'none' as const, // 阻止浏览器自动将文本转换为大写
  fontWeight: 500,
  fontSize: '14px',
  minHeight: '36px',
  border: '1px solid rgba(154, 189, 230, 1)',
  color: 'rgba(154, 189, 230, 1)',

  '&:hover, &.Mui-selected, &.Mui-active': {
    background:
      'linear-gradient(90deg, rgb(70, 135, 207) 0%,rgb(169, 206, 250) 100%)',
    color: 'white',
    borderColor: 'transparent',
  },

  '&:active': {
    boxShadow: '0 4px 12px rgba(30, 136, 229, 0.2)',
  },

  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(30, 136, 229, 0.2)',
  },

  '&.Mui-disabled': {
    borderColor: 'rgba(154, 189, 230, 0.3)',
    color: 'rgba(154, 189, 230, 0.3)',
    backgroundColor: 'transparent',
  },
};

/**
 * 渐变蓝色主题色值
 */
export const gradientColors = {
  primary:
    'linear-gradient(90deg, rgb(70, 135, 207) 0%,rgb(169, 206, 250) 100%)',
  hover: 'linear-gradient(90deg, rgb(70, 135, 207) 0%,rgb(169, 206, 250) 100%)',
  shadow: 'rgba(30, 136, 229, 0.2)',
  border: 'rgba(154, 189, 230, 1)',
  text: 'rgba(154, 189, 230, 1)',
  textHover: 'white',
};
