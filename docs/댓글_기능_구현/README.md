# giscus 댓글 기능 구현 가이드

Astro 블로그에 GitHub Discussions 기반 댓글 시스템(giscus)을 추가하는 단계별 가이드입니다.

## 📚 문서 목차

### [00. 개요](./00_개요.md)
- giscus 소개
- 현재 상태 분석
- Disqus vs giscus 비교
- 구현 범위 및 예상 소요 시간

### [01. 사전 준비](./01_사전_준비.md)
- GitHub Discussions 활성화
- giscus 앱 설치
- giscus 설정값 획득
- 필수 체크리스트

### [02. 설정 파일 생성](./02_설정_파일_생성.md)
- `src/data/giscus.config.ts` 생성
- TypeScript 인터페이스 정의
- 설정 필드 상세 설명
- 예시 코드

### [03. 컴포넌트 생성](./03_컴포넌트_생성.md)
- `src/components/Giscus.astro` 생성
- 기존 Disqus 패턴 참고
- 동적 스크립트 로딩
- 다크모드 테마 동기화 구현

### [04. 페이지 통합](./04_페이지_통합.md)
- `src/pages/post/[...slug].astro` 수정
- Import 및 변수 추가
- 조건부 렌더링 설정
- Disqus 대체 방법

### [05. 테스트 및 검증](./05_테스트_및_검증.md)
- TypeScript 타입 체크
- 로컬 개발 서버 테스트
- giscus 위젯 로드 확인
- GitHub Discussions 연동 확인
- 프로덕션 배포 및 검증

### [06. 유지보수 및 팁](./06_유지보수_및_팁.md)
- 댓글 관리 방법
- 설정 변경 가이드
- 테마 커스터마이징
- 성능 최적화
- 알림 설정
- 마이그레이션 전략

---

## 🚀 빠른 시작

### 1단계: 사전 준비 (10-15분)
1. GitHub Discussions 활성화
2. https://github.com/apps/giscus 에서 giscus 앱 설치
3. https://giscus.app/ko 에서 설정값 획득

### 2단계: 코드 구현 (15-20분)
1. `src/data/giscus.config.ts` 생성
2. `src/components/Giscus.astro` 생성
3. `src/pages/post/[...slug].astro` 수정

### 3단계: 테스트 (10분)
1. `pnpm dev` 실행
2. 블로그 포스트 확인
3. GitHub Discussions 확인

---

## 📋 필수 요구사항

### GitHub 저장소
- ✅ Public 저장소 (giscus는 private 저장소 미지원)
- ✅ GitHub Discussions 활성화
- ✅ giscus 앱 설치됨

### 프로젝트
- ✅ Astro 5.x
- ✅ TypeScript 설정
- ✅ Tailwind CSS (스타일링)

---

## 🎯 핵심 파일

### 생성할 파일
```
src/
├── data/
│   └── giscus.config.ts       ← 새로 생성
└── components/
    └── Giscus.astro           ← 새로 생성
```

### 수정할 파일
```
src/
└── pages/
    └── post/
        └── [...slug].astro    ← 수정 (3곳)
```

---

## 🔧 설정 예시

### giscus.config.ts
```typescript
export const giscusConfig: GiscusConfig = {
  enabled: true,
  repo: 'username/sunshower-blog',
  repoId: 'R_kgDOH1234567',
  category: 'General',
  categoryId: 'DIC_kwDOH1234567',
  mapping: 'pathname',
  reactionsEnabled: true,
  theme: 'preferred_color_scheme',
  lang: 'ko'
}
```

---

## ✅ 완료 체크리스트

### 사전 준비
- [ ] GitHub Discussions 활성화
- [ ] giscus 앱 설치
- [ ] 설정값 4개 획득 (repo, repoId, category, categoryId)

### 코드 구현
- [ ] `giscus.config.ts` 생성
- [ ] `Giscus.astro` 생성
- [ ] `[...slug].astro` 수정

### 테스트
- [ ] 로컬 빌드 성공
- [ ] giscus 위젯 표시 확인
- [ ] GitHub Discussions 연동 확인
- [ ] 다크모드 테마 동기화 확인
- [ ] 프로덕션 배포 성공

---

## 🐛 일반적인 문제

### giscus 위젯이 안 보여요
- `enabled: true` 확인
- 설정값 4개가 빈 문자열이 아닌지 확인
- 개발자 도구 Console 오류 확인

### "Discussion category not found" 오류
- GitHub Discussions 탭에서 카테고리 존재 확인
- giscus.app에서 올바른 categoryId 다시 복사

### "Repository not found" 오류
- 저장소가 public인지 확인
- giscus 앱이 설치되었는지 확인
- `repo` 값 형식 확인 (`"username/repo"`)

---

## 📖 참고 자료

- [giscus 공식 사이트 (한국어)](https://giscus.app/ko)
- [giscus GitHub 저장소](https://github.com/giscus/giscus)
- [GitHub Discussions 문서](https://docs.github.com/en/discussions)
- [Astro 공식 문서](https://docs.astro.build)

---

## 📊 비교표: Disqus vs giscus

| 항목 | Disqus | giscus |
|------|--------|--------|
| 비용 | 무료(광고) / $9+/월 | 완전 무료 |
| 광고 | 무료 플랜 포함 | 없음 |
| 로그인 | Disqus 계정 | GitHub 계정 |
| 데이터 저장 | Disqus 서버 | 내 GitHub repo |
| 데이터 소유권 | Disqus | 사용자 |
| 마크다운 | 제한적 | 완전 지원 |
| 코드 하이라이팅 | 없음 | 있음 |
| 익명 댓글 | 가능 | 불가능 |
| 적합한 블로그 | 일반 블로그 | 기술/개발 블로그 |

---

## 🎉 마무리

이 가이드를 따라하면 약 35-45분 안에 giscus 댓글 시스템을 완전히 통합할 수 있습니다.

각 단계별 문서를 차례대로 읽으며 진행하세요!

**시작**: [00_개요.md](./00_개요.md) →
