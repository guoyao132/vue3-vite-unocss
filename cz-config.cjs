module.exports = {
  types: [
    { value: '✨feat', name: '✨feat:     新功能' },
    { value: '🐛fix', name: '🐛fix:      修复bug' },
    { value: '📚docs', name: '📚docs:     文档更新' },
    { value: '💎style', name: '💎style:    代码风格的更改(空格，逗号，缺少分号等)' },
    { value: '📦refactor', name: '📦refactor: 代码重构(即不修复bug也不增加新功能)' },
    { value: '🚀perf', name: '🚀perf:     性能提升' },
    { value: '🚨test', name: '🚨test:     添加测试文件或者更改测试文件' },
    { value: '🛠build', name: '🛠build:    构建系统的更改或新的依赖更新，如webpack、gulp更改或者npm' },
    { value: '⚙️ci', name: '⚙️ci:       ci配置的更改，如 travis、gitlab-ci' },
    { value: '🗑revert', name: '🗑revert:   恢复以前的提交（如git revert）' },
  ],
  scopes: [
    { name: 'components' },
    { name: 'utils' },
    { name: 'styles' },
    { name: 'deps' },
    { name: 'other' },
  ],
  messages: {
    jiraNumber: '请输入Jira编号 (可选):\n',
    type: '选择当前 commit 的类型:\n',
    scope: '变动访问，模块或者文件名(可skip):\n',
    customScope: '请输入自定义的 scope：',
    subject: '写一个简短的描述:\n',
    body: '提供更改的详细说明(可skip):\n',
    isBreaking: '是否有破坏性变更?\n',
    breaking: '破坏性变更的详细描述简短描述\n',
  },
  allowCustomScopes: false,
  subjectRequired: true, // 添加此行以确保 subject 不可跳过
  allowBreakingChanges: ['✨feat', '🐛fix'],
}
