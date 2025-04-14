# 📚 성경 통합 어플리케이션 지향 서비스

## 🧾 프로젝트 개요

구직활동 기간이 점차 길어지면서 실무 감각을 잃지 않으려고 시작했습니다.   
여러 언어별, 버전별 성경 말씀과 크리스천 최신 뉴스를 제공합니다. Next.js 15(App Router), TypeScript, React Query v5 등 최신 기술 스택을 활용하여 사용성과 성능을 모두 고려해 개발했습니다.

---

## 📁 폴더 구조 및 주요 코드 설명

```bash
src/
├── api/                # API 기본 설정 및 Fetch 함수 정의
├── components/         
│   └── book/           # 도서 관련 도메인 컴포넌트
│   └── common/         # 공통 컴포넌트
├── constants/          # 매직 넘버 등 공통 상수
├── contexts/           # 전역 설정 컨텍스트 (React Query)
├── hooks/              # 커스텀 훅
├── lib/                # 유틸 함수 (금액 포맷 등)
├── pages/              # 각 페이지의 최상위 컴포넌트 (도서 검색, 내가 찜한 책)
├── store/              # zustand 기반 상태 관리 (찜한 책 관리)
└── types/              # 프로젝트 전반에서 사용하는 타입 정의
```

---

## ✨ 주요 기능
- **다국어 성경**
  - 한국어, 영어, 중국어 외에도 크리스천 비중이 많은 국가의 언어를 지원합니다.

- **AI 크리스천 뉴스**
  - 최신 뉴스를 제공하며 AI를 통해 뉴스를 요약하여 보여줍니다.

---

## 📦 기타 리소스
[제작 배경](https://velog.io/@_sky/%EC%83%9D%EC%A1%B4%EC%9D%84-%EC%9C%84%ED%95%9C-%EC%82%AC%EC%9D%B4%EB%93%9C-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EA%B0%9C%EB%B0%9C%EA%B8%B0)

[제작 이슈](https://linen-blarney-a50.notion.site/1ab39938811b806e8f6ef1e82acbf390?v=1ab39938811b81428ba8000cc7650b8e)