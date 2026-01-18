import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Mic, MicOff, PhoneOff, MessageSquare } from "lucide-react";
import { useConversation } from "@elevenlabs/react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VoiceWaveform } from "@/components/VoiceWaveform";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendFinishedInterview } from "@/routes/routes"; 
import technicalPromptTemplate from "@/prompts/technical.prompt.txt?raw";
import behavioralPromptTemplate from "@/prompts/behavioral.prompt.txt?raw";
import caseStudyPromptTemplate from "@/prompts/caseStudy.prompt.txt?raw";

interface TranscriptMessage {
  role: "ai" | "user";
  text: string;
  isComplete?: boolean;
}

interface LocationState {
  jobTitle: string;
  jobDescription: string;
  companyName: string;
  interviewType: "technical" | "behavioral" | "case_study";
}


// function for defining prompt
function buildPrompt(template: string | undefined, vars: Record<string, string>) {
  if (!template) {
    console.warn("No template provided for buildPrompt");
    return "You are an AI interviewer. Ask technical and behavioral questions.";
  }
  let prompt = template;
  for (const [key, value] of Object.entries(vars)) {
    if (value) {
      prompt = prompt.replaceAll(`{{${key}}}`, value);
    }
  }
  return prompt;
}

// ElevenLabs Agent ID - replace with your agent ID if different
const ELEVENLABS_AGENT_ID = "agent_6101kf6wh22wek3tmx2e7w7w8yd7";

export default function InterviewRoom() {
  const navigate = useNavigate();
  const location = useLocation();

  // previous interview state
  const { 
    jobTitle, 
    companyName,
    jobDescription, 
    interviewType
  } = (location.state as LocationState) || {};

  //conversationId pointer
  const conversationIdRef = useRef<string | null>(null);
  // Transcript scroll ref
  const transcriptEndRef = useRef<HTMLDivElement>(null);
   // Transcript state - will be populated by ElevenLabs responses
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [pastInterview, setPastInterview] = useState<any>(null);


  // Auto-scroll to bottom when transcript updates
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcript]);
  // Audio/Interview state
  const [isMuted, setIsMuted] = useState(true);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  


  // Prompt templates
  const PROMPT_TEMPLATES: Record<string, string> = {
  behavioral: behavioralPromptTemplate,
  technical: technicalPromptTemplate,
  case_study: caseStudyPromptTemplate,
};


  // Custom agent prompt based on previous params
  const agentPrompt = useMemo(() => {
    const type = interviewType || "technical";
    return buildPrompt(PROMPT_TEMPLATES[type], {
      companyName: companyName || "Company",
      jobTitle: jobTitle || "Job Title",
      jobDescription: jobDescription || "No description provided",
    });
  }, [companyName, jobTitle, jobDescription]);
  // ElevenLabs Conversation Hook
  const conversation = useConversation({
      overrides: {
    agent: {
      prompt: {
        prompt: agentPrompt,
      },
     },
    },
  
    onConnect: () => {
      console.log("ElevenLabs: Connected to agent");
      setIsConnecting(false);
    },
    onDisconnect: async () => {
      console.log("ElevenLabs: Disconnected from agent");
      if (conversationIdRef.current) {
      const pi = await sendFinishedInterview(companyName,jobTitle,jobDescription,interviewType,conversationIdRef.current); 
      console.log(pi)
      setPastInterview(pi);
      }
    },
    onMessage: (message) => {
      console.log("=== ElevenLabs Message Received ===");
      console.log("Message:", message);
      console.log("Message Type:", typeof message);
      console.log("Message String:", JSON.stringify(message, null, 2));
      
      const msg = message as any;
      
      // Log all properties
      if (msg && typeof msg === 'object') {
        console.log("Message Properties:", Object.keys(msg));
        for (const key of Object.keys(msg)) {
          console.log(`  ${key}:`, msg[key]);
        }
      }
      
      // Simple approach: look for any string that looks like speech
      let transcript_text = null;
      let speaker_role = null;
      
      // Check all possible property names
      if (msg.user_transcript) {
        transcript_text = msg.user_transcript;
        speaker_role = "user";
      } else if (msg.user_transcription_event?.user_transcript) {
        transcript_text = msg.user_transcription_event.user_transcript;
        speaker_role = "user";
      } else if (msg.agent_response) {
        transcript_text = msg.agent_response;
        speaker_role = "ai";
      } else if (msg.agent_response_event?.agent_response) {
        transcript_text = msg.agent_response_event.agent_response;
        speaker_role = "ai";
      } else if (msg.transcript) {
        transcript_text = msg.transcript;
        speaker_role = msg.speaker === "user" ? "user" : "ai";
      } else if (msg.message) {
        transcript_text = msg.message;
        speaker_role = msg.speaker === "user" ? "user" : "ai";
      } else if (msg.text) {
        transcript_text = msg.text;
        speaker_role = msg.speaker === "user" ? "user" : "ai";
      }
      
      console.log("Parsed - Text:", transcript_text, "Role:", speaker_role);
      
      if (transcript_text && speaker_role) {
        console.log("Adding to transcript!");
        setTranscript(prev => [...prev, { role: speaker_role as any, text: transcript_text, isComplete: true }]);
      }
    },
    onError: (error) => {
      console.error("ElevenLabs Error:", error);
      setIsConnecting(false);
    },
  });

  // Derived state from ElevenLabs conversation
  const isConnected = conversation.status === "connected";
  const isInterviewerSpeaking = conversation.isSpeaking;
  const isUserSpeaking = !isMuted && isConnected && !isInterviewerSpeaking;

  // Start the ElevenLabs conversation
  const startInterview = useCallback(async () => {
    setIsConnecting(true);
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start ElevenLabs conversation session with public agent
      const conversationId = await conversation.startSession({
        agentId: ELEVENLABS_AGENT_ID,
      } as any); // Cast to any for public agent without auth token
      conversationIdRef.current = conversationId;
      console.log("Interview started with conversation ID:", conversationId);
      setIsMuted(false);
    } catch (error) {
      console.error("Failed to start interview:", error);
      setIsConnecting(false);
    }
  }, [conversation]);

  // Toggle microphone
  const toggleMicrophone = useCallback(() => {
    if (!isConnected) {
      startInterview();
      return;
    }
    setIsMuted(!isMuted);
  }, [isConnected, isMuted, startInterview]);

  // End the interview
  const handleEndInterview = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error("Error ending conversation:", error);
    }
    // Navigate to the feedback report
    
    //navigate("/report/current",{state: {pastInterview}});
  }, [conversation/*, navigate*/]);

  useEffect(() => {
  if (pastInterview) {
    navigate("/report/current", {
      state: { pastInterview },
    });
  }
}, [pastInterview, navigate]);

  return (
    <Layout showSidebar={false}>
      <div className="h-screen bg-sidebar flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-sidebar-border flex-shrink-0">
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">
              Interview in Progress
            </h1>
            <p className="text-sm text-sidebar-foreground/60">
              Senior Frontend Developer • TechCorp
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-muted'}`} />
            <span className="text-sm text-sidebar-foreground/80">
              {isConnected ? 'Live' : 'Not Connected'}
            </span>
          </div>
        </div>

        {/* Main Content - Flexible */}
        <div className="flex flex-col gap-4 p-3 lg:p-4 flex-1 overflow-hidden">
          {/* Mascot & Audio Status Area */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-shrink-0"
          >
            <Card className="bg-card border-border">
              <CardContent className="flex flex-col items-center justify-center p-4 min-h-[180px]">
                {/* Mascot Placeholder - TODO: Replace with your custom mascot */}
                <motion.div
                  animate={isInterviewerSpeaking ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                  transition={{ duration: 1.5, repeat: isInterviewerSpeaking ? Infinity : 0 }}
                  className="relative mb-6"
                >
                  {/* TODO: Replace this placeholder with your custom mascot component */}
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isInterviewerSpeaking 
                      ? 'gradient-hero shadow-glow' 
                      : 'bg-muted border-4 border-border'
                  }`}>
                    {/* Mascot placeholder - add your mascot here */}
                    <div className="text-center">
                      <span className="text-2xl">🎙️</span>
                      <p className="text-xs text-muted-foreground mt-1">AI</p>
                    </div>
                  </div>
                  {isInterviewerSpeaking && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-primary"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                {/* Status Text */}
                <h3 className="text-lg font-semibold text-card-foreground mb-1">
                  {!isConnected 
                    ? "Ready to Start"
                    : isInterviewerSpeaking 
                      ? "Interviewer Speaking..." 
                      : isUserSpeaking 
                        ? "You're Speaking..."
                        : "Listening..."}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {!isConnected
                    ? "Click the microphone button below to begin"
                    : isMuted 
                      ? "Your microphone is muted" 
                      : "Speak clearly into your microphone"}
                </p>

                {/* Voice Waveform */}
                <VoiceWaveform 
                  isActive={isInterviewerSpeaking || isUserSpeaking} 
                  barCount={32} 
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Transcript Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 min-h-0 overflow-hidden"
          >
            <Card className="bg-card border-border h-full flex flex-col">
              <CardHeader className="pb-2 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm">Live Transcript</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-4">
                <ScrollArea className="h-full w-full">
                  {transcript.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                      Transcript will appear here once the interview starts...
                    </div>
                  ) : (
                    <div className="space-y-3 pr-4">
                      {transcript.map((msg, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                              msg.role === "ai"
                                ? "bg-muted text-muted-foreground"
                                : "bg-primary text-primary-foreground"
                            }`}
                          >
                            <span className="font-medium text-xs block mb-1 opacity-70">
                              {msg.role === "ai" ? "Interviewer" : "You"}
                            </span>
                            {msg.text}
                          </div>
                        </motion.div>
                      ))}
                      <div ref={transcriptEndRef} />
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Control Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-sidebar border-t border-sidebar-border p-4 flex-shrink-0"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-4">
            {/* Microphone Button */}
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="icon"
              className="w-14 h-14 rounded-full"
              onClick={toggleMicrophone}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-current border-t-transparent rounded-full"
                />
              ) : isMuted ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </Button>

            {/* End Interview Button */}
            <Button
              variant="destructive"
              size="lg"
              className="rounded-full px-8"
              onClick={() => setShowEndConfirm(true)}
              disabled={!isConnected}
            >
              <PhoneOff className="w-5 h-5 mr-2" />
              End Interview
            </Button>
          </div>
        </motion.div>

        {/* End Confirmation Modal */}
        <AnimatePresence>
          {showEndConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowEndConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card rounded-2xl p-6 max-w-md w-full shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold mb-2">End Interview?</h3>
                <p className="text-muted-foreground mb-6">
                  Are you sure you want to end this interview? You'll receive your
                  feedback report after ending.
                </p>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowEndConfirm(false)}
                  >
                    Continue Interview
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleEndInterview}
                  >
                    End & Get Feedback
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
