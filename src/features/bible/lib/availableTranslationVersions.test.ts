import { describe, it, expect } from 'vitest';
import { availableTranslationVersions, type TransitionVersion } from '..';

function createTransitionVersion(overrides: Partial<TransitionVersion>): TransitionVersion {
  return {
    abbreviation: '',
    description: '',
    lang: '',
    language: '',
    distribution_license: '',
    distribution_versification: '',
    url: '',
    sha: '',
    translation: '',
    ...overrides
  };
}

describe('availableTranslationVersions', () => {
  it('각 항목이 모든 조건(license, versification, lang)을 만족하는 경우에만 반환', () => {
    const versions = {
      version1: createTransitionVersion({
        distribution_license: 'Public Domain',
        distribution_versification: 'KJV',
        lang: 'en'
      }),
      version2: createTransitionVersion({
        distribution_license: 'Copyrighted; Free non-commercial distribution',
        distribution_versification: 'NIV',
        lang: 'ko'
      }),
      version3: createTransitionVersion({
        distribution_license: 'Restricted',
        distribution_versification: '',
        lang: 'ar'
      })
    };

    const result = availableTranslationVersions(versions);

    expect(result).toEqual([
      createTransitionVersion({
        distribution_license: 'Public Domain',
        distribution_versification: 'KJV',
        lang: 'en'
      }),
      createTransitionVersion({
        distribution_license: 'Copyrighted; Free non-commercial distribution',
        distribution_versification: 'NIV',
        lang: 'ko'
      })
    ]);
  });

  it('각 항목이 일부 조건만 만족하는 경우 빈 배열을 반환', () => {
    const versions = {
      version1: createTransitionVersion({
        distribution_license: 'Public Domain',
        distribution_versification: '',
        lang: 'en'
      }),
      version2: createTransitionVersion({
        distribution_license: 'Restricted',
        distribution_versification: 'NIV',
        lang: 'ko'
      }),
      version3: createTransitionVersion({
        distribution_license: 'Public Domain',
        distribution_versification: 'NIV',
        lang: 'ar'
      })
    };

    const result = availableTranslationVersions(versions);

    expect(result).toEqual([]);
  });

  it('조건을 만족하는 번역 버전이 없을 때 빈 배열을 반환', () => {
    const versions = {
      version1: createTransitionVersion({
        distribution_license: 'Restricted',
        distribution_versification: '',
        lang: 'ar'
      })
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
