# Foundingai.in — Autonomous Multi-Agent Corporate Architect & Execution Terminal

Foundingai.in (also known as the **OpenClaw Enterprise Suite**) is an advanced web-based multi-agent corporate simulation and workflow execution platform. It models entire businesses by generating domain-specific cognitive agents (e.g., Finance, Tech, Marketing, Ops, Legal), facilitating an adversarial multi-round strategy debate to resolve resource and timeline conflicts, scoring overall project viability, and providing live execution sandboxes (sprint boards, code editors, marketing generators, and local WhatsApp automation daemons).

---

## 📂 Recruiter Guide: Codebase Folder Separation

For recruiters and developers auditing this repository, here is a clean separation of the frontend, backend, core cognitive engine, and local background daemons:

```
Foundingai.frontend/
│
├── src/
│   ├── app/                      <─── FRONTEND LAYOUTS & BACKEND ENDPOINTS
│   │   ├── workspace/            <─── FRONTEND: Tab-based user interface components
│   │   └── api/                  <─── BACKEND: Next.js serverless route handlers
│   │
│   └── lib/                      <─── SHARED LOGIC, COGNITIVE BRAIN & STATE
│       ├── store.ts              <─── FRONTEND: Client state store (Zustand)
│       ├── types/                <─── TYPES: Shared data schemas (TypeScript)
│       └── engine/               <─── BACKEND/ENGINE: Core AI prompts & debate orchestration
│
└── clawdbot/                     <─── EXECUTION DAEMON: Background WhatsApp Playwright bot
```

### 1. 🎨 The Frontend (Client-Side Interface)
The client interface is designed for real-time responsiveness, offering rich visualizations of agent interaction, active code previews, and analytics:
* **Interactive Views & Tabs:** Located in [src/app/workspace/](file:///Users/ayushmishra/Foundingai.frontend/src/app/workspace/). Includes:
  * [TechBuildTab.tsx](file:///Users/ayushmishra/Foundingai.frontend/src/app/workspace/TechBuildTab.tsx) (interactive Next.js code sandbox and Vercel publisher).
  * [OpsAgentTab.tsx](file:///Users/ayushmishra/Foundingai.frontend/src/app/workspace/OpsAgentTab.tsx) (sprint backlog, kanban drag-and-drop, and dynamic SOP runner).
  * [MarketingTab.tsx](file:///Users/ayushmishra/Foundingai.frontend/src/app/workspace/MarketingTab.tsx) (content calendars, ad copy/creative editors, A/B performance graphs).
  * [FinanceTab.tsx](file:///Users/ayushmishra/Foundingai.frontend/src/app/workspace/FinanceTab.tsx) (burn/runway charts, cash flow simulator).
* **Global Client State:** Managed in [store.ts](file:///Users/ayushmishra/Foundingai.frontend/src/lib/store.ts) via **Zustand**. Coordinates workflow stages, streams agent messages, stores generated files, and handles user interactions.
* **Styling & Motion:** Leverages vanilla CSS custom variables for layout design, paired with **Framer Motion** for micro-animations and stream animations.

### 2. ⚡ The Backend (Serverless Routes)
Next.js serverless API routes act as the gateway, executing tasks and streaming real-time JSON events to the client:
* **SSE Debate API:** Located at `/api/debate` ([route.ts](file:///Users/ayushmishra/Foundingai.frontend/src/app/api/debate/route.ts)). Streams multi-turn agent arguments, consensus phases, and resolved conflicts directly to the UI reader.
* **Sandbox Tech APIs:** Located at `/api/tech/` ([route.ts](file:///Users/ayushmishra/Foundingai.frontend/src/app/api/tech/build/route.ts)). Orchestrates the file builder and code modifier engines, and deploys final codebases to Vercel via POST requests.
* **Task Automation API:** Located at `/api/ops` ([route.ts](file:///Users/ayushmishra/Foundingai.frontend/src/app/api/ops/route.ts)). Connects frontend console inputs to modular execution steps, logging details in the workflow history database.

### 3. 🧠 The Cognitive Engine (AI Core)
Operating inside the Next.js server runtime, these libraries contain the LLM orchestration logic:
* **Mistral API Adapter:** [claude-client.ts](file:///Users/ayushmishra/Foundingai.frontend/src/lib/engine/claude-client.ts) wraps the `@mistralai/mistralai` SDK, offering structured JSON parsing, auto-retries on empty responses, and strict token limits.
* **Prompt Synthesizer:** [prompt-synthesizer.ts](file:///Users/ayushmishra/Foundingai.frontend/src/lib/engine/prompt-synthesizer.ts) compiles persona guidelines, operational scopes, and industry boundaries into comprehensive prompts.
* **Orchestrator Debate Loop:** [debate-engine.ts](file:///Users/ayushmishra/Foundingai.frontend/src/lib/engine/debate-engine.ts) drives agent critiques, flags resource conflicts, and decides on project acceptance or revisions.
* **Viability Scorer:** [scoring.ts](file:///Users/ayushmishra/Foundingai.frontend/src/lib/engine/scoring.ts) calculates feasibility metrics on a 6-axis framework.

### 4. 🤖 The Execution Daemon (WhatsApp Automation)
* **Playwright Automation Bot:** Located in [clawdbot/](file:///Users/ayushmishra/Foundingai.frontend/clawdbot). Operates as a standalone background runner that connects to the server API, scans WhatsApp Web, and executes message broadcasts safely using anti-ban throttling.

---

## ⚙️ Core Architectural Pipeline

The system operates as a unified processing flow to convert a brief business proposal into a ready-to-run organization:

### 1. Intent Parsing & Complexity Scoring
* **Files:** [business-understanding.ts](file:///Users/ayushmishra/Foundingai.frontend/src/lib/engine/business-understanding.ts) | [scoring.ts](file:///Users/ayushmishra/Foundingai.frontend/src/lib/engine/scoring.ts)
* **Process:** The raw input is parsed using the Mistral LLM into a structured [BusinessProfile](file:///Users/ayushmishra/Foundingai.frontend/src/lib/types/index.ts#L2-L17) model. Once parsed, the `calculateComplexityScores` algorithm maps parameter dimensions:
  * **Finance Complexity:** Computed logarithmically based on numeric capital, stage, and scaling factors:
    $$\text{Finance Complexity} = \min\left(1, \frac{\log_{10}(\text{Capital})}{8} \times \text{Scale} \times \text{Growth Intent} \times 2.5\right)$$
  * **Marketing Complexity:** Driven by competitive density and scaling limits.
  * **Tech, Licensing, and Supply Complexities:** Directly driven by user-indicated dependency indexes.

### 2. Cognitive Agent Activation
* **File:** [agent-generator.ts](file:///Users/ayushmishra/Foundingai.frontend/src/lib/engine/agent-generator.ts)
* **Process:** Evaluates complexity scores against activation thresholds. If a score exceeds the threshold, the corresponding agent is spawned.
* **Activation Thresholds:**
  ```typescript
  const ACTIVATION_THRESHOLDS = {
      finance: 0.25,      // Active for almost all projects
      marketing: 0.30,
      tech: 0.40,
      licensing: 0.45,    // Highly regulated businesses only
      supply: 0.40,       // Required for physical infrastructure
      growth: 0.35,
      market_research: 0.30,
      launch: 0.30
  };
  ```
* **Sub-Agent Spawning:** If the `tech` complexity exceeds $0.75$, the Tech Architect automatically spawns three nested sub-agents:
  1. `Backend Systems Engineer` (CORE)
  2. `Frontend Experience Architect` (PIXEL)
  3. `DevOps & Infrastructure Lead` (FORGE)

### 3. Multi-Round Adversarial Debate
* **File:** [debate-engine.ts](file:///Users/ayushmishra/Foundingai.frontend/src/lib/engine/debate-engine.ts)
* **Process:** The debate resolves typical LLM hallucinations and alignment problems by pitting departments against each other:
  1. **Round 1 (Initial Proposal):** Active agents draft domain-specific strategies.
  2. **Round 2 (Cross-Critique):** Agents critique neighboring department plans. For example, the *Finance Director* flags the *Marketing Lead* if ad spend projections exceed total capital.
  3. **Round 3 (Orchestrator Verdict):** The Orchestrator (`ARIA`) analyzes the arguments, evaluates conflicts, and grades the viability matrix. If conflicts remain unresolved or scores fail to hit the threshold ($0.65$), it requests a revision.
  4. **Force Convergence:** To prevent infinite loops, the orchestrator overrides rejections and compiles the best-compromise strategy after $2$ revision cycles.

---

## 🤖 Deployed Agent Personas

| Agent Name | Icon | Department | Title | Theme Color |
| :--- | :---: | :--- | :--- | :--- |
| **ARIA** | 🎯 | Orchestrator | Strategic Orchestration Intelligence | `#A855F7` (Purple) |
| **MARCUS** | 💰 | Finance | Chief Financial Architect | `#10B981` (Green) |
| **NOVA** | 📢 | Marketing | Strategic Market Penetration Director | `#F59E0B` (Amber) |
| **PHOENIX** | 🚀 | Growth | Growth Acceleration Strategist | `#EC4899` (Pink) |
| **ORACLE** | 🔍 | Market Research | Market Intelligence Analyst | `#06B6D4` (Cyan) |
| **NEXUS** | ⚙️ | Tech | Technical Systems Architect | `#6366F1` (Indigo) |
| **SHIELD** | 🛡️ | Licensing | Regulatory & Compliance Director | `#EF4444` (Red) |
| **ATLAS** | 📦 | Supply | Supply Chain & Operations Director | `#8B5CF6` (Violet) |
| **IGNITE** | 🔥 | Launch | Go-To-Market Launch Commander | `#F97316` (Orange) |

---

## 💻 Detailed Workspace Features

Once the Orchestrator accepts a synthesized business model, founders can access the core operations console:

### 1. Operations Workspace (`OpsAgentTab.tsx`)
* **Kanban Backlog:** Drag-and-drop task tracking system mapping immediate, short-term, and long-term milestones.
* **Autonomous Task Executor:** Connects to the `/api/ops` endpoint. Founders type commands (e.g. *"Reconcile invoices"* or *"Draft an SOP for onboarding new vendors"*), which streams execution steps and outputs formatted Standard Operating Procedure documents.
* **Workflow Logs:** A persistent sidebar logging duration and details of executed automation tasks.

### 2. Tech Build Sandbox (`TechBuildTab.tsx`)
* **Dynamic Code Sandbox:** Renders generated websites based on the business profile.
* **Integrated File Tree & Editor:** Provides a browser-based, line-numbered source viewer for files like `index.html`, `styles.css`, and `script.js`.
* **Prompt-to-Edit Controller:** Connects to the `/api/tech/edit` endpoint. Founders type instructions (e.g., *"Change the theme to dark mode"* or *"Add a testimonials page"*), and the Tech Agent modifies the files and refreshes the sandbox.
* **Vercel Deployment:** A one-click compiler that uploads sandbox assets and generates a live public Vercel preview URL.

### 3. Marketing Creative Studio (`MarketingTab.tsx`)
* **AI Content Calendar:** Constructs a monthly marketing roadmap with time, channel, and platform attributes.
* **Copywriting Editor:** Edits headlines, body copy, and call-to-actions.
* **AI Image Generator:** Integrates with pollination/image generation wrappers. Inputting a prompt (e.g. *"Cyberpunk delivery boy"*) triggers the generation of custom visual assets, immediately injected as the flyer's background.
* **Analytics & A/B Dashboards:** Compares click-through rates (CTR), customer acquisition costs (CAC), and return on ad spend (ROAS) across variants.

### 4. Financial Planner (`FinanceTab.tsx`)
* **Runway Forecasts:** Simulates cash flow curves based on different marketing spends and inventory speeds.
* **Capital Distribution Charts:** Breaks down how funding is divided across tech, logistics, branding, and regulatory setup.
* **Unit Economics Calculator:** Computes break-even points, gross margins, and price optimization ratios.

---

## 🟢 Companion Agent: Clawdbot (WhatsApp Broadcast Daemon)

Found under the [/clawdbot](file:///Users/ayushmishra/Foundingai.frontend/clawdbot) directory, **Clawdbot** is a node-based background utility that connects to the Next.js server via Server-Sent Events (SSE), listening for automated campaign instructions and broadcasting them via WhatsApp Web.

```
                  ┌──────────────────────────────┐
                  │   Foundingai.in Dashboard    │
                  └──────────────┬───────────────┘
                                 │ SSE Stream
                                 ▼
                  ┌──────────────────────────────┐
                  │    Clawdbot Local Agent      │
                  └──────────────┬───────────────┘
                                 │ Playwright (Chromium)
                                 ▼
                  ┌──────────────────────────────┐
                  │        WhatsApp Web          │
                  └──────────────────────────────┘
```

### Installation & Run
```bash
# Navigate to the clawdbot subdirectory
cd clawdbot

# Install Playwright dependencies
npm install
npm run install-browser

# Start the agent
node agent.js
```

### Key Configurations (Security & Safety)
* **Session Cache:** WhatsApp credentials are encrypted and stored in `.wa-session/` so scanning the QR code is only needed on the first run.
* **Anti-Spam Controls:**
  * **Typing Simulation:** Generates variable delay rates (5-15s) matching average human keystroke speeds before sending messages.
  * **Throttling:** Caps delivery to $2-8$ messages/minute to prevent WhatsApp number suspensions.
  * **Retries:** Employs a $3$-attempt retry system utilizing exponential backoffs.

---

## 🚀 Installation & Local Development

### 1. Requirements
* Node.js (v18.0.0 or higher)
* NPM or PNPM package managers
* A valid Mistral AI API key (for agent simulation)

### 2. Configure Environment Variables
Create a [.env.local](file:///Users/ayushmishra/Foundingai.frontend/.env.local) file in the root workspace directory:
```env
MISTRAL_API_KEY=your_mistral_api_key_here
```

### 3. Install & Start Dev Server
```bash
# Install NPM packages
npm install

# Run the local server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the suite.

---

## 📦 Deployment Configuration

### Railway Integration
The workspace includes a [railway.json](file:///Users/ayushmishra/Foundingai.frontend/railway.json) file specifying build phases:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Vercel Deployment
Simply link the repository to your Vercel Dashboard. Next.js App Router configurations will compile automatically. Ensure that `MISTRAL_API_KEY` is configured under Vercel's Environment Variables.
