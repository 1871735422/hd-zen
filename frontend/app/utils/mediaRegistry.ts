/**
 * 全局媒体播放器注册表
 * 用于管理页面中的所有视频和音频播放器，确保同一时间只有一个媒体在播放
 */

export interface MediaPlayer {
  pause: () => void;
  paused: boolean;
  type: 'video' | 'audio';
}

// 全局媒体播放器注册表
const globalMediaRegistry = new Set<MediaPlayer>();

/**
 * 注册媒体播放器到全局列表
 */
export function registerMediaPlayer(player: MediaPlayer) {
  globalMediaRegistry.add(player);
}

/**
 * 从全局列表移除媒体播放器
 */
export function unregisterMediaPlayer(player: MediaPlayer) {
  globalMediaRegistry.delete(player);
}

/**
 * 暂停所有其他媒体播放器
 */
export function pauseOtherMediaPlayers(currentPlayer: MediaPlayer) {
  globalMediaRegistry.forEach(player => {
    if (player !== currentPlayer && !player.paused) {
      player.pause();
    }
  });
}
