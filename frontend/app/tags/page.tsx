import { getTagRelations } from '../api';
import TagRelation from '../components/pc/TagRelation';

interface PageProps {
  searchParams: Promise<{ tag?: string }>;
}

const page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;
  const tag = resolvedSearchParams.tag || '';
  const tagRelations = await getTagRelations(tag);
  const refCourses = tagRelations.map(tagRelation => ({
    topicTitle: tagRelation.topicTitle,
    topicUrl: `/course/${tagRelation.courseOrder}/lesson${tagRelation.topicOrder}`,
    courseName: tagRelation.courseTitle,
    courseUrl: `/course/${tagRelation.courseOrder}`,
    date: tagRelation.created,
  }));
  return <TagRelation tag={tag} refCourses={refCourses} />;
};

export default page;
