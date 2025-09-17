import Apis from '@/request';

// 获取语言分类列表
export const getLanguageCategories = () => {
  return Apis.general.LanguagesController_findAllActive();
};

// 获取语言分类下类别列表
export const getLanguageCategorySubCategories = (categoryId: number) => {
  return Apis.general.CorpusCategoriesController_findByLanguageId({
    pathParams: {
      languageId: categoryId.toString()
    }
  });
};

// 获取用户分页查询单词的进度
export const getUserWordsProgress = (
  languageId: string,
  categoryId: string
) => {
  return Apis.general.WordsController_getUserWordsProgress({
    params: {
      languageId: languageId,
      categoryId: categoryId
    }
  });
};

// 分页获取单词
export const getWordsByCategoryId = (
  languageId: number,
  categoryId: number,
  page: number = 1,
  pageSize: number = 10
) => {
  return Apis.general.WordsController_findByLanguageAndCategory({
    pathParams: {
      languageId: languageId.toString(),
      categoryId: categoryId.toString()
    },
    params: {
      page,
      pageSize
    }
  });
};

// 单词错误上报
export const reportWordError = (wordId: string, errorDescription: string) => {
  return Apis.general.WordErrorReportsController_create({
    data: {
      wordId,
      errorDescription
    }
  });
};

// 单词正确记录
export const correctWord = (id: string) => {
  return Apis.general.WordsController_correctWord({
    data: {
      id: id
    }
  });
};

// 单词错误记录
export const createWordErrorRecord = (
  categoryId: string,
  languageId: string,
  wordId: string
) => {
  return Apis.general.WordErrorRecordsController_recordWordError({
    data: {
      wordId: wordId,
      categoryId,
      languageId
    }
  });
};

// 获取单词排行榜
export const getWordRanking = (
  type: 'total' | 'daily' | 'weekly',
  limit: number
) => {
  return Apis.general.WordsController_getRanking({
    params: {
      type,
      limit
    }
  });
};

// 获取用户错词记录分类列表
export const getUserErrorRecordsCategories = (
  page: number = 1,
  pageSize: number = 10
) => {
  return Apis.general.WordErrorRecordsController_getCategoriesWithErrors({
    params: {
      page,
      pageSize
    }
  });
};
// 获取用户错词记录列表
export const getUserErrorRecordsByCategoryList = (
  categoryId: string,
  page: number = 1,
  pageSize: number = 10
) => {
  return Apis.general.WordErrorRecordsController_getErrorRecordsByCategory({
    pathParams: {
      categoryId
    },
    params: {
      page,
      pageSize
    }
  });
};

// 标记错词记录为已练习
export const markWordErrorRecordAsPracticed = (id: string) => {
  return Apis.general.WordErrorRecordsController_markAsPracticed({
    pathParams: {
      wordId: id
    }
  });
};

// 获取错词统计信息
export const getWordErrorStatistics = () => {
  return Apis.general.WordErrorRecordsController_getErrorStatistics();
};
