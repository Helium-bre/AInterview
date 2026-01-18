import { motion } from "framer-motion";
import { PastInterview } from "@/contexts/InterviewContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, Loader2, FileText, TrendingUp, Award } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";


const PastInterviewCard = ({ pastInterview }: { pastInterview: PastInterview }) => {
  const navigate = useNavigate();
    
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card
        className="cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => navigate(`/report/${pastInterview.id}`, { state: { pastInterview } })}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">
                {formatDate(pastInterview.created_at)}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-foreground line-clamp-3">
            {pastInterview.job_title ||
              truncateText(pastInterview.job_description, 150)}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PastInterviewCard;
