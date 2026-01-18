import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

interface ScoreCardProps {
  id: string;
  jobTitle: string;
  company: string;
  date: string;
  score: number;
  index: number;
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-destructive";
}

function getScoreBadge(score: number) {
  if (score >= 90) return { label: "Excellent", class: "bg-success/10 text-success border-success/20" };
  if (score >= 80) return { label: "Great", class: "bg-success/10 text-success border-success/20" };
  if (score >= 70) return { label: "Good", class: "bg-warning/10 text-warning border-warning/20" };
  if (score >= 60) return { label: "Fair", class: "bg-warning/10 text-warning border-warning/20" };
  return { label: "Needs Work", class: "bg-destructive/10 text-destructive border-destructive/20" };
}

export function ScoreCard({ id, jobTitle, company, date, score, index }: ScoreCardProps) {
  const badge = getScoreBadge(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                {jobTitle}
              </h3>
              <p className="text-sm text-muted-foreground">{company}</p>
            </div>
            <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
          </div>
        </CardHeader>
        
        <CardContent className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {date}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${badge.class}`}>
              {badge.label}
            </span>
          </div>
          
          {/* Score Progress Bar */}
          <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-hero rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </CardContent>
        
        <CardFooter className="pt-3 border-t border-border">
          <Link to={`/report/${id}`} className="w-full">
            <Button variant="ghost" className="w-full group/btn">
              View Report
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
