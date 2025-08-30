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
