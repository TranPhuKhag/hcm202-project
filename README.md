
# HCM202 

[![Node](https://img.shields.io/badge/node-%3E=18-339933?logo=node.js)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)]()

## ✨ Tính năng
- **Lesson**: Hero, progress đọc, video cards, timeline, trích dẫn, block **CQ3**.
- **Quiz**: 10 câu · 20s/câu · 5 phút tổng · auto next · giải thích chi tiết · lưu điểm (Firestore).
- **Leaderboard**: Top 10 (score ↓, time ↑) · podium top 3 · thống kê tổng.
- **AI Chat**: Chat UI + serverless `/api/chat` (ẩn `GEMINI_API_KEY`), demo echo nếu chưa cấu hình.
- **Floating Chat**: Nút chat nổi trên mọi trang.

## 🧱 Kiến trúc
```mermaid
flowchart LR
  A[React + Vite + TS] --> B[Serverless API /api/chat]
  A --> C[Firebase Firestore]
  B -->|GEMINI_API_KEY| D[Google Gemini API]
  subgraph Client
    A
  end
  subgraph Backend (Vercel)
    B
  end
  subgraph Cloud
    C
    D
  end
```

## 🚀 Quick Start
```bash
# Cài
npm ci            # hoặc: yarn
# Dev server
npm run dev
# Lint + typecheck + build
npm run lint && npm run typecheck && npm run build
```

## 🔐 Environment
- `.env` (client):
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```
- **Vercel Project Secret**:
```
GEMINI_API_KEY=xxxx
```

## 📁 Cấu trúc
```
api/            # /api/chat - proxy Gemini (ẩn key)
src/
  components/   # FloatingChat, Progress, Podium
  data/         # videos, timeline, quotes, quiz questions
  pages/        # Home, Lesson, Quiz, Leaderboard, AIChat
  firebase.ts   # saveScore(), fetchTop()
  styles.css    # Light + Gold tokens
.github/
  workflows/    # CI
  ISSUE_TEMPLATE/ feature & bug templates
docs/           # ARCHITECTURE, FIREBASE, DEPLOY, ...
```

## 🧭 Quy ước & quy trình
- **Branching**: `main` (protected), `dev`
- **Commit**: Conventional Commits (ví dụ: `feat(quiz): auto next when timeout`)
- **PR**: 1 reviewer, CI xanh (`lint`, `typecheck`, `build`, `test`)

## 🌿 Branch Naming

**Pattern**
<type>/HCM202-<ticket>

- **type**: `feature` | `fix` | `chore` | `docs` | `refactor` | `ci` | `hotfix`
- **ticket**: three digits, **zero-padded** → `001, 002, …`
**Types**

| Type     | Purpose                                                                      |
|---------|-------------------------------------------------------------------------------|
| `chore`  | Auxiliary tasks: configs, setup, tooling that don’t affect features directly |
| `feat`   | Add a new feature or content                                                 |
| `fix`    | Bug fixes in code or UI                                                      |
| `style`  | UI/UX tweaks (typography, spacing, colors) with **no logic changes**        |
| `refactor` | Code restructuring without adding/removing features                        |
| `docs`   | Documentation updates (README, guides)                                      |
| `ci`     | CI/CD changes (workflows, build scripts)                                    |
| `hotfix` | Emergency fix on `main`                                                      |

**Examples**
- `feature/HCM202-001
- `fix/HCM202-014


## 📝 Commit Convention

Use **Conventional Commits**:
- [Branch]-short description in

**Examples**
- [HCM202-001] Init repo
