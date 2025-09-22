'use client';

import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { sharedButtonStyles } from '../shared/ButtonStyles';

/**
 * CourseActionButton组件属性接口
 * @extends Omit<ButtonProps, 'variant'> - 继承ButtonProps
 */
interface CourseActionButtonProps extends Omit<ButtonProps, 'variant'> {
  /** 是否为激活状态，激活时效果等同于hover */
  isActive?: boolean;
  variant?: 'outlined' | 'contained';
}

/**
 * 课程操作按钮的样式化组件
 * 采用Material-UI styled API，提供统一的视觉风格和交互效果
 */
const StyledCourseActionButton = styled(Button)(({ theme }) => ({
  ...sharedButtonStyles,
  margin: theme.spacing(0, 2),
  padding: theme.spacing(0.5, 0),
}));

/**
 * 课程操作按钮组件
 *
 * @param props - 组件属性
 * @param props.children - 自定义按钮文本内容
 * @param props.isActive - 是否为激活状态，激活时效果等同于hover
 * @param props.sx - 自定义样式，会与默认样式合并
 * @param props... - 其他ButtonProps属性
 *
 */
export default function CourseActionButton({
  children,
  isActive = false,
  variant = 'outlined',
  sx,
  ...props
}: CourseActionButtonProps) {
  return (
    <StyledCourseActionButton
      className={isActive ? 'Mui-active' : ''}
      variant={variant}
      sx={{
        margin: 0,
        ...sx,
      }}
      {...props}
    >
      {children}
    </StyledCourseActionButton>
  );
}
