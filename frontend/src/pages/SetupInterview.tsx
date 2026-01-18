import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, FileText, MessageSquare, Code, Users, Lightbulb, Briefcase, Building2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type InterviewType = "technical" | "case-study" | "behavioral";

export interface InterviewSetupData {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  interviewType: InterviewType;
}

const interviewTypes = [
  {
    value: "technical" as InterviewType,
    label: "Technical",
    description: "Coding & system design",
    icon: Code,
  },
  {
    value: "case-study" as InterviewType,
    label: "Case Study",
    description: "Problem-solving scenarios",
    icon: Lightbulb,
  },
  {
    value: "behavioral" as InterviewType,
    label: "Behavioral",
    description: "Past experiences & soft skills",
    icon: Users,
  },
];

export default function SetupInterview() {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedType, setSelectedType] = useState<InterviewType>("technical");

  // Extract data for backend submission
  const getInterviewSetupData = (): InterviewSetupData => ({
    jobTitle: jobTitle.trim(),
    companyName: companyName.trim(),
    jobDescription: jobDescription.trim(),
    interviewType: selectedType,
  });

  const handleStartInterview = () => {
    const setupData = getInterviewSetupData();
    // Pass the setup data to the interview room via state
    navigate("/interview", { state: setupData });
  };

  const isValid = jobTitle.trim().length > 0 && companyName.trim().length > 0 && jobDescription.trim().length > 50;

  return (
    <>
      <Layout>
        <div className="p-6 lg:p-8 max-w-4xl mx-auto relative z-20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Set Up Your Interview
            </h1>
            <p className="text-muted-foreground">
              Paste the job description and choose your interview style
            </p>
          </motion.div>

          {/* Job Title Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>Job Title</CardTitle>
                    <CardDescription>
                      Enter the position you're interviewing for
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="e.g. Senior Frontend Developer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Company Name Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <CardTitle>Company Name</CardTitle>
                    <CardDescription>
                      Enter the company you're applying to
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="e.g. Google, Microsoft, Startup Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Job Description Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle>Job Description</CardTitle>
                    <CardDescription>
                      Paste the full job description for tailored questions
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste the job description here...

Example:
We are looking for a Senior Frontend Developer with 5+ years of experience in React, TypeScript, and modern web technologies. You will be responsible for building scalable UI components..."
                  className="min-h-[200px] resize-none"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-muted-foreground">
                    {jobDescription.length} characters
                  </span>
                  {jobDescription.length > 0 && jobDescription.length < 50 && (
                    <span className="text-sm text-warning">
                      Add more details for better results
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Interview Type Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Interview Type</CardTitle>
                    <CardDescription>
                      Choose the type of questions you want to practice
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ToggleGroup
                  type="single"
                  value={selectedType}
                  onValueChange={(value) => value && setSelectedType(value as InterviewType)}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  {interviewTypes.map((type) => (
                    <ToggleGroupItem
                      key={type.value}
                      value={type.value}
                      className={`flex-1 flex flex-col items-center gap-2 p-6 h-auto rounded-xl border-2 transition-all ${
                        selectedType === type.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <type.icon className={`w-8 h-8 ${
                        selectedType === type.value ? "text-primary" : "text-muted-foreground"
                      }`} />
                      <span className="font-semibold">{type.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {type.description}
                      </span>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </CardContent>
            </Card>
          </motion.div>

          {/* Start Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex justify-center"
          >
            <Button
              variant="hero"
              size="xl"
              onClick={handleStartInterview}
              disabled={!isValid}
              className="w-full sm:w-auto"
            >
              Start Interview
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>

          {!isValid && jobDescription.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-muted-foreground mt-4"
            >
              Please add at least 50 characters to the job description
            </motion.p>
          )}
        </div>
      </Layout>
    </>
  );
}
