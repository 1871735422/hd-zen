import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock PocketBase before importing the module
const mockGetFullList = vi.fn();
const mockGetList = vi.fn();
const mockGetFirstListItem = vi.fn();
const mockGetOne = vi.fn();
const mockCollection = vi.fn(() => ({
  getFullList: mockGetFullList,
  getList: mockGetList,
  getFirstListItem: mockGetFirstListItem,
  getOne: mockGetOne,
}));

class MockPocketBase {
  collection = mockCollection;
  autoCancellation = vi.fn();
  constructor(_url?: string) {
    // Constructor
  }
}

vi.mock('pocketbase', () => ({
  default: MockPocketBase,
}));

describe('API Functions', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    mockGetFullList.mockReset();
    mockGetList.mockReset();
    mockGetFirstListItem.mockReset();
    mockGetOne.mockReset();
    mockCollection.mockReset();
    mockCollection.mockReturnValue({
      getFullList: mockGetFullList,
      getList: mockGetList,
      getFirstListItem: mockGetFirstListItem,
      getOne: mockGetOne,
    });
  });

  describe('getCategories', () => {
    it('should return categories without filter', async () => {
      const mockCategories = [
        { name: 'course', slug: '/course', subMenu: [] },
        { name: 'qa', slug: '/qa', subMenu: [] },
      ];

      mockGetFullList.mockResolvedValue(mockCategories);

      const { getCategories } = await import('../index');
      const result = await getCategories();

      expect(result).toEqual(mockCategories);
      expect(mockCollection).toHaveBeenCalledWith('navMenu');
      expect(mockGetFullList).toHaveBeenCalledWith({
        sort: 'displayOrder',
        filter: 'isActive = true ',
      });
    });

    it('should return categories with name filter', async () => {
      const mockCategories = [{ name: 'course', slug: '/course', subMenu: [] }];

      mockGetFullList.mockResolvedValue(mockCategories);

      const { getCategories } = await import('../index');
      const result = await getCategories('course');

      expect(result).toEqual(mockCategories);
      expect(mockGetFullList).toHaveBeenCalledWith({
        sort: 'displayOrder',
        filter: 'isActive = true && name = "course"',
      });
    });

    it('should return empty array on error', async () => {
      mockGetFullList.mockRejectedValue(new Error('Network error'));

      const { getCategories } = await import('../index');
      const result = await getCategories();

      expect(result).toEqual([]);
    });
  });

  describe('getCourses', () => {
    it('should return empty result on error', async () => {
      mockGetFullList.mockRejectedValue(new Error('Network error'));

      const { getCourses } = await import('../index');
      const result = await getCourses();

      expect(result.items).toEqual([]);
      expect(result.totalItems).toBe(0);
    });
  });

  describe('getTagRelations', () => {
    it('should return empty array for empty tag', async () => {
      const { getTagRelations } = await import('../index');
      const result = await getTagRelations('');

      expect(result).toEqual([]);
      expect(mockCollection).not.toHaveBeenCalled();
    });
  });
});
