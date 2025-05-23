# 剪映无水印图片下载器 - 轻量版

这是一个Chrome浏览器扩展，用于从剪映（即梦）、豆包AI图片生成工具下载或复制无水印图片和视频，**不干扰网站正常运行**。

## 功能特点

- 轻量级设计，不干扰网站正常图片加载
- 固定工具面板，可随时点击图片或视频进行选择
- 支持一键下载或复制无水印图片
- 支持一键下载视频或复制视频地址
- 简洁的交互方式：点击媒体选择、扩展图标点击
- 操作后有友好的提示通知
- 仅在即梦、剪映和豆包网站上运行，不影响其他网站

## 安装方法

1. 下载此仓库的全部文件
2. 打开Chrome浏览器，进入扩展管理页面：`chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击左上角的"加载已解压的扩展程序"
5. 选择下载的文件夹
6. 安装完成

## 使用方法

两种使用方式任选其一：

### 方式一：使用工具面板（推荐）
1. 访问即梦、剪映或豆包页面
2. 在页面右下角会显示工具面板
3. 点击你想要保存的图片或视频选中它
4. 图片：点击"下载图片"或"复制图片"按钮
5. 视频：点击"下载视频"或"复制视频地址"按钮

### 方式二：使用扩展图标
1. 点击浏览器工具栏上的扩展图标
2. 工具面板会立即显示
3. 按照方式一的步骤3-5操作

## 快捷键
- `Alt+W`：快速显示工具面板

## 注意事项

- 此扩展仅供学习和个人使用
- 请尊重原创内容和版权，不要用于非法用途
- 如遇到问题，请尝试刷新页面或重新安装扩展

## 更新日志

### 版本 1.4.2
- 移除右键菜单功能，简化插件交互方式
- 仅保留浮窗和扩展图标点击两种交互方式
- 精简代码，提高性能

### 版本 1.4.1
- 添加对豆包(doubao.com)网站的支持
- 可下载和复制豆包AI图片生成的图片

### 版本 1.4
- 限制插件仅在即梦和剪映网站上运行，不再影响其他网站浏览
- 增加对视频媒体的支持
- 添加视频下载功能
- 添加视频地址复制功能
- 针对不同媒体类型显示不同的操作按钮文本
- 优化用户界面体验

### 版本 1.3 (轻量版)
- 完全重写代码，采用轻量级设计
- 不再干扰网站正常加载图片
- 使用固定工具面板替代悬浮按钮
- 提供多种使用方式：点击选择、扩展图标、右键菜单
- 添加快捷键Alt+W用于显示面板

### 版本 1.2
- 增加智能网络请求拦截功能
- 绕过网站限制，确保无水印下载
- 优化图片元素选择器

### 版本 1.1
- 将功能按钮移至图片右上角，避免与网站自定义右键菜单冲突
- 添加直接下载功能按钮
- 优化图片元素选择器，提高兼容性

### 版本 1.0
- 初始版本发布
