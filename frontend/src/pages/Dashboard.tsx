import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Clock, Loader2, FileText, TrendingUp, Award } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import PastInterviewCard from "@/components/PastInterviewCard";
import { useAuth } from "@/contexts/AuthContext";
import { useInterview, InterviewPayload, PastInterview } from "@/contexts/InterviewContext";
import { fetchInterviews } from "@/routes/routes";



export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { interviews, stats, isLoading: interviewsLoading, startInterview } = useInterview();
  
  // State for the Setup Form
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jd, setJd] = useState("");
  const [type, setType] = useState<'behavioral' | 'technical' | 'case_study'>("behavioral");
  const [persona, setPersona] = useState<'casual' | 'technical' | 'stressful'>("casual");
  const [pastInterviews, setPastInterviews] = useState<PastInterview[] | null>(null);

  // Stats configuration for display
  const statsConfig = [
    { label: "Total Interviews", value: stats.totalInterviews.toString(), icon: Clock, color: "text-primary" },
    { label: "Average Score", value: stats.averageScore.toString(), icon: TrendingUp, color: "text-success" },
    { label: "Best Score", value: stats.bestScore.toString(), icon: Award, color: "text-accent" },
  ];

  // Function to send the data
  const handleStartInterview = async () => {
    if (!jd) return alert("Please enter a Job Description");
    
    setLoading(true);
    const payload: InterviewPayload = {
      jobDescription: jd,
      interviewType: type,
      interviewerPersona: persona,
    };
    
    const result = await startInterview(payload);

    if (result.success) {
      // Close modal and navigate to the interview room
      setOpen(false);
      setJd("");
      navigate("/interview");
    } else {
      alert(result.error || "Failed to start session");
    }
    
    setLoading(false);
  };

  // Helper functions
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const truncateText = (text?: string, maxLength: number = 150) => {
    if (!text) return 'No description available';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };
  
  // Get recent interviews
  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const data = await fetchInterviews();
        if (data) {
          setPastInterviews(data);
        }
      } catch (error) {
        console.error("Failed to fetch interviews:", error);
      }
    };
    loadInterviews();
  }, []);

  /*const pastInterviews: PastInterview[] = [
  {
    id: 1,
    job_description: "Design and implement scalable REST APIs using FastAPI and PostgreSQL. Optimize database queries and ensure secure authentication flows.",
    type: "technical",
    feedback: "Strong understanding of backend architecture and API design. Minor gaps in database indexing strategies.",
    created_at: "2026-01-10T14:32:00Z",
    company_name: "Stripe",
    job_title: "Backend Software Engineer",
    chat_history: "Discussed API versioning, authentication methods, and query optimization techniques.",
    score: 82,
  },
  {
    id: 2,
    job_description: "Lead cross-functional teams to deliver user-facing features. Resolve conflicts, mentor junior engineers, and communicate progress to stakeholders.",
    type: "behavioral",
    feedback: "Excellent communication skills and clear leadership examples. Could provide more measurable outcomes.",
    created_at: "2026-01-12T18:05:00Z",
    company_name: "Shopify",
    job_title: "Senior Frontend Engineer",
    chat_history: "Answered STAR-based questions about leadership challenges and team collaboration.",
    score: 88,
  },
  {
    id: 3,
    job_description: "Analyze ambiguous business problems, structure solutions, and present data-driven recommendations to executives.",
    type: "case_study",
    feedback: "Well-structured approach and strong analytical thinking. Assumptions should be validated more explicitly.",
    created_at: "2026-01-14T09:20:00Z",
    company_name: "McKinsey & Company",
    job_title: "Business Analyst",
    chat_history: "Walked through market sizing, hypothesis-driven analysis, and final recommendations.",
    score: 85,
  },
  {
    id: 4,
    job_description: "Build responsive web interfaces using React and TypeScript. Collaborate with designers to translate Figma mockups into production code.",
    type: "technical",
    feedback: "Clean component structure and strong TypeScript usage. Could improve performance optimizations.",
    created_at: "2026-01-16T21:47:00Z",
    company_name: "Vercel",
    job_title: "Frontend Engineer",
    chat_history: "Reviewed component composition, hooks usage, and rendering performance.",
    score: 79,
  },
];
*/

  return (
    <Layout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-foreground"
          >
            Welcome Back{user?.email ? `, ${user.email.split('@')[0]}` : ''}! 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            Ready to ace your next interview?
          </motion.p>
        </div>

        {/* Recent Interviews */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Recent Interviews
            </h2>
          </div>

          
          {/* interviewsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : pastInterviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {pastInterviews.map((interview, index) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => navigate(`/report/${interview.id}`)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-muted-foreground">
                            {formatDate(interview.date || interview.createdAt)}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground line-clamp-3">
                        {interview.jobTitle || truncateText(interview.jobDescription, 150)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No interviews yet</h3>
                <p className="text-muted-foreground">
                  Start your first AI interview practice session from the sidebar
                </p>
              </CardContent>
            </Card>
          )*/}

          { pastInterviews === null ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : pastInterviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {pastInterviews.map( pastInterview => (
                < PastInterviewCard key={pastInterview.id} pastInterview={pastInterview}/>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No interviews yet</h3>
                <p className="text-muted-foreground">
                  Start your first AI interview practice session from the sidebar
                </p>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </Layout>
  );
}
