'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Home, ArrowRight, CheckCircle, UserRound, BrainCircuit, ClipboardList, ShieldCheck, FileText, LayoutDashboard, LogOut } from "lucide-react";

export default function MortgageReadyMasterFlow() {
  const [screen, setScreen] = useState("landing");
  const [progress, setProgress] = useState(15);

  const navigation = [
    { id: "landing", label: "Landing" },
    { id: "auth", label: "Sign Up" },
    { id: "quiz", label: "Quiz" },
    { id: "results", label: "Results" },
    { id: "dashboard", label: "Dashboard" },
  ];

  const moveTo = (next: string, value: number) => {
    setScreen(next);
    setProgress(value);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Home className="h-5 w-5" /> Mortgage Ready Coach
          </div>
          <nav className="hidden gap-3 md:flex">
            {navigation.map((item) => (
              <button key={item.id} onClick={() => setScreen(item.id)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${screen === item.id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                {item.label}
              </button>
            ))}
          </nav>
          <Button variant="outline" className="rounded-2xl"><LogOut className="mr-2 h-4 w-4" /> Demo</Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-bold uppercase tracking-wide text-slate-500">Borrower Journey</div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">End-to-End Mortgage Readiness Platform</h1>
              <p className="mt-2 text-slate-600">This starter app demonstrates the complete SaaS experience.</p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <div className="flex justify-between text-sm font-semibold text-slate-600"><span>Borrower Progress</span><span>{progress}%</span></div>
              <Progress value={progress} className="h-3" />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {screen === "landing" && <motion.div key="landing" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}><LandingScreen onContinue={() => moveTo("auth", 25)} /></motion.div>}
          {screen === "auth" && <motion.div key="auth" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}><AuthScreen onContinue={() => moveTo("quiz", 45)} /></motion.div>}
          {screen === "quiz" && <motion.div key="quiz" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}><QuizScreen onContinue={() => moveTo("results", 70)} /></motion.div>}
          {screen === "results" && <motion.div key="results" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}><ResultsScreen onContinue={() => moveTo("dashboard", 100)} /></motion.div>}
          {screen === "dashboard" && <motion.div key="dashboard" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}><DashboardScreen /></motion.div>}
        </AnimatePresence>
      </div>
    </div>
  );
}

function LandingScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card className="rounded-[2rem] border-0 bg-slate-900 text-white shadow-sm"><CardContent className="p-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold"><ShieldCheck className="h-4 w-4" /> Educational Mortgage Guidance</div>
        <h2 className="mt-8 text-5xl font-extrabold leading-tight tracking-tight">Understand your mortgage readiness before applying</h2>
        <p className="mt-6 text-lg text-slate-300">Learn about DTI, documentation, underwriting concerns, and mortgage preparation using guided educational tools.</p>
        <Button className="mt-10 rounded-2xl px-8 py-6 text-base" onClick={onContinue}>Start Assessment <ArrowRight className="ml-2 h-4 w-4" /></Button>
      </CardContent></Card>
      <Card className="rounded-[2rem] border-0 bg-white shadow-sm"><CardContent className="space-y-5 p-8">
        <Feature icon={<ClipboardList />} title="Readiness Quiz" />
        <Feature icon={<FileText />} title="Document Checklist" />
        <Feature icon={<BrainCircuit />} title="AI Mortgage Coach" />
        <Feature icon={<LayoutDashboard />} title="Borrower Dashboard" />
      </CardContent></Card>
    </div>
  );
}

function AuthScreen({ onContinue }: { onContinue: () => void }) {
  return <Card className="rounded-[2rem] border-0 bg-white shadow-sm"><CardContent className="space-y-6 p-8"><div><div className="text-sm font-bold uppercase tracking-wide text-slate-500">Step 1</div><h2 className="mt-2 text-3xl font-extrabold">Create your borrower account</h2><p className="mt-2 text-slate-600">Save reports, checklist progress, and mortgage guidance.</p></div><div className="grid gap-4 md:grid-cols-2"><InputMock label="First Name" value="Debbie" /><InputMock label="Last Name" value="Wolford" /><InputMock label="Email" value="debbie@example.com" /><InputMock label="Password" value="••••••••" /></div><Button className="rounded-2xl px-8 py-6 text-base" onClick={onContinue}>Continue to Quiz <ArrowRight className="ml-2 h-4 w-4" /></Button></CardContent></Card>;
}

function QuizScreen({ onContinue }: { onContinue: () => void }) {
  return <Card className="rounded-[2rem] border-0 bg-white shadow-sm"><CardContent className="space-y-6 p-8"><div><div className="text-sm font-bold uppercase tracking-wide text-slate-500">Step 2</div><h2 className="mt-2 text-3xl font-extrabold">Mortgage readiness quiz</h2><p className="mt-2 text-slate-600">Educational questions to help estimate borrower readiness.</p></div><div className="grid gap-4 md:grid-cols-2"><QuizCard title="Credit Range" value="620–679" /><QuizCard title="Employment" value="W-2 Employee" /><QuizCard title="Monthly Income" value="$6,000" /><QuizCard title="Monthly Debts" value="$850" /><QuizCard title="Savings" value="$15,000" /><QuizCard title="Timeline" value="3–6 months" /></div><Button className="rounded-2xl px-8 py-6 text-base" onClick={onContinue}>Generate Results <ArrowRight className="ml-2 h-4 w-4" /></Button></CardContent></Card>;
}

function ResultsScreen({ onContinue }: { onContinue: () => void }) {
  return <div className="grid gap-6 lg:grid-cols-3"><Card className="rounded-[2rem] border-0 bg-slate-900 text-white shadow-sm lg:col-span-2"><CardContent className="space-y-5 p-8"><div className="inline-flex rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300">Yellow Readiness Status</div><h2 className="text-4xl font-extrabold">You may need some preparation first</h2><p className="text-slate-300">Based on your educational assessment, there may be items to review before applying with a lender.</p><div className="grid gap-4 md:grid-cols-2"><ResultBox title="Estimated DTI" value="41%" /><ResultBox title="Risk Flags" value="3 Items" /></div><Button className="rounded-2xl px-8 py-6 text-base" onClick={onContinue}>Open Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Button></CardContent></Card><Card className="rounded-[2rem] border-0 bg-white shadow-sm"><CardContent className="space-y-4 p-6"><div className="text-lg font-bold">Recommended Next Steps</div>{["Gather bank statements","Review credit report","Avoid opening new debt","Prepare income documentation"].map((item) => <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"><CheckCircle className="mt-0.5 h-5 w-5 text-emerald-600" /><span className="text-sm text-slate-700">{item}</span></div>)}</CardContent></Card></div>;
}

function DashboardScreen() {
  return <div className="grid gap-6 lg:grid-cols-3"><Card className="rounded-[2rem] border-0 bg-white shadow-sm lg:col-span-2"><CardContent className="space-y-6 p-8"><div className="flex items-center justify-between"><div><div className="text-sm font-bold uppercase tracking-wide text-slate-500">Borrower Dashboard</div><h2 className="mt-2 text-3xl font-extrabold">Welcome back, Debbie</h2></div><div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">100% Setup Complete</div></div><div className="grid gap-4 md:grid-cols-3"><DashboardMetric label="Checklist" value="72%" /><DashboardMetric label="Risk Flags" value="3" /><DashboardMetric label="Saved Reports" value="2" /></div><div className="rounded-[2rem] bg-slate-100 p-6"><div className="flex items-center gap-3"><BrainCircuit className="h-6 w-6 text-slate-700" /><div><div className="font-bold">AI Mortgage Coach</div><div className="text-sm text-slate-600">Educational mortgage guidance available 24/7.</div></div></div><div className="mt-5 rounded-2xl bg-white p-4 text-sm text-slate-700 shadow-sm">“Mortgage approval depends on multiple factors including credit, income, assets, and underwriting review.”</div></div></CardContent></Card><Card className="rounded-[2rem] border-0 bg-slate-900 text-white shadow-sm"><CardContent className="space-y-5 p-8"><div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold"><UserRound className="h-4 w-4" /> Borrower Profile</div><div><div className="text-sm text-slate-400">Goal</div><div className="text-xl font-bold">Buy a Home</div></div><div><div className="text-sm text-slate-400">Estimated Credit</div><div className="text-xl font-bold">620–679</div></div><div><div className="text-sm text-slate-400">Target Timeline</div><div className="text-xl font-bold">3–6 Months</div></div><div className="rounded-2xl bg-white/10 p-4 text-sm text-slate-300">Educational information only. Mortgage Ready Coach does not guarantee approval or provide lending decisions.</div></CardContent></Card></div>;
}

function Feature({ icon, title }: { icon: React.ReactNode; title: string }) { return <div className="flex items-center gap-4 rounded-3xl bg-slate-50 p-5"><div className="rounded-2xl bg-slate-100 p-3 text-slate-800">{icon}</div><div className="font-bold">{title}</div></div>; }
function InputMock({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-slate-200 p-4"><div className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</div><div className="mt-2 font-semibold text-slate-900">{value}</div></div>; }
function QuizCard({ title, value }: { title: string; value: string }) { return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="text-xs font-bold uppercase tracking-wide text-slate-500">{title}</div><div className="mt-2 text-lg font-bold text-slate-900">{value}</div></div>; }
function ResultBox({ title, value }: { title: string; value: string }) { return <div className="rounded-2xl bg-white/10 p-5"><div className="text-sm text-slate-300">{title}</div><div className="mt-2 text-3xl font-bold">{value}</div></div>; }
function DashboardMetric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="text-sm font-semibold text-slate-500">{label}</div><div className="mt-2 text-3xl font-extrabold text-slate-900">{value}</div></div>; }
