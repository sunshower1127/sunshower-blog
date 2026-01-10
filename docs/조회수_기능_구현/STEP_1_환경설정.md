**완료**

# STEP 1: 환경 설정

## 목표

Netlify Functions와 Netlify Blobs를 사용하기 위한 개발 환경을 설정합니다.

## 작업 내용

### 1. 의존성 설치

```bash
pnpm add @netlify/functions @netlify/blobs
```

**패키지 설명:**

- `@netlify/functions`: Netlify Functions의 TypeScript 타입 정의 및 유틸리티
- `@netlify/blobs`: Netlify Blobs 스토리지 API 클라이언트

### 2. netlify.toml 수정

**파일:** `netlify.toml`

**기존 내용:**

```toml
[build]
command = 'pnpm build'
```

**수정 후:**

```toml
[build]
  command = 'pnpm build'

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
```

**설정 설명:**

- `directory`: Netlify Functions 파일들이 위치할 디렉토리
- `node_bundler`: TypeScript 및 ES 모듈을 번들링하기 위한 도구 (esbuild 사용)

### 3. 디렉토리 생성

다음 디렉토리를 생성합니다:

```
netlify/
└── functions/
```

```bash
# Windows (PowerShell)
New-Item -ItemType Directory -Path "netlify\functions" -Force

# macOS/Linux
mkdir -p netlify/functions
```

## 검증

다음 명령어로 의존성이 올바르게 설치되었는지 확인:

```bash
pnpm list @netlify/functions @netlify/blobs
```

예상 출력:

```
blog-template@1.1.0 C:\Users\seng1\Documents\Projects\sunshower-blog
├── @netlify/blobs x.x.x
└── @netlify/functions x.x.x
```

## 다음 단계

✅ 환경 설정 완료 후 → **STEP 2: 백엔드 구현**으로 진행
