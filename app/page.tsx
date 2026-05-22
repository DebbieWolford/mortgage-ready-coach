'use client';

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Home,
  ArrowRight,
  ClipboardList,
  FileText,
  BrainCircuit,
  LayoutDashboard,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function MortgageReadyCoach() {
  const [screen, setScreen] = useState("landing");
  const [progress, setProgress] = useState(15);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(
    "Start by reviewing your credit profile, reducing debt where possible, organizing income and asset documentation, and avoiding major financial changes before applying. A licensed mortgage professional can review your specific situation in more detail."
  );

  const [answers, setAnswers] = useState({
    credit: "",
    income: "",
    dti: "",
    downPayment: "",
    documents: "",
  });
const [leadForm, setLeadForm] = useState({
  name: "",
  email: "",
  phone: "",
  state: "",
  goal: "",
});

const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const updateAnswer = (field: string, value: string) => {
    setAnswers({ ...answers, [field]: value });
  };

  const calculateScore = () => {
    let score = 0;

    if (answers.credit === "720+") score += 25;
    else if (answers.credit === "680-719") score += 20;
    else if (answers.credit === "620-679") score += 12;
    else if (answers.credit === "below620") score += 4;

    if (answers.income === "stable") score += 20;
    else if (answers.income === "variable") score += 12;
    else if (answers.income === "new") score += 6;

    if (answers.dti === "low") score += 20;
    else if (answers.dti === "medium") score += 12;
    else if (answers.dti === "high") score += 4;

    if (answers.downPayment === "strong") score += 15;
    else if (answers.downPayment === "some") score += 10;
    else if (answers.downPayment === "none") score += 3;

    if (answers.documents === "ready") score += 20;
    else if (answers.documents === "partial") score += 10;
    else if (answers.documents === "notready") score += 3;

    return Math.min(score, 100);
  };

  const score = calculateScore();

  const readinessLabel =
    score >= 80
      ? "Strong Mortgage Readiness"
      : score >= 60
      ? "Moderate Mortgage Readiness"
      : score >= 40
      ? "Needs Preparation"
      : "Early Preparation Stage";

  const askCoach = () => {
    const q = question.toLowerCase();

    if (q.includes("credit")) {
      setAnswer(
        "Improving credit may include making all payments on time, reducing credit card balances, avoiding new credit inquiries, and checking your credit report for errors."
      );
    } else if (q.includes("dti") || q.includes("debt")) {
      setAnswer(
        "DTI means debt-to-income ratio. It compares monthly debt payments to gross monthly income. Lower debt and stable income may improve mortgage readiness."
      );
    } else if (q.includes("document")) {
      setAnswer(
        "Common mortgage documents include pay stubs, W-2s, tax returns, bank statements, identification, and documentation for large deposits."
      );
    } else if (q.includes("underwriting")) {
      setAnswer(
        "Underwriting delays can happen because of missing documents, unexplained deposits, new debt, credit changes, income questions, or property-related issues."
      );
    } else {
      setAnswer(
        "Mortgage readiness usually includes stable income, manageable debt, organized documents, acceptable credit history, and enough funds for down payment and closing costs."
      );
    }
  };

  const questionBlock = (
    label: string,
    field: keyof typeof answers,
    options: { label: string; value: string }[]
  ) => (
    <div className="rounded-2xl bg-slate-50 p-5">
      <h3 className="mb-3 font-bold">{label}</h3>
      <div className="grid gap-3 md:grid-cols-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => updateAnswer(field, option.value)}
            className={`rounded-xl border p-4 text-left text-sm font-medium hover:bg-white ${
              answers[field] === option.value
                ? "border-slate-950 bg-white shadow-sm"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Home className="h-5 w-5" />
            Mortgage Ready Coach
          </div>

          <nav className="hidden gap-3 md:flex">
            {["Landing", "Quiz", "Results", "Coach", "Lead", "Dashboard"].map((item) => (
              <button
                key={item}
                onClick={() => setScreen(item.toLowerCase())}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  screen === item.toLowerCase()
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 hover:bg-slate-200"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <Button className="bg-slate-950 text-white">Demo</Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {screen === "landing" && (
          <>
            <section className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
              <div className="grid gap-6 md:grid-cols-2 md:items-center">
                <div>
                  <p className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
                    Borrower Journey
                  </p>
                  <h1 className="mb-4 text-4xl font-extrabold tracking-tight">
                    End-to-End Mortgage Readiness Platform
                  </h1>
                  <p className="text-slate-600">
                    Help future borrowers understand credit, income, documents, DTI,
                    and underwriting readiness before they apply.
                  </p>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-sm font-medium">
                    <span>Borrower Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              </div>
            </section>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="rounded-3xl">
                <CardContent className="p-8">
                  <div className="mb-5 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Educational Mortgage Guidance
                  </div>

                  <h2 className="mb-4 text-3xl font-bold">
                    Know what lenders may review before you apply.
                  </h2>

                  <p className="mb-6 text-slate-600">
                    Take a short readiness assessment and receive a score,
                    strengths, concerns, and suggested next steps.
                  </p>

                  <Button
                    onClick={() => {
                      setScreen("quiz");
                      setProgress(45);
                    }}
                    className="bg-slate-950 px-6 py-6 text-white"
                  >
                    Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-3xl">
                <CardContent className="space-y-4 p-8">
                  {[
                    { icon: ClipboardList, title: "Readiness Quiz", text: "Check income, credit, assets, and debt.", screen: "quiz" },
                    { icon: FileText, title: "Document Checklist", text: "Know what to gather before applying.", screen: "dashboard" },
                    { icon: BrainCircuit, title: "AI Mortgage Coach", text: "Get plain-English readiness guidance.", screen: "coach" },
                    { icon: LayoutDashboard, title: "Borrower Dashboard", text: "Track progress and next steps.", screen: "dashboard" },
                  ].map((item) => (
                    <button
                      key={item.title}
                      onClick={() => setScreen(item.screen)}
                      className="flex w-full items-center gap-4 rounded-2xl bg-slate-50 p-5 text-left hover:bg-slate-100"
                    >
                      <div className="rounded-xl bg-white p-3 shadow-sm">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold">{item.title}</h3>
                        <p className="text-sm text-slate-500">{item.text}</p>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {screen === "quiz" && (
          <Card className="rounded-3xl">
            <CardContent className="space-y-5 p-8">
              <h1 className="text-3xl font-extrabold">Mortgage Readiness Assessment</h1>
              <p className="text-slate-600">
                Answer a few questions to estimate borrower readiness.
              </p>

              {questionBlock("Credit Score Range", "credit", [
                { label: "720 or higher", value: "720+" },
                { label: "680 - 719", value: "680-719" },
                { label: "620 - 679", value: "620-679" },
                { label: "Below 620", value: "below620" },
              ])}

              {questionBlock("Income Situation", "income", [
                { label: "Stable W-2 income for 2+ years", value: "stable" },
                { label: "Variable, commission, or bonus income", value: "variable" },
                { label: "New job or recent employment change", value: "new" },
              ])}

              {questionBlock("Debt-to-Income Estimate", "dti", [
                { label: "Low debt compared to income", value: "low" },
                { label: "Moderate monthly debt", value: "medium" },
                { label: "High monthly debt", value: "high" },
              ])}

              {questionBlock("Down Payment / Cash Reserves", "downPayment", [
                { label: "Strong savings available", value: "strong" },
                { label: "Some savings available", value: "some" },
                { label: "Little or no savings yet", value: "none" },
              ])}

              {questionBlock("Documents", "documents", [
                { label: "Paystubs, W-2s, bank statements ready", value: "ready" },
                { label: "Some documents gathered", value: "partial" },
                { label: "Not organized yet", value: "notready" },
              ])}

              <Button
                onClick={() => {
                  setScreen("results");
                  setProgress(80);
                }}
                className="bg-slate-950 px-6 py-6 text-white"
              >
                View Results <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {screen === "results" && (
          <Card className="rounded-3xl">
            <CardContent className="p-8">
              <h1 className="mb-2 text-3xl font-extrabold">Your Readiness Results</h1>
              <p className="mb-6 text-slate-600">
                Educational estimate only. This is not a loan approval or commitment to lend.
              </p>

              <div className="mb-6 rounded-3xl bg-slate-50 p-6">
                <div className="mb-2 flex justify-between font-bold">
                  <span>{readinessLabel}</span>
                  <span>{score}/100</span>
                </div>
                <Progress value={score} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <CheckCircle className="mb-3 h-6 w-6" />
                  <h3 className="mb-2 font-bold">Strengths</h3>
                  <p className="text-sm text-slate-600">
                    Stronger answers may support a smoother mortgage preparation process.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <AlertCircle className="mb-3 h-6 w-6" />
                  <h3 className="mb-2 font-bold">Items to Improve</h3>
                  <p className="text-sm text-slate-600">
                    Focus on credit, debt, savings, income stability, and document organization.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-950 p-6 text-white">
                <h3 className="mb-2 text-xl font-bold">Recommended Next Steps</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Organize paystubs, W-2s, tax returns, and bank statements.</li>
                  <li>• Review monthly debts and estimate your DTI.</li>
                  <li>• Avoid opening new credit before applying.</li>
                  <li>• Speak with a licensed mortgage professional before making decisions.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {screen === "coach" && (
          <Card className="rounded-3xl">
            <CardContent className="p-8">
              <h1 className="mb-2 text-3xl font-extrabold">AI Mortgage Coach</h1>
              <p className="mb-6 text-slate-600">
                Ask mortgage-readiness questions and receive educational guidance.
              </p>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-3">
                  {[
                    "How can I improve my credit?",
                    "What documents do I need?",
                    "How does DTI affect approval?",
                    "What hurts underwriting?",
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => {
                        setQuestion(prompt);
                        setTimeout(() => askCoach(), 0);
                      }}
                      className="w-full rounded-2xl bg-slate-100 p-4 text-left text-sm font-semibold hover:bg-slate-200"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                <div className="rounded-3xl bg-slate-50 p-6 md:col-span-2">
                  <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-sm font-bold">Borrower</p>
                    <p className="text-slate-600">
                      {question || "What can I do to become mortgage ready?"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
                    <p className="text-sm font-bold">Mortgage Ready Coach</p>
                    <p className="mt-2 text-sm leading-6">{answer}</p>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <input
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                      placeholder="Ask your mortgage question..."
                    />

                    <Button onClick={askCoach} className="bg-slate-950 text-white">
                      Ask
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
{screen === "lead" && (
  <Card className="rounded-3xl">
    <CardContent className="p-8">
      <h1 className="mb-2 text-3xl font-extrabold">
        Request Mortgage Guidance
      </h1>

      <p className="mb-6 text-slate-600">
        Collect borrower contact details for personalized follow-up guidance.
      </p>

      {leadSubmitted && (
        <div className="mb-6 rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-800">
          Thank you! A mortgage professional will contact you soon.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={leadForm.name}
          onChange={(e) =>
            setLeadForm({ ...leadForm, name: e.target.value })
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
          placeholder="Full Name"
        />

        <input
          value={leadForm.email}
          onChange={(e) =>
            setLeadForm({ ...leadForm, email: e.target.value })
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
          placeholder="Email"
        />

        <input
          value={leadForm.phone}
          onChange={(e) =>
            setLeadForm({ ...leadForm, phone: e.target.value })
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
          placeholder="Phone"
        />

        <input
          value={leadForm.state}
          onChange={(e) =>
            setLeadForm({ ...leadForm, state: e.target.value })
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
         placeholder="State"
        />

        <select
          value={leadForm.goal}
          onChange={(e) =>
            setLeadForm({ ...leadForm, goal: e.target.value })
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm md:col-span-2"
        >
          <option value="">Loan Goal</option>
          <option value="Buy a home">Buy a home</option>
          <option value="Refinance">Refinance</option>
          <option value="Improve readiness first">
            Improve readiness first
          </option>
          <option value="Speak with a mortgage professional">
            Speak with a mortgage professional
          </option>
        </select>
      </div>

      <Button
        className="mt-6 bg-slate-950 px-6 py-6 text-white"
        onClick={() => {
  setLeads([...leads, leadForm]);
  setLeadSubmitted(true);

  setLeadForm({
            name: "",
            email: "",
            phone: "",
            state: "",
            goal: "",
          });
        }}
      >
        Request Guidance
      </Button>
    </CardContent>
  </Card>
)} 
        {screen === "dashboard" && (
          <Card className="rounded-3xl">
            <CardContent className="p-8">
              <h1 className="mb-4 text-3xl font-extrabold">Borrower Dashboard</h1>
              <p className="mb-6 text-slate-600">
                Track readiness, documents, and next steps.
              </p>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <h3 className="font-bold">Readiness Score</h3>
                  <p className="mt-2 text-3xl font-extrabold">{score}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5">
                  <h3 className="font-bold">Documents</h3>
                  <p className="mt-2 text-3xl font-extrabold">In Progress</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5">
                  <h3 className="font-bold">Next Step</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Review readiness gaps and prepare documents.
                  </p>
                  <div className="rounded-2xl bg-slate-50 p-5">
  <h3 className="font-bold">Captured Leads</h3>
  <p className="mt-2 text-3xl font-extrabold">{leads.length}</p>
</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
