import { getTagRelations } from '../api';
import TagRelation from '../components/pc/TagRelation';

interface PageProps {
  searchParams: { tag?: string };
}

const page = async ({ searchParams }: PageProps) => {
  const tag = searchParams.tag || '';
  const tagRelations = await getTagRelations(tag);
  // console.log('tagRelations', tagRelations);
  const refCourses = tagRelations.map(tagRelation => ({
    topicTitle: tagRelation.topic_title,
    topicUrl: `/course/${tagRelation.course_order}/lesson${tagRelation.topic_order}`,
    courseName: tagRelation.course_title,
    courseUrl: `/course/${tagRelation.course_order}`,
    date: tagRelation.created,
  }));
  return <TagRelation tag={tag} refCourses={refCourses} />;
};

export default page;
