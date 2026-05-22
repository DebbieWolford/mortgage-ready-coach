'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";

export default function MortgageReadyCoach() {
  const [screen, setScreen] = useState("landing");
  const [progress, setProgress] = useState(15);

  const moveTo = (next: string, value: number) => {
    setScreen(next);
    setProgress(value);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Home className="h-5 w-5" />
            Mortgage Ready Coach
          </div>

          <nav className="hidden gap-3 md:flex">
            {["Landing", "Sign Up", "Quiz", "Results", "Dashboard"].map((item) => (
              <button
                key={item}
                onClick={() => setScreen(item.toLowerCase().replace(" ", ""))}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium hover:bg-slate-200"
              >
                {item}
              </button>
            ))}
          </nav>

          <Button className="bg-slate-950 text-white">Demo</Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
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
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-5 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Educational Mortgage Guidance
                </div>

                <h2 className="mb-4 text-3xl font-bold">
                  Know what lenders may review before you apply.
                </h2>

                <p className="mb-6 text-slate-600">
                  Mortgage Ready Coach guides borrowers through readiness questions,
                  required documents, and potential issues that could delay approval.
                </p>

                <Button
                  onClick={() => moveTo("quiz", 35)}
                  className="bg-slate-950 px-6 py-6 text-white"
                >
                  Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardContent className="space-y-4 p-8">
              {[
                { icon: ClipboardList, title: "Readiness Quiz", text: "Check income, credit, assets, and debt." },
                { icon: FileText, title: "Document Checklist", text: "Know what to gather before applying." },
                { icon: BrainCircuit, title: "AI Mortgage Coach", text: "Get plain-English readiness guidance." },
                { icon: LayoutDashboard, title: "Borrower Dashboard", text: "Track progress and next steps." },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-4 rounded-2xl bg-slate-50 p-5"
                >
                  <div className="rounded-xl bg-white p-3 shadow-sm">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-sm text-slate-500">{item.text}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            "Prepare before speaking with a lender",
            "Reduce surprises during underwriting",
            "Understand your next best action",
          ].map((item) => (
            <div key={item} className="rounded-2xl bg-white p-5 shadow-sm">
              <CheckCircle className="mb-3 h-5 w-5" />
              <p className="font-semibold">{item}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
