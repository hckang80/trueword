# 📚 성경 통합 어플리케이션 서비스

## 🧾 프로젝트 개요

현재는 성경과 뉴스를 제공하며 종교 활동과 관련한 기능을 점차 확대해나갈 목적으로 제작 중입니다.

---

## ✨ 주요 기능
- **다국어 성경**
  - 한국어, 영어, 중국어 외에도 크리스천 비중이 많은 국가의 성경 버전을 지원합니다.

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

## 📦 기타

[프로젝트 제작 칸반](https://linen-blarney-a50.notion.site/1f239938811b808d80c4d53cbe2c0b77?v=1f239938811b81dfa7b4000c58951d3b)