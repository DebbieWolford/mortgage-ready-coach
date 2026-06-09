'use client';

import React, { useEffect, useState } from "react";
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
import { createClient } from "@supabase/supabase-js";

export default function MortgageReadyCoach() {
  const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
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
lastName: "",
email: "",
phone: "",
purchasePrice: "",
  referralSource: "",
creditScore: "",
state: "",
goal: "",
  notes: "",
});

const [leadSubmitted, setLeadSubmitted] = useState(false);
const [leads, setLeads] = useState<any[]>([]);
const [leadSearch, setLeadSearch] = useState("");
  const [borrowerPortalEmail, setBorrowerPortalEmail] = useState("");
const [borrowerPortalLead, setBorrowerPortalLead] = useState<any>(null);
const [borrowerPortalMessage, setBorrowerPortalMessage] = useState("");
  const [leadSort, setLeadSort] = useState("newest");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [uploading, setUploading] = useState(false);
const [documentType, setDocumentType] = useState("Pay Stub");
const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const [viewingDocumentsLeadId, setViewingDocumentsLeadId] = useState<number | null>(null);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
const [viewingActivityLeadId, setViewingActivityLeadId] = useState<number | null>(null);
  const [editingLeadId, setEditingLeadId] = useState<number | null>(null);
const [editLeadForm, setEditLeadForm] = useState<any>({});
const [chatHistory, setChatHistory] = useState<
  { role: "Borrower" | "Mortgage Ready Coach"; message: string }[]
>([]);
  useEffect(() => {
  const loadLeads = async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setLeads(
        data.map((lead) => ({
          id: lead.id,
          name: lead.name || "",
          lastName: lead.lastname || "",
          email: lead.email || "",
          phone: lead.phone || "",
          purchasePrice: lead.purchaseprice || "",
          creditScore: lead.creditscore || "",
          goal: lead.goal || "",
          referralSource: lead.referralsource || "",
          notes: lead.notes || "",
          status: lead.status || "New Lead",
          submittedAt: lead.created_at
            ? new Date(lead.created_at).toLocaleString()
            : "",
        }))
      );
    }
  };

  loadLeads();
    const loadDocuments = async () => {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (!error && data) {
    setUploadedDocuments(data);
    console.log("Documents:", data);
  }
};
    const loadActivityLogs = async () => {
  const { data, error } = await supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false });

  if (!error && data) {
    setActivityLogs(data);
    console.log("Activity Logs:", data);
  }
};

loadDocuments();
loadActivityLogs();
}, []);
  const updateLeadStatus = async (leadId: number, newStatus: string) => {
  setLeads(
    
    leads.map((lead) =>
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    )
  );

 const { error } = await supabase
  .from("leads")
  .update({ status: newStatus })
  .eq("id", leadId);

if (error) {
  console.log("Status Update Error:", error);
}
    await supabase
  .from("activity_log")
  .insert([
    {
      lead_id: leadId,
      activity_type: "Status Change",
      description: `Status changed to ${newStatus}`,
    },
  ]);
};
  const handleDocumentUpload = async (leadId: number) => {
  if (!selectedFile) {
    alert("Please choose a file before uploading.");
    return;
  }

  setUploading(true);

  const filePath = `${leadId}/${Date.now()}-${selectedFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("borrower-documents")
    .upload(filePath, selectedFile);

  if (uploadError) {
    alert("Upload failed: " + uploadError.message);
    setUploading(false);
    return;
  }

  const { error: dbError } = await supabase.from("documents").insert([
    {
      lead_id: leadId,
      file_name: selectedFile.name,
      file_path: filePath,
      document_type: documentType,
      uploaded_by: "borrower",
      status: "Uploaded",
    },
  ]);

  if (dbError) {
    alert("File uploaded, but document record failed: " + dbError.message);
    setUploading(false);
    return;
  }

  setUploadedDocuments([
    {
      lead_id: leadId,
      file_name: selectedFile.name,
      file_path: filePath,
      document_type: documentType,
      uploaded_by: "borrower",
      status: "Uploaded",
    },
    ...uploadedDocuments,
  ]);

  setSelectedFile(null);
  setUploading(false);
    await supabase
  .from("activity_log")
  .insert([
    {
      lead_id: leadId,
      activity_type: "Document Upload",
      description: `Uploaded ${documentType}: ${selectedFile.name}`,
    },
  ]);
  alert("Document uploaded successfully.");
};
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
  const actionPlan: string[] = [];
const strengths: string[] = [];
const improvements: string[] = [];
if (answers.credit === "low") {
  actionPlan.push("Reduce credit card balances.");
  actionPlan.push("Avoid opening new credit accounts.");
  actionPlan.push("Make all payments on time.");

  improvements.push("Credit profile may need improvement.");
}

if (answers.credit === "high") {
  strengths.push("Strong credit profile.");
}

if (answers.dti === "high") {
  actionPlan.push("Pay down monthly debt obligations.");
  actionPlan.push("Avoid financing large purchases.");
  improvements.push("High debt-to-income ratio.");
}
if (answers.dti === "low") {
  strengths.push("Manageable debt levels.");
}
  if (answers.documents === "ready") {
  strengths.push("Organized mortgage documentation.");
}

if (answers.documents === "notready") {
  improvements.push("Documentation may need preparation.");
}

if (answers.downPayment === "strong") {
  strengths.push("Strong down payment preparation.");
}

if (answers.downPayment === "none") {
  improvements.push("Limited funds for down payment and closing costs.");
}
if (answers.downPayment === "none") {
  actionPlan.push("Build savings for down payment and closing costs.");
}

if (answers.documents === "notready") {
  actionPlan.push("Organize income and asset documentation.");
}


if (score >= 80) {
  actionPlan.push("Consider speaking with a lender for preapproval.");
}


  const readinessLabel =
    score >= 80
      ? "Strong Mortgage Readiness"
      : score >= 60
      ? "Moderate Mortgage Readiness"
      : score >= 40
      ? "Needs Preparation"
      : "Early Preparation Stage";

  const askCoach = () => {
  if (!question.trim()) return;

  const q = question.toLowerCase();
const topics: string[] = [];
  let response =
    "Mortgage readiness usually includes stable income, manageable debt, organized documents, acceptable credit history, and enough funds for down payment and closing costs.";

  if (q.includes("credit") || q.includes("score")) {
  topics.push("credit");

  response =
      "Improving credit may include making payments on time, reducing credit card balances, avoiding new credit inquiries, and reviewing your credit report for errors.";
  } else if (q.includes("w2") || q.includes("w-2") || q.includes("w's")) {
    topics.push("w2");
    
    response =
      "Many lenders review a 2-year employment and income history, often using W-2s, pay stubs, and verification of employment. Some borrowers with less than 2 years may still qualify depending on job history, education, and loan program.";
  } else if (q.includes("self-employed") || q.includes("self employed") || q.includes("business owner")) {
    topics.push("selfemployed");
    
    response =
      "Self-employed borrowers are commonly asked for 2 years of tax returns, profit-and-loss information, business bank statements, and stable income documentation.";
 } else if (q.includes("fha")) {
  topics.push("fha");

  response =
      "FHA loans may allow more flexible credit and down payment options than some conventional loans, but borrowers still need stable income, acceptable debt levels, and required documentation.";
  } else if (q.includes("va loan") || q.includes(" va ")) {
    topics.push("va");
    
    response =
      "VA loans may offer strong benefits for eligible veterans, service members, and some surviving spouses. Borrowers still need income, credit, VA eligibility, and property approval.";
  } else if (q.includes("conventional")) {
    topics.push("conventional");
    
    response =
      "Conventional loans often consider credit score, DTI, down payment, reserves, income stability, and property eligibility. Stronger credit and lower debt can help readiness.";
  } else if (q.includes("dti") || q.includes("debt")) {
  topics.push("dti");

  response =
      "DTI means debt-to-income ratio. It compares monthly debt payments to gross monthly income. Lower DTI ratios generally improve mortgage readiness.";
  } else if (q.includes("down payment")) {
    topics.push("downpayment");
    
    response =
      "Down payment requirements vary by loan type. Some programs allow low down payments, but borrowers should also prepare for closing costs, reserves, inspections, and moving expenses.";
  } else if (q.includes("closing cost")) {
    topics.push("closingcost");
    
    response =
      "Closing costs may include lender fees, title fees, appraisal, escrow setup, prepaid taxes, insurance, and recording fees. Buyers should prepare for these in addition to the down payment.";
  } else if (q.includes("document")) {
    topics.push("document");
    
    response =
      "Common mortgage documents include pay stubs, W-2s, tax returns, bank statements, ID, employment history, and explanations for large deposits.";
     

  response =
    "Underwriting concerns may include missing documents, large unexplained deposits, new debt, credit changes, income instability, appraisal issues, or property condition concerns.";
  } else if (q.includes("condo")) {
    topics.push("condo");
    
    response =
      "Condo loans may require both borrower approval and condo project review. Lenders may look at HOA finances, insurance, occupancy, litigation, and project eligibility.";
  } else if (q.includes("bankruptcy")) {
    topics.push("bankruptcy");
    
    response =
      "A prior bankruptcy does not always prevent mortgage approval, but lenders usually review the discharge date, re-established credit, payment history, and loan program waiting periods.";
  } else if (q.includes("foreclosure")) {
    topics.push("foreclosure");
    
    response =
      "A prior foreclosure may require a waiting period depending on the loan program. Lenders also review re-established credit, income stability, and the reason for the prior hardship.";
  } else if (q.includes("large deposit")) {
    topics.push("largedeposit");
    
    response =
      "Large deposits often need to be sourced and explained. Lenders may ask for documentation showing where the money came from and whether it must be repaid.";
  } else if (q.includes("employment gap") || q.includes("job gap") || q.includes("gap")) {
  topics.push("employment");

  response =
    "Employment gaps may need to be explained. Lenders often look for stable, continuing income and may ask for documentation about job changes or gaps.";

  } else if (q.includes("preapproval") || q.includes("pre-approval")) {
    topics.push("preapproval");
    
    response =
      "For preapproval, borrowers usually provide income documents, asset statements, credit authorization, ID, employment history, and information about debts and housing goals.";
  }

  setChatHistory((previous) => [
    ...previous,
    { role: "Borrower", message: question },
    { role: "Mortgage Ready Coach", message: response },
  ]);

  setAnswer(response);
  setQuestion("");
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
const downloadAllDocuments = async (leadId: string) => {
  const { data: borrowerDocuments, error } = await supabase
    .from("documents")
    .select("*")
    .eq("lead_id", leadId);

  if (error) {
    alert("Could not retrieve borrower documents.");
    return;
  }

  if (!borrowerDocuments || borrowerDocuments.length === 0) {
    alert("No documents found for this borrower.");
    return;
  }

  for (const doc of borrowerDocuments) {
    const { data, error: signedUrlError } = await supabase.storage
      .from("borrower-documents")
    .createSignedUrl(doc.file_path, 60, {
  download: doc.file_name || "borrower-document",
});

    if (signedUrlError || !data?.signedUrl) {
      console.error("Could not download document:", doc.file_name);
      continue;
    }

    const link = document.createElement("a");
    link.href = data.signedUrl;
    link.download = doc.file_name || "borrower-document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    await new Promise((resolve) => setTimeout(resolve, 500));
  }
};
  const findBorrowerPortalLead = () => {
  const foundLead = leads.find(
    (lead) =>
      lead.email?.toLowerCase().trim() ===
      borrowerPortalEmail.toLowerCase().trim()
  );

  if (!borrowerPortalEmail.trim()) {
    setBorrowerPortalLead(null);
    setBorrowerPortalMessage("Please enter your email address.");
    return;
  }

  if (!foundLead) {
    setBorrowerPortalLead(null);
    setBorrowerPortalMessage("No borrower file was found for that email.");
    return;
  }

  setBorrowerPortalLead(foundLead);
  setBorrowerPortalMessage("");
};
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {viewingActivityLeadId && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
      <h2 className="mb-4 text-xl font-bold">Activity Log</h2>

      {activityLogs.filter((log) => log.lead_id === viewingActivityLeadId).length === 0 ? (
        <p className="text-sm text-slate-600">No activity recorded for this lead yet.</p>
      ) : (
        <div className="space-y-3">
          {activityLogs
            .filter((log) => log.lead_id === viewingActivityLeadId)
            .map((log, index) => (
              <div key={index} className="rounded-lg border bg-slate-50 p-3 text-sm">
                <p><strong>Type:</strong> {log.activity_type}</p>
                <p><strong>Description:</strong> {log.description}</p>
                <p className="text-xs text-slate-500">
                  {new Date(log.created_at).toLocaleString()}
                </p>
              </div>
            ))}
        </div>
      )}

      <button
        onClick={() => setViewingActivityLeadId(null)}
        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
      >
        Close
      </button>
    </div>
  </div>
)}
      {viewingDocumentsLeadId && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
      <h2 className="mb-4 text-xl font-bold">Uploaded Documents</h2>

      {uploadedDocuments.filter((doc) => doc.lead_id === viewingDocumentsLeadId).length === 0 ? (
        <p className="text-sm text-slate-600">No documents uploaded for this lead yet.</p>
      ) : (
        <div className="space-y-3">
          {uploadedDocuments
            .filter((doc) => doc.lead_id === viewingDocumentsLeadId)
            .map((doc, index) => (
              <div key={index} className="rounded-lg border bg-slate-50 p-3 text-sm">
                <p><strong>Type:</strong> {doc.document_type}</p>
                <p><strong>File:</strong> {doc.file_name}</p>
                <p><strong>Status:</strong> {doc.status}</p>
                <button
    onClick={async () => {
    const { data, error } = await supabase.storage
      .from("borrower-documents")
      .createSignedUrl(doc.file_path, 60);

    if (error || !data?.signedUrl) {
      alert("Could not open document.");
      return;
    }

    window.open(data.signedUrl, "_blank");
  }}
  className="mt-2 rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
>
  Open Document
</button>
                <button
  onClick={async () => {
    const { data, error } = await supabase.storage
      .from("borrower-documents")
      .createSignedUrl(doc.file_path, 60);

    if (error || !data?.signedUrl) {
      alert("Could not download document.");
      return;
    }

    const link = document.createElement("a");
    link.href = data.signedUrl;
    link.download = doc.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }}
  className="mt-2 ml-2 rounded-lg bg-slate-700 px-3 py-1 text-sm text-white hover:bg-slate-800"
>
  Download
</button>
              </div>
            ))}
        </div>
      )}

      <button
        onClick={() => setViewingDocumentsLeadId(null)}
        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
      >
        Close
      </button>
    </div>
  </div>
)}
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
                  {leadSubmitted && (
  <div className="mb-4 rounded-xl bg-green-100 p-4 text-green-700">
    Thank you! A mortgage professional will contact you soon.
  </div>
)}
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
            { icon: LayoutDashboard, title: "Borrower Portal", text: "Borrowers can look up their file by email.", screen: "dashboard" },
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
                  <span
  className={
    score >= 80
      ? "rounded-full bg-green-100 px-3 py-1 text-green-700"
      : score >= 60
      ? "rounded-full bg-yellow-100 px-3 py-1 text-yellow-700"
      : "rounded-full bg-red-100 px-3 py-1 text-red-700"
  }
>
  {score}/100
</span>
                </div>
               <Progress
  value={score}
  className={
    score >= 80
      ? "[&>div]:bg-green-600"
      : score >= 60
      ? "[&>div]:bg-yellow-500"
      : "[&>div]:bg-red-500"
  }
/>
              </div>
{actionPlan.length > 0 && (
  <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
    <h3 className="mb-3 text-lg font-bold">
      Personalized Action Plan
    </h3>

    <ul className="space-y-2 text-sm text-slate-700">
      {actionPlan.map((item, index) => (
        <li
          key={index}
          className="rounded-lg bg-slate-50 p-3"
        >
          • {item}
        </li>
      ))}
    </ul>
  </div>
)}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <CheckCircle className="mb-3 h-6 w-6" />
                  <h3 className="mb-2 font-bold">Strengths</h3>
                  <div className="text-sm text-slate-600">
                    {strengths.length > 0 ? (
  <ul className="space-y-1">
    {strengths.map((item, index) => (
      <li key={index}>• {item}</li>
    ))}
  </ul>
) : (
  "Continue building strong mortgage readiness habits."
)}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <AlertCircle className="mb-3 h-6 w-6" />
                  <h3 className="mb-2 font-bold">Items to Improve</h3>
                 <div className="text-sm text-slate-600">
                    {improvements.length > 0 ? (
  <ul className="space-y-1">
    {improvements.map((item, index) => (
      <li key={index}>• {item}</li>
    ))}
  </ul>
) : (
  "Your profile currently shows minimal improvement areas."
)}
                  </div>
                </div>
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
              }}
              className="w-full rounded-2xl bg-slate-100 p-4 text-left text-sm font-semibold hover:bg-slate-200"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="rounded-3xl bg-slate-50 p-6 md:col-span-2">
          <div className="space-y-4">
            {chatHistory.length === 0 ? (
              <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
                <p className="mb-2 font-bold">Mortgage Ready Coach</p>
                              </div>
            ) : (
              chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`rounded-2xl p-5 ${
                    chat.role === "Borrower"
                      ? "bg-white"
                      : "bg-slate-950 text-white"
                  }`}
                >
                  <p className="mb-2 font-bold">{chat.role}</p>
                  <p className="text-sm leading-6">{chat.message}</p>
                </div>
              ))
            )}
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
    {leadSubmitted && (
  <div className="mb-4 rounded-xl bg-green-100 p-4 text-green-700">
    Thank you! A mortgage professional will contact you soon.
  </div>
)}
    <h1 className="mb-2 text-3xl font-extrabold">
      Get Connected With a Mortgage Professional
    </h1>

    <p className="mb-6 text-slate-600">
      Request educational guidance and mortgage readiness support.
    </p>

    <div className="grid gap-4 md:grid-cols-2">
      <input
        type="text"
        placeholder="First Name"
        value={leadForm.name}
onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
        className="rounded-xl border p-3"
      />

      <input
        type="text"
        placeholder="Last Name"
        value={leadForm.lastName}
onChange={(e) => setLeadForm({ ...leadForm, lastName: e.target.value })}
        className="rounded-xl border p-3"
      />

      <input
        type="email"
        placeholder="Email Address"
        value={leadForm.email}
onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
        className="rounded-xl border p-3"
      />

      <input
        type="tel"
        placeholder="Phone Number"
        value={leadForm.phone}
onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
        className="rounded-xl border p-3"
      />

      <input
        type="text"
        placeholder="Desired Purchase Price"
        value={leadForm.purchasePrice}
onChange={(e) => setLeadForm({ ...leadForm, purchasePrice: e.target.value })}
        className="rounded-xl border p-3"
      />
      <input
  type="text"
  placeholder="Referral Source"
  value={leadForm.referralSource || ""}
  onChange={(e) =>
    setLeadForm({ ...leadForm, referralSource: e.target.value })
  }
  className="rounded-xl border p-3"
/>

      <input
        type="text"
        placeholder="Estimated Credit Score"
        value={leadForm.creditScore}
onChange={(e) => setLeadForm({ ...leadForm, creditScore: e.target.value })}
        className="rounded-xl border p-3"
      />
    </div>

    <textarea
      placeholder="Tell us about your mortgage goals..."
      value={leadForm.goal}
  onChange={(e) => setLeadForm({ ...leadForm, goal: e.target.value })}
      className="mt-4 min-h-[120px] w-full rounded-xl border p-3"
    />
<textarea
  placeholder="Lead Notes..."
  value={leadForm.notes || ""}
  onChange={(e) =>
    setLeadForm({ ...leadForm, notes: e.target.value })
  }
  className="mt-4 min-h-[120px] w-full rounded-xl border p-3"
/>
    <button
  onClick={async () => {
   await supabase.from("leads").insert([
  {
    name: leadForm.name,
    lastname: leadForm.lastName,
    email: leadForm.email,
    phone: leadForm.phone,
    purchaseprice: leadForm.purchasePrice,
    creditscore: leadForm.creditScore,
    goal: leadForm.goal,
    referralsource: leadForm.referralSource,
    notes: leadForm.notes,
  },
]); 
  setLeads([
  {
    ...leadForm,
    submittedAt: new Date().toLocaleString(),
  },
  ...leads,
]);  
    setLeadSubmitted(true);

    setLeadForm({
  name: "",
  lastName: "",
  email: "",
  phone: "",
  purchasePrice: "",
  creditScore: "",
  state: "",
  goal: "",
      notes: "",
      referralSource: "",
});
  }}
  className="mt-6 rounded-xl bg-slate-950 px-6 py-3 text-white"
>
      Request Guidance
    </button>
  </CardContent>
</Card>
  )}
        {screen === "dashboard" && (
          <Card className="rounded-3xl">
            <CardContent className="p-8">
              <h1 className="mb-4 text-3xl font-extrabold">Borrower Dashboard</h1>
              <p className="mb-6 text-slate-600">
                Track readiness, documents, leads, and next steps.
              </p>
     <div className="mb-6 rounded-2xl bg-slate-50 p-5">
  <h2 className="mb-2 text-xl font-bold text-slate-900">Borrower Portal</h2>
  <p className="mb-4 text-sm text-slate-600">
    Borrowers can look up their file by email to view their readiness and document status.
  </p>

  <div className="flex flex-col gap-3 md:flex-row">
    <input
      type="email"
      placeholder="Enter borrower email"
      value={borrowerPortalEmail}
      onChange={(e) => setBorrowerPortalEmail(e.target.value)}
      className="flex-1 rounded-lg border p-3"
    />

    <button
      onClick={findBorrowerPortalLead}
      className="rounded-lg bg-slate-900 px-5 py-3 text-white hover:bg-slate-700"
    >
      Find My File
    </button>
  </div>

  {borrowerPortalMessage && (
    <p className="mt-3 text-sm font-semibold text-red-600">
      {borrowerPortalMessage}
    </p>
  )}

  {borrowerPortalLead && (
    <div className="mt-5 space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">Borrower</p>
        <p className="text-lg font-bold">
          {borrowerPortalLead.name} {borrowerPortalLead.lastName}
        </p>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">Pipeline Status</p>
        <p className="text-lg font-bold">
          {borrowerPortalLead.status || "New Lead"}
        </p>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">Readiness Score</p>
        <p className="text-lg font-bold">
          {borrowerPortalLead.readinessScore || 0}
        </p>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">Documents Uploaded</p>
        <p className="text-lg font-bold">
          {
            uploadedDocuments.filter(
              (doc) => doc.lead_id === borrowerPortalLead.id
            ).length
          }
        </p>
      </div>
    </div>
      <div className="rounded-xl bg-white p-4 shadow-sm">
  <h3 className="mb-3 font-bold text-slate-900">Borrower Document Checklist</h3>

  <div className="grid gap-2 md:grid-cols-2">
    {[
      "Pay Stub",
      "W-2",
      "Bank Statement",
      "Tax Return",
      "Driver's License",
      "Purchase Contract",
      "Rent History",
      "Other",
    ].map((requiredDoc) => {
      const hasDocument = uploadedDocuments.some(
        (doc) =>
          doc.lead_id === borrowerPortalLead.id &&
          doc.document_type === requiredDoc
      );

      return (
        <div
          key={requiredDoc}
          className="flex items-center justify-between rounded-lg border bg-slate-50 px-3 py-2 text-sm"
        >
          <span>{requiredDoc}</span>
          <span
            className={
              hasDocument
                ? "font-semibold text-green-700"
                : "font-semibold text-red-600"
            }
          >
            {hasDocument ? "Uploaded" : "Needed"}
          </span>
        </div>
      );
    })}
  </div>
</div>
      <div className="rounded-xl bg-white p-4 shadow-sm">
  <h3 className="mb-2 font-bold text-slate-900">Upload a Document</h3>
  <p className="mb-3 text-sm text-slate-600">
    Add documents directly to this borrower file.
  </p>

  <select
    value={documentType}
    onChange={(e) => setDocumentType(e.target.value)}
    className="mb-3 w-full rounded-lg border px-3 py-2 text-sm"
  >
    <option>Pay Stub</option>
    <option>W-2</option>
    <option>Bank Statement</option>
    <option>Tax Return</option>
    <option>Driver's License</option>
    <option>Purchase Contract</option>
    <option>Rent History</option>
    <option>Other</option>
  </select>

  <input
    type="file"
    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
    className="mb-3 w-full text-sm"
  />

  <button
    onClick={() => handleDocumentUpload(borrowerPortalLead.id)}
    disabled={uploading}
    className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-slate-400"
  >
    {uploading ? "Uploading..." : "Upload to My File"}
 </button>
</div>
</div>
)}
</div>
{editingLeadId && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
  <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
    <h2 className="mb-4 text-xl font-bold">Edit Lead</h2>

    <div className="grid gap-3 md:grid-cols-2">

      <input
        type="text"
        placeholder="First Name"
        value={editLeadForm.name || ""}
        onChange={(e) =>
          setEditLeadForm({ ...editLeadForm, name: e.target.value })
        }
        className="rounded-lg border p-2"
      />

      <input
        type="text"
        placeholder="Last Name"
        value={editLeadForm.lastName || ""}
        onChange={(e) =>
          setEditLeadForm({ ...editLeadForm, lastName: e.target.value })
        }
        className="rounded-lg border p-2"
      />

      <input
        type="email"
        placeholder="Email"
        value={editLeadForm.email || ""}
        onChange={(e) =>
          setEditLeadForm({ ...editLeadForm, email: e.target.value })
        }
        className="rounded-lg border p-2"
      />

      <input
        type="text"
        placeholder="Phone"
        value={editLeadForm.phone || ""}
        onChange={(e) =>
          setEditLeadForm({ ...editLeadForm, phone: e.target.value })
        }
        className="rounded-lg border p-2"
      />

      <input
        type="text"
        placeholder="Referral Source"
        value={editLeadForm.referralSource || ""}
        onChange={(e) =>
          setEditLeadForm({
            ...editLeadForm,
            referralSource: e.target.value,
          })
        }
        className="rounded-lg border p-2"
      />

      <input
        type="text"
        placeholder="Credit Score"
        value={editLeadForm.creditScore || ""}
        onChange={(e) =>
          setEditLeadForm({
            ...editLeadForm,
            creditScore: e.target.value,
          })
        }
        className="rounded-lg border p-2"
      />

    </div>

    <textarea
      placeholder="Notes"
      value={editLeadForm.notes || ""}
      onChange={(e) =>
        setEditLeadForm({
          ...editLeadForm,
          notes: e.target.value,
        })
      }
      className="mt-3 w-full rounded-lg border p-2"
    />
<div className="mt-4 flex gap-3">
  <button
    onClick={async () => {
  const { error } = await supabase
    .from("leads")
    .update({
      name: editLeadForm.name,
      lastname: editLeadForm.lastName,
      email: editLeadForm.email,
      phone: editLeadForm.phone,
      referralsource: editLeadForm.referralSource || "",
      creditscore: editLeadForm.creditScore,
      notes: editLeadForm.notes || "",
    })
    .eq("id", editingLeadId);

  if (error) {
    alert("Update failed: " + error.message);
    return;
  }

  setLeads(
    leads.map((lead) =>
      lead.id === editingLeadId ? { ...lead, ...editLeadForm } : lead
    )
  );

  setEditingLeadId(null);
  setEditLeadForm({});
}}
    className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
  >
    Save Changes
  </button>

  <button
    onClick={() => {
      setEditingLeadId(null);
      setEditLeadForm({});
    }}
    className="rounded-lg bg-slate-200 px-4 py-2 text-slate-800 hover:bg-slate-300"
  >
    Cancel
  </button>
</div>
  </div>
   </div>
)}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <h3 className="font-bold">Readiness Score</h3>
                  <p className="mt-2 text-3xl font-extrabold">{score}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5">
  <h3 className="font-bold">Readiness Status</h3>
  <p className="mt-2 text-xl font-extrabold">{readinessLabel}</p>
  <p className="mt-2 text-sm text-slate-600">
    Based on the borrower’s quiz answers.
  </p>
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
                  </div>
                <div className="mt-6 grid gap-4 md:grid-cols-5">
  {["New Lead", "Contacted", "Application Started", "Pre-Approved", "Closed"].map((status) => (
    <div key={status} className="rounded-2xl bg-slate-50 p-4">
      <h3 className="text-sm font-bold">{status}</h3>
      <p className="mt-2 text-2xl font-extrabold">
        {leads.filter((lead) => (lead.status || "New Lead") === status).length}
      </p>
    </div>
  ))}
</div>
                 <div className="rounded-2xl bg-slate-50 p-5 md:col-span-3">
                   <div className="mb-4 flex gap-4">
  <input
    type="text"
    placeholder="Search by name, email, or phone..."
    value={leadSearch}
    onChange={(e) => setLeadSearch(e.target.value)}
    className="flex-1 rounded-lg border px-3 py-2"
  />

  <select
    value={leadSort}
    onChange={(e) => setLeadSort(e.target.value)}
    className="rounded-lg border px-3 py-2"
  >
    <option value="newest">Newest First</option>
    <option value="oldest">Oldest First</option>
    <option value="highest">Highest Price</option>
    <option value="lowest">Lowest Price</option>
  </select>
</div>
    <div className="mb-6 grid gap-4 md:grid-cols-3 lg:grid-cols-9">
  <div className="rounded-2xl bg-slate-50 p-4">
    <p className="text-sm text-slate-600">Total Leads</p>
    <p className="text-2xl font-bold">{leads.length}</p>
  </div>

  <div className="rounded-2xl bg-blue-50 p-4">
    <p className="text-sm text-slate-600">New Leads</p>
    <p className="text-2xl font-bold">
      {leads.filter((lead) => lead.status === "New Lead").length}
    </p>
  </div>

  <div className="rounded-2xl bg-yellow-50 p-4">
    <p className="text-sm text-slate-600">Application Started</p>
    <p className="text-2xl font-bold">
      {leads.filter((lead) => lead.status === "Application Started").length}
    </p>
  </div>

  <div className="rounded-2xl bg-green-50 p-4">
    <p className="text-sm text-slate-600">Pre-Approved</p>
    <p className="text-2xl font-bold">
      {leads.filter((lead) => lead.status === "Pre-Approved").length}
    </p>
  </div>

  <div className="rounded-2xl bg-purple-50 p-4">
    <p className="text-sm text-slate-600">Documents Uploaded</p>
    <p className="text-2xl font-bold">{uploadedDocuments.length}</p>
  </div>
      <div className="rounded-2xl bg-purple-100 p-4">
  <p className="text-sm text-slate-600">Underwriting</p>
  <p className="text-2xl font-bold">
    {leads.filter((lead) => lead.status === "Underwriting").length}
  </p>
</div>

<div className="rounded-2xl bg-emerald-50 p-4">
  <p className="text-sm text-slate-600">Clear to Close</p>
  <p className="text-2xl font-bold">
    {leads.filter((lead) => lead.status === "Clear to Close").length}
  </p>
</div>

<div className="rounded-2xl bg-green-100 p-4">
  <p className="text-sm text-slate-600">Closed</p>
  <p className="text-2xl font-bold">
    {leads.filter((lead) => lead.status === "Closed").length}
  </p>
</div>

<div className="rounded-2xl bg-red-50 p-4">
  <p className="text-sm text-slate-600">Canceled / Withdrawn</p>
  <p className="text-2xl font-bold">
    {leads.filter((lead) => lead.status === "Canceled / Withdrawn").length}
  </p>
</div>
</div>    
                   <div className="mt-6 rounded-2xl bg-white p-5 shadow">
  <h3 className="mb-4 text-lg font-bold text-slate-800">
    Mortgage Pipeline Visualization
  </h3>

  <div className="grid gap-3 md:grid-cols-7">
    {[
      "New Lead",
      "Contacted",
      "Application Started",
      "Underwriting",
      "Pre-Approved",
      "Clear to Close",
      "Closed",
    ].map((stage) => {
      const stageCount = leads.filter((lead) => lead.status === stage).length;

      return (
        <div
          key={stage}
          className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center"
        >
          <p className="text-xs font-semibold text-slate-600">{stage}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{stageCount}</p>
        </div>
      );
    })}
  </div>

  <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
    <span>New Lead</span>
    <span>→</span>
    <span>Contacted</span>
    <span>→</span>
    <span>Application Started</span>
    <span>→</span>
    <span>Underwriting</span>
    <span>→</span>
    <span>Pre-Approved</span>
    <span>→</span>
    <span>Clear to Close</span>
    <span>→</span>
    <span>Closed</span>
  </div>
</div>
  <h3 className="font-bold">Captured Leads</h3>
  <p className="mt-2 text-3xl font-extrabold">
{
  leads.filter((lead) =>
    `${lead.name} ${lead.lastName} ${lead.email} ${lead.phone}`
      .toLowerCase()
      .includes(leadSearch.toLowerCase())
  ).length
}
</p>

  <div className="mt-4 grid gap-4 md:grid-cols-2">
    {leads
  .filter((lead) =>
    `${lead.name} ${lead.lastName} ${lead.email} ${lead.phone}`
      .toLowerCase()
      .includes(leadSearch.toLowerCase())
  )
  .sort((a, b) => {
  if (leadSort === "oldest") {
    return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
  }

  if (leadSort === "highest") {
    return Number(b.purchasePrice || 0) - Number(a.purchasePrice || 0);
  }

  if (leadSort === "lowest") {
    return Number(a.purchasePrice || 0) - Number(b.purchasePrice || 0);
  }

  return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
})
.map((lead, index) => (
      <div
        key={index}
        className="rounded-xl border bg-white p-4 text-sm shadow-sm"
      >
        <p><strong>Name:</strong> {lead.name} {lead.lastName}</p>
        <p><strong>Email:</strong> {lead.email}</p>
        <p>
  <strong>Phone:</strong>{" "}
  {lead.phone
    ? lead.phone.replace(
        /(\d{3})(\d{3})(\d{4})/,
        "($1) $2-$3"
      )
    : ""}
</p>
        <p>
  <strong>Purchase Price:</strong>{" "}
  {lead.purchasePrice
    ? Number(lead.purchasePrice).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })
    : ""}
</p>
        <p><strong>Credit Score:</strong> {lead.creditScore}</p>
        <p><strong>Goals:</strong> {lead.goal}</p>
        <p><strong>Referral Source:</strong> {lead.referralSource || "Not Provided"}</p>
        <p><strong>Notes:</strong> {lead.notes || "No Notes"}</p>
        <div className="mt-2">
  <label className="mr-2 text-sm font-bold">Status:</label>
  <select
      value={lead.status || "New Lead"}
  onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
  className="rounded-lg border px-2 py-1 text-sm"
>
    <option>New Lead</option>
    <option>Contacted</option>
    <option>Application Started</option>
    <option>Pre-Approved</option>
    <option>Underwriting</option>
<option>Clear to Close</option>
<option>Closed</option>
<option>Canceled / Withdrawn</option>
    
  </select>
</div>
        <div
  className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
    lead.status === "Closed"
  ? "bg-green-200 text-green-800"
  : lead.status === "Clear to Close"
  ? "bg-emerald-100 text-emerald-700"
  : lead.status === "Underwriting"
  ? "bg-purple-100 text-purple-700"
  : lead.status === "Pre-Approved"
  ? "bg-green-100 text-green-700"
  : lead.status === "Application Started"
  ? "bg-orange-100 text-orange-700"
  : lead.status === "Canceled / Withdrawn"
  ? "bg-red-100 text-red-700"
  : "bg-blue-100 text-blue-700"
  }`}
          >
          {lead.status || "New Lead"}
</div>
          <p className="mt-2 text-xs text-slate-500">
  Submitted: {lead.submittedAt}
</p>
<div className="mt-4 rounded-lg border bg-slate-50 p-3">
  <p className="mb-2 font-bold">Upload Documents</p>

  <select
    value={documentType}
    onChange={(e) => setDocumentType(e.target.value)}
    className="mb-2 w-full rounded-lg border px-2 py-1 text-sm"
  >
    <option>Pay Stub</option>
    <option>W-2</option>
    <option>Bank Statement</option>
    <option>Tax Return</option>
    <option>Driver's License</option>
    <option>Purchase Contract</option>
    <option>Rent History</option>
    <option>Other</option>
  </select>

 <input
  type="file"
  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
    className="mb-2 w-full text-sm"
  />

  <button
    onClick={() => handleDocumentUpload(lead.id)}
    disabled={uploading}
    className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
  >
    {uploading ? "Uploading..." : "Upload Document"}
  </button>
 <button
  onClick={() => setViewingDocumentsLeadId(lead.id)}
  className="ml-2 rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
>
  View Documents ({uploadedDocuments.filter((doc) => doc.lead_id === lead.id).length})
</button>

<button
  onClick={() => downloadAllDocuments(lead.id)}
  className="mt-3 ml-2 rounded-lg bg-purple-600 px-3 py-2 text-white hover:bg-purple-700"
>
  Download All
</button>
  <button
  onClick={() => setViewingActivityLeadId(lead.id)}
  className="mt-3 ml-2 rounded-lg bg-slate-600 px-3 py-2 text-white hover:bg-slate-700"
>
  Activity Log
</button>
</div>

<button
  onClick={() => {
    setEditingLeadId(lead.id);
    setEditLeadForm(lead);
  }}
  className="mt-3 mr-2 rounded-lg bg-slate-900 px-3 py-2 text-white hover:bg-slate-700"
>
  Edit Lead
</button>

<button
  onClick={async () => {
    await supabase
      .from("leads")
      .delete()
      .eq("id", lead.id);

    setLeads(leads.filter((l) => l.id !== lead.id));
  }}
  className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
>
  Delete Lead
</button>    
      </div>
    ))}
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
