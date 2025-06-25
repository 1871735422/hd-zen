import VideoPlayer from '@/app/components/pc/VideoPlayer';
import { lessonItems } from '@/app/constants';

const LessonPage = async ({
  params,
}: {
  params: Promise<{ lesson: string }>;
}) => {
  const resolvedParams = await params;
  const lessonId = parseInt(resolvedParams.lesson.replace('lesson', ''));
  const lessonTitle = lessonItems.find(item => item.id === lessonId)?.title;

  return (
    <VideoPlayer
      poster='https://img.js.design/assets/img/67dd3b8c27277df4377fc09e.jpg'
      title={lessonTitle}
      src='https://box.hdcxb.net/d/%E7%A6%85%E4%BF%AE%E7%8F%AD/hdjmy/%E6%85%A7%E7%81%AF%E9%97%AE%E9%81%93/%E6%85%A7%E7%81%AF%E9%97%AE%E9%81%93%E7%AC%AC%E4%B8%83%E5%AD%A3/%E7%AC%AC%E4%B8%83%E5%AD%A3%E4%B9%8B%E2%80%9C%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E7%AF%87%E2%80%9D/AI%E6%97%B6%E4%BB%A3%EF%BC%8C%E6%88%91%E4%BB%AC%E7%9A%84%E5%AD%A9%E5%AD%90%E8%A6%81%E8%BA%BA%E5%B9%B3%E4%BA%86%E5%90%97%EF%BC%9F%E4%B8%A8%E3%80%8A%E6%85%A7%E7%81%AF%C2%B7%E9%97%AE%E9%81%93%E3%80%8B%E7%AC%AC%E4%B8%83%E5%AD%A3.mp4'
    />
  );
};

export default LessonPage;
