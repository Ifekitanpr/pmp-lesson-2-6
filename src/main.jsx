import React, { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUpFromLine,
  Award,
  BookOpen,
  Check,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  Compass,
  Gauge,
  Handshake,
  Lightbulb,
  MapPinned,
  Menu,
  Network,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Volume2,
  VolumeX,
  Workflow,
  Wrench,
  X,
} from "lucide-react";
import "./styles.css";

function playTone(type = "tap", enabled = true) {
  if (!enabled || typeof window === "undefined") return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  const frequencies = type === "success" ? [660, 880] : [420];
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequencies[0], now);
  if (frequencies[1]) oscillator.frequency.setValueAtTime(frequencies[1], now + 0.08);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(type === "success" ? 0.045 : 0.025, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (type === "success" ? 0.18 : 0.09));
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + (type === "success" ? 0.2 : 0.1));
  oscillator.onended = () => context.close();
}

/* Every image below is used in exactly one place — no reuse — except Olivia's photo. */
const stockImages = {
  olivia: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80",
  judgement: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
  vocabulary: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80",
  change: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
  hierarchy: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  process: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
  dashboard: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  agile: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
  roadmap: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
  governance: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
  map: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  risk: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
};

/* One dedicated image per card, keyed by title — nothing is ever reused. */
const cardImages = {
  "The map, not a memory test": stockImages.judgement,
  "The vocabulary shift — Process Groups became Focus Areas": stockImages.vocabulary,
  "Domains are not phases — they run at the same time": stockImages.change,
  "A domain and a Focus Area are two independent axes": stockImages.hierarchy,
  "How to read an ITTO box — the right way": stockImages.process,
  "The most central artifact across all 40 processes": stockImages.dashboard,
  "ITTOs are illustrative — not a checklist": stockImages.agile,
  "Why 'Focus Areas' — not 'Process Groups'": stockImages.roadmap,
  "Governance — the only domain that spans all five focus areas": stockImages.governance,
  "How to use this map without being overwhelmed": stockImages.map,
  "The domain most candidates underestimate — Business Environment links": stockImages.risk,
};

function imageForCard(card) {
  return cardImages[card.title];
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.12 } } };

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.56, ease: [0.22, 1, 0.36, 1] } },
};

const swipeIn = {
  hidden: { opacity: 0, x: 42, filter: "blur(4px)" },
  show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] } },
};

const slideObject = {
  hidden: { opacity: 0, y: 34, scale: 0.985, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { delay: 0.52, duration: 0.62, ease: [0.22, 1, 0.36, 1] } },
};

const successUnlock = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 240, damping: 20 } },
};

const modalReveal = {
  hidden: { opacity: 0, y: 34, scale: 0.94, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { type: "spring", stiffness: 170, damping: 24, mass: 0.9 } },
  exit: { opacity: 0, y: 22, scale: 0.96, filter: "blur(6px)", transition: { duration: 0.24, ease: "easeIn" } },
};

/* ---------------------------------------------------------------- */
/* Content                                                            */
/* ---------------------------------------------------------------- */

const mindsetCards = [
  {
    title: "The map, not a memory test",
    preview: "PMBOK® 8 says the 40 processes and their ITTOs are illustrative — not prescriptive. The exam punishes rote memorisation and rewards understanding.",
    body: "PMBOK® 8 is explicit: the forty processes and their associated ITTOs are illustrative but not comprehensive — a technical description of common practice, not a methodology every project must follow.\n\nThe exam punishes candidates who try to memorise every input and output. It rewards candidates who know what a process is FOR and what it hands to the next one.\n\nYour job in this lesson is to build a navigable mental map — not to photograph a list.",
    exam: "When a scenario asks what to do next, understanding the purpose and output of a process will get you to the answer. A memorised ITTO list usually will not.",
    insight: "Olivia refuses to treat the forty processes as a memory test. She reads each one for what it is FOR and what it produces.",
  },
  {
    title: "The vocabulary shift — Process Groups became Focus Areas",
    preview: "PMBOK® 8 renamed Process Groups to Focus Areas for a reason. The rename changes how you read exam questions.",
    body: "What used to be called Process Groups — Initiating, Planning, Executing, Monitoring and Controlling, Closing — are now called Focus Areas.\n\nThe rename is deliberate. 'Process Group' suggested a stage you pass through once, in order. 'Focus Area' signals an enduring area of attention that recurs throughout the project.\n\nMonitoring and Controlling, in particular, loops back across the others continuously. In adaptive work, every focus area repeats each iteration.\n\nThe exam will test this. A scenario that treats focus areas as rigid sequential phases is almost always pointing to the wrong answer.",
    exam: "Rule out answers that treat the lifecycle as a one-way waterfall. In adaptive scenarios, the iterative, recurring answer is right.",
    insight: "Olivia clocks this immediately — she treats her control panel as a live dashboard, not a checklist of stages to tick off.",
  },
];

const domainItems = [
  {
    key: "GOVERNANCE",
    label: "Governance",
    count: "~9 processes",
    preview: "Framework, decisions & integration — spans all five focus areas",
    title: "Governance — Framework, Decisions & Integration",
    body: "Governance is the framework, functions, and processes that guide decisions to optimise value. It is holistic and integrative — it spans all five focus areas and integrates across all the other domains.\n\nFrom Initiate Project or Phase through to Close Project or Phase, Governance provides the oversight, decision rights, escalation paths, and change control that keep the project aligned to organisational strategy.\n\n~9 processes — the largest domain by process count.",
    exam: "If a scenario touches authorization, change approval, escalation, or strategic alignment — that is Governance.",
    insight: "When Finance asks Olivia about the app's burn rate, she reaches for Finance domain processes. When a cross-functional dispute needs a decision above her authority, she routes it through the Governance domain's escalation path.",
    icon: ShieldCheck,
  },
  {
    key: "SCOPE",
    label: "Scope",
    count: "~6 processes",
    preview: "The work and deliverables — what the project will produce and what it will not",
    title: "Scope — The Work and Deliverables",
    body: "Scope covers requirements and deliverables — what the project will produce and, equally important, what it will not.\n\nIts processes concentrate in Planning (collect requirements, define scope, create WBS) and Monitoring & Controlling (validate scope, control scope).\n\n~6 processes.",
    exam: "Scope creep questions belong here. 'The customer wants to add a new feature mid-project' — that is a Scope and Governance question.",
    insight: "When a stakeholder asks Olivia to add counter-ordering features to the loyalty app after the backlog was locked, that is a Scope conversation — with a Governance escalation if the change exceeds her threshold.",
    icon: ClipboardList,
  },
  {
    key: "SCHEDULE",
    label: "Schedule",
    count: "~3 processes",
    preview: "Sequencing and timing of the work",
    title: "Schedule — Sequencing and Timing",
    body: "Schedule covers the sequencing and timing of project work — activities, dependencies, durations, and the schedule baseline.\n\nIts planning processes build the schedule; its Monitoring & Controlling process (Control Schedule) tracks variance and triggers corrective action.\n\n~3 processes at domain level, with detailed sub-processes for activity definition and sequencing sitting underneath.",
    exam: "A slipping milestone is a Schedule and Governance question. The exam will ask what to do FIRST — usually assess the impact before escalating.",
    insight: "When the kitchen flags a delivery clash for the new café build, Olivia knows it lives in Schedule and Resources — not 'somewhere in the plan.'",
    icon: Gauge,
  },
  {
    key: "FINANCE",
    label: "Finance",
    count: "~4 processes",
    preview: "Cost, budget, and funding",
    title: "Finance — Cost, Budget, and Funding",
    body: "Finance covers cost estimation, budgeting, and financial control. PMBOK® 8 deliberately broadened this domain from 'Cost' to 'Finance' — signalling that the PM's responsibility extends to funding management and value tracking, not just cost tracking.\n\n~4 processes: Plan Cost Management, Estimate Costs, Determine Budget, Control Costs.\n\nFinance has strong connections to Governance (budget approval) and Scope (cost of changes).",
    exam: "An earned value question belongs here. The exam distinguishes cost variance from schedule variance — know which metric belongs to which domain.",
    insight: "When Finance asks Olivia about the app's burn rate, she reaches specifically for Finance domain processes — Estimate Costs and Monitor and Control Finances.",
    icon: CircleDollarSign,
  },
  {
    key: "STAKEHOLDERS",
    label: "Stakeholders",
    count: "~7 processes",
    preview: "Engagement and communication",
    title: "Stakeholders — Engagement and Communication",
    body: "Stakeholders covers how stakeholders are identified, engaged, and communicated with across the project lifecycle.\n\nIt spans all focus areas — from Identify Stakeholders in Initiating through to Monitor Stakeholder Engagement in closing.\n\n~7 processes. Note: Communications is no longer a standalone domain in PMBOK® 8 — it is folded into Stakeholders and Governance.",
    exam: "A scenario about a disengaged sponsor, a resistant department head, or a miscommunicated change belongs in Stakeholders. The principled answer almost always involves engaging before escalating.",
    insight: "Olivia's RACI chart and her steering committee meetings are governance mechanisms — but the day-to-day relationship management with kitchen managers, logistics heads, and the app vendor lives in Stakeholders.",
    icon: Handshake,
  },
  {
    key: "RESOURCES",
    label: "Resources",
    count: "~5 processes",
    preview: "People and physical resources",
    title: "Resources — People and Physical Resources",
    body: "Resources covers the acquisition, development, and management of people and physical assets needed to do the project work.\n\nIts processes include planning (Plan Resource Management, Estimate Activity Resources), execution (Acquire Resources, Develop Team, Manage Team), and control (Control Resources).\n\n~5 processes. Note: Procurement is no longer a standalone domain — strategic sourcing sits in Governance; detailed procurement processes moved to Appendix X4.",
    exam: "A team conflict question, a resource overallocation, or a team motivation issue belongs in Resources. The principled answer usually involves developing the team or removing barriers — not reassigning or escalating immediately.",
    insight: "Because Bloom Foods is largely functional, Olivia cannot simply command the people she needs. Her Resources work is heavily negotiation-driven — securing team members from functional managers and motivating a team she does not fully own.",
    icon: Users,
  },
  {
    key: "RISK",
    label: "Risk",
    count: "~6 processes",
    preview: "Threats and opportunities — both",
    title: "Risk — Threats and Opportunities",
    body: "Risk covers the identification, analysis, planning, implementation, and monitoring of both threats (negative risks) and opportunities (positive risks).\n\nIts processes concentrate heavily in Planning — Plan Risk Management, Identify Risks, Qualitative Analysis, Quantitative Analysis, Plan Risk Responses — with implementation and monitoring in Executing and Monitoring & Controlling.\n\n~6 processes.",
    exam: "A new regulation, a vendor dependency, or an unexpected market opportunity is a Risk question. The exam tests whether you recognize both threats AND opportunities — and whether your response is proactive or reactive.",
    insight: "When a surprise food-labelling regulation hits Bloom, Olivia flags it immediately as a Risk-domain item — and then traces its ripple into Scope (new labelling requirements) and Governance (compliance reporting).",
    icon: Target,
  },
];

const concurrentCards = [
  {
    title: "Domains are not phases — they run at the same time",
    preview: "A scenario that touches schedule, cost, and people at once is normal, not a trick.",
    body: "Performance domains run concurrently throughout the project life cycle, regardless of how value is delivered — frequently, periodically, or at the end.\n\nThey overlap and interconnect — they are not addressed as siloed efforts. A schedule change touches Resources (who is doing the work) and Finance (what it costs). A new risk reshapes Scope (what is deliverable) and Governance (who approves the response).\n\nThe specific ways the domains relate differ for every project environment — but all seven are always present.",
    exam: "A scenario where one event touches two or three domains simultaneously is not a trick question. It is normal. The principled answer addresses all affected domains — not just the most obvious one.",
    insight: "Olivia treats her one-page map as a live control panel. When the kitchen flags a delivery clash, she immediately checks Schedule AND Resources AND Governance (does this need escalation?) — not just schedule.",
  },
  {
    title: "A domain and a Focus Area are two independent axes",
    preview: "One domain spans multiple focus areas. One focus area draws from multiple domains.",
    body: "A performance domain is WHERE the work lives. A Focus Area is WHEN it happens. They are orthogonal — independent of each other.\n\nThe Schedule domain has work that happens during Planning (build and baseline the schedule), Executing and Monitoring & Controlling (analyse variance, re-forecast), and even Closing (final schedule reconciliation). One domain, multiple focus areas.\n\nConversely, the Planning Focus Area pulls work from almost every domain at once — you plan scope, schedule, finance, resources, risk, stakeholders, and governance simultaneously.\n\nGovernance is the only domain that explicitly spans all five focus areas — from Initiate Project or Phase to Close Project or Phase — because it integrates and steers everything else toward value.",
    exam: "The exam probes whether you understand that a single process sits at the intersection of one domain and one focus area. Governance × Initiating = Initiate Project or Phase. Schedule × Monitoring & Controlling = Control Schedule.",
  },
];

const ittoCards = [
  {
    title: "How to read an ITTO box — the right way",
    preview: "Read it as a sentence. The chain is what the exam tests — not the list.",
    body: "Inputs are what the process needs to start — a charter, existing plans, data, enterprise environmental factors, organisational process assets.\n\nTools & Techniques are how the work gets done — expert judgment, estimating methods, data analysis, meetings.\n\nOutputs are what the process produces — a plan, a baseline, a register, an updated artifact.\n\nRead it as a sentence: 'Take these inputs, apply these tools, produce this output.' One process's output is almost always an input to the next — that flow is how the whole project chains together.",
    exam: "The exam rarely asks you to recite an ITTO. It asks: which input is missing before you can do this? Which tool produces this output? You received this output — what do you do next? The chain answers all three.",
    insight: "Olivia reads each process for what it is FOR and what it produces — not as a list of inputs and outputs to recite.",
  },
  {
    title: "The most central artifact across all 40 processes",
    preview: "One artifact appears as an input to virtually every Executing, M&C, and Closing process.",
    body: "The project management plan is an input to virtually every Executing, Monitoring & Controlling, and Closing process.\n\nIt is the integrated baseline — the document that consolidates all subsidiary plans (scope management plan, schedule baseline, cost baseline, risk management plan, and more) into one coherent guide for how the project will be executed, monitored, and controlled.\n\nIf a scenario asks what the PM should consult, reference, or update — the project management plan is almost always part of the answer.",
    exam: "Whenever a question feels ambiguous about what to do next, ask: what does the project management plan say? That instinct is almost always directionally correct.",
  },
  {
    title: "ITTOs are illustrative — not a checklist",
    preview: "PMBOK® 8 says so explicitly. The exam punishes rote memorisation and rewards reasoning.",
    body: "PMBOK® 8 states clearly that the processes and their associated ITTOs are illustrative but not comprehensive — a technical description of common practice, not a prescription for every project.\n\nThis has a direct consequence for how you study. Memorising long ITTO lists is low-value effort on the 2026 exam. Understanding what a process consumes, what it does, and what it produces is high-value effort.\n\nAsk for each process: what does it need to start? What technique does the real work? What does it hand to the next process? Understand that chain and you can reason your way through scenarios you have never seen.",
    exam: "Memorising the lists = low value. Understanding the dependencies = high value. The exam tests the logic of the chain.",
  },
];

const focusAreas5 = [
  ["Initiating", "Start the project or phase", Play],
  ["Planning", "Define how to get there", MapPinned],
  ["Executing", "Do the work", Workflow],
  ["Monitoring & Controlling", "Track, review, regulate", Gauge],
  ["Closing", "Formally complete", Check],
];

const focusAreaMiniCards = [
  {
    title: "Why 'Focus Areas' — not 'Process Groups'",
    preview: "The rename signals that these are recurring areas of attention, not phases you finish and move past.",
    body: "'Process Group' suggested a stage you pass through once, in order — a one-way waterfall progression.\n\n'Focus Area' signals an enduring area of attention that recurs throughout the project. You initiate once — but you re-plan every iteration in adaptive work. You execute while monitoring. Monitoring & Controlling loops back across the others continuously.\n\nIn agile work, every focus area repeats each sprint. Initiating the sprint. Planning the sprint. Executing the sprint work. Monitoring & Controlling progress. Closing the sprint with a retrospective.\n\nThe exam builds on this mindset shift. A scenario that places Planning work mid-delivery is testing whether you understand that focus areas recur — not whether you think Planning happened weeks ago and is finished.",
    exam: "Rule out any answer that treats focus areas as rigid sequential stages. In adaptive scenarios, every focus area repeats each iteration. Monitoring & Controlling is always happening — not just at the end.",
    insight: "Olivia notices this immediately — her control panel is a live dashboard, not a sequence of stages to tick off.",
  },
  {
    title: "Governance — the only domain that spans all five focus areas",
    preview: "From Initiate Project or Phase to Close Project or Phase, Governance integrates and steers everything.",
    body: "Governance is the only performance domain with processes in every focus area — Initiating, Planning, Executing, Monitoring & Controlling, and Closing.\n\nInitiating: Initiate Project or Phase — authorizes the project and names the PM.\nPlanning: Develop Project Management Plan — the central integration process.\nExecuting: Direct & Manage Project Work — the central execution process.\nMonitoring & Controlling: Monitor & Control Project Work, Perform Integrated Change Control.\nClosing: Close Project or Phase — formally completes the work and captures lessons learned.\n\nBecause governance integrates and steers all other domains toward value, it is present from the first day to the last.",
    exam: "Any scenario about authorization, change control, project direction, or formal closure belongs in Governance — regardless of which focus area the scenario is set in.",
  },
];

const fullMapCards = [
  {
    title: "How to use this map without being overwhelmed",
    preview: "You don't need to memorise it. You need to navigate it.",
    body: "The process map is not a memorisation target. It is a navigation tool.\n\nWhen a later lesson covers a specific process — say, Develop Schedule — glance at the map and locate it: Schedule domain, Planning focus area. That placement tells you WHEN it happens and WHERE it lives. That context is what the exam tests.\n\nWhen a scenario describes an event — a missed milestone, a stakeholder complaint, a cost overrun — ask which domain it belongs to and which focus area you are in. Those two answers narrow your options dramatically.\n\nGovernance spans all five focus areas because it integrates and steers everything else. When in doubt about which domain an issue belongs to, ask: does this require a decision, approval, or escalation? If yes — Governance is involved.",
    exam: "The exam does not ask you to recite the process map. It describes a situation and tests whether you know which domain the work belongs to — and what the principled next action is.",
  },
  {
    title: "The domain most candidates underestimate — Business Environment links",
    preview: "Governance, Risk, and Stakeholders have the strongest connections to the ECO's Business Environment domain.",
    body: "The ECO's Business Environment domain (26% of the exam, tripled from 2021) maps most directly to three PMBOK® 8 performance domains: Governance, Risk, and Stakeholders.\n\nGovernance — strategic alignment, compliance, change control, escalation, project charter, and project management plan all live here.\nRisk — the entire risk management process family sits in this domain, from identification through monitoring.\nStakeholders — governance and compliance decisions always involve stakeholders who must be engaged, informed, or consulted.\n\nA scenario about regulatory compliance, organizational change, or governance structure is a Business Environment × Governance scenario. Knowing this cross-reference cuts through exam ambiguity.",
    exam: "Business Environment is now 26% of the exam. Governance is the domain most connected to it. When a scenario feels like it is about the organization around the project — not just the project itself — Governance is almost certainly the right domain.",
  },
];

const fullMapRows = [
  ["Governance (~9)", "Initiate Project or Phase · Identify & Engage Stakeholders (initial)", "Develop Project Management Plan · Plan Stakeholder Engagement", "Direct & Manage Project Work · Manage Stakeholder Engagement", "Monitor & Control Project Work · Perform Integrated Change Control · Monitor Stakeholder Engagement", "Close Project or Phase"],
  ["Scope (~6)", "—", "Plan Scope Management · Collect Requirements · Define Scope · Create WBS", "—", "Validate Scope · Control Scope", "—"],
  ["Schedule (~3)", "—", "Plan Schedule Management · Define Activities · Sequence Activities · Estimate Activity Durations · Develop Schedule", "—", "Control Schedule", "—"],
  ["Finance (~4)", "—", "Plan Cost Management · Estimate Costs · Determine Budget", "—", "Control Costs", "—"],
  ["Stakeholders (~7)", "Identify Stakeholders", "Plan Stakeholder Engagement", "Manage Stakeholder Engagement", "Monitor Stakeholder Engagement", "—"],
  ["Resources (~5)", "—", "Plan Resource Management · Estimate Activity Resources", "Acquire Resources · Develop Team · Manage Team", "Control Resources", "—"],
  ["Risk (~6)", "—", "Plan Risk Management · Identify Risks · Perform Qualitative Risk Analysis · Perform Quantitative Risk Analysis · Plan Risk Responses", "Implement Risk Responses", "Monitor Risks", "—"],
];

const lessonBuiltRows = [
  ["2.1 — What Is a Project?", "The precise definition of a project, program, portfolio, and operations", "Foundation — why the work exists"],
  ["2.2 — Six Principles", "The mindset and decision compass — the WHY", "Principles layer"],
  ["2.3 — Value Delivery", "How strategy becomes execution, outputs become outcomes, benefits become value", "Value layer — the point of everything"],
  ["2.4 — Structures & Governance", "How the organization shapes PM authority, governance mechanisms, escalation", "Governance domain + organizational context"],
  ["2.5 — Development Approaches", "How to match predictive, agile, or hybrid to the work", "Tailoring — runs through every domain"],
  ["2.6 — Domains & Processes", "The complete operating map — seven domains, forty processes, five focus areas", "Domains + Processes layers"],
];

const stackLayers = [
  [Compass, "6 Principles", "The WHY — the mindset (Lesson 2.2)"],
  [Network, "7 Performance Domains", "The WHAT — Governance · Scope · Schedule · Finance · Stakeholders · Resources · Risk (Lesson 2.6)"],
  [Workflow, "40 Processes (ITTOs)", "The HOW — illustrative samples of project work (Lesson 2.6)"],
  [Sparkles, "Value", "The POINT — why every principle, domain, and process exists"],
];

const sections = [
  {
    eyebrow: "Lesson Overview",
    title: "Lesson Overview",
    heading: "The Seven Performance Domains & the 40 Processes",
    subtitle: "The capstone lesson of Module 2. Everything you have built — what a project is, the six principles, value delivery, structure and governance, development approaches — now gets its operating map: the seven performance domains and the forty processes that describe the mechanics of project execution.",
    cards: [
      {
        title: "What You'll Learn",
        points: [
          "Name the seven performance domains and state what each one manages.",
          "Explain why performance domains run concurrently and interconnect — never as sequential phases.",
          "Describe the 40 processes at a high level and locate each within its domain and focus area.",
          "Read a process through its ITTO anatomy — and adopt the mindset that ITTOs are illustrative, not a memorisation target.",
          "Explain the five Focus Areas and why PMBOK® 8 renamed the Process Groups.",
          "Connect principles, domains, processes, and value into one coherent mental model for the rest of the course.",
        ],
      },
    ],
    anchor: "Start Section 1 — The Right Mindset Shift.",
  },
  {
    eyebrow: "Section 1",
    title: "The Right Mindset Shift",
    subtitle: "If the six principles are the mindset — the WHY — then the performance domains are the mechanics — the WHAT TO MANAGE. And the forty processes are the HOW. Two ideas to lock in before the map makes full sense.",
    type: "modal",
    cards: mindsetCards,
    anchor: "Seven domains = the WHAT TO MANAGE. Forty processes = the HOW — illustrative, not prescriptive. Five Focus Areas = the WHEN — recurring areas of attention, not rigid phases. All of it exists to deliver VALUE.",
  },
  {
    eyebrow: "Section 2",
    title: "The Seven Performance Domains",
    subtitle: "PMBOK® 8 defines seven performance domains — the complete surface area a project manager attends to. Each is a coherent area of project work with its own processes, and every one exists to deliver value.",
    type: "domain-figure",
    anchor: "Seven performance domains, one page: Governance · Scope · Schedule · Finance · Stakeholders · Resources · Risk — all running concurrently, all in service of Value.",
  },
  {
    eyebrow: "Section 2",
    title: "Explore the Seven Domains",
    subtitle: "Now click through each domain to see what it manages, its process count, and the exam angle.",
    type: "domains",
    cards: domainItems,
    anchor: "Seven domains: Governance · Scope · Schedule · Finance · Stakeholders · Resources · Risk. Mnemonic: 'Great Scope Sets Firm Stakeholder Resource Risk.' Every domain exists to deliver value — none of them are ends in themselves.",
  },
  {
    eyebrow: "Section 3",
    title: "Domains Run Concurrently",
    subtitle: "This is the most important conceptual point in this lesson — and a favourite exam trap. Performance domains are not sequential phases you complete one at a time.",
    type: "modal",
    cards: concurrentCards,
    anchor: "Domains are not phases. They run at the same time and overlap all project long. Treat them as a live dashboard — not a sequence of stages. Governance is the only domain that spans all five focus areas.",
  },
  {
    eyebrow: "Section 4",
    title: "40 Processes & ITTOs",
    subtitle: "PMBOK® 8 presents 40 processes to describe the mechanics of each domain. Each is expressed as an ITTO — Inputs, Tools & Techniques, Outputs. Here is how to read them without drowning in them.",
    type: "itto",
    cards: ittoCards,
    anchor: "Read every process left to right: inputs (what it needs) → tools & techniques (how) → outputs (what it makes). One output feeds the next process. PMBOK® 8 says ITTOs are illustrative — study purpose and outputs, not rote lists.",
  },
  {
    eyebrow: "Section 5",
    title: "Five Focus Areas",
    subtitle: "PMBOK® 8 organises the 40 processes across five Focus Areas. The names are familiar — because they are the renamed Process Groups from earlier editions. The rename is not cosmetic.",
    type: "focus-row",
    cards: focusAreaMiniCards,
    anchor: "Five Focus Areas = Initiating → Planning → Executing → Monitoring & Controlling → Closing. They are recurring areas of attention — not a one-way sequence. Monitoring & Controlling loops back constantly. In agile, every focus area repeats each iteration. Governance spans all five.",
  },
  {
    eyebrow: "Section 6",
    title: "The Full Map",
    subtitle: "Every process sits at the intersection of one domain (WHERE) and one focus area (WHEN). Read down a column to see what you focus on at a particular stage. Read across a row to see how a single domain plays out from start to finish.",
    type: "fullmap-table",
    anchor: "Every process = one domain (WHERE) × one focus area (WHEN). Read the map to navigate, not to memorise.",
  },
  {
    eyebrow: "Section 6",
    title: "Full Map — Key Takeaways",
    subtitle: "Two things to keep in mind whenever you use the process map — how to navigate it, and the ECO connection most candidates miss.",
    type: "modal",
    cardLayout: "grid",
    cards: fullMapCards,
    anchor: "Governance is the only domain spanning all five focus areas. Business Environment ECO domain links most strongly to Governance, Risk, and Stakeholders.",
  },
  {
    eyebrow: "Section 7",
    title: "The Module 2 Stack",
    subtitle: "Step back and the architecture is clean. Principles → Domains → Processes → Value. Every future lesson in this course is a zoom-in on one box of this picture.",
    type: "stack",
    anchor: "THE STACK: Principles (why) → Domains (what) → Processes (how) → Value (the point). Every future lesson is a zoom-in on one domain.",
  },
  {
    eyebrow: "Section 7",
    title: "What Each Lesson Built",
    subtitle: "Olivia's one-page control panel is, in effect, the table of contents for everything that follows. Here's what each Module 2 lesson contributed to it.",
    type: "lessons-table",
    anchor: "From here, the rest of the course simply zooms in — each later module takes one domain and works through its processes, tools, and exam patterns in depth.",
  },
  {
    eyebrow: "Section 7",
    title: "Exam Lens & Reference",
    subtitle: "Use this page as your orientation map whenever a later lesson feels dense.",
    type: "exam-reference",
    anchor: "End of Lesson 2.6 · End of Module 2.",
  },
];

const lessonList = sections.map((section) => section.title);

/* ---------------------------------------------------------------- */
/* Shared shell (topbar, progress, outline) — identical to 1.6       */
/* ---------------------------------------------------------------- */

function ProgressDot({ state = "idle" }) {
  return (
    <span className={`progress-dot ${state}`} aria-hidden="true">
      {state === "done" ? <Check size={10} strokeWidth={3} /> : <span />}
    </span>
  );
}

function TopBar({ soundOn, onToggleSound }) {
  const dots = Array.from({ length: 19 }, (_, index) =>
    index < 6 ? "done" : index === 6 ? "active" : "idle",
  );

  return (
    <header className="topbar">
      <button className="course-select" type="button" aria-label="Select certificate">
        <Award size={24} />
        <span>PMP Project Management Professional</span>
        <ChevronDown size={20} />
      </button>

      <div className="module-progress" aria-label="Course progress">
        <div>{dots.slice(0, 10).map((state, index) => <ProgressDot key={index} state={state} />)}</div>
        <div>{dots.slice(10).map((state, index) => <ProgressDot key={index + 10} state={state} />)}</div>
      </div>

      <div className="top-actions">
        <button className="ghost-button" type="button" onClick={onToggleSound} aria-pressed={soundOn} aria-label={soundOn ? "Turn sound off" : "Turn sound on"}>
          {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
          <span>{soundOn ? "Sound on" : "Sound off"}</span>
        </button>
        <button className="ghost-button" type="button">
          <X size={20} />
          <span>Quit</span>
        </button>
      </div>
    </header>
  );
}

function InteractionStatus({ done, total }) {
  const isComplete = done >= total;
  return (
    <motion.div className={isComplete ? "interaction-status complete" : "interaction-status"} role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done} animate={isComplete ? { scale: [1, 1.015, 1] } : { scale: 1 }} transition={{ duration: 0.32 }}>
      <span>{done} of {total} completed</span>
      <div><span style={{ width: `${Math.min(100, (done / total) * 100)}%` }} /></div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------- */
/* Interactions — same components/patterns as 1.6                    */
/* ---------------------------------------------------------------- */

function IntroInteraction({ section, onComplete }) {
  useEffect(() => { onComplete(); }, [onComplete]);
  return (
    <motion.div className="intro-screen" variants={stagger} initial="hidden" animate="show">
      <motion.section className="priya-panel" variants={fadeUp}>
        <img src={stockImages.olivia} alt="" />
        <div>
          <p className="mini-label">Olivia · One-Page Control Panel</p>
          <h3>The complete map of project execution</h3>
          <p>
            Olivia pins a single page above her desk: seven boxes for the performance domains, forty processes laid out across five focus areas. It becomes her control panel for all of Bloom 2026.
          </p>
          <p>
            When the kitchen flags a delivery clash — Schedule and Resources. When Finance asks about the app's burn rate — Finance domain's Estimate Costs and Monitor and Control Finances. A surprise food-labelling rule — Risk, rippling into Scope and Governance. The map doesn't tell her what to do. It tells her where to look.
          </p>
        </div>
      </motion.section>
      <motion.section className="intro-block" variants={fadeUp}>
        <div>
          <h3>What You'll Learn</h3>
          <ul>{section.cards[0].points.map((point) => <li key={point}>{point}</li>)}</ul>
        </div>
        <div className="intro-block-icon"><Target size={22} /></div>
      </motion.section>
    </motion.div>
  );
}

function SlideModal({ card, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);
  if (!card) return null;
  return createPortal(
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} onClick={onClose}>
      <motion.article className="slide-modal" variants={modalReveal} initial="hidden" animate="show" exit="exit" onClick={(event) => event.stopPropagation()}>
        <button className="drawer-close" type="button" onClick={onClose} aria-label="Close"><X size={22} /></button>
        <motion.div className="modal-editorial" variants={stagger} initial="hidden" animate="show">
          <motion.img className="modal-image" src={imageForCard(card)} alt="" variants={fadeUp} />
          <motion.p className="mini-label" variants={fadeUp}>Detail</motion.p>
          <motion.h3 variants={fadeUp}>{card.title}</motion.h3>
          <motion.p variants={fadeUp}>{card.body}</motion.p>
          <motion.div className="exam-lens compact" variants={fadeUp}><Lightbulb size={18} /><span>{card.exam}</span></motion.div>
          {card.insight && <motion.div className="priya-insight" variants={fadeUp}><strong>Olivia's insight:</strong><span>{card.insight}</span></motion.div>}
        </motion.div>
        <motion.button className="modal-close-bottom" type="button" onClick={onClose} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36, duration: 0.32 }}><Check size={18} /> Mark as read</motion.button>
      </motion.article>
    </motion.div>,
    document.body,
  );
}

function CardModalInteraction({ section, onComplete, soundOn }) {
  const [active, setActive] = useState(null);
  const [visited, setVisited] = useState(new Set());
  useEffect(() => { if (visited.size >= section.cards.length) onComplete(); }, [visited, section.cards.length, onComplete]);
  const open = (card) => {
    playTone("tap", soundOn);
    setActive(card);
    setVisited((items) => new Set(items).add(card.title));
  };
  const isTwoCard = section.cards.length === 2;
  const isEqualHeight = isTwoCard && section.cardLayout === "grid";
  const gridClassName = isEqualHeight ? "card-grid two-col-grid" : isTwoCard ? "card-grid two-card-grid" : "card-grid";
  return (
    <motion.div className="modal-activity" variants={stagger} initial="hidden" animate="show">
      <motion.div className="activity-instruction" variants={fadeUp}><Search size={18} /><span>Open each learning card to continue.</span></motion.div>
      <motion.div className={gridClassName} variants={stagger}>
        {section.cards.map((card, index) => {
          const isOrange = isTwoCard && !isEqualHeight && index === 1;
          const isVisited = visited.has(card.title);
          return (
            <motion.button className={`${isVisited ? "grid-learn-card viewed" : "grid-learn-card"} ${isOrange ? "orange-card" : ""}`} type="button" key={card.title} onClick={() => open(card)} variants={fadeUp} whileHover={{ y: -3 }} whileTap={{ scale: 0.985 }}>
              <img className="grid-card-image" src={imageForCard(card)} alt="" />
              <div className={`grid-card-icon ${isVisited ? "green" : isOrange ? "orange" : "blue"}`}>{isVisited ? <Check size={26} /> : <Search size={26} />}</div>
              <strong>{card.title}</strong>
              <small>{card.preview}</small>
              <em>{isVisited ? "Viewed" : "Explore"} <ArrowRight size={14} /></em>
            </motion.button>
          );
        })}
      </motion.div>
      <InteractionStatus done={visited.size} total={section.cards.length} />
      <AnimatePresence>{active && <SlideModal card={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </motion.div>
  );
}

function DomainFigure({ onComplete }) {
  useEffect(() => { onComplete(); }, [onComplete]);
  return (
    <motion.section className="domain-figure" variants={stagger} initial="hidden" animate="show">
      <motion.div className="lens-figure-head" variants={fadeUp}>
        <p className="mini-label">The Seven Performance Domains</p>
        <h3>All seven run concurrently — all in service of value</h3>
      </motion.div>
      <motion.div className="domain-figure-grid" variants={stagger}>
        {domainItems.map((domain, index) => {
          const Icon = domain.icon;
          return (
            <motion.article key={domain.key} data-index={String(index + 1).padStart(2, "0")} variants={fadeUp} whileHover={{ y: -3 }}>
              <span className="figure-icon"><Icon size={22} /></span>
              <strong>{domain.label}</strong>
              <small>{domain.count}</small>
            </motion.article>
          );
        })}
        <motion.article className="value-node" data-index="08" variants={fadeUp} whileHover={{ y: -3 }}>
          <span className="figure-icon"><Sparkles size={22} /></span>
          <strong>Value</strong>
          <small>The purpose of every domain</small>
        </motion.article>
      </motion.div>
      <motion.p className="figure-caption" variants={fadeUp}>Figure 1.6.a — The seven performance domains run concurrently, all in service of value.</motion.p>
    </motion.section>
  );
}

function DomainSelector({ section, onComplete, soundOn }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visited, setVisited] = useState(new Set([0]));
  const active = section.cards[activeIndex];
  const ActiveIcon = active.icon;
  const [activeHeading, activeSubtitle] = active.title.split(" — ");
  useEffect(() => { if (visited.size >= section.cards.length) onComplete(); }, [visited, section.cards.length, onComplete]);
  const select = (index) => {
    playTone("tap", soundOn);
    setActiveIndex(index);
    setVisited((items) => new Set(items).add(index));
  };
  return (
    <div className="lens-experience">
      <motion.div className="module-explorer" variants={stagger} initial="hidden" animate="show">
        <motion.aside className="module-list" aria-label="Seven domain selector" variants={stagger}>
          {section.cards.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button className={`${index === activeIndex ? "active" : ""} ${visited.has(index) ? "visited" : ""}`} type="button" key={item.key} onClick={() => select(index)} variants={swipeIn} whileHover={{ x: 4 }} whileTap={{ scale: 0.985 }}>
                <span className="module-list-icon">{visited.has(index) ? <Check size={22} /> : <Icon size={22} />}</span>
                <span><small>{item.count}</small><strong>{item.label}</strong></span>
              </motion.button>
            );
          })}
        </motion.aside>
        <AnimatePresence mode="wait">
          <motion.article key={active.key} className={visited.has(activeIndex) ? "module-detail visited" : "module-detail"} initial={{ opacity: 0, x: 34, filter: "blur(5px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: -24, filter: "blur(4px)" }} transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}>
            <ActiveIcon className="module-detail-icon" size={76} strokeWidth={1.8} />
            <p className="mini-label">{active.key}</p>
            <h3>{activeHeading}</h3>
            {activeSubtitle && <p className="detail-subtitle">{activeSubtitle}</p>}
            <p>{active.body}</p>
            <h4>Key takeaways:</h4>
            <div className="module-bullet-list">
              <div><span>&bull;</span><strong>{active.preview}</strong></div>
              <div><span>&bull;</span><strong>{active.exam}</strong></div>
            </div>
            {active.insight && <div className="priya-insight"><strong>Olivia's insight:</strong><span>{active.insight}</span></div>}
          </motion.article>
        </AnimatePresence>
        <InteractionStatus done={visited.size} total={section.cards.length} />
      </motion.div>
    </div>
  );
}

function IttoInteraction(props) {
  return (
    <div className="itto-experience">
      <motion.div className="itto-flow" variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp}>
          <span className="figure-icon"><ArrowDownToLine size={20} /></span>
          <strong>Inputs</strong>
          <span>What the process needs to start</span>
        </motion.div>
        <ArrowRight size={28} />
        <motion.div variants={fadeUp}>
          <span className="figure-icon"><Wrench size={20} /></span>
          <strong>Tools & Techniques</strong>
          <span>How the work gets done</span>
        </motion.div>
        <ArrowRight size={28} />
        <motion.div variants={fadeUp}>
          <span className="figure-icon"><ArrowUpFromLine size={20} /></span>
          <strong>Outputs</strong>
          <span>What it produces for the next process</span>
        </motion.div>
      </motion.div>
      <p className="figure-caption">Figure 1.6.b — ITTO anatomy: inputs are transformed by tools and techniques into outputs. Read it for logic, not as a list to memorise.</p>
      <CardModalInteraction {...props} />
    </div>
  );
}

function FocusAreaRow({ section, onComplete, soundOn }) {
  return (
    <div className="assessment-experience">
      <motion.div className="lens-figure" variants={stagger} initial="hidden" animate="show">
        <motion.div className="lens-figure-head" variants={fadeUp}>
          <p className="mini-label">The Five Focus Areas</p>
          <h3>Recurring areas of attention — not a one-way sequence</h3>
        </motion.div>
        <motion.div className="focus-row-grid" variants={stagger}>
          {focusAreas5.map(([title, preview, Icon]) => (
            <motion.article key={title} variants={fadeUp}>
              <span className="figure-icon"><Icon size={22} /></span>
              <strong>{title}</strong>
              <p>{preview}</p>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
      <CardModalInteraction section={section} onComplete={onComplete} soundOn={soundOn} />
    </div>
  );
}

function FullMapTable({ onComplete }) {
  useEffect(() => { onComplete(); }, [onComplete]);
  return (
    <div className="assessment-experience">
      <div className="crosswalk-panel">
        <h3>All 40 Processes — Domain × Focus Area</h3>
        <p>Read down a column (when) or across a row (where) — every process sits at one intersection. This is your reference — not a memorisation target.</p>
        <div className="crosswalk-table-wrap">
          <table className="crosswalk-table">
            <thead>
              <tr>
                <th>Domain</th>
                <th>Initiating</th>
                <th>Planning</th>
                <th>Executing</th>
                <th>Monitoring & Controlling</th>
                <th>Closing</th>
              </tr>
            </thead>
            <tbody>
              {fullMapRows.map(([domain, initiating, planning, executing, mc, closing]) => (
                <tr key={domain}>
                  <th scope="row">{domain}</th>
                  <td>{initiating}</td>
                  <td>{planning}</td>
                  <td>{executing}</td>
                  <td>{mc}</td>
                  <td>{closing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="figure-caption">PMBOK® 8 Table 2-1 (condensed) — Every process mapped to its domain and focus area. Governance is the only domain spanning all five focus areas.</p>
      </div>
    </div>
  );
}

function StackFigure({ onComplete }) {
  useEffect(() => { onComplete(); }, [onComplete]);
  return (
    <motion.section className="lens-figure" variants={stagger} initial="hidden" animate="show">
      <motion.div className="lens-figure-head" variants={fadeUp}>
        <p className="mini-label">Module 2 Stack</p>
        <h3>Principles → Domains → Processes → Value</h3>
      </motion.div>
      <motion.div className="stack-grid" variants={stagger}>
        {stackLayers.map(([Icon, title, body]) => (
          <motion.article key={title} variants={swipeIn} whileHover={{ y: -3 }}>
            <span className="figure-icon"><Icon size={24} /></span>
            <strong>{title}</strong>
            <p>{body}</p>
          </motion.article>
        ))}
      </motion.div>
      <motion.p className="figure-caption" variants={fadeUp}>Figure 1.6.d — The Module 2 stack: principles (why) → domains (what) → processes (how) → value (the point). Every future lesson is a zoom-in on one domain.</motion.p>
    </motion.section>
  );
}

function LessonsBuiltTable({ onComplete }) {
  useEffect(() => { onComplete(); }, [onComplete]);
  return (
    <div className="assessment-experience">
      <div className="crosswalk-panel">
        <h3>What Each Lesson Built</h3>
        <div className="crosswalk-table-wrap">
          <table className="crosswalk-table">
            <thead>
              <tr>
                <th>Lesson</th>
                <th>What It Built</th>
                <th>Where It Lives in the Stack</th>
              </tr>
            </thead>
            <tbody>
              {lessonBuiltRows.map(([lesson, built, where]) => (
                <tr key={lesson}>
                  <th scope="row">{lesson}</th>
                  <td>{built}</td>
                  <td>{where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <section className="priya-panel compact">
        <img src={stockImages.olivia} alt="" />
        <div>
          <p className="mini-label">Olivia · One-Page Control Panel</p>
          <p>Olivia's one-page control panel — seven boxes for the domains, forty processes laid out across five focus areas — is, in effect, the table of contents for everything that follows.</p>
          <p>From here, the rest of the course simply zooms in. Each later module takes a domain and works through its processes, tools, and exam patterns in depth. Because she now holds the whole map, she always knows where a new topic sits and why it matters.</p>
        </div>
      </section>
    </div>
  );
}

function ExamReference({ onComplete }) {
  useEffect(() => { onComplete(); }, [onComplete]);
  return (
    <div className="assessment-experience">
      <div className="reading-note">
        <h3>Exam Lens</h3>
        <p>Lesson 2.6 maps to PMBOK® 8 Guide Section 2 and underpins the entire Process domain of the 2026 ECO.</p>
        <p>Expect items that exploit two ideas: that domains run concurrently and interconnect (a single event touches several domains); and that processes are illustrative — punishing candidates who treat ITTOs as a rigid checklist.</p>
        <p>The terminology shift is also tested: Focus Areas vs. the old Process Groups — know the rename and what it signals.</p>
        <p>Reason from a process's purpose and outputs and from which domain an issue belongs to — not from a memorised ITTO list.</p>
        <p>When in doubt: identify the domain, locate the focus area, apply PMBOK® 8 judgement.</p>
      </div>
      <div className="reading-note">
        <h3>Module 2 · Complete Reference</h3>
        <p><strong>Seven domains:</strong> Governance · Scope · Schedule · Finance · Stakeholders · Resources · Risk — run concurrently, all in service of value. Governance spans all five focus areas.</p>
        <p><strong>Forty processes:</strong> illustrative, not prescriptive. Read each as a sentence: inputs → tools & techniques → outputs. One process's output feeds the next. Project management plan = most central artifact.</p>
        <p><strong>Five focus areas:</strong> Initiating → Planning → Executing → Monitoring & Controlling → Closing. Recurring areas of attention — not a one-way sequence. Monitoring & Controlling loops back constantly.</p>
        <p><strong>The stack:</strong> Principles (why) → Domains (what) → Processes (how) → Value (the point). Every future lesson is a zoom-in on one domain.</p>
      </div>
    </div>
  );
}

function SectionActivity({ section, onComplete, soundOn }) {
  if (section.title === "Lesson Overview") return <IntroInteraction section={section} onComplete={onComplete} />;
  if (section.type === "domain-figure") return <DomainFigure onComplete={onComplete} />;
  if (section.type === "domains") return <DomainSelector section={section} onComplete={onComplete} soundOn={soundOn} />;
  if (section.type === "itto") return <IttoInteraction section={section} onComplete={onComplete} soundOn={soundOn} />;
  if (section.type === "focus-row") return <FocusAreaRow section={section} onComplete={onComplete} soundOn={soundOn} />;
  if (section.type === "fullmap-table") return <FullMapTable onComplete={onComplete} />;
  if (section.type === "stack") return <StackFigure onComplete={onComplete} />;
  if (section.type === "lessons-table") return <LessonsBuiltTable onComplete={onComplete} />;
  if (section.type === "exam-reference") return <ExamReference onComplete={onComplete} />;
  return <CardModalInteraction section={section} onComplete={onComplete} soundOn={soundOn} />;
}

function LessonSection({ section, onComplete, isComplete, soundOn }) {
  const isIntro = section.title === "Lesson Overview";
  return (
    <motion.section className="lesson-content" key={section.title} initial={{ opacity: 0, x: 70, filter: "blur(8px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: -48, filter: "blur(6px)" }} transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}>
      <div className="lesson-hero">
        <motion.div className="hero-copy" variants={stagger} initial="hidden" animate="show">
          {isIntro && <p className="lesson-pill">Lesson 2.6</p>}
          {!isIntro && <motion.p className="eyebrow" variants={fadeUp}>{section.eyebrow}</motion.p>}
          <motion.h1 variants={fadeUp}>{section.heading || section.title}</motion.h1>
          <motion.p variants={fadeUp}>{section.subtitle}</motion.p>
        </motion.div>
      </div>
      <motion.div className="slide-object-stage" variants={slideObject} initial="hidden" animate="show">
        <SectionActivity section={section} onComplete={onComplete} soundOn={soundOn} />
      </motion.div>
      <AnimatePresence>
        {isComplete && (
          <motion.div className="anchor" variants={successUnlock} initial="hidden" animate="show" exit={{ opacity: 0, y: 12 }}>
            <Check size={20} />
            <span>{section.anchor}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [completed, setCompleted] = useState(() => Array(sections.length).fill(false));
  const current = sections[activeIndex];
  const canContinue = completed[activeIndex];

  const markComplete = useCallback((index) => {
    setCompleted((items) => {
      if (items[index]) return items;
      if (index !== 0) playTone("success", soundOn);
      return items.map((item, itemIndex) => (itemIndex === index ? true : item));
    });
  }, [soundOn]);

  const goNext = () => setActiveIndex((index) => Math.min(index + 1, sections.length - 1));
  const goPrev = () => setActiveIndex((index) => Math.max(index - 1, 0));
  const progress = Math.round(((activeIndex + 1) / sections.length) * 100);

  return (
    <div className="app-shell">
      <TopBar soundOn={soundOn} onToggleSound={() => setSoundOn((value) => !value)} />
      <section className="workspace">
        <div className="lesson-stage">
          <div className="outline">
            <button className="menu-button" type="button" onClick={() => setOutlineOpen((open) => !open)} aria-label="Toggle lesson outline"><Menu size={20} /></button>
            {outlineOpen && (
              <div className="outline-panel">
                <div className="outline-summary"><div><strong>Lesson 2.6</strong><span>{progress}%</span></div><span className="summary-track"><span style={{ width: `${progress}%` }} /></span></div>
                <section className="study-block">
                  <div className="study-heading"><span><BookOpen size={18} /> Study Plan</span><span className="block-status">{activeIndex + 1}</span></div>
                  <div className="lesson-list">
                    {lessonList.map((title, index) => (
                      <button className={index === activeIndex ? "lesson current" : "lesson"} type="button" key={`${title}-${index}`} onClick={() => { if (completed[index] || index <= activeIndex) setActiveIndex(index); }}>
                        <ProgressDot state={completed[index] ? "done" : index === activeIndex ? "active" : "idle"} />
                        <span>{title}</span>
                        <small>{index + 1}</small>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>
          <article className="lesson-card">
            <AnimatePresence mode="wait">
              <LessonSection section={current} isComplete={completed[activeIndex]} onComplete={() => markComplete(activeIndex)} soundOn={soundOn} />
            </AnimatePresence>
            <footer className="nav-footer">
              <button className="secondary-button" type="button" onClick={goPrev} disabled={activeIndex === 0}><ArrowLeft size={18} /> Previous</button>
              <motion.button className={canContinue ? "primary-button unlocked" : "primary-button"} type="button" onClick={goNext} disabled={!canContinue} animate={canContinue ? { scale: [1, 1.035, 1] } : { scale: 1 }} transition={{ duration: 0.42, ease: "easeOut" }}>
                {!canContinue ? "Complete interactions" : activeIndex === sections.length - 1 ? "Complete" : "Continue"}
                <ArrowRight size={18} />
              </motion.button>
            </footer>
          </article>
        </div>
      </section>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
