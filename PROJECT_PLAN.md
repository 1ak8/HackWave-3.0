# 🏆 Project Plan: Self-Healing Software Tests (HackWave 3.0)

## 📌 Executive Summary
Traditional end-to-end (E2E) testing frameworks (Playwright, Selenium, Cypress) are brittle. Minor UI updates—such as renamed attributes, CSS selector changes, or relocated elements—break test suites even when core business workflows remain intact.
**Self-Healing Software Tests** is an enterprise-grade automated testing suite that uses Intent-Based Reasoning and Large Language Models (LLMs) to detect failed selectors, deduce user intent, locate replacement elements in real time, and patch test workflows dynamically without failing builds. Crucially, it distinguishes between harmless UI shifts and genuine software regressions.

---

## 🛠️ Technology Stack
- **Frontend:** React.js (Vite), Tailwind CSS, Lucide Icons, Socket.io-client
- **Backend:** Node.js, Express.js, Socket.io (Real-time telemetry)
- **Database:** MongoDB (Mongoose ODM)
- **Browser Automation:** Playwright (Headless & Headed browser execution)
- **AI Engine:** Groq / OpenAI API (Semantic DOM element matching & root cause analysis)
- **Configuration:** Single root-level `.env` file for centralized secret management

---

## 📁 Repository Architecture

```text
HackWave-3.0/
├── PROJECT_PLAN.md                      # Permanent project architecture blueprint
├── .env                                 # Single root secrets & configs (Git ignored)
├── .env.example                         # Root ENV template
├── .gitignore
├── README.md
│
├── backend/
│   ├── package.json
│   ├── server.js                        # Loads root .env (dotenv path: '../.env')
│   └── src/
│       ├── config/
│       │   ├── db.js                    # MongoDB connection with retry logic
│       │   ├── aiConfig.js              # LLM client initialization (Groq / OpenAI)
│       │   └── socket.js                # Socket.io telemetry server
│       ├── models/
│       │   ├── TestCase.js              # Intent, steps, selectors, target URL
│       │   ├── TestRun.js               # Execution status, duration, logs
│       │   └── HealingLog.js            # Broken vs Healed selectors, confidence score, decision
│       ├── engine/
│       │   ├── playwrightRunner.js      # Browser orchestrator & step executor
│       │   ├── domExtractor.js          # Interactive DOM cleaner & context minifier
│       │   ├── aiHealer.js              # Semantic element matcher & classifier
│       │   └── testPatcher.js           # Auto-patcher for persisted test scripts
│       ├── controllers/
│       │   ├── testController.js        # CRUD operations for test cases
│       │   ├── runController.js         # Run triggers & execution status
│       │   └── reportController.js      # Audit trails, metrics & stats
│       ├── routes/
│       │   ├── testRoutes.js
│       │   ├── runRoutes.js
│       │   └── reportRoutes.js
│       └── utils/
│           ├── logger.js
│           └── errorHandler.js
│
└── frontend/
    ├── package.json
    ├── vite.config.js                   # Reads root .env directly (envDir: '../')
    ├── tailwind.config.js
    └── src/
        ├── api/
        │   ├── apiClient.js             # Axios instance
        │   └── socketClient.js          # Socket.io connection for live run logs
        ├── components/
        │   ├── common/                  # Navbar, Sidebar, Badges, Metrics cards
        │   ├── studio/                  # Intent input form, Step builder
        │   ├── runner/                  # Real-time execution logs & step progress
        │   └── inspector/               # Side-by-side selector diff & AI confidence card
        ├── pages/
        │   ├── Dashboard.jsx            # KPI cards, healing metrics, recent runs
        │   ├── TestStudio.jsx           # Natural language intent-to-test creator
        │   ├── LiveRunView.jsx          # Live interactive step-by-step runner
        │   ├── HealingReport.jsx        # Audit trail & detailed healing explanations
        │   └── DemoStore.jsx            # Built-in Target App (Toggle: Ver A / Ver B / Bug)
        └── context/
            └── TestContext.jsx
```

---

## 🧭 Step-by-Step Implementation Roadmap

### Phase 1: Foundation & Environment Configuration
- [ ] Initialize root `.gitignore`, `.env.example`, and `.env`.
- [ ] Initialize `backend/` with Express, Mongoose, Playwright, Socket.io, cors, and dotenv.
- [ ] Initialize `frontend/` with Vite (React), Tailwind CSS, Axios, and Lucide icons.
- [ ] Verify MongoDB Atlas connection & server health endpoint.

### Phase 2: Built-in Target Demo App (`/demo-store`)
- [ ] Develop realistic multi-step E-commerce workflow: Product catalog ➔ Cart ➔ Checkout Form ➔ Payment ➔ Confirmation.
- [ ] Implement instant 3-state switcher:
  - **Version A (Base):** Standard, expected selectors (`#checkout-btn`, `#email-field`).
  - **Version B (Mutated):** Altered IDs, relocated elements, changed CSS classes (`.btn-pay-now`), renamed button labels ("Complete Order").
  - **Bug Mode (Real Failure):** Button disabled or throwing server error to test AI failure classification.

### Phase 3: Data Schemas & Database Persistence (MongoDB)
- [ ] `TestCase` schema: intent string, target URL, step definitions, selectors.
- [ ] `TestRun` schema: status (`Passed`, `Failed`, `Healed`), execution time, run steps.
- [ ] `HealingLog` schema: original selector, healed selector, reasoning, confidence score, classification (`Harmless_UI_Change` vs `Genuine_Bug`).

### Phase 4: Playwright Runner & Real-Time Socket Stream
- [ ] Construct Playwright browser runner capable of headed/headless execution.
- [ ] Step-by-step execution listener streaming real-time status via Socket.io.
- [ ] Failure interceptor capturing DOM snapshots on element lookup failure instead of crashing.

### Phase 5: AI Self-Healing Engine (Core Innovation)
- [ ] `domExtractor`: Strip irrelevant nodes (scripts, svgs, styles) to create concise interactive DOM representation.
- [ ] `aiHealer`: LLM prompt combining user intent, broken selector, and DOM representation.
  - Return structure: Healed selector, confidence %, classification (`Harmless_UI_Change` vs `Genuine_Bug`), rationale.
- [ ] Resume browser action with the healed element and log changes.
- [ ] Update `TestCase` model to permanently heal the script for future runs.

### Phase 6: SaaS Dashboard & Visual Studio (Frontend)
- [ ] **Dashboard:** High-level metrics (Total Runs, Auto-Heal Success Rate, Developer Time Saved).
- [ ] **Test Studio:** Intent-to-test creation UI with step previews.
- [ ] **Live Execution Console:** Real-time log terminal with animated status indicators.
- [ ] **Visual Healing Inspector:** Visual diff viewer (Broken vs Healed selector), confidence meter, and AI rationale badge.

---

## 🚀 Advanced Capabilities (Post-MVP Enhancements)
- **Git PR Patch Generator:** Automatically generate Git diff / Pull Request proposing updated test code.
- **Visual Snapshot Comparison:** Before/after element screenshots.
- **Exportable Playwright Scripts:** Generate raw `.spec.js` files for CI/CD pipeline integration.
