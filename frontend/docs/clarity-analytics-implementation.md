# Clarity Analytics 统计功能实现文档

## 概述

本文档描述了项目中添加的 Microsoft Clarity 统计功能，包括文章阅读、视频播放和文件下载的统计实现。

## 统计工具函数

### 文件位置

`app/utils/clarityAnalytics.ts`

### 核心功能

#### 1. `trackClarityEvent(eventName, eventData)`

- **功能**: 发送 Clarity 自定义事件的底层函数
- **参数**:
  - `eventName`: 事件名称（字符串）
  - `eventData`: 事件数据（可选，键值对对象）
- **逻辑**:
  - 检查 Clarity 是否已初始化
  - 仅在浏览器环境且 Clarity 可用时发送事件
  - 错误处理：开发环境显示警告，生产环境静默处理

#### 2. `trackArticleRead(articleId, articleTitle)`

- **功能**: 文章阅读统计
- **参数**:
  - `articleId`: 文章ID（必填）
  - `articleTitle`: 文章标题（可选）
- **发送事件**: `article_read`
- **事件数据**:
  - `article_id`: 文章ID
  - `article_title`: 文章标题（如果提供）

#### 3. `trackVideoPlay(videoId, videoTitle)`

- **功能**: 视频播放统计
- **参数**:
  - `videoId`: 视频ID（必填）
  - `videoTitle`: 视频标题（可选）
- **发送事件**: `video_play`
- **事件数据**:
  - `video_id`: 视频ID
  - `video_title`: 视频标题（如果提供）

#### 4. `trackAudioPlay(audioId, audioTitle)`

- **功能**: 音频播放统计
- **参数**:
  - `audioId`: 音频ID（必填）
  - `audioTitle`: 音频标题（可选）
- **发送事件**: `audio_play`
- **事件数据**:
  - `audio_id`: 音频ID
  - `audio_title`: 音频标题（如果提供）

#### 5. `trackDownload(fileType, fileName, fileUrl)`

- **功能**: 文件下载统计
- **参数**:
  - `fileType`: 文件类型（pdf, epub, audio, video 等）
  - `fileName`: 文件名（可选）
  - `fileUrl`: 文件URL（可选）
- **发送事件**: `file_download`
- **事件数据**:
  - `file_type`: 文件类型
  - `file_name`: 文件名（如果提供）
  - `file_url`: 文件URL（如果提供）

## 文章阅读统计

### 实现位置

#### 1. 普通阅读模式

**文件**: `app/components/pc/ReadingContentWrapper.tsx`

**触发时机**:

- 组件挂载后，当文章内容（introText 或 fullText）加载完成时
- 仅在客户端环境执行
- 使用 `useRef` 确保每个文章只统计一次

**实现逻辑**:

```typescript
const hasTrackedRef = React.useRef(false);

React.useEffect(() => {
  if (
    isClient &&
    (introText || fullText) &&
    articleId &&
    !hasTrackedRef.current
  ) {
    trackArticleRead(articleId, articleTitle);
    hasTrackedRef.current = true;
  }
}, [isClient, introText, fullText, articleId, articleTitle]);
```

**数据来源**:

- `articleId`: 从 `ReadingPage` 组件传递的 `topicMedia.id`
- `articleTitle`: 从 `ReadingPage` 组件传递的 `topicMedia.article_title` 或 `topicMedia.title`

#### 2. 阅读模式页面

**文件**: `app/components/pc/ReadingModePage.tsx`

**触发时机**:

- 组件挂载后，当文章内容加载完成时
- 仅在客户端环境执行
- 使用 `useRef` 确保只统计一次

**实现逻辑**:

```typescript
const hasTrackedRef = useRef(false);

useEffect(() => {
  if (isClient && articleId && !hasTrackedRef.current) {
    trackArticleRead(articleId, title);
    hasTrackedRef.current = true;
  }
}, [isClient, articleId, title]);
```

**数据来源**:

- `articleId`: 从 `ReadingPage` 组件传递的 `topicMedia.id`
- `title`: 从 `ReadingPage` 组件传递的 `topicMedia.article_title` 或 `topicMedia.title`

### 数据传递链路

```
ReadingPage (服务端组件)
  ↓ 传递 articleId, articleTitle
ReadingContentWrapper / ReadingModePage (客户端组件)
  ↓ 调用
trackArticleRead()
  ↓ 发送
Clarity Event: article_read
```

## 视频播放统计

### 实现位置

**文件**: `app/components/pc/VideoPlayer.tsx`

## 音频播放统计

### 实现位置

**文件**: `app/components/pc/AudioPlayer.tsx`

### 触发时机

- 音频开始播放时（HTMLAudioElement 的 `play` 事件触发）
- 每个音频只统计一次，使用 `useRef` 标记已统计状态

### 实现逻辑

```typescript
const hasTrackedRef = useRef(false);

// 在 audioElement 的 play 事件监听器中
audioElement.addEventListener('play', () => {
  // ... 其他逻辑 ...

  // 音频播放统计
  if (audioId && !hasTrackedRef.current) {
    trackAudioPlay(audioId, audioTitle);
    hasTrackedRef.current = true;
  }
});
```

### 统计范围

- 支持多个音频的播放器（如课程页面的多个音频）
- 每个音频首次播放时统计
- 当音频源改变时，重置统计状态（通过 useEffect 依赖项）

### 数据来源

- `audioId`: 从 `AudioPage` 组件传递的 `topicMedia.id`
- `audioTitle`: 从 `AudioPage` 组件传递的音频标题

### 数据传递链路

```
AudioPage (客户端组件)
  ↓ 传递 audioId, audioTitle
AudioPlayer (客户端组件)
  ↓ 调用
trackAudioPlay()
  ↓ 发送
Clarity Event: audio_play
```

### 触发时机

- 视频开始播放时（Plyr 的 `play` 事件触发）
- 每个视频只统计一次，使用 `Set` 记录已统计的视频ID

### 实现逻辑

```typescript
const trackedVideoIdsRef = useRef<Set<string>>(new Set());

// 在 Plyr 的 play 事件监听器中
playerRef.current.on('play', () => {
  // ... 其他逻辑 ...

  // 视频播放统计
  const currentVideo = videos[currentIndexRef.current];
  if (currentVideo && !trackedVideoIdsRef.current.has(currentVideo.id)) {
    trackVideoPlay(currentVideo.id, currentVideo.title);
    trackedVideoIdsRef.current.add(currentVideo.id);
  }

  // ... 其他逻辑 ...
});
```

### 统计范围

- 支持多个视频的播放器（如问答页面的多个问题视频）
- 每个视频首次播放时统计
- 自动切换视频时也会统计新视频

### 数据来源

- `videoId`: `currentVideo.id`（来自 `videoList`）
- `videoTitle`: `currentVideo.title`（来自 `videoList`）

## 文件下载统计

### 实现位置

#### 1. PC端媒体下载按钮

**文件**: `app/components/pc/MediaDownloadButton.tsx`

**触发时机**: 用户点击下载按钮时

**实现逻辑**:

```typescript
const handleDownload = () => {
  downloadUrls.forEach(url => {
    trackDownload(mediaType, undefined, url);
    // ... 下载逻辑 ...
  });
};
```

**统计类型**:

- `pdf`: PDF 文件
- `epub`: EPUB 文件
- `audio`: 音频文件
- `video`: 视频文件

#### 2. 下载页面文件图标容器

**文件**: `app/components/shared/FileIconContainer.tsx`

**触发时机**: 用户点击下载链接时

**实现逻辑**:

```typescript
const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  if (href && href !== '#' && fileType) {
    trackDownload(fileType, fileName, href);
  }
  onClick?.(e);
};
```

**使用位置**:

- `app/download/page.tsx` - PC端下载页面
- 传递 `fileType` 和 `fileName` 属性

#### 3. 移动端下载卡片

**文件**: `app/components/mobile/MobileDownloadCard.tsx`

**触发时机**: 用户点击下载选项时

**实现逻辑**:

```typescript
const DownloadOption: React.FC<DownloadOptionProps> = ({
  href,
  fileType,
  fileName,
  // ...
}) => {
  const handleClick = () => {
    trackDownload(fileType, fileName, href);
  };
  // ...
};
```

**统计类型**:

- `pdf`: PDF 文件下载
- `epub`: EPUB 文件下载

#### 4. 移动端电子书下载

**文件**: `app/components/mobile/MobileEBookDownload.tsx`

**触发时机**: 用户点击下载按钮时

**实现逻辑**:

```typescript
const handleDownload = (url: string, type: 'epub' | 'pdf' | 'mp3') => {
  const fileType = type === 'mp3' ? 'audio' : type;
  trackDownload(fileType, undefined, url);
  // ... 下载逻辑 ...
};
```

**统计类型**:

- `pdf`: PDF 文件
- `epub`: EPUB 文件
- `audio`: 音频文件（mp3）

#### 5. 问答资源下载

**文件**: `app/components/shared/DownloadQaResource.tsx`

**触发时机**: 用户点击"本课问答打包下载"按钮时

**实现逻辑**:

```typescript
const handleDownload = async () => {
  const downloadItems = await getDownloadResources(/* ... */);
  const url = downloadItems?.[0]?.url_downvideo;

  if (!url) {
    return alert('本课下载资源不存在');
  }

  trackDownload('video', undefined, url);
  window.open(url);
};
```

**统计类型**: `video` - 问答视频打包下载

## 统计事件汇总

| 事件名称        | 触发场景         | 数据字段                             |
| --------------- | ---------------- | ------------------------------------ |
| `article_read`  | 文章内容加载完成 | `article_id`, `article_title`        |
| `video_play`    | 视频开始播放     | `video_id`, `video_title`            |
| `audio_play`    | 音频开始播放     | `audio_id`, `audio_title`            |
| `file_download` | 用户点击下载     | `file_type`, `file_name`, `file_url` |

## 技术实现要点

### 1. 客户端执行

- 所有统计函数仅在客户端（浏览器）环境执行
- 使用 `typeof window !== 'undefined'` 检查环境

### 2. 防重复统计

- **文章阅读**: 使用 `useRef` 标记已统计状态
- **视频播放**: 使用 `Set` 记录已统计的视频ID
- **音频播放**: 使用 `useRef` 标记已统计状态
- **文件下载**: 每次点击都统计（允许重复下载统计）

### 3. 错误处理

- 静默处理错误，不影响用户体验
- 开发环境显示警告信息便于调试

### 4. 类型安全

- 使用 TypeScript 类型定义
- 对 `window.clarity` 使用类型断言（添加 eslint 忽略注释）

## 使用示例

### 文章阅读统计

```typescript
// 在组件中
trackArticleRead('article-123', '文章标题');
```

### 视频播放统计

```typescript
// 在视频播放器中
trackVideoPlay('video-456', '视频标题');
```

### 音频播放统计

```typescript
// 在音频播放器中
trackAudioPlay('audio-789', '音频标题');
```

### 文件下载统计

```typescript
// 在下载处理函数中
trackDownload('pdf', '文件名.pdf', 'https://example.com/file.pdf');
```

## 注意事项

1. **统计时机**: 文章阅读统计在内容加载时触发，不是滚动到底部
2. **重复统计**:
   - 视频播放每个视频只统计一次，即使重新播放也不会重复统计
   - 音频播放每个音频只统计一次，当音频源改变时会重置统计状态
3. **下载统计**: 每次点击下载都会统计，允许统计重复下载行为
4. **环境检查**: 所有统计函数都会检查 Clarity 是否可用，避免在未初始化时调用

## 后续扩展

如需添加新的统计功能，可以：

1. 在 `clarityAnalytics.ts` 中添加新的统计函数
2. 在相应的组件中调用统计函数
3. 确保在正确的时机触发（用户行为发生时）

## 相关文件清单

### 工具函数

- `app/utils/clarityAnalytics.ts` - 统计工具函数

### 文章阅读统计

- `app/components/pc/ReadingContentWrapper.tsx` - 普通阅读模式
- `app/components/pc/ReadingModePage.tsx` - 阅读模式页面
- `app/components/pc/ReadingPage.tsx` - 阅读页面（传递数据）

### 视频播放统计

- `app/components/pc/VideoPlayer.tsx` - 视频播放器组件

### 音频播放统计

- `app/components/pc/AudioPlayer.tsx` - 音频播放器组件
- `app/components/pc/AudioPage.tsx` - 音频页面（传递数据）

### 文件下载统计

- `app/components/pc/MediaDownloadButton.tsx` - PC端媒体下载按钮
- `app/components/shared/FileIconContainer.tsx` - 文件图标容器
- `app/components/mobile/MobileDownloadCard.tsx` - 移动端下载卡片
- `app/components/mobile/MobileEBookDownload.tsx` - 移动端电子书下载
- `app/components/shared/DownloadQaResource.tsx` - 问答资源下载
- `app/download/page.tsx` - 下载页面（使用 FileIconContainer）
