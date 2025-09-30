'use client';
import React from 'react';
import PackageCard from './PackageCard';
import type { CustomPackage as ApiCustomPackage } from '@/request/globals';

type CustomPackage = ApiCustomPackage;

interface PackageListProps {
  packages: CustomPackage[];
  loading: boolean;
  packageType: 'my' | 'public';
  onDelete: (id: string) => void;
  onImport?: (id: string) => void;
  onStartPractice?: (id: string) => void;
}

export default function PackageList({
  packages,
  loading,
  packageType,
  onDelete,
  onImport,
  onStartPractice
}: PackageListProps) {
  if (loading) {
    return (
      <div className='col-span-full flex justify-center items-center py-12'>
        <div className='text-gray-400'>加载中...</div>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className='col-span-full flex flex-col justify-center items-center py-12'>
        <div className='text-gray-400'>暂无数据</div>
      </div>
    );
  }

  return (
    <>
      {packages.map(pkg => (
        <PackageCard
          key={pkg.id}
          pkg={pkg}
          packageType={packageType}
          onDelete={onDelete}
          onImport={onImport}
          onStartPractice={onStartPractice}
        />
      ))}
    </>
  );
}
