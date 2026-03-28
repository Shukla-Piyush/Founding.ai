'use client';

import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

// ===== DATA =====
const AGENTS_DATA = [
  { name: 'Marcus', role: 'Finance Director', icon: '💰', color: '#3DBFA0', tasks: ['Reconciling Q3 ledger...', 'Drafting board report...', 'Scanning invoices (2,341)...', 'Forecasting runway...', 'Raising vendor invoice...'] },
  { name: 'Nova', role: 'Marketing Lead', icon: '📣', color: '#5BA8D4', tasks: ['Launching email campaign...', 'A/B testing ad copy...', 'Scheduling 14 posts...', 'Optimizing ad spend...', 'Generating SEO brief...'] },
  { name: 'Nexus', role: 'Tech Architect', icon: '⚡', color: '#40B5CC', tasks: ['Deploying hotfix v2.3...', 'Scanning for vulnerabilities...', 'Refactoring auth module...', 'Reviewing 6 PRs...', 'Optimizing DB queries...'] },
  { name: 'Oracle', role: 'Market Intel', icon: '🔍', color: '#D4A24F', tasks: ['Tracking competitor prices...', 'Scraping market signals...', 'Synthesizing 40 reports...', 'Updating trend model...', 'Alerting on anomaly...'] },
  { name: 'Atlas', role: 'Ops Director', icon: '🏗️', color: '#D470A0', tasks: ['Routing 18 support tickets...', 'Scheduling team standup...', 'Updating project tracker...', 'Escalating blocker...', 'Drafting SOP document...'] },
];

const LIVE_LOGS = [
  { agent: 'Marcus', color: '#3DBFA0', msg: 'Reconciled 3,241 transactions — variance: $0.00', type: '✅ DONE' },
  { agent: 'Nova', color: '#5BA8D4', msg: 'Campaign sent to 14,800 subscribers — open rate: 32%', type: '✅ DONE' },
  { agent: 'Nexus', color: '#40B5CC', msg: 'Hotfix deployed to production — latency -18ms', type: '🚀 DEPLOY' },
  { agent: 'Oracle', color: '#D4A24F', msg: 'Competitor dropped price by 12% — flagging for review', type: '⚠️ ALERT' },
  { agent: 'Atlas', color: '#D470A0', msg: '18 tickets routed to correct teams — avg response: 4min', type: '✅ DONE' },
  { agent: 'Marcus', color: '#3DBFA0', msg: 'Q3 board report generated — 24 slides, PDF exported', type: '📄 OUTPUT' },
  { agent: 'Nova', color: '#5BA8D4', msg: 'Ad spend reallocated — ROI improved 2.4×', type: '📈 OPTIMIZE' },
  { agent: 'Nexus', color: '#40B5CC', msg: 'Security scan complete — 0 critical vulnerabilities', type: '🔒 SECURE' },
  { agent: 'Oracle', color: '#D4A24F', msg: 'Market report synthesized — 3 new opportunities found', type: '📊 INSIGHT' },
  { agent: 'Atlas', color: '#D470A0', msg: 'Sprint plan drafted — 22 tasks assigned across 4 teams', type: '📋 PLAN' },
];

const STATIC_AGENTS = [
  { name: 'Finance Agent', icon: '💰', color: '#3DBFA0', gradient: 'linear-gradient(135deg, rgba(61,191,160,0.12), rgba(61,191,160,0.03))', border: '#3DBFA0',
    role: 'Financial Operations', desc: 'Monitors transactions, reconciles ledgers, forecasts runway, and auto-generates board-level financial reports.',
    capabilities: ['Invoice automation', 'Ledger reconciliation', 'Cash flow forecasting', 'Expense categorization', 'Tax preparation'],
    liveTask: 'Reconciling 3,241 transactions...' },
  { name: 'Marketing Agent', icon: '📣', color: '#5BA8D4', gradient: 'linear-gradient(135deg, rgba(91,168,212,0.12), rgba(91,168,212,0.03))', border: '#5BA8D4',
    role: 'Growth & Campaigns', desc: 'Runs email campaigns, A/B tests copy, optimizes ad spend, schedules content and tracks conversion metrics.',
    capabilities: ['Campaign management', 'A/B testing', 'Ad spend optimization', 'SEO brief generation', 'Social scheduling'],
    liveTask: 'Launching drip sequence to 14.8k leads...' },
  { name: 'Tech Agent', icon: '⚡', color: '#40B5CC', gradient: 'linear-gradient(135deg, rgba(64,181,204,0.12), rgba(64,181,204,0.03))', border: '#40B5CC',
    role: 'Engineering & DevOps', desc: 'Deploys code, reviews PRs, patches vulnerabilities, monitors latency, and manages technical debt autonomously.',
    capabilities: ['CI/CD automation', 'Security scanning', 'PR review & merge', 'Infra monitoring', 'Debt tracking'],
    liveTask: 'Deploying hotfix v2.3 to production...' },
  { name: 'Market Intel Agent', icon: '🔍', color: '#D4A24F', gradient: 'linear-gradient(135deg, rgba(212,162,79,0.12), rgba(212,162,79,0.03))', border: '#D4A24F',
    role: 'Competitive Intelligence', desc: 'Tracks competitor pricing, scrapes market signals, synthesizes analyst reports, and alerts on anomalies.',
    capabilities: ['Competitor tracking', 'Trend synthesis', 'Price monitoring', 'Analyst report parsing', 'Anomaly alerts'],
    liveTask: 'Scanning 40 competitor sites for price changes...' },
  { name: 'Operations Agent', icon: '🏗️', color: '#D470A0', gradient: 'linear-gradient(135deg, rgba(212,112,160,0.12), rgba(212,112,160,0.03))', border: '#D470A0',
    role: 'Ops & Project Management', desc: 'Routes tickets, manages sprints, drafts SOPs, coordinates teams, and eliminates operational bottlenecks.',
    capabilities: ['Ticket routing', 'Sprint planning', 'SOP creation', 'Team coordination', 'Backlog grooming'],
    liveTask: 'Drafting Q2 sprint plan for 4 teams...' },
  { name: 'HR Agent', icon: '👥', color: '#9482D4', gradient: 'linear-gradient(135deg, rgba(148,130,212,0.12), rgba(148,130,212,0.03))', border: '#9482D4',
    role: 'People & Talent', desc: 'Screens resumes, schedules interviews, onboards hires, tracks performance, and drafts HR policies automatically.',
    capabilities: ['Resume screening', 'Interview scheduling', 'Onboarding flows', 'Performance tracking', 'Policy drafting'],
    liveTask: 'Screening 87 applicants for senior roles...' },
];


const METRICS = [
  { label: 'Time Saved', value: '84%', detail: 'Average reduction in operational overhead per deployed agent.' },
  { label: 'Tasks Automated', value: '1.2M+', detail: 'Workflows executed seamlessly across our network last month.' },
  { label: 'Decision Speed', value: '< 2s', detail: 'From intent analysis to API execution across your stack.' },
];

const T = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const };
const FADE_UP = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-100px' }, transition: T };

// ===== LIVE AGENT DASHBOARD =====
function LiveAgentDashboard() {
  const [agentTasks, setAgentTasks] = useState(AGENTS_DATA.map(a => ({ ...a, currentTask: 0, progress: Math.random() * 80 + 10, status: 'running' as 'running' | 'done' })));
  const [logs, setLogs] = useState(LIVE_LOGS.slice(0, 3));
  const [taskCount, setTaskCount] = useState(1247832);
  const [logIndex, setLogIndex] = useState(3);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgentTasks(prev => prev.map(agent => {
        const nextTask = (agent.currentTask + 1) % agent.tasks.length;
        const newProgress = Math.random() * 70 + 20;
        return { ...agent, currentTask: nextTask, progress: newProgress };
      }));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgentTasks(prev => prev.map(a => ({
        ...a,
        progress: Math.min(100, a.progress + Math.random() * 8 + 2),
        status: a.progress > 95 ? 'done' : 'running',
      })));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const next = [...prev, LIVE_LOGS[logIndex % LIVE_LOGS.length]];
        return next.slice(-6);
      });
      setLogIndex(i => i + 1);
      setTaskCount(c => c + Math.floor(Math.random() * 3 + 1));
    }, 1800);
    return () => clearInterval(interval);
  }, [logIndex]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <section style={{ width: '100%', maxWidth: 1200, padding: '0 24px 160px' }}>
      <motion.div {...FADE_UP}>

        {/* Header label */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 4, border: '1px solid rgba(40, 114, 161, 0.3)', background: 'rgba(40, 114, 161, 0.08)', marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3DBFA0', display: 'inline-block', boxShadow: '0 0 8px #3DBFA0' }} />
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#3DBFA0', textTransform: 'uppercase', letterSpacing: 1 }}>Live Agent Network — {taskCount.toLocaleString()} tasks executed</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 600, letterSpacing: '-0.02em', color: '#EBF2F7', marginBottom: 12 }}>Your workforce, always on.</h2>
          <p style={{ fontSize: 16, color: 'var(--text-tertiary)', maxWidth: 520, margin: '0 auto' }}>Watch agents execute real work across your business — simultaneously, autonomously, right now.</p>
        </div>

        {/* Main dashboard grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>

          {/* ---- LEFT: Agent Cards ---- */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {agentTasks.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: 'rgba(203, 221, 233, 0.04)',
                  border: `1px solid ${agent.color}25`,
                  borderRadius: 8,
                  padding: '16px 20px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Glow sweep on active */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: `linear-gradient(90deg, transparent, ${agent.color}80, transparent)`,
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  {/* Pulse dot */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: `${agent.color}15`, border: `1px solid ${agent.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                      {agent.icon}
                    </div>
                    <div style={{ position: 'absolute', bottom: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: '#3DBFA0', border: '2px solid var(--bg-primary)', boxShadow: '0 0 6px #3DBFA0' }} />
                  </div>

                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: '#EBF2F7' }}>{agent.name}</span>
                      <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: agent.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>{agent.role}</span>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={agent.currentTask}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3 }}
                        style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        ▶ {agent.tasks[agent.currentTask]}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Task counter badge */}
                  <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: agent.color, background: `${agent.color}12`, padding: '3px 8px', borderRadius: 4, border: `1px solid ${agent.color}30`, flexShrink: 0 }}>
                    {Math.floor(agent.progress)}%
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ height: 3, background: 'rgba(203,221,233,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                  <motion.div
                    animate={{ width: `${agent.progress > 100 ? 20 : agent.progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{ height: '100%', background: `linear-gradient(90deg, ${agent.color}80, ${agent.color})`, borderRadius: 4, boxShadow: `0 0 8px ${agent.color}60` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* ---- RIGHT: Live Log Feed ---- */}
          <div style={{
            background: 'rgba(10, 22, 40, 0.6)',
            border: '1px solid rgba(203,221,233,0.08)',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* Log header */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(203,221,233,0.06)', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(203,221,233,0.03)' }}>
              <div style={{ display: 'flex', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#D46B82' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#D4A24F' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3DBFA0' }} />
              </div>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginLeft: 4 }}>agent-activity.log</span>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3DBFA0', boxShadow: '0 0 6px #3DBFA0', animation: 'pulse-ring 1.5s ease-out infinite' }} />
                <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#3DBFA0' }}>LIVE</span>
              </div>
            </div>

            {/* Log entries */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
              <AnimatePresence>
                {logs.map((log, i) => (
                  <motion.div
                    key={`${log.agent}-${i}`}
                    initial={{ opacity: 0, x: 10, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35 }}
                    style={{ padding: '10px 16px', borderBottom: '1px solid rgba(203,221,233,0.04)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: log.color, fontWeight: 700 }}>{log.agent}</span>
                      <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 3, background: `${log.color}15`, color: log.color, fontFamily: 'var(--font-mono)' }}>{log.type}</span>
                      <span style={{ fontSize: 9, color: 'var(--text-muted)', marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>just now</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(203,221,233,0.5)', lineHeight: 1.5, fontFamily: 'var(--font-mono)' }}>{log.msg}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={logsEndRef} />
            </div>

            {/* Bottom stats bar */}
            <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(203,221,233,0.06)', background: 'rgba(203,221,233,0.03)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>5 agents active</span>
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#3DBFA0' }}>↑ {taskCount.toLocaleString()} tasks done</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ===== ARCHITECTURE FLOWCHART =====
const ARCH_STEPS = [
  {
    id: 'input',
    icon: '📥',
    label: 'Business Input',
    shortDesc: 'You describe your business idea, goals, and constraints.',
    details: [
      'Natural language input — no forms, no templates',
      'Accepts industry, stage, budget, geography, target market',
      'Supports follow-up refinements and multi-turn context',
    ],
    color: '#5BA8D4',
  },
  {
    id: 'analysis',
    icon: '🧠',
    label: 'AI Business Analysis',
    shortDesc: 'Deep analysis extracts complexity scores and profiles your business.',
    details: [
      'Identifies industry vertical, business model, and regulatory landscape',
      'Generates complexity scores across 8 dimensions',
      'Creates a structured BusinessProfile used by all downstream agents',
    ],
    color: '#3DBFA0',
  },
  {
    id: 'agents',
    icon: '🤖',
    label: 'Agent Generation',
    shortDesc: 'Specialized AI agents are dynamically assembled for your business.',
    details: [
      'Agents spawned based on complexity scores — only relevant experts activate',
      'Each agent has domain-specific knowledge (Finance, Marketing, Tech, Legal, etc.)',
      'Agents are assigned roles, personas, and strategic objectives',
    ],
    color: '#D4A24F',
  },
  {
    id: 'debate',
    icon: '⚔️',
    label: 'Executive Debate',
    shortDesc: 'Agents debate strategy in real-time, challenging and refining each other.',
    details: [
      'Multi-round adversarial debate across all departments',
      'Cross-analysis: each agent reviews others\' proposals for conflicts',
      'Orchestrator resolves disputes, requests revisions, enforces constraints',
      'Live-streamed via SSE — watch the debate unfold in real-time',
    ],
    color: '#D46B82',
  },
  {
    id: 'synthesis',
    icon: '📊',
    label: 'Strategy Synthesis',
    shortDesc: 'Conflict-free strategy is compiled with viability scoring.',
    details: [
      'Viability score computed across 6 dimensions (financial, market, ops, regulatory, resources, risk)',
      'Executive summary, department-level action plans, and timeline generated',
      'Key risks identified and mitigation strategies proposed',
    ],
    color: '#9482D4',
  },
  {
    id: 'output',
    icon: '🚀',
    label: 'Actionable Output',
    shortDesc: 'Complete strategy with department plans, metrics, and next steps.',
    details: [
      'Exportable PDF reports for every department',
      'Dedicated tabs: Finance, Marketing, Tech Build, Growth, Supply Chain, etc.',
      'One-click deployment to specialized execution tools (Ops Agent, Tech Build)',
    ],
    color: '#40B5CC',
  },
];

function ArchitectureFlowchart() {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  return (
    <section id="architecture" style={{ width: '100%', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-primary)', borderBottom: '1px solid var(--border-primary)', padding: '120px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <motion.div {...FADE_UP} style={{ textAlign: 'center', marginBottom: 72 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 20, border: '1px solid rgba(40,114,161,0.25)', background: 'rgba(40,114,161,0.06)', marginBottom: 20 }}>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#2872A1', textTransform: 'uppercase', letterSpacing: 1.5 }}>System Architecture</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 16 }}>
            <span style={{ color: '#EBF2F7' }}>How </span>
            <span style={{ color: '#EBF2F7' }}>Founding</span>
            <span style={{ background: 'linear-gradient(135deg, #CBDDE9 0%, #2872A1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ai</span>
            <span style={{ color: 'rgba(203,221,233,0.5)', fontSize: 32 }}>.in</span>
            <span style={{ color: '#EBF2F7' }}> Works</span>
          </h2>
          <p style={{ fontSize: 18, color: 'var(--text-tertiary)', maxWidth: 620, margin: '0 auto', lineHeight: 1.7 }}>
            Click any stage to explore the pipeline. From a single prompt to a full business strategy — here is every step.
          </p>
        </motion.div>

        {/* ===== FLOWCHART ===== */}
        <div style={{ position: 'relative' }}>

          {/* Vertical connector line */}
          <div style={{
            position: 'absolute', left: 51, top: 0, bottom: 0, width: 2,
            background: 'linear-gradient(180deg, rgba(40,114,161,0.05), rgba(40,114,161,0.25) 15%, rgba(203,221,233,0.2) 50%, rgba(40,114,161,0.25) 85%, rgba(40,114,161,0.05))',
            zIndex: 0,
          }} />

          {/* Flow Nodes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
            {ARCH_STEPS.map((step, i) => {
              const isActive = activeStep === step.id;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ ...T, delay: i * 0.08 }}
                  style={{ display: 'flex', gap: 20, alignItems: 'flex-start', cursor: 'pointer' }}
                  onClick={() => setActiveStep(isActive ? null : step.id)}
                >
                  {/* Left: Node circle + connector */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 104, flexShrink: 0, paddingTop: 24 }}>
                    <motion.div
                      animate={{
                        scale: isActive ? 1.15 : 1,
                        boxShadow: isActive ? `0 0 24px ${step.color}60, 0 0 48px ${step.color}20` : `0 0 0px transparent`,
                      }}
                      transition={{ duration: 0.3 }}
                      style={{
                        width: 56, height: 56, borderRadius: 16,
                        background: isActive ? `${step.color}25` : 'rgba(13,27,46,0.9)',
                        border: `2px solid ${isActive ? step.color : step.color + '40'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 26, position: 'relative', zIndex: 2,
                        transition: 'background 0.3s, border-color 0.3s',
                      }}
                    >
                      {step.icon}
                      {/* Pulse ring when active */}
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0.6 }}
                          animate={{ scale: 2, opacity: 0 }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          style={{
                            position: 'absolute', inset: -4, borderRadius: 20,
                            border: `2px solid ${step.color}`,
                          }}
                        />
                      )}
                    </motion.div>
                    {/* Step number */}
                    <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: step.color, marginTop: 6, letterSpacing: 1 }}>STEP {String(i + 1).padStart(2, '0')}</div>
                  </div>

                  {/* Right: Content card */}
                  <motion.div
                    animate={{
                      borderColor: isActive ? step.color + '50' : 'rgba(203,221,233,0.08)',
                      background: isActive ? `linear-gradient(135deg, ${step.color}08, ${step.color}03)` : 'rgba(203,221,233,0.02)',
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      flex: 1,
                      border: '1px solid rgba(203,221,233,0.08)',
                      borderRadius: 16,
                      padding: '28px 32px',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Glow line top */}
                    <motion.div
                      animate={{ opacity: isActive ? 1 : 0 }}
                      style={{
                        position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
                        background: `linear-gradient(90deg, transparent, ${step.color}80, transparent)`,
                      }}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isActive ? 16 : 0 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#EBF2F7', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>{step.label}</h3>
                          <motion.div
                            animate={{ rotate: isActive ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ fontSize: 14, color: step.color, display: 'flex' }}
                          >
                            ▾
                          </motion.div>
                        </div>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.shortDesc}</p>
                      </div>

                      {/* Arrow connector to the right */}
                      {i < ARCH_STEPS.length - 1 && (
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          fontSize: 10, fontFamily: 'var(--font-mono)', color: 'rgba(203,221,233,0.25)',
                          flexShrink: 0, marginLeft: 16,
                        }}>
                          ↓ NEXT
                        </div>
                      )}
                    </div>

                    {/* Expandable details */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{
                            paddingTop: 16, borderTop: `1px solid ${step.color}20`,
                            display: 'flex', flexDirection: 'column', gap: 10,
                          }}>
                            {step.details.map((detail, di) => (
                              <motion.div
                                key={di}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: di * 0.07 }}
                                style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}
                              >
                                <div style={{
                                  width: 6, height: 6, borderRadius: '50%', background: step.color,
                                  boxShadow: `0 0 6px ${step.color}80`, marginTop: 7, flexShrink: 0,
                                }} />
                                <span style={{ fontSize: 13, color: 'rgba(203,221,233,0.65)', lineHeight: 1.6 }}>{detail}</span>
                              </motion.div>
                            ))}
                          </div>

                          {/* Tech badge */}
                          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                            {['Real-time', 'AI-Powered', 'Autonomous'].map(tag => (
                              <span key={tag} style={{
                                fontSize: 10, padding: '3px 10px', borderRadius: 20,
                                background: `${step.color}10`, border: `1px solid ${step.color}25`,
                                color: step.color, fontFamily: 'var(--font-mono)', letterSpacing: 0.5, textTransform: 'uppercase',
                              }}>{tag}</span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Final output glow */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
              marginTop: 48, textAlign: 'center',
              padding: '32px 40px', borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(40,114,161,0.08), rgba(203,221,233,0.04))',
              border: '1px solid rgba(40,114,161,0.2)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(40,114,161,0.5), transparent)' }} />
            <div style={{ fontSize: 32, marginBottom: 12 }}>✨</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#EBF2F7', fontFamily: 'var(--font-display)', marginBottom: 8 }}>Complete Business Strategy</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
              In under 3 minutes, you get a comprehensive, debate-refined strategy across every department — ready to execute.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null);
  const { scrollY } = useScroll();

  const bgY1 = useTransform(scrollY, [0, 1000], [0, 200]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Ambient Background Grid */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', perspective: '1000px' }}>
        <motion.div style={{
          position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
          backgroundImage: 'linear-gradient(rgba(203, 221, 233, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(203, 221, 233, 0.02) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          transform: 'rotateX(60deg) translateY(-100px)',
          y: bgY1
        }} />
      </div>

      {/* ===== NAVBAR ===== */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 40px', borderBottom: '1px solid var(--border-primary)',
        background: 'rgba(10, 22, 40, 0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/foundingai-logo.svg" alt="Foundingai.in logo" style={{ width: 44, height: 44, display: 'block' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>
            <span style={{ color: '#EBF2F7' }}>Founding</span><span style={{ background: 'linear-gradient(135deg, #CBDDE9 0%, #2872A1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ai</span><span style={{ color: 'rgba(203,221,233,0.45)', fontSize: 16 }}>.in</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#architecture" style={{ fontSize: 14, color: 'var(--text-tertiary)', textDecoration: 'none', transition: 'color 0.3s', fontWeight: 500 }} onMouseOver={e => e.currentTarget.style.color = '#EBF2F7'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-tertiary)'}>Architecture</a>
          <a href="#agents" style={{ fontSize: 14, color: 'var(--text-tertiary)', textDecoration: 'none', transition: 'color 0.3s', fontWeight: 500 }} onMouseOver={e => e.currentTarget.style.color = '#EBF2F7'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-tertiary)'}>Intelligence</a>
          <motion.button
            onClick={() => router.push('/workspace')}
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(40, 114, 161, 0.3)' }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}
            style={{
              padding: '10px 24px', borderRadius: 4, border: '1px solid rgba(40, 114, 161, 0.4)',
              background: 'rgba(40, 114, 161, 0.1)', color: '#CBDDE9', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Access Terminal
          </motion.button>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* ===== HERO ===== */}
        <section style={{ width: '100%', maxWidth: 1200, padding: '200px 24px 140px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 4, border: '1px solid var(--border-primary)', background: 'var(--bg-glass)', marginBottom: 32 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3DBFA0', boxShadow: '0 0 8px #3DBFA0' }} />
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>System Online</span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(56px, 7vw, 92px)', fontWeight: 500,
              lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: 32, maxWidth: 1000,
              background: 'linear-gradient(135deg, #EBF2F7 30%, #CBDDE9 60%, #2872A1 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Build companies that<br />run themselves.
            </h1>

            <p style={{ fontSize: 20, color: 'var(--text-tertiary)', lineHeight: 1.6, marginBottom: 56, maxWidth: 640, margin: '0 auto 56px' }}>
              Foundingai.in deploys intelligent agents that operate across your tools, workflows, and data — executing real work without manual effort.
            </p>

            <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
              <motion.button
                onClick={() => router.push('/workspace')}
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(40, 114, 161, 0.4)' }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.3 }}
                style={{
                  padding: '16px 36px', borderRadius: 4, border: 'none',
                  background: 'linear-gradient(135deg, #2872A1, #3A8FC4)', color: '#FFFFFF', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                  position: 'relative', overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(40, 114, 161, 0.35)',
                }}
              >
                Deploy your AI workforce
              </motion.button>
              <motion.button
                onClick={() => router.push('/workspace')}
                whileHover={{ background: 'rgba(40, 114, 161, 0.12)' }} transition={{ duration: 0.3 }}
                style={{
                  padding: '16px 36px', borderRadius: 4, border: '1px solid rgba(203, 221, 233, 0.2)',
                  background: 'transparent', color: '#CBDDE9', fontSize: 15, fontWeight: 500, cursor: 'pointer',
                }}
              >
                Watch agents execute
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* ===== LIVE AGENT DASHBOARD ===== */}
        <LiveAgentDashboard />

        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes spin { 100% { transform: rotate(360deg); } }
            @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(2.2); opacity: 0; } }
          `}} />

        {/* ===== AI WORKFORCE ===== */}
        <section id="agents" style={{ width: '100%', maxWidth: 1400, padding: '0 24px 160px' }}>
          <motion.div {...FADE_UP} style={{ marginBottom: 64, textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 20, border: '1px solid rgba(203,221,233,0.12)', background: 'rgba(203,221,233,0.04)', marginBottom: 20 }}>
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 1.5 }}>6 specialists deployed</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 20, background: 'linear-gradient(135deg, #EBF2F7, #CBDDE9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>The Cognitive Workforce</h2>
            <p style={{ fontSize: 18, color: 'var(--text-tertiary)', maxWidth: 580, margin: '0 auto', lineHeight: 1.7 }}>
              Six specialized agents running in parallel — each an expert in their domain, always available, never tired.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {STATIC_AGENTS.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ ...T, delay: i * 0.08 }}
                onMouseEnter={() => setHoveredAgent(i)}
                onMouseLeave={() => setHoveredAgent(null)}
                style={{
                  position: 'relative',
                  background: hoveredAgent === i ? agent.gradient.replace('0.03)', '0.08)').replace('0.12)', '0.2)') : agent.gradient,
                  border: `1px solid ${hoveredAgent === i ? agent.border + '60' : agent.border + '20'}`,
                  borderRadius: 16,
                  padding: '28px 28px 24px',
                  cursor: 'pointer',
                  transition: 'all 0.35s ease',
                  overflow: 'hidden',
                  boxShadow: hoveredAgent === i ? `0 8px 40px ${agent.color}18, inset 0 0 0 1px ${agent.color}30` : 'none',
                }}
              >
                {/* Top glow line */}
                <div style={{
                  position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
                  background: `linear-gradient(90deg, transparent, ${agent.color}${hoveredAgent === i ? 'cc' : '40'}, transparent)`,
                  transition: 'all 0.35s ease',
                }} />

                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {/* Icon box */}
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: `${agent.color}15`,
                      border: `1px solid ${agent.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 24,
                      boxShadow: hoveredAgent === i ? `0 0 20px ${agent.color}30` : 'none',
                      transition: 'box-shadow 0.3s',
                      position: 'relative',
                    }}>
                      {agent.icon}
                      {/* Active pulse dot */}
                      <div style={{
                        position: 'absolute', bottom: -3, right: -3,
                        width: 12, height: 12, borderRadius: '50%',
                        background: '#3DBFA0',
                        border: '2px solid #0D1B2E',
                        boxShadow: '0 0 8px #3DBFA0aa',
                      }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 700, color: '#EBF2F7', letterSpacing: '-0.01em', marginBottom: 3 }}>{agent.name}</div>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        fontSize: 10, fontFamily: 'var(--font-mono)',
                        color: agent.color, textTransform: 'uppercase', letterSpacing: 0.8,
                        padding: '2px 8px', borderRadius: 4,
                        background: `${agent.color}12`,
                        border: `1px solid ${agent.color}25`,
                      }}>
                        {agent.role}
                      </div>
                    </div>
                  </div>

                  {/* Status indicator */}
                  <motion.div
                    animate={{ opacity: hoveredAgent === i ? 1 : 0.5, scale: hoveredAgent === i ? 1 : 0.9 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: 'rgba(61,191,160,0.08)', border: '1px solid rgba(61,191,160,0.2)' }}
                  >
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#3DBFA0', boxShadow: '0 0 5px #3DBFA0' }} />
                    <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: '#3DBFA0', letterSpacing: 0.5 }}>ACTIVE</span>
                  </motion.div>
                </div>

                {/* Description */}
                <p style={{ fontSize: 13.5, color: 'rgba(203,221,233,0.55)', lineHeight: 1.7, marginBottom: 20 }}>{agent.desc}</p>

                {/* Capabilities */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                  {agent.capabilities.map((cap) => (
                    <span key={cap} style={{
                      fontSize: 11, padding: '4px 10px', borderRadius: 6,
                      background: `${agent.color}0d`,
                      border: `1px solid ${agent.color}20`,
                      color: 'rgba(203,221,233,0.5)',
                      fontFamily: 'var(--font-mono)',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={e => { e.currentTarget.style.color = agent.color; e.currentTarget.style.borderColor = `${agent.color}60`; e.currentTarget.style.background = `${agent.color}18`; }}
                    onMouseOut={e => { e.currentTarget.style.color = 'rgba(203,221,233,0.5)'; e.currentTarget.style.borderColor = `${agent.color}20`; e.currentTarget.style.background = `${agent.color}0d`; }}
                    >
                      {cap}
                    </span>
                  ))}
                </div>

                {/* Live task preview */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 14px', borderRadius: 8,
                  background: hoveredAgent === i ? 'rgba(10,22,40,0.5)' : 'rgba(10,22,40,0.3)',
                  border: `1px solid ${hoveredAgent === i ? agent.color + '30' : 'rgba(203,221,233,0.06)'}`,
                  transition: 'all 0.3s',
                  marginBottom: 18,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: agent.color, boxShadow: `0 0 6px ${agent.color}`, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'rgba(203,221,233,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>▶ {agent.liveTask}</span>
                </div>

                {/* CTA row */}
                <motion.div
                  animate={{ opacity: hoveredAgent === i ? 1 : 0, y: hoveredAgent === i ? 0 : 6 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600,
                    color: agent.color, fontFamily: 'var(--font-sans)',
                    padding: '7px 16px', borderRadius: 8,
                    background: `${agent.color}15`, border: `1px solid ${agent.color}35`,
                    cursor: 'pointer',
                  }}>
                    Deploy Agent →
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== ARCHITECTURE FLOWCHART ===== */}
        <ArchitectureFlowchart />

        {/* ===== METRICS ===== */}
        <section style={{ width: '100%', maxWidth: 1200, padding: '160px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
            {METRICS.map((metric, i) => (
              <motion.div key={metric.label} {...FADE_UP} transition={{ ...T, delay: i * 0.15 }} style={{
                padding: 40, borderLeft: '2px solid rgba(40, 114, 161, 0.3)',
              }}>
                <div style={{ fontSize: 56, fontFamily: 'var(--font-display)', fontWeight: 500, background: 'linear-gradient(135deg, #EBF2F7, #CBDDE9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 16 }}>{metric.value}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#CBDDE9', marginBottom: 12 }}>{metric.label}</div>
                <div style={{ fontSize: 14, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>{metric.detail}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== SECURITY ===== */}
        <section style={{ width: '100%', padding: '120px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-primary)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <motion.div {...FADE_UP}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 24, background: 'linear-gradient(135deg, #EBF2F7, #CBDDE9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Absolute Control.<br />Total Security.</h2>
              <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 40 }}>
                Trust is the prerequisite for autonomy. The execution engine enforces strict boundary constraints, complete transparency, and human-in-the-loop overrides.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {['Role-based permission schemas', 'Immutable execution audit logs', 'End-to-end encrypted action state', 'Mandatory human escalations'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, color: 'var(--text-secondary)', fontSize: 15 }}>
                    <div style={{ width: 4, height: 4, background: '#2872A1', borderRadius: 1, boxShadow: '0 0 6px rgba(40, 114, 161, 0.5)' }} />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...FADE_UP} transition={{ ...T, delay: 0.2 }} style={{
              background: 'var(--bg-primary)', padding: 40, border: '1px solid var(--border-primary)', position: 'relative'
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(40, 114, 161, 0.3), transparent)' }} />
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#CBDDE9', marginBottom: 32, textTransform: 'uppercase', letterSpacing: 2 }}>Security Telemetry</div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 24, borderBottom: '1px solid var(--border-secondary)', marginBottom: 24 }}>
                <div style={{ color: 'var(--text-secondary)' }}>Encryption Status</div>
                <div style={{ color: '#3DBFA0', fontWeight: 600 }}>Valid</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 24, borderBottom: '1px solid var(--border-secondary)', marginBottom: 24 }}>
                <div style={{ color: 'var(--text-secondary)' }}>Audit Log Stream</div>
                <div style={{ color: '#3DBFA0', fontWeight: 600 }}>Active</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ color: 'var(--text-secondary)' }}>Human Override</div>
                <div style={{ color: '#CBDDE9', fontWeight: 600 }}>Standby</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section style={{ width: '100%', padding: '160px 24px', textAlign: 'center', borderTop: '1px solid var(--border-primary)' }}>
          <motion.div {...FADE_UP} style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 500, letterSpacing: '-0.03em', marginBottom: 40, background: 'linear-gradient(135deg, #EBF2F7 30%, #CBDDE9 60%, #2872A1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Stop operating manually.</h2>
            <motion.button
              onClick={() => router.push('/workspace')}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.3 }}
              style={{
                padding: '16px 40px', borderRadius: 4, border: 'none',
                background: 'linear-gradient(135deg, #2872A1, #3A8FC4)', color: '#FFFFFF', fontSize: 16, fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(40, 114, 161, 0.35)',
              }}
            >
              Initialize System
            </motion.button>
          </motion.div>
        </section>

        {/* Footer */}
        <footer style={{ width: '100%', padding: '40px 48px', borderTop: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: 'var(--text-tertiary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/foundingai-logo.svg" alt="Foundingai.in" style={{ width: 22, height: 22, opacity: 0.7 }} />
            <span>© 2026 Foundingai.in. Autonomous execution layer.</span>
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#CBDDE9'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-tertiary)'}>Privacy</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#CBDDE9'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-tertiary)'}>Terms</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#CBDDE9'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-tertiary)'}>System Status</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
