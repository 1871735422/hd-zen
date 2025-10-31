import { NextRequest, NextResponse } from 'next/server';
import { getSearchArticles, getSearchQuestions } from '../../api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || undefined;
    const content = searchParams.get('content') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const sort = searchParams.get('sort') || 'desc';
    const type = searchParams.get('type') || 'all';
    const cate = searchParams.get('cate') || 'all';

    console.log('API Route - Search params:', {
      title,
      content,
      page,
      pageSize,
      sort,
      type,
      cate,
    });

    let results;

    if (cate === 'qa') {
      // 问答搜索：仅搜索标题
      results = await getSearchQuestions(title || '', page, pageSize, sort);
    } else if (cate === 'course') {
      // 慧灯禅修课搜索：搜索标题和内容
      // results = await getSearchCourses(title || '', page, pageSize, sort);
    } else if (cate === 'reference') {
      // 学修参考资料搜索：搜索标题和内容
      // results = await getSearchReference(title || '', page, pageSize, sort);
    } else {
      // 全站搜索
      results = await getSearchArticles(
        title,
        content,
        page,
        pageSize,
        sort,
        type
      );
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
