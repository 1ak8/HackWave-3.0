# ⚡ NexHeal — Intent-Aware Self-Healing E2E Testing Engine
> **HackWave** | Intent-Aware End-to-End Testing that Survives Interface Changes

![Build Status](https://img.shields.io/badge/Build-Passing-ea580c?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node%20%7C%20Playwright%20%7C%20MongoDB%20%7C%20AI-c2410c?style=for-the-badge)
![UI Design](https://img.shields.io/badge/Theme-Warm%20Terracotta%20%26%20Stone-ea580c?style=for-the-badge)
![Live Telemetry](https://img.shields.io/badge/Telemetry-Socket.io%20Live-16a34a?style=for-the-badge)

---

## 📌 The Problem
Traditional automated tests (Playwright, Selenium, Cypress) are notoriously brittle. A minor UI update—such as renaming a button from `"Add to Cart"` to `"Grab It!"`, altering an ID from `#btn-checkout` to `.btn-pay-now`, or relocating an input field—causes entire test suites to crash with cryptic timeout errors. Engineering teams spend up to **30-40% of their sprints repairing broken selectors** rather than catching real application regressions.

---

## 💡 The Solution: Autonomous Intent-Driven Testing
**NexHeal** shifts the testing paradigm from rigid CSS selector matching to **Autonomous User Intent Reasoning**. Tests are expressed as high-level user outcomes (`"Complete checkout for headphones with valid credit card"`). 

When UI redesigns occur, the engine:
1. Detects selector failure before crashing.
2. Extracts a lightweight semantic snapshot of interactive DOM candidates.
3. Invokes an AI Reasoning Engine to locate replacement elements in flight.
4. Distinguishes harmless cosmetic shifts from genuine software regressions (**Smart Triage**).
5. Resumes execution seamlessly and persists updated selectors for future runs.

---

## 🎯 3 Killer Hackathon Features

### 1. ⚡ Live Chaos Mode (Real-Time Mutation Demo)
- **Live Destruction & Real-Time Repair:** While a test is executing, you can dynamically mutate button labels, swap layout positions, and scramble CSS classes directly from the interactive control toolbar.
- The engine intercepts the changes mid-flight and auto-heals within milliseconds—proving live healing rather than a pre-baked static script.

### 2. 📊 Intent Graph (Visual Healing Animation)
- End-to-end tests are rendered as an interactive, real-time node state machine (`Select Product` ➔ `Open Cart` ➔ `Fill Address` ➔ `Authorize Payment`).
- Watch nodes transition dynamically:
  - 🟢 **Green:** Executing cleanly via baseline selector.
  - 🟡 **Pulsing Amber (Radar Ring):** AI Engine analyzing page context and healing replacement elements.
  - 🟢 **Emerald (Healed):** Action dispatched successfully with confidence score badge (e.g., 99%).
  - 🚨 **Crimson:** Genuine bug detected; execution halted to alert developers.

### 3. 🛡️ Smart Triage: Harmless Change vs. Genuine Bug
- Standard tools blindly attempt to click whatever is on screen. **AutoHeal Studio actually reasons:**
  - **Harmless UI Mutation:** Button renamed from `"Buy Now"` to `"Purchase"`. Flow intact ➔ Auto-heals and continues ✅.
  - **Genuine Application Failure:** Cart total unexpectedly drops to `$0.00`, or payment gateway throws an uncaught `500 Server Error`. AI recognizes this as a genuine regression ➔ **Halts execution and alerts developers** 🚨.

---

## 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   AUTOHEAL STUDIO (SaaS Frontend)                      │
│   • Dashboard & KPIs          • Intent Graph Visualizer (Framer)       │
│   • Visual Diff Inspector     • Built-in Target Sandbox (/demo-store)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Socket.io & REST
┌───────────────────────────────────▼────────────────────────────────────┐
│                  AUTONOMOUS CORE ENGINE (Backend)                      │
│                                                                        │
│   ┌─────────────────────┐               ┌──────────────────────────┐   │
│   │  Playwright Runner  │ ──on fail──>  │      domExtractor        │   │
│   │ (Headless / Headed) │               │  (Clean Interactive DOM) │   │
│   └──────────┬──────────┘               └────────────┬─────────────┘   │
│              │                                       │                 │
│              │ resume action                         ▼                 │
│              │                          ┌──────────────────────────┐   │
│              └───────────────────────── │       aiHealer           │   │
│                                         │ (Multi-Strategy Triage)  │   │
│                                         └──────────────────────────┘   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                    PERSISTENCE LAYER (Dual Mode)                       │
│    MongoDB Atlas (Primary)  ⇄  In-Memory Zero-Setup Engine (Fallback)   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Socket.io-client, Axios |
| **Backend** | Node.js, Express.js, Socket.io, Dotenv, Playwright Chromium Automation |
| **Persistence** | MongoDB (Mongoose) with instant In-Memory Fallback Engine |
| **AI Engine** | Groq / OpenAI LLM Integration + Semantic Multi-Strategy Heuristic Reasoner |
| **Configuration** | Centralized Single Root `.env` file |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- Git

### 2. Clone Repository
```bash
git clone https://github.com/1ak8/HackWave-3.0.git
cd HackWave-3.0
```

### 3. Environment Configuration
A single root `.env` manages both frontend and backend configurations:
```bash
cp .env.example .env
```
*(Default settings work out-of-the-box with zero API keys required for local heuristic demo!)*

### 4. Start the Application
In terminal 1 (Backend):
```bash
cd backend
npm install
npm run dev
```

In terminal 2 (Frontend):
```bash
cd frontend
npm install
npm run dev
```

Open your browser at: **[http://localhost:5173](http://localhost:5173)**

---

## 🎬 5-Minute Judge Demo Guide

1. **Step 1: Baseline Test (Version A)**
   - On the Dashboard, click **"Run Version A (Base)"**.
   - Navigate to `/live` to see all 6 nodes in the **Intent Graph** light up green within seconds.

2. **Step 2: Autonomous Auto-Healing (Version B)**
   - Click **"Run Version B (Auto-Heal)"**.
   - The UI buttons have different IDs, labels, and classes.
   - Watch the nodes turn **Pulsing Amber (Healing...)** and dynamically self-repair to **Emerald (Healed - 99% Confidence)**!
   - Click any healed node in the graph to inspect the side-by-side **Visual Diff Inspector**!

3. **Step 3: Live Chaos Mode**
   - Click **"Feature 1: Live Chaos Run"**.
   - Open the Target Store at `/demo-store` and toggle button text or shift layout in real-time.
   - Watch the AI adapt dynamically on the fly.

4. **Step 4: Smart Triage (Genuine Bug)**
   - Click **"Feature 3: Smart Triage Bug"**.
   - The simulated e-commerce cart experiences a critical pricing corruption ($0.00) and 500 error.
   - Notice the AI does **NOT** blindly heal: it halts the test, flags `Genuine_Bug`, and alerts the developer!
