import { useState, useCallback } from "react";
import { useConversation } from "@elevenlabs/react";
import { Phone, PhoneOff, Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ELEVENLABS_AGENT_ID = ""; // User must set their agent ID

interface VoiceCallProps {
  agentId?: string;
}

const VoiceCall = ({ agentId }: VoiceCallProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const effectiveAgentId = agentId || ELEVENLABS_AGENT_ID;

  const conversation = useConversation({
    onConnect: () => {
      console.log("Voice agent connected");
      toast.success("Voice call connected!");
    },
    onDisconnect: () => {
      console.log("Voice agent disconnected");
    },
    onError: (error) => {
      console.error("Voice agent error:", error);
      toast.error("Voice connection error. Please try again.");
    },
  });

  const startCall = useCallback(async () => {
    if (!effectiveAgentId) {
      toast.error("Voice agent not configured. Please set an ElevenLabs Agent ID.");
      return;
    }

    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const { data, error } = await supabase.functions.invoke(
        "elevenlabs-conversation-token",
        { body: { agentId: effectiveAgentId } }
      );

      if (error || !data?.token) {
        throw new Error(error?.message || "No token received");
      }

      await conversation.startSession({
        conversationToken: data.token,
        connectionType: "webrtc",
      });
    } catch (error: any) {
      console.error("Failed to start voice call:", error);
      if (error.name === "NotAllowedError") {
        toast.error("Microphone access is required for voice calls.");
      } else {
        toast.error("Failed to connect voice call.");
      }
    } finally {
      setIsConnecting(false);
    }
  }, [conversation, effectiveAgentId]);

  const endCall = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isActive = conversation.status === "connected";

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      {/* Status indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {isActive && (
          <>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>
              {conversation.isSpeaking ? (
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-primary animate-pulse" />
                  Agent speaking...
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5 text-primary" />
                  Listening...
                </span>
              )}
            </span>
          </>
        )}
        {!isActive && !isConnecting && (
          <span>Tap to start a voice call with our AI assistant</span>
        )}
        {isConnecting && <span>Connecting...</span>}
      </div>

      {/* Call button */}
      {isActive ? (
        <Button
          onClick={endCall}
          variant="destructive"
          size="lg"
          className="rounded-full w-16 h-16 p-0 shadow-lg animate-pulse"
          aria-label="End voice call"
        >
          <PhoneOff className="w-6 h-6" />
        </Button>
      ) : (
        <Button
          onClick={startCall}
          disabled={isConnecting}
          size="lg"
          className="rounded-full w-16 h-16 p-0 shadow-lg bg-green-600 hover:bg-green-700 text-white"
          aria-label="Start voice call"
        >
          {isConnecting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Phone className="w-6 h-6" />
          )}
        </Button>
      )}

      {/* Audio wave visualization when active */}
      {isActive && (
        <div className="flex items-center gap-0.5 h-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-primary rounded-full animate-bounce"
              style={{
                height: conversation.isSpeaking ? `${12 + Math.random() * 12}px` : "4px",
                animationDelay: `${i * 100}ms`,
                animationDuration: "0.6s",
                transition: "height 0.2s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceCall;
