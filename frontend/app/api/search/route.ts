import { SearchCate, SearchType } from '@/app/types/models';
import { NextRequest, NextResponse } from 'next/server';
import { getSearchResults } from '../../api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get('title') || undefined;
    const keywords = searchParams.get('keywords') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const sort = searchParams.get('sort') || 'desc';
    const type = searchParams.get('searchType') || 'all';
    const cate = searchParams.get('cate') || 'all';
    // 统一使用 getSearchResults 处理所有搜索类型
    const results = await getSearchResults(
      title,
      keywords,
      page,
      pageSize,
      sort,
      type as SearchType,
      cate as SearchCate
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
