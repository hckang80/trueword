# 📚 성경 통합 어플리케이션 지향 서비스

## 🧾 프로젝트 개요

구직활동 기간이 점차 길어지면서 실무 감각을 잃지 않으려고 시작했습니다.   
여러 언어별, 버전별 성경 말씀과 크리스천 최신 뉴스를 제공합니다. Next.js 15(App Router), TypeScript, React Query v5 등 최신 기술 스택을 활용하여 사용성과 성능을 모두 고려해 개발했습니다.

---

## ✨ 주요 기능
- **다국어 성경**
  - 한국어, 영어, 중국어 외에도 크리스천 비중이 많은 국가의 언어를 지원합니다.

- **AI 크리스천 뉴스**
  - 최신 뉴스를 제공하며 AI를 통해 뉴스를 요약하여 보여줍니다.

---

## 📁 폴더 구조 및 설명

FSD(Feature-Sliced Design)로 설계했습니다.
```bash
src/
├── app/                          
│   ├── [locale]/                 # 다국어 지원 라우트
│   ├── api/                      # API 라우트
│   └── translations/             # 동적 API 라우트
├── features/                     # 기능 모듈
│   └── bible/                    # 도메인 명칭 (bible, news...)
│       ├── api/                  # 데이터 패칭 함수
│       ├── hooks/                # 커스텀 훅, react-query
│       ├── lib/                  # 유틸리티 함수 및 라이브러리
│       └── model/                # 상수, 타입 정의
└── shared/                       # 공용 모듈
│   ├── components/               # UI 등 공통 컴포넌트
│   ├── config/                   # Axios, 언어 설정
│   ├── i18n/                     # 국제화
│   ├── lib/                      # 유틸리티 함수 및 라이브러리
│   └── types/                    # 타입 정의
└── middleware/                   # 전역 미들웨어
```

---

## 📦 기타 리소스
[제작 배경](https://velog.io/@_sky/%EC%83%9D%EC%A1%B4%EC%9D%84-%EC%9C%84%ED%95%9C-%EC%82%AC%EC%9D%B4%EB%93%9C-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EA%B0%9C%EB%B0%9C%EA%B8%B0)

[제작 이슈](https://linen-blarney-a50.notion.site/1ab39938811b806e8f6ef1e82acbf390?v=1ab39938811b81428ba8000cc7650b8e)