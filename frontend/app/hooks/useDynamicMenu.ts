import { useEffect, useState } from 'react';
import { getCourses, getCategories } from '../api';
import { Course, Category } from '../types/models';

export interface MenuItem {
  label: string;
  path: string;
  children?: MenuItem[];
}

export const useDynamicMenu = () => {
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const loadMenuData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get courses and categories
        const [coursesResult, categoriesResult] = await Promise.all([
          getCourses(),
          getCategories()
        ]);

        if (!mounted) return;

        const courses = coursesResult.items;
        const categories = categoriesResult.items;

        // Build dynamic menu structure
        const dynamicMenu: MenuItem[] = [
          {
            label: '首页',
            path: '/',
          },
          {
            label: '慧灯禅修课',
            path: '/course',
            children: courses.map(course => ({
              label: course.title,
              path: `/course/${course.id}`,
            })),
          },
          {
            label: '禅修课问答',
            path: '/qa',
            children: [
              { label: '问答 第一册', path: '/qa/1' },
              { label: '问答 第二册', path: '/qa/2' },
            ],
          },
          {
            label: '学修参考资料',
            path: '/reference',
            children: [
              { label: '资料一', path: '/reference/1' },
              { label: '资料二', path: '/reference/2' },
            ],
          },
          {
            label: '下载',
            path: '/download',
          },
          {
            label: '问题征集',
            path: '/questionnaire',
          },
        ];

        setMenuData(dynamicMenu);
      } catch (err) {
        console.error('Error loading menu data:', err);
        if (!mounted) return;
        
        setError(err instanceof Error ? err.message : 'Failed to load menu');
        // Fallback to static menu if API fails
        setMenuData([
          {
            label: '首页',
            path: '/',
          },
          {
            label: '慧灯禅修课',
            path: '/course',
            children: [
              { label: '禅修课 第一册', path: '/course/1' },
              { label: '禅修课 第二册', path: '/course/2' },
            ],
          },
          {
            label: '禅修课问答',
            path: '/qa',
            children: [
              { label: '问答 第一册', path: '/qa/1' },
              { label: '问答 第二册', path: '/qa/2' },
            ],
          },
          {
            label: '学修参考资料',
            path: '/reference',
            children: [
              { label: '资料一', path: '/reference/1' },
              { label: '资料二', path: '/reference/2' },
            ],
          },
          {
            label: '下载',
            path: '/download',
          },
          {
            label: '问题征集',
            path: '/questionnaire',
          },
        ]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadMenuData();
    
    return () => {
      mounted = false;
    };
  }, []);

  return { menuData, loading, error };
};
