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
