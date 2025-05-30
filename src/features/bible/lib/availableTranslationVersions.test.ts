import { describe, it, expect } from 'vitest';
import { availableTranslationVersions } from './index';

describe('availableTranslationVersions', () => {
  it('지원하는 언어와 라이센스, 그리고 versification 여부에 따라 필터링', () => {
    const versions = {
      version1: {
        distribution_license: 'Public Domain',
        distribution_versification: 'KJV',
        language: 'English'
      },
      version2: {
        distribution_license: 'Copyrighted; Free non-commercial distribution',
        distribution_versification: 'NIV',
        language: 'Korean'
      },
      version3: {
        distribution_license: 'Restricted',
        distribution_versification: '',
        language: 'Arabic'
      }
    };

    const result = availableTranslationVersions(versions);

    expect(result).toEqual([
      {
        distribution_license: 'Public Domain',
        distribution_versification: 'KJV',
        language: 'English'
      },
      {
        distribution_license: 'Copyrighted; Free non-commercial distribution',
        distribution_versification: 'NIV',
        language: 'Korean'
      }
    ]);
  });

  it('조건을 만족하는 번역 버전이 없을 때 빈 배열을 반환', () => {
    const versions = {
      version1: {
        distribution_license: 'Restricted',
        distribution_versification: '',
        language: 'Arabic'
      }
    };

    const result = availableTranslationVersions(versions);

    expect(result).toEqual([]);
  });

  it('입력 객체가 비어 있을 때 빈 배열을 반환', () => {
    const versions = {};

    const result = availableTranslationVersions(versions);

    expect(result).toEqual([]);
  });
});
