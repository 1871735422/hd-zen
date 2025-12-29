import { Media } from '@/app/types/models';
import { Typography } from '@mui/material';
import { Fragment } from 'react';
import VideoPlayer from './VideoPlayer';

export default function VideoPage({ topicMedia }: { topicMedia: Media[] }) {
  return (
    <>
      {topicMedia
        .filter(x => x.url_sd || x.url_hd)
        .map(media => (
          <Fragment key={media.id}>
            {media?.url_hd || media?.url_sd ? (
              <VideoPlayer
                urlParamName={topicMedia.length > 0 ? 'showTitle' : ''}
                videoList={[
                  {
                    id: media?.id || '',
                    title: media?.title || '',
                    poster: media?.url_image || '',
                    url_downmp4: media?.url_downmp4,
                    sources: [
                      media?.url_sd
                        ? {
                            src: media?.url_sd,
                            size: 720,
                            type: 'video/mp4',
                          }
                        : undefined,
                      media?.url_hd
                        ? {
                            src: media?.url_hd,
                            size: 1080,
                            type: 'video/mp4',
                          }
                        : undefined,
                    ].filter(Boolean) as {
                      src: string;
                      size?: number;
                      type?: string;
                    }[],
                  },
                ]}
              />
            ) : (
              <Typography>视频资源不可用：{media?.title} </Typography>
            )}
          </Fragment>
        ))}
    </>
  );
}
