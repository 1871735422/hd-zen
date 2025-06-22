export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2, // 错误级别：2 表示不通过则阻塞提交
      'always',
      [
        'fix', // 修复 Bug
        'feat', // 新增功能
        'build', // 构建或依赖改动
        'chore', // 杂项（如工具链调整）
        'ci', // CI/CD 配置
        'docs', // 文档更新
        'style', // 代码样式调整
        'refactor', // 代码重构
        'perf', // 性能优化
        'test', // 测试相关
      ],
    ],
    'scope-empty': [1, 'never'], // 警告：建议使用scope，但不强制
    'scope-case': [1, 'always', 'lower-case'], // 警告：scope建议使用小写
    'subject-empty': [2, 'never'], // 错误：必须填写提交描述
    'subject-case': [1, 'always', 'lower-case'], // 警告：描述建议使用小写
    'header-max-length': [1, 'always', 100], // 警告：标题长度建议不超过100字符
  },
};
