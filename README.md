# 바이올린 1포지션 운지 안내 / Violin 1st Position Guide

바이올린 입문자를 위한 조별 1포지션 운지점 안내 사이트. React + Vite + TypeScript, 서버 없는 정적 SPA.

## 개발
```bash
npm install
npm run dev      # 로컬 개발 서버
npm run build    # dist/ 정적 빌드
npm run preview  # 빌드 결과 미리보기
```

## 배포 (GitHub Pages)
- `vite.config.ts`의 `base: './'` 로 어떤 레포 하위 경로에서도 동작.
- `main` 브랜치 push 시 `.github/workflows/deploy.yml` 가 자동 빌드 후 Pages 배포.
- 최초 1회: GitHub 레포 Settings → Pages → Source 를 **GitHub Actions** 로 설정.

## 구조
- `src/music.ts` — 현/운지점/음이름 데이터·유틸
- `src/keys.ts` — 조(장·단조, 5도권) 데이터
- `src/components/Fingerboard.tsx` — 지판 SVG
- `src/components/KeySelector.tsx` — 조 선택(샵/다장조/플랫 섹션)
- `src/components/Staff.tsx` — 오선지/음표 SVG
