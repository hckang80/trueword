import { describe, expect, it } from 'vitest';
import { getLanguageFullName } from '..';

describe('getLanguageFullName', () => {
  it('언어 코드가 유효한 경우 해당 언어의 전체 이름을 반환해야 한다', () => {
    const result = getLanguageFullName('en', 'ko');
    expect(result).toBe('영어');
  });

  it('언어 코드가 유효하지 않은 경우 빈 문자열을 반환해야 한다', () => {
    const result = getLanguageFullName('invalid-code', 'ko');
    expect(result).toBe('invalid(Code)');
  });

  it('로케일을 지정하지 않은 경우 기본 로케일(ko)을 사용해야 한다', () => {
    const result = getLanguageFullName('en');
    expect(result).toBe('영어');
  });

  it('언어 코드가 빈 문자열인 경우 에러를 던져야 한다', () => {
    expect(() => getLanguageFullName('', 'ko')).toThrowError('langCode가 빈 문자열입니다.');
  });
});
