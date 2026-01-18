import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types ready for backend integration
export interface Interview {
  id: string;
  jobTitle: string;
  company: string;
  date: string;
  score: number;
  jobDescription?: string;
  interviewType?: 'behavioral' | 'technical' | 'case_study';
  interviewerPersona?: 'casual' | 'technical' | 'stressful';
}

export interface PastInterview {
  id: number
  job_description: string; 
  type?: 'behavioral' | 'technical' | 'case_study';
  feedback: string;
  created_at: string;
  company_name: string; 
  job_title: string;
  chat_history: string; //might be an array?
  score: number;
}

export interface InterviewPayload {
  jobDescription: string;
  interviewType: 'behavioral' | 'technical' | 'case_study';
  interviewerPersona: 'casual' | 'technical' | 'stressful';
}

export interface InterviewStats {
  totalInterviews: number;
  averageScore: number;
  bestScore: number;
}

interface InterviewContextType {
  interviews: Interview[];
  stats: InterviewStats;
  isLoading: boolean;
  error: string | null;
  fetchInterviews: () => Promise<void>;
  startInterview: (payload: InterviewPayload) => Promise<{ success: boolean; error: string | null }>;
  getInterview: (id: string) => Interview | undefined;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export interface FeedbackData {
  score: number; // Score out of 100
  feedback: string;
  jobTitle: string;
  jobDescription: string;
  company: string;
  date: string;
}

// Mock data - will be replaced with backend data
const mockInterviews: Interview[] = [
  { id: "1", jobTitle: "Senior Frontend Developer", company: "TechCorp Inc.", date: "Jan 15, 2026", score: 92 },
  { id: "2", jobTitle: "Full Stack Engineer", company: "StartupXYZ", date: "Jan 12, 2026", score: 78 },
  { id: "3", jobTitle: "React Developer", company: "Digital Agency", date: "Jan 8, 2026", score: 85 },
  { id: "4", jobTitle: "Software Engineer", company: "BigTech Co.", date: "Jan 5, 2026", score: 67 },
];

const calculateStats = (interviews: Interview[]): InterviewStats => {
  if (interviews.length === 0) {
    return { totalInterviews: 0, averageScore: 0, bestScore: 0 };
  }
  
  const scores = interviews.map(i => i.score);
  return {
    totalInterviews: interviews.length,
    averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    bestScore: Math.max(...scores),
  };
};

export const InterviewProvider = ({ children }: { children: ReactNode }) => {
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate stats from interviews
  const stats = calculateStats(interviews);

  // Fetch all interviews - will be replaced with backend call
  const fetchInterviews = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // TODO: Replace with backend call
      // const { data, error } = await supabase.from('interviews').select('*').order('created_at', { ascending: false });
      
      // if (error) throw error;
      // setInterviews(data);
      
      setInterviews(mockInterviews);
    } catch (err) {
      console.error('Failed to fetch interviews:', err);
      setError('Failed to load interviews');
    } finally {
      setIsLoading(false);
    }
  };

  // Start a new interview session - will be replaced with backend call
  const startInterview = async (payload: InterviewPayload): Promise<{ success: boolean; error: string | null }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // TODO: Replace with backend call
      // const response = await fetch('/api/init-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });
      // if (!response.ok) throw new Error('Failed to start session');
      // const data = await response.json();
      
      console.log('Starting interview with payload:', payload);
      
      // Mock success
      return { success: true, error: null };
    } catch (err) {
      console.error('Failed to start interview:', err);
      const errorMessage = 'Failed to start interview session';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Get a specific interview by ID
  const getInterview = (id: string): Interview | undefined => {
    return interviews.find(interview => interview.id === id);
  };

  return (
    <InterviewContext.Provider value={{ 
      interviews, 
      stats, 
      isLoading, 
      error, 
      fetchInterviews, 
      startInterview,
      getInterview 
    }}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
