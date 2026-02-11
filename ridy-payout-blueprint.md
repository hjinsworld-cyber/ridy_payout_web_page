# RIDY Payout 랜딩페이지 — 구현 설계도

---

## 0. 목차 (Table of Contents)

| # | 섹션 | 배경색 | 핵심 컴포넌트 |
|---|------|--------|--------------|
| 1 | Hero / 서비스 소개 | `#4054E7` (Primary Blue) | Badge, 탭 전환, Glassmorphism 카드 |
| 2 | 주요 기능 — 관리자 | `#FAF9F5` (Light) | 4-Column Feature Cards |
| 3 | 주요 기능 — 라이더 | `#212121` (Dark) | 텍스트 + 앱 목업 Split Layout |
| 4 | 이용 가이드 | `#FFFFFF` (White) | 2-Column Accordion |
| 5 | 요금제 & 프로모션 | `#FAF9F5` (Light) | Pricing Table, Type 카드 |
| 6 | 도입 문의 (CTA) | `#FFFFFF` → `#4054E7` gradient | Checklist, Tally Modal, 고객지원 |
| — | Global: Mobile Sticky Bar | Fixed Bottom | 카톡 + 상담신청 버튼 |

---

## 1. 기술 스택 & 전역 설정

### 1-1. 권장 스택

| 항목 | 권장 | 비고 |
|------|------|------|
| 프레임워크 | **Next.js 14 (App Router)** 또는 순수 HTML/TailwindCSS | SEO 필수이므로 SSR/SSG 권장 |
| 스타일링 | **Tailwind CSS 3.4+** | 유틸리티 기반, 반응형 용이 |
| 애니메이션 | **Framer Motion** 또는 CSS `@keyframes` | 탭 전환, 아코디언, Scroll Reveal |
| 폼 | **Tally Embed (Modal)** | `<script>` 삽입 방식 |
| 아이콘 | **Lucide Icons** 또는 **Heroicons** | 일관된 Line 스타일 |
| 배포 | Vercel / Cloudflare Pages | — |

### 1-2. Design Token (전역 변수)

```css
:root {
  /* Colors */
  --color-primary:       #4054E7;
  --color-primary-dark:  #2E3FCC;
  --color-primary-light: #6B7CFF;
  --color-dark:          #212121;
  --color-dark-card:     #2A2A2A;
  --color-light-bg:      #FAF9F5;
  --color-white:         #FFFFFF;
  --color-text-primary:  #1A1A1A;
  --color-text-secondary:#6B7280;
  --color-text-on-dark:  #E5E5E5;
  --color-kakao:         #FAE100;
  --color-success:       #10B981;
  --color-danger:        #EF4444;

  /* Typography Scale (Mobile-first) */
  --text-hero:    clamp(1.75rem, 5vw, 3rem);      /* Hero 헤드라인 */
  --text-h2:      clamp(1.375rem, 3.5vw, 2.25rem); /* 섹션 헤드라인 */
  --text-h3:      clamp(1.125rem, 2.5vw, 1.5rem);  /* 카드 제목 */
  --text-body:    clamp(0.875rem, 1.5vw, 1rem);     /* 본문 */
  --text-small:   clamp(0.75rem, 1.2vw, 0.875rem);  /* 캡션 */

  /* Spacing */
  --section-py:   clamp(3rem, 8vw, 6rem);  /* 섹션 상하 패딩 */
  --container-px: clamp(1rem, 4vw, 2rem);  /* 좌우 여백 */
  --container-max: 1200px;

  /* Radius & Shadow */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --shadow-card: 0 4px 24px rgba(0,0,0,0.08);
  --shadow-elevated: 0 8px 40px rgba(0,0,0,0.12);
}
```

### 1-3. 반응형 브레이크포인트

| 이름 | 범위 | 기준 |
|------|------|------|
| `mobile` | 0 ~ 639px | 기본 (Mobile-first) |
| `sm` | 640px+ | 큰 모바일 |
| `md` | 768px+ | 태블릿 / Sticky Bar 숨김 기준 |
| `lg` | 1024px+ | 데스크톱 |
| `xl` | 1280px+ | 와이드 데스크톱 |

---

## 2. 섹션별 상세 설계

---

### 섹션 1: Hero / 서비스 소개

#### 레이아웃 구조

```
┌──────────────────────────────────────────────┐
│  [Full-width Blue Background #4054E7]        │
│                                              │
│   ┌─ Badge ─────────────┐                    │
│   │ RIDY Payout         │                    │
│   └─────────────────────┘                    │
│                                              │
│   정산은 정확하게, 출금은 간편하게.              │  ← Hero Headline
│   배달 대행 정산의 새로운 기준, RIDY Payout     │  ← Sub-copy
│                                              │
│   ┌─ Vision Box (Glassmorphism) ───────────┐ │
│   │ 💡 왜 RIDY Payout인가요?               │ │
│   │ 복잡한 엑셀 수식과 연락 지옥에서...      │ │
│   └────────────────────────────────────────┘ │
│                                              │
│   ┌──────────────┬──────────────┐            │
│   │  관리자/지사  │    라이더     │            │  ← Tab Switcher
│   └──────────────┴──────────────┘            │
│   ┌────────────────────────────────────────┐ │
│   │ (Tab Content - fade transition)        │ │
│   │ • 업로드 한 번으로 자동 계산            │ │
│   │ • 차감금 누락 없이 관리                 │ │
│   │ • ...                                  │ │
│   └────────────────────────────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
```

#### 상세 스펙

| 요소 | 데스크톱 | 모바일 |
|------|---------|--------|
| 섹션 패딩 | `py: 80px` | `py: 48px` |
| Badge | `border: 1.5px solid white`, `px:16 py:6`, `radius: 999px`, `font-size: 14px` | 동일 |
| Headline | `font-size: var(--text-hero)`, `font-weight: 700`, `color: white`, `line-height: 1.3` | 자동 축소 (clamp) |
| Sub-copy | `font-size: var(--text-body)`, `color: rgba(255,255,255,0.85)` | — |
| Vision Box | `background: rgba(255,255,255,0.1)`, `backdrop-filter: blur(12px)`, `border: 1px solid rgba(255,255,255,0.2)`, `radius: var(--radius-lg)`, `padding: 24px 28px` | `padding: 20px` |
| 탭 버튼 | `width: 50%` 각각, 활성: `bg: white, color: #4054E7`, 비활성: `bg: transparent, color: rgba(255,255,255,0.6), border: 1px solid rgba(255,255,255,0.3)` | 동일 |
| 탭 전환 | 콘텐츠 영역 `min-height: 200px`, `opacity 0→1` 트랜지션 300ms | — |
| 탭 콘텐츠 | 각 항목에 작은 체크 아이콘(✓) 또는 bullet, `color: rgba(255,255,255,0.9)` | — |

#### 인터랙션

```
[Tab Click]
  → 활성 탭 스타일 전환 (pill 형태 슬라이딩 또는 즉시)
  → 콘텐츠 영역: opacity 0 → 0 (150ms) → content swap → opacity 1 (150ms)
  → 선택된 탭 상태를 URL hash로 저장 (#admin / #rider) — 선택사항
```

#### 💡 개선 제안

> **기획서 방식:** `<details>` 태그 기반 접기/펼치기
> **개선안:** 탭(Tab) UI가 더 적합합니다. 두 가지 타겟이 배타적 선택이므로, 토글/탭이 UX상 자연스럽습니다.
> 추가로 **탭 배경에 sliding pill indicator** (선택된 탭 뒤에 흰색 배경이 슬라이드하는 효과)를 적용하면 인터랙티브한 느낌을 줄 수 있습니다.

---

### 섹션 2: 주요 기능 — 관리자 (Admin)

#### 레이아웃 구조

```
┌──────────────────────────────────────────────┐
│  [Light BG #FAF9F5]                          │
│                                              │
│   🖥️ PAYOUT Admin (지사용 웹 콘솔)           │
│   엑셀 업로드부터 이체까지, 단 3단계로 끝나는...│
│                                              │
│   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐│  ← Desktop: 4-col
│   │ 🧮     │ │ 🛡️     │ │ 🎁     │ │ ⬇️     ││
│   │ 자동   │ │ 리스크  │ │ 프로모 │ │ 대량   ││
│   │ 정산   │ │ 차감금  │ │ 연동   │ │ 이체   ││
│   │ 시스템 │ │ 관리   │ │        │ │ 지원   ││
│   └────────┘ └────────┘ └────────┘ └────────┘│
│                                              │
│   Mobile: 1-col vertical stack               │
│   Tablet(md): 2-col grid                     │
└──────────────────────────────────────────────┘
```

#### 카드 스펙

| 속성 | 값 |
|------|-----|
| 배경 | `#FFFFFF` |
| 테두리 | `1px solid #E5E7EB` (또는 없음, shadow로 대체) |
| 라운드 | `var(--radius-md)` = 12px |
| 그림자 | `var(--shadow-card)` |
| 패딩 | `24px` (Desktop) / `20px` (Mobile) |
| 아이콘 영역 | `48×48px` 원형 또는 사각형 배경(`#EEF0FF` — primary 연한색), 중앙에 아이콘 24px |
| 제목 | `font-weight: 600`, `font-size: var(--text-h3)`, `color: var(--color-text-primary)`, `margin-top: 16px` |
| 설명 | `font-size: var(--text-body)`, `color: var(--color-text-secondary)`, `line-height: 1.6`, `margin-top: 8px` |

#### 그리드

```css
/* Mobile-first */
.admin-grid {
  display: grid;
  grid-template-columns: 1fr;           /* mobile: 1열 */
  gap: 16px;
}
@media (min-width: 768px) {
  .admin-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
}
@media (min-width: 1024px) {
  .admin-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; }
}
```

#### 카드 콘텐츠

| # | 아이콘 | 제목 | 설명 요약 |
|---|--------|------|----------|
| 1 | 계산기 (Calculator) | 자동 정산 시스템 | 엑셀 업로드 → 수수료/지급액 즉시 자동 계산 |
| 2 | 방패 (ShieldAlert) | 리스크 & 차감금 관리 | 렌트/리스비, 소액 대출 관리 & 우선 공제 |
| 3 | 선물 (Gift / Sparkles) | 지사 프로모션 연동 | 기상 할증, 보너스 등 정산 자동 반영 |
| 4 | 다운로드 (Download) | 대량 이체 지원 | 은행 양식 이체 파일 원클릭 다운로드 |

#### 💡 개선 제안

> **기획서:** 단순 정적 카드
> **개선안:** 각 카드에 `hover` 시 **미세한 Y축 이동(-4px) + shadow 강화** 트랜지션을 적용하면 인터랙티브 느낌 향상. 모바일에서는 **Scroll Reveal (IntersectionObserver)** 로 카드가 순차적으로 fade-up 되는 애니메이션 적용 권장.

---

### 섹션 3: 주요 기능 — 라이더 (Rider)

#### 레이아웃 구조

```
Desktop (lg+):
┌──────────────────────────────────────────────┐
│  [Dark BG #212121]                           │
│                                              │
│   📱 PAYOUT Rider (라이더용 앱)               │
│   내 손안의 정산 비서, 10원 단위까지...         │
│                                              │
│   ┌─────────────────┬───────────────────┐    │
│   │  텍스트 영역     │   앱 목업 이미지   │    │
│   │                 │   ┌───────────┐   │    │
│   │  ① 원터치 출금   │   │  📱       │   │    │
│   │  ② 상세 정산     │   │  Mockup   │   │    │
│   │  ③ 멀티 플랫폼   │   │  Image    │   │    │
│   │                 │   └───────────┘   │    │
│   └─────────────────┴───────────────────┘    │
│                                              │
└──────────────────────────────────────────────┘

Mobile:
┌─────────────────────┐
│  헤드라인/서브카피    │
│  앱 목업 이미지      │  ← 이미지 먼저 (시각적 임팩트)
│  ① 원터치 출금       │
│  ② 상세 정산         │
│  ③ 멀티 플랫폼       │
└─────────────────────┘
```

#### 상세 스펙

| 요소 | 값 |
|------|-----|
| 섹션 배경 | `#212121` |
| 텍스트 색상 | 헤드라인: `#FFFFFF`, 본문: `#E5E5E5`, 보조: `#9CA3AF` |
| 레이아웃 비율 (Desktop) | 좌 텍스트 55% : 우 이미지 45% |
| 기능 항목 | 각 항목 앞에 번호 배지(`1`,`2`,`3`) — `bg: var(--color-primary)`, `color: white`, `width: 28px`, `height: 28px`, `border-radius: 50%`, `font-size: 14px` |
| 기능 항목 간격 | `gap: 24px` (세로) |
| 수식 강조 | `수입 - (수수료 + 차감금 + 세금) = 실지급액` → `bg: var(--color-dark-card)`, `border-left: 3px solid var(--color-primary)`, `padding: 12px 16px`, `font-family: monospace`, `color: #A5B4FC` |
| 앱 목업 | 최대 너비 `300px`, 그림자 `0 20px 60px rgba(0,0,0,0.4)`, 이미지 없을 시 placeholder |

#### 💡 개선 제안

> **기획서:** 좌측 텍스트 + 우측 목업 (고정)
> **개선안 1:** 모바일에서는 **목업 이미지를 텍스트 위에 배치**하여 시각적 임팩트를 먼저 주고, 스크롤 다운하면 기능 설명이 나오는 구조가 더 효과적입니다.
> **개선안 2:** 목업 이미지에 **미세한 floating 애니메이션** (Y축 10px 상하 반복, 6초 주기)을 적용하면 역동적인 느낌을 줄 수 있습니다.

---

### 섹션 4: 이용 가이드 (User Manual)

#### 레이아웃 구조

```
Desktop (lg+):
┌──────────────────────────────────────────────┐
│  [White BG #FFFFFF]                          │
│                                              │
│  이용 가이드                                  │
│                                              │
│  ┌─ 관리자 가이드 ──────┬─ 라이더 가이드 ────┐│
│  │                     │                    ││
│  │ ▶ 1단계: 지사 등록   │ ▶ 1단계: 앱 설치   ││
│  │   (펼침 내용...)     │   (펼침 내용...)   ││
│  │ ▶ 2단계: 차감금 관리  │ ▶ 2단계: 대시보드  ││
│  │ ▶ 3단계: 파일 업로드  │ ▶ 3단계: 출금 신청 ││
│  │ ▶ 4단계: 이체 다운    │                    ││
│  │                     │                    ││
│  └─────────────────────┴────────────────────┘│
└──────────────────────────────────────────────┘

Mobile:
┌─────────────────────┐
│  [탭: 관리자 | 라이더] │  ← 2단 → 탭 전환으로 변경
│  ▶ 1단계: ...        │
│  ▶ 2단계: ...        │
│  ▶ 3단계: ...        │
└─────────────────────┘
```

#### 아코디언 스펙

| 속성 | 값 |
|------|-----|
| 트리거 영역 | `padding: 16px 20px`, `cursor: pointer`, `display: flex`, `justify-content: space-between` |
| 트리거 텍스트 | `font-weight: 600`, `font-size: var(--text-body)` |
| 화살표 아이콘 | `ChevronDown` 16px, 펼침 시 180도 회전 (`transition: transform 200ms`) |
| 콘텐츠 영역 | `padding: 0 20px 16px`, `max-height` 트랜지션 또는 `grid-template-rows: 0fr → 1fr` |
| 구분선 | 각 아코디언 아이템 사이 `border-bottom: 1px solid #E5E7EB` |
| 열린 상태 | 좌측에 `border-left: 3px solid var(--color-primary)` 강조 |
| 동작 | **한 번에 하나만 열림** (exclusive) — 다른 항목 클릭 시 기존 항목 자동 닫힘 |

#### 컬럼 구조 (Desktop)

| 구분 | 관리자 (좌) | 라이더 (우) |
|------|-----------|-----------|
| 타이틀 | 🛠️ 관리자(Admin) | 📱 라이더(Rider) |
| 서브타이틀 | 빈틈없는 정산 관리 | 간편한 내역 조회 |
| 항목 수 | 4단계 | 3단계 |
| 카드 배경 | `#FFFFFF` with `var(--shadow-card)` | 동일 |
| 컬럼 간격 | `gap: 32px` | — |

#### 💡 개선 제안 (중요)

> **기획서:** Desktop에서 2-column 병렬 배치
> **개선안:** 모바일에서 2-column을 단순 세로 스택하면 **관리자 4개 + 라이더 3개 = 7개 아코디언이 연속**으로 나열되어 매우 길어집니다.
>
> **→ 모바일에서는 상단에 [관리자 | 라이더] 미니 탭을 추가**하여, 탭으로 전환하는 것이 UX상 훨씬 우수합니다. Desktop에서만 2-column 병렬을 유지합니다.

---

### 섹션 5: 요금제 & 프로모션 (Pricing)

#### 레이아웃 구조

```
┌──────────────────────────────────────────────┐
│  [Light BG #FAF9F5]                          │
│                                              │
│  부담 없는 시작, 파격적인 프로모션              │
│  초기 도입 부담을 줄여드려요...                 │
│                                              │
│  ┌─ 요금표 ────────────────────────────────┐ │
│  │ 서비스 구분 │ 정상가  │ 프로모션가  │ 비고 │ │
│  │ 사용료     │ ~100원~ │ 35원       │ ... │ │
│  │ 정산수수료  │ ~200원~ │ 100원      │ ... │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ┌─ 프로모션 배지 ─────────────────────────┐ │
│  │ 🎁 2주 무료 체험 │ 🏍️ 렌탈 제휴 혜택  │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ┌─ Type A (Basic) ─┐ ┌─ Type B (Premium) ┐ │
│  │  정산 관리만       │ │  익일 선지급 포함  │ │
│  │  사업자 유지       │ │  RIDY 이관 필요   │ │
│  │                   │ │  ⭐ RECOMMENDED   │ │
│  └───────────────────┘ └──────────────────┘ │
│                                              │
│  ⚠️ 안내: Type B는 사업자 이관 필요           │
│                                              │
└──────────────────────────────────────────────┘
```

#### 요금표 스펙

| 속성 | 값 |
|------|-----|
| 컨테이너 | `bg: white`, `border-radius: var(--radius-lg)`, `overflow: hidden`, `shadow: var(--shadow-card)` |
| 헤더 행 | `bg: #F3F4F6`, `font-weight: 600`, `padding: 12px 16px` |
| 정상가 | `text-decoration: line-through`, `color: var(--color-text-secondary)` |
| 프로모션가 | `font-weight: 700`, `color: var(--color-primary)`, `font-size: 1.125rem` |
| 할인 뱃지 | `bg: #FEF3C7`, `color: #92400E`, `font-size: 12px`, `padding: 2px 8px`, `border-radius: 999px` |
| 모바일 | 테이블 → **카드 형태로 변환** (각 서비스가 독립 카드) |

#### 도입 유형 카드

| 속성 | Type A (Basic) | Type B (Premium) |
|------|---------------|-----------------|
| 테두리 | `1px solid #E5E7EB` | `2px solid var(--color-primary)` |
| 배경 | `white` | `white` |
| 상단 뱃지 | `🅰️ Basic` (`bg: #F3F4F6`) | `🅱️ Premium` (`bg: #EEF0FF`, `color: var(--color-primary)`) |
| 추천 리본 | — | `RECOMMENDED` 뱃지 우상단 |
| 내용 구성 | 기능 목록 → 조건 → 추천 대상 | 동일 구조 |
| CTA (선택적) | — | 하단 "상담 신청하기" 링크 |

#### 💡 개선 제안

> **기획서:** 테이블 형태의 요금표
> **개선안 1:** 모바일에서 `<table>`은 가독성이 떨어집니다. **모바일에서는 각 요금 항목을 독립적인 카드(Pricing Card)로 변환**하는 것이 좋습니다.
>
> **개선안 2:** Type B 카드에 **미묘한 그라데이션 배경** (`linear-gradient(135deg, #EEF0FF, #FFFFFF)`)과 `scale(1.02)` 효과를 주어 시각적으로 "추천"임을 강조하면 전환율에 도움됩니다.
>
> **개선안 3 (FOMO 강화):** 프로모션 영역에 "현재 XX개 지사 도입 완료" 같은 **사회적 증거(Social Proof)** 텍스트를 추가하면 효과적입니다.

---

### 섹션 6: 도입 문의 (Contact Us & CTA)

#### 레이아웃 구조

```
Desktop:
┌──────────────────────────────────────────────┐
│                                              │
│  지금 바로, 간편한 정산 시스템을 경험하세요.     │
│                                              │
│  ┌─ 체크리스트 & CTA ──┬─ 고객 지원 정보 ───┐│
│  │                     │                    ││
│  │ ✅ 상담 전 준비사항   │ 📞 1588-9988      ││
│  │  □ 지사명/성명       │ 💬 @RIDY_Payout   ││
│  │  □ 연락처           │ 📧 support@...     ││
│  │  □ 플랫폼           │                    ││
│  │  □ 관심 유형         │ 운영시간 안내       ││
│  │                     │                    ││
│  │ [━━ 상담 신청서 작성하기 ━━]              ││
│  │        ↑ CTA Button (Tally Modal)        ││
│  └─────────────────────┴────────────────────┘│
│                                              │
└──────────────────────────────────────────────┘

Mobile:
┌─────────────────────┐
│ 헤드라인             │
│ 체크리스트            │
│ [상담 신청서 작성하기]  │  ← Full-width CTA
│ ─────────────────── │
│ 고객 지원 정보        │
│ 📞  💬  📧          │
└─────────────────────┘
```

#### CTA 버튼 스펙

| 속성 | 값 |
|------|-----|
| 배경 | `var(--color-primary)` |
| 텍스트 | `white`, `font-weight: 700`, `font-size: 1rem` |
| 패딩 | `16px 32px` |
| 라운드 | `var(--radius-md)` |
| 호버 | `background: var(--color-primary-dark)`, `transform: translateY(-2px)`, `shadow 강화` |
| 너비 | Desktop: `auto` (내용 기반), Mobile: `width: 100%` |
| 클릭 동작 | `data-tally-open="폼ID"` → Tally Modal 실행 |

#### 체크리스트 스펙

| 속성 | 값 |
|------|-----|
| 컨테이너 | `bg: #F9FAFB`, `border: 1px solid #E5E7EB`, `border-radius: var(--radius-md)`, `padding: 24px` |
| 체크 아이콘 | `□` → 순수 장식용 (인터랙티브 아님), `color: var(--color-text-secondary)` |
| 항목 간격 | `gap: 12px` |

#### Tally 모달 연동

```html
<!-- Tally Script (head 또는 body 끝) -->
<script async src="https://tally.so/widgets/embed.js"></script>

<!-- CTA 버튼 -->
<button
  data-tally-open="YOUR_FORM_ID"
  data-tally-layout="modal"
  data-tally-width="500"
  data-tally-align-left="1"
  data-tally-overlay="1"
  data-tally-emoji-text="📋"
  data-tally-emoji-animation="wave"
  data-tally-auto-close="3000"
>
  상담 신청서 작성하기
</button>

<!-- Tally 커스텀 CSS (모달 내부) -->
<!--
  Tally 폼 설정에서:
  - 배경: 흰색
  - 버튼 컬러: #4054E7
  - 폰트: 시스템 기본
-->
```

#### 고객 지원 정보

| 항목 | 아이콘 | 값 | 동작 |
|------|--------|-----|------|
| 전화 | Phone | 1588-9988 | `<a href="tel:1588-9988">` |
| 카카오톡 | MessageCircle (노란색) | @RIDY_Payout | 새 탭 열기 (`target="_blank"`) |
| 이메일 | Mail | support@ridy.co.kr | `<a href="mailto:...">` |
| 운영시간 | Clock | 평일 10:00 ~ 18:00 | 텍스트 표시 |

---

### Global: 모바일 Sticky Bar

#### 스펙

```
┌──────────────────────────────────────┐
│  [카톡 문의]  │  [도입 상담 신청]      │  ← 화면 하단 고정
└──────────────────────────────────────┘
```

| 속성 | 값 |
|------|-----|
| 노출 조건 | `md` 미만 (768px 이하)에서만 표시 |
| 위치 | `position: fixed`, `bottom: 0`, `left: 0`, `right: 0`, `z-index: 50` |
| 높이 | `60px` (+ `padding-bottom: env(safe-area-inset-bottom)` for iOS) |
| 배경 | `white`, `border-top: 1px solid #E5E7EB`, `box-shadow: 0 -4px 16px rgba(0,0,0,0.08)` |
| 좌측 버튼 (카톡) | `bg: #FAE100`, `color: #3C1E1E`, `width: 35%`, 카카오 아이콘 포함 |
| 우측 버튼 (상담) | `bg: var(--color-dark)`, `color: white`, `width: 65%`, Tally 모달 트리거 |
| body 패딩 | 모바일에서 `padding-bottom: 60px` 추가 (Sticky Bar에 콘텐츠 가리지 않도록) |

#### 💡 개선 제안

> **개선안:** Sticky Bar가 스크롤 초반(Hero 영역)에서는 숨겨져 있다가, 사용자가 섹션 2 이상으로 스크롤하면 **아래에서 슬라이드업**되며 나타나는 방식이 더 세련됩니다.
> `IntersectionObserver`로 Hero 섹션이 뷰포트에서 사라지는 시점을 감지하여 처리합니다.

---

## 3. 추가 인터랙션 & 애니메이션 정의

### 3-1. Scroll Reveal (전체 적용)

```
- 트리거: IntersectionObserver (threshold: 0.15)
- 효과: opacity 0→1, translateY(24px→0)
- Duration: 500ms
- Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)
- 순차 딜레이: 그리드 카드의 경우 각 카드마다 100ms 딜레이
```

### 3-2. 부드러운 스크롤 (Smooth Scroll)

```css
html { scroll-behavior: smooth; }
```

네비게이션 링크 클릭 시 해당 섹션으로 부드럽게 이동.

### 3-3. 탭 전환 애니메이션

```
- 방식: CSS transition 또는 Framer Motion AnimatePresence
- 나가는 콘텐츠: opacity 1→0 (150ms)
- 들어오는 콘텐츠: opacity 0→1 + translateY(8px→0) (200ms)
- 탭 인디케이터: sliding pill (translateX transition 300ms)
```

### 3-4. 아코디언 애니메이션

```css
/* CSS Grid 방식 (height: auto 문제 해결) */
.accordion-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 300ms ease;
}
.accordion-content.open {
  grid-template-rows: 1fr;
}
.accordion-content > div {
  overflow: hidden;
}
```

---

## 4. SEO & 퍼포먼스

| 항목 | 적용 사항 |
|------|----------|
| `<title>` | RIDY Payout — 배달 대행 정산 자동화 & 익일 출금 |
| `meta description` | 엑셀 업로드 한 번으로 정산 끝. 라이더 익일 출금까지. RIDY Payout으로 정산 업무를 자동화하세요. |
| OG Image | 1200×630px, 브랜드 블루 배경 + 핵심 카피 |
| Semantic HTML | `<header>`, `<main>`, `<section>`, `<footer>` 활용 |
| 이미지 | WebP 포맷, `loading="lazy"`, 적절한 `alt` 텍스트 |
| 폰트 | Pretendard 또는 SUIT (한글 최적화), `font-display: swap` |
| LCP 최적화 | Hero 배경은 CSS 색상이므로 빠름, 목업 이미지만 `priority` 로드 |

---

## 5. 컴포넌트 트리 (Component Tree)

```
<App>
├── <Head> (SEO meta, Tally script, font preload)
├── <main>
│   ├── <HeroSection>
│   │   ├── <Badge />
│   │   ├── <Headline />
│   │   ├── <SubCopy />
│   │   ├── <VisionBox />       ← Glassmorphism
│   │   └── <TargetTabs>
│   │       ├── <TabButton />    × 2
│   │       └── <TabContent />   × 2 (conditional render)
│   │
│   ├── <AdminFeaturesSection>
│   │   ├── <SectionHeader />
│   │   └── <FeatureGrid>
│   │       └── <FeatureCard />  × 4
│   │
│   ├── <RiderFeaturesSection>
│   │   ├── <SectionHeader />
│   │   ├── <FeatureList>
│   │   │   └── <FeatureItem />  × 3
│   │   └── <AppMockup />
│   │
│   ├── <UserGuideSection>
│   │   ├── <SectionHeader />
│   │   ├── <GuideTabs />        ← 모바일 전용
│   │   └── <GuideColumns>
│   │       ├── <AccordionGroup title="관리자">
│   │       │   └── <AccordionItem /> × 4
│   │       └── <AccordionGroup title="라이더">
│   │           └── <AccordionItem /> × 3
│   │
│   ├── <PricingSection>
│   │   ├── <SectionHeader />
│   │   ├── <PricingTable />     ← Desktop: table, Mobile: cards
│   │   ├── <PromoBadges />
│   │   ├── <TypeCards>
│   │   │   ├── <TypeCard type="A" />
│   │   │   └── <TypeCard type="B" recommended />
│   │   └── <TypeBNotice />      ← ⚠️ 안내 박스
│   │
│   └── <ContactSection>
│       ├── <SectionHeader />
│       ├── <ChecklistCard />
│       ├── <CTAButton />        ← Tally trigger
│       └── <SupportInfo />
│
├── <MobileStickyBar />          ← md 이하에서만 렌더
└── <TallyModalScript />
```

---

## 6. 종합 개선 제안 요약

| # | 영역 | 기획서 방식 | 개선안 | 효과 |
|---|------|-----------|--------|------|
| 1 | Hero 탭 | details/summary | **Sliding pill 탭 UI** | 더 직관적, 모던한 UX |
| 2 | 이용 가이드 (모바일) | 7개 아코디언 세로 나열 | **상단 탭 전환 + 아코디언** | 스크롤 피로 감소 |
| 3 | 요금표 (모바일) | HTML 테이블 | **독립 카드 형태 변환** | 가독성 대폭 향상 |
| 4 | Type 카드 | 동일 크기 | **Type B에 scale + gradient** | 추천 옵션 시각적 강조 |
| 5 | Sticky Bar | 항상 노출 | **Hero 통과 후 슬라이드업** | 초반 방해 요소 제거 |
| 6 | 카드 애니메이션 | 정적 | **Scroll Reveal + hover lift** | 인터랙티브 느낌 |
| 7 | 앱 목업 | 정적 이미지 | **Floating 애니메이션** | 시선 집중 효과 |
| 8 | 프로모션 | 할인 정보만 | **Social Proof 추가** | 신뢰도 & FOMO 강화 |
| 9 | 네비게이션 | 없음 | **상단 고정 미니 네비게이션** (섹션 앵커) | 긴 페이지 탐색 용이 |
| 10 | 폼 전환율 | CTA 1곳 | **섹션 2, 3 하단에도 미니 CTA** 배치 | 전환 기회 증가 |
