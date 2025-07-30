import VideoPlayer from '@/app/components/pc/VideoPlayer';
import { getCourseTopicById, getTopicMediaByTopic } from '@/app/api';
import { notFound } from 'next/navigation';

interface LessonPageProps {
  params: Promise<{ slug: string; lesson: string }>;
}

const LessonPage = async ({ params }: LessonPageProps) => {
  const resolvedParams = await params;
  const topicId = resolvedParams.lesson;

  // Fetch topic details and associated media
  const [topic, topicMediaResult] = await Promise.all([
    getCourseTopicById(topicId),
    getTopicMediaByTopic(topicId)
  ]);

  if (!topic) {
    notFound();
  }

  const topicMedia = topicMediaResult.items;
  
  // Get the primary media (first one or one with video)
  const primaryMedia = topicMedia.find(tm => tm.media?.url_hd) || topicMedia[0];
  
  // Determine video source - prefer topic's direct URL, then media URL
  const videoSrc = topic.url || 
                   primaryMedia?.media?.url_hd || 
                   primaryMedia?.media?.high_quality_url ||
                   ''; // Fallback to empty string
  
  // Determine poster image
  const posterImage = primaryMedia?.media?.url_image || 
                     primaryMedia?.media?.image1_url || 
                     'https://img.js.design/assets/img/67dd3b8c27277df4377fc09e.jpg';

  return (
    <VideoPlayer
      poster={posterImage}
      title={topic.article_title || topic.title}
      src={videoSrc}
    />
  );
};

export default LessonPage;
