import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PastInterview, FeedbackData } from "@/contexts/InterviewContext";






// Interface for feedback data - ready for backend integration




// Mock data for now - replace with actual API call
/*
const mockFeedback: PastInterview = {
  score: 85,
  positives: [
    "Demonstrated strong technical knowledge when explaining system design concepts.",
    "Communication was clear and concise, making complex topics easy to understand.",
    "Showed good problem-solving skills when addressing hypothetical scenarios.",
    "Maintained confident body language and professional demeanor throughout.",
    "Provided relevant examples from past work experience effectively.",
  ],
  negatives: [
    "Could elaborate more on specific technical implementation details.",
    "Consider maintaining more consistent eye contact during responses.",
    "Some answers could benefit from using the STAR method for better structure.",
    "Could improve pacing - some responses felt slightly rushed.",
    "Add more quantifiable achievements and metrics to strengthen answers.",
  ],
  jobTitle: "Senior Frontend Developer",
  company: "TechCorp",
  date: "Jan 17, 2026",
};
*/
``
export default function FeedbackReport( {} ) {
  const location = useLocation();
  console.log("Location state:", location.state);
  // const { id } = useParams();
  const [feedback, setFeedback] = useState<PastInterview | null>(location.state.pastInterview);
  const [loading, setLoading] = useState(false);
  
  // Fetch feedback data - ready for backend integration
  /*
  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {

        //await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
        setFeedback(feedbackData);  
        //setFeedback(mockFeedback);
        
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [id]); */

  // while(true) {
  //   console.log(location.state)
  //   console.log(location.state.pastInterview)
  // }

  // Helper to get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 lg:p-8 max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="flex-1">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <Skeleton className="h-48 w-full mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  if (!feedback) {
    return (
      <Layout>
        <div className="p-6 lg:p-8 max-w-3xl mx-auto text-center">
          <p className="text-muted-foreground">Failed to load feedback.</p>
          <Link to="/dashboard">
            <Button variant="outline" className="mt-4">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-foreground"
            >
              Interview Feedback
            </motion.h1>
            {(feedback.job_title || feedback.company_name || feedback.created_at) && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground"
              >
                {[feedback.job_title, feedback.company_name, feedback.created_at].filter(Boolean).join(" • ")}
              </motion.p>
            )}
          </div>
        </div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-sm uppercase tracking-wide mb-2">
                Your Score
              </p>
              <div className="flex items-baseline gap-1">
                <span className={`text-7xl font-bold ${getScoreColor(feedback.score)}`}>
                  {feedback.score}
                </span>
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Positives & Negatives */}
        <div className="grid md:grid-cols-1 gap-6 mb-8">
          {/* Positives */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-green-500">Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                { /*
                <ul className="space-y-3">
                  {feedback.positives.map((point, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="flex gap-3"
                    >
                      <span className="text-green-500 font-bold shrink-0">+</span>
                      <span className="text-foreground text-sm">{point}</span>
                    </motion.li>
                  ))}
                </ul> */
                }

                <p>{feedback.feedback}</p>
              </CardContent>
            </Card>
          </motion.div>

        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/setup">
            <Button variant="hero" size="lg">
              Practice Again
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" size="lg">
              Back to Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
}
