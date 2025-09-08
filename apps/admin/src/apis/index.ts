import Apis from '../request';
import type {
  LoginDto,
  RegisterDto,
  CreateUserDto,
  CreateLanguageDto,
  CreateCorpusCategoryDto,
  CreateWordDto,
  CreateSentenceDto,
  CreateWordErrorReportDto
} from '../request/globals';

// ==================== 认证相关 API ====================

// 用户注册
export const register = (data: RegisterDto) => {
  return Apis.general.AuthController_register({
    data
  });
};

// 用户登录
export const login = (data: LoginDto) => {
  return Apis.general.AuthController_login({
    data
  });
};

// GitHub OAuth 登录
export const githubAuth = () => {
  return Apis.general.AuthController_githubAuth();
};

// GitHub OAuth 回调
export const githubCallback = () => {
  return Apis.general.AuthController_githubCallback();
};

// QQ OAuth 登录
export const qqAuth = () => {
  return Apis.general.AuthController_qqAuth();
};

// QQ OAuth 回调
export const qqCallback = () => {
  return Apis.general.AuthController_qqCallback();
};

// 获取用户信息
export const getProfile = () => {
  return Apis.general.UserController_findMe();
};

// 绑定GitHub账户
export const bindGithub = () => {
  return Apis.general.AuthController_bindGithub();
};

// 手动绑定GitHub账户
export const bindGithubManual = () => {
  return Apis.general.AuthController_bindGithubManual();
};

// 解绑GitHub账户
export const unbindGithub = () => {
  return Apis.general.AuthController_unbindGithub();
};

// 绑定QQ账户
export const bindQQ = () => {
  return Apis.general.AuthController_bindQQ();
};

// 手动绑定QQ账户
export const bindQQManual = () => {
  return Apis.general.AuthController_bindQQManual();
};

// 解绑QQ账户
export const unbindQQ = () => {
  return Apis.general.AuthController_unbindQQ();
};

// 获取用户绑定的第三方账户
export const getBindings = () => {
  return Apis.general.AuthController_getBindings();
};

// ==================== 用户管理 API ====================

// 创建用户（仅管理员）
export const createUser = (data: CreateUserDto) => {
  return Apis.general.UserController_create({
    data
  });
};

// 分页查询用户（仅管理员）
export const getUserPaginated = (params: {
  page?: number;
  pageSize?: number;
}) => {
  return Apis.general.UserController_findPaginated({
    params
  });
};

// 根据用户Token查询当前用户
export const getCurrentUser = () => {
  return Apis.general.UserController_findMe();
};

// 根据ID查询用户
export const getUserById = (id: number) => {
  return Apis.general.UserController_findOne({
    pathParams: { id }
  });
};

// 注意：更新用户相关的接口在API定义中不存在，可能需要重新生成API定义

// 删除用户（仅超级管理员）
export const deleteUser = (id: number) => {
  return Apis.general.UserController_remove({
    pathParams: { id }
  });
};

// ==================== 语言管理 API ====================

// 创建语言
export const createLanguage = (data: CreateLanguageDto) => {
  return Apis.general.LanguagesController_create({
    data
  });
};

// 获取所有语言列表
export const getAllLanguages = () => {
  return Apis.general.LanguagesController_findAll();
};

// 获取所有启用的语言列表
export const getActiveLanguages = () => {
  return Apis.general.LanguagesController_findAllActive();
};

// 分页查询语言（仅管理员）
export const getLanguagesPaginated = (params: {
  page?: number;
  pageSize?: number;
}) => {
  return Apis.general.LanguagesController_findAllPaginated({
    params
  });
};

// 根据语言代码查询语言
export const getLanguageByCode = (code: string) => {
  return Apis.general.LanguagesController_findByCode({
    pathParams: { code }
  });
};

// 根据ID查询语言
export const getLanguageById = (id: number) => {
  return Apis.general.LanguagesController_findOne({
    pathParams: { id }
  });
};

// 注意：更新语言相关的接口在API定义中不存在，可能需要重新生成API定义

// 删除语言
export const deleteLanguage = (id: number) => {
  return Apis.general.LanguagesController_remove({
    pathParams: { id }
  });
};

// ==================== 语料库分类管理 API ====================

// 创建语料库分类（仅管理员）
export const createCorpusCategory = (data: CreateCorpusCategoryDto) => {
  return Apis.general.CorpusCategoriesController_create({
    data
  });
};

// 获取所有语料库分类
export const getAllCorpusCategories = () => {
  return Apis.general.CorpusCategoriesController_findAll();
};

// 分页查询语料库分类
export const getCorpusCategoriesPaginated = (params: {
  page?: number;
  pageSize?: number;
}) => {
  return Apis.general.CorpusCategoriesController_findAllPaginated({
    params
  });
};

// 根据语言ID查询分类
export const getCorpusCategoriesByLanguage = (languageId: string) => {
  return Apis.general.CorpusCategoriesController_findByLanguageId({
    pathParams: { languageId }
  });
};

// 根据难度等级查询分类
export const getCorpusCategoriesByDifficulty = (difficulty: number) => {
  return Apis.general.CorpusCategoriesController_findByDifficulty({
    pathParams: { difficulty }
  });
};

// 根据语言ID和难度等级查询分类
export const getCorpusCategoriesByLanguageAndDifficulty = (
  languageId: string,
  difficulty: number
) => {
  return Apis.general.CorpusCategoriesController_findByLanguageAndDifficulty({
    pathParams: { languageId, difficulty }
  });
};

// 获取难度等级统计
export const getDifficultyStats = () => {
  return Apis.general.CorpusCategoriesController_getDifficultyStats();
};

// 获取语言分类数量统计
export const getLanguageStats = () => {
  return Apis.general.CorpusCategoriesController_getLanguageStats();
};

// 根据ID查询语料库分类
export const getCorpusCategoryById = (id: string) => {
  return Apis.general.CorpusCategoriesController_findOne({
    pathParams: { id }
  });
};

// 注意：更新语料库分类相关的接口在API定义中不存在，可能需要重新生成API定义

// 删除语料库分类（仅管理员）
export const deleteCorpusCategory = (id: string) => {
  return Apis.general.CorpusCategoriesController_remove({
    pathParams: { id }
  });
};

// ==================== 单词管理 API ====================

// 创建单词（仅管理员）
export const createWord = (data: CreateWordDto) => {
  return Apis.general.WordsController_create({
    data
  });
};

// 分页查询单词（仅管理员）
export const getWordsPaginated = (params: {
  page?: number;
  pageSize?: number;
}) => {
  return Apis.general.WordsController_findAllPaginated({
    params
  });
};

// 根据语言ID查询单词
export const getWordsByLanguage = (
  languageId: string,
  params: { page?: number; pageSize?: number }
) => {
  return Apis.general.WordsController_findByLanguageId({
    pathParams: { languageId },
    params
  });
};

// 根据分类ID查询单词
export const getWordsByCategory = (
  categoryId: string,
  params: { page?: number; pageSize?: number }
) => {
  return Apis.general.WordsController_findByCategoryId({
    pathParams: { categoryId },
    params
  });
};

// 根据语言和分类查询单词
export const getWordsByLanguageAndCategory = (
  languageId: string,
  categoryId: string,
  params: { page?: number; pageSize?: number }
) => {
  return Apis.general.WordsController_findByLanguageAndCategory({
    pathParams: { languageId, categoryId },
    params
  });
};

// 搜索单词
export const searchWords = (params: {
  keyword: string;
  languageId?: string;
  categoryId?: string;
  page?: number;
  pageSize?: number;
}) => {
  return Apis.general.WordsController_searchWords({
    params
  });
};

// 分页搜索单词
export const searchWordsPaginated = (params: {
  keyword: string;
  languageId?: string;
  categoryId?: string;
  page?: number;
  pageSize?: number;
}) => {
  return Apis.general.WordsController_searchWordsPaginated({
    params
  });
};

// 随机获取单词（用于练习）
export const getRandomWords = (
  params: {
    count?: number;
    languageId?: string;
    categoryId?: string;
  } = {}
) => {
  return Apis.general.WordsController_getRandomWords({
    params
  });
};

// 获取单词语言统计信息
export const getWordLanguageStats = () => {
  return Apis.general.WordsController_getLanguageStats();
};

// 获取单词分类统计信息
export const getWordCategoryStats = () => {
  return Apis.general.WordsController_getCategoryStats();
};

// 根据ID查询单词详情
export const getWordById = (id: string) => {
  return Apis.general.WordsController_findOne({
    pathParams: { id }
  });
};

// 注意：更新单词相关的接口在API定义中不存在，可能需要重新生成API定义

// 删除单词（仅管理员）
export const deleteWord = (id: string) => {
  return Apis.general.WordsController_remove({
    pathParams: { id }
  });
};

// ==================== 句子管理 API ====================

// 创建句子（仅管理员）
export const createSentence = (data: CreateSentenceDto) => {
  return Apis.general.SentencesController_create({
    data
  });
};

// 分页查询句子
export const getSentencesPaginated = (params: {
  page?: number;
  pageSize?: number;
}) => {
  return Apis.general.SentencesController_findAllPaginated({
    params
  });
};

// 根据语言ID查询句子
export const getSentencesByLanguage = (
  languageId: string,
  params: { page?: number; pageSize?: number }
) => {
  return Apis.general.SentencesController_findByLanguageId({
    pathParams: { languageId },
    params
  });
};

// 根据分类ID查询句子
export const getSentencesByCategory = (
  categoryId: string,
  params: { page?: number; pageSize?: number }
) => {
  return Apis.general.SentencesController_findByCategoryId({
    pathParams: { categoryId },
    params
  });
};

// 根据语言ID和分类ID查询句子
export const getSentencesByLanguageAndCategory = (
  languageId: string,
  categoryId: string,
  params: { page?: number; pageSize?: number }
) => {
  return Apis.general.SentencesController_findByLanguageAndCategory({
    pathParams: { languageId, categoryId },
    params
  });
};

// 搜索句子
export const searchSentences = (params: {
  keyword: string;
  languageId?: string;
  categoryId?: string;
}) => {
  return Apis.general.SentencesController_searchSentences({
    params
  });
};

// 分页搜索句子
export const searchSentencesPaginated = (params: {
  keyword: string;
  languageId?: string;
  categoryId?: string;
  page?: number;
  pageSize?: number;
}) => {
  return Apis.general.SentencesController_searchSentencesPaginated({
    params
  });
};

// 获取随机句子
export const getRandomSentences = (
  params: {
    count?: number;
    languageId?: string;
    categoryId?: string;
  } = {}
) => {
  return Apis.general.SentencesController_getRandomSentences({
    params
  });
};

// 获取句子语言统计信息
export const getSentenceLanguageStats = () => {
  return Apis.general.SentencesController_getLanguageStats();
};

// 获取句子分类统计信息
export const getSentenceCategoryStats = () => {
  return Apis.general.SentencesController_getCategoryStats();
};

// 根据ID查询句子详情
export const getSentenceById = (id: string) => {
  return Apis.general.SentencesController_findOne({
    pathParams: { id }
  });
};

// 注意：更新句子相关的接口在API定义中不存在，可能需要重新生成API定义

// 删除句子（仅管理员）
export const deleteSentence = (id: string) => {
  return Apis.general.SentencesController_remove({
    pathParams: { id }
  });
};

// ==================== 语音 API ====================

// 文本转语音
export const getTextToSpeech = (params: {
  id: string;
  word: string;
  form: string;
  voice: string;
}) => {
  return Apis.general.SpeechController_getText2Speech({
    params
  });
};

// ==================== 单词错误报告 API ====================

// 提交单词错误报告
export const createWordErrorReport = (data: CreateWordErrorReportDto) => {
  return Apis.general.WordErrorReportsController_create({
    data
  });
};

// 分页查询所有错误报告（仅管理员）
export const getWordErrorReportsPaginated = (params: {
  page?: number;
  pageSize?: number;
}) => {
  return Apis.general.WordErrorReportsController_findAllPaginated({
    params
  });
};

// 查询我的错误报告
export const getMyWordErrorReports = (params: {
  page?: number;
  pageSize?: number;
}) => {
  return Apis.general.WordErrorReportsController_findMyReports({
    params
  });
};

// 获取错误报告统计信息（仅管理员）
export const getWordErrorReportStats = () => {
  return Apis.general.WordErrorReportsController_getReportStats();
};

// 搜索我的错误报告
export const searchMyWordErrorReports = (params: {
  keyword: string;
  page?: number;
  pageSize?: number;
}) => {
  return Apis.general.WordErrorReportsController_searchMyReports({
    params
  });
};

// 分页搜索我的错误报告
export const searchMyWordErrorReportsPaginated = (params: {
  keyword: string;
  page?: number;
  pageSize?: number;
}) => {
  return Apis.general.WordErrorReportsController_searchMyReportsPaginated({
    params
  });
};

// 搜索所有错误报告（仅管理员）
export const searchAllWordErrorReports = (params: {
  keyword: string;
  page?: number;
  pageSize?: number;
}) => {
  return Apis.general.WordErrorReportsController_searchAllReports({
    params
  });
};

// 分页搜索所有错误报告（仅管理员）
export const searchAllWordErrorReportsPaginated = (params: {
  keyword: string;
  page?: number;
  pageSize?: number;
}) => {
  return Apis.general.WordErrorReportsController_searchAllReportsPaginated({
    params
  });
};

// 根据状态查询错误报告（仅管理员）
export const getWordErrorReportsByStatus = (
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected',
  params: { page?: number; pageSize?: number }
) => {
  return Apis.general.WordErrorReportsController_findByStatus({
    pathParams: { status },
    params
  });
};

// 根据ID查询错误报告详情
export const getWordErrorReportById = (id: string) => {
  return Apis.general.WordErrorReportsController_findOne({
    pathParams: { id }
  });
};

// 注意：更新错误报告相关的接口在API定义中不存在，可能需要重新生成API定义

// 删除错误报告（仅管理员）
export const deleteWordErrorReport = (id: string) => {
  return Apis.general.WordErrorReportsController_remove({
    pathParams: { id }
  });
};
