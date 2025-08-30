'use client';
import { getLanguageCategories, getLanguageCategorySubCategories } from '@/api';
import Header from '@/components/Header/Header';
import PlasmaWaveV2 from '@/blocks/PlasmaWaveV2/PlasmaWaveV2';
import { CorpusCategory, Language } from '@/request/globals';
import React, { useEffect, useState } from 'react';

/**
 * 语言分类列表页面组件
 * 展示可用的语言类别和子分类
 */
export default function page() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [categorySubCategories, setCategorySubCategories] = useState<
    CorpusCategory[]
  >([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLanguageCategorySubCategoriesAction();
  }, []);

  /**
   * 获取语言分类和默认子分类数据
   */
  const getLanguageCategorySubCategoriesAction = () => {
    setLoading(true);
    getLanguageCategories().then(res => {
      setLanguages(res.data);
      if (res.data.length > 0) {
        setSelectedLanguageId(res.data[0].id);
        getCategorySubCategoriesAction(res.data[0].id);
      }
      setLoading(false);
    });
  };

  /**
   * 获取指定语言的子分类数据
   * @param categoryId 语言分类ID
   */
  const getCategorySubCategoriesAction = (categoryId: number) => {
    getLanguageCategorySubCategories(categoryId).then(res => {
      setCategorySubCategories(res.data);
    });
  };

  /**
   * 处理语言选择
   * @param language 选中的语言对象
   */
  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguageId(language.id);
    getCategorySubCategoriesAction(language.id);
  };

  return (
    <div className='bg-black min-h-screen w-screen relative'>
      {/* 背景动画层 */}
      <div className='fixed inset-0 z-0 backdrop-blur-3xl'>
        <PlasmaWaveV2
          yOffset={-300}
          xOffset={0}
          rotationDeg={-30}
          speed1={1}
          bend1={200}
        />
      </div>

      {/* Header */}
      <div className='relative z-50'>
        <Header activeItem='/list' />
      </div>

      {/* 主要内容区域 */}
      <div className='relative z-40 pt-20 px-4 sm:px-6 lg:px-8 backdrop-blur-md'>
        <div className='max-w-6xl mx-auto'>
          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500'></div>
            </div>
          ) : (
            <div className='space-y-12'>
              {/* 语言列表 */}
              <div>
                <h2 className='text-2xl font-semibold text-white mb-6'>
                  选择您的语言
                </h2>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                  {languages.map(language => (
                    <div
                      key={language.id}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 text-center ${
                        selectedLanguageId === language.id
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                      onClick={() => handleLanguageSelect(language)}>
                      <div className='font-medium'>{language.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 子分类列表 */}
              <div>
                <h2 className='text-2xl font-semibold text-white mb-6'>
                  选择您的学习内容
                </h2>
                {categorySubCategories.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {categorySubCategories.map(category => (
                      <div
                        key={category.id}
                        className='bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer border border-white/10'>
                        <h3 className='text-lg font-semibold text-white mb-2'>
                          {category.name}
                        </h3>
                        <p className='text-gray-300 text-sm mb-4'>
                          {category.description}
                        </p>
                        <div className='flex items-center text-purple-400'>
                          <span className='text-sm'>开始练习</span>
                          <svg
                            className='w-4 h-4 ml-2'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M9 5l7 7-7 7'
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-12'>
                    <div className='text-gray-400 text-lg'>
                      暂无可用的学习内容
                    </div>
                    <p className='text-gray-500 mt-2'>请选择其他语言类别</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
