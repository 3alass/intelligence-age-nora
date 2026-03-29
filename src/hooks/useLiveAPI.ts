import { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { AudioStreamer, AudioRecorder } from '../lib/audio';

const SYSTEM_INSTRUCTION = `Role: You are Nora, the 24/7 Front-Desk Specialist. You are a highly professional, human-sounding employee. You are not an AI assistant; you are a solution to the "Missed Call" problem.

Objective: Convert every caller into a captured lead. Your priority is to get the Name, Service Needed, Location, and Phone Number.

Voice & Persona:
- Empathetic & Calm: Essential for high-stress leads (Bail Bonds/Lockouts).
- Action-Oriented: Do not explain that you are "trained" or "processing data." Just do the work.
- Pro-Active: If a user is a business owner, your goal is to demonstrate value. Immediately offer a roleplay: "The best way to see how I save your revenue is to try me. Pretend you’re a customer calling at 3 AM with an emergency. Go ahead, tell me your problem."

Handling the "Hot Prospects" (From Audit):
- For Locksmiths (e.g., SOS Locksmith): Focus on immediate dispatch. Ask for the address and the type of lock (auto/residential).
- For Bail Bonds (e.g., Empire Bail Bonds): Focus on the urgency of the arrest. Ask for the defendant's name and location.
- For Cleaning (e.g., MyClean): Focus on the property type and preferred time.

Strict Rules:
- Never say "As an AI..."
- Never use robotic phrases like "How can I assist you today?" Instead, use "I’m glad I caught your call—how can I help you right now?"
- If asked if you are a robot, say: "I'm the dedicated coordinator for this office. I'm here 24/7 so you never have to worry about a missed call."`;

export function useLiveAPI() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<{role: string, text: string}[]>([]);
  
  const sessionRef = useRef<any>(null);
  const audioStreamerRef = useRef<AudioStreamer | null>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);
      setTranscripts([]);

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      audioStreamerRef.current = new AudioStreamer();
      await audioStreamerRef.current.init();

      const sessionPromise = ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);
            
            audioRecorderRef.current = new AudioRecorder((base64Data) => {
               sessionPromise.then((session) => {
                 session.sendRealtimeInput({
                   audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
                 });
               });
            });
            audioRecorderRef.current.start();
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn) {
               const parts = message.serverContent.modelTurn.parts;
               for (const part of parts) {
                 if (part.inlineData && part.inlineData.data) {
                   audioStreamerRef.current?.addChunk(part.inlineData.data);
                 }
                 if (part.text) {
                   setTranscripts(prev => [...prev, { role: 'model', text: part.text as string }]);
                 }
               }
            }
            if (message.serverContent?.interrupted) {
               audioStreamerRef.current?.stop();
               audioStreamerRef.current?.resume();
            }
            // @ts-ignore
            if (message.serverContent?.turnComplete) {
               // turn complete
            }
          },
          onclose: () => {
            disconnect();
          },
          onerror: (e) => {
            console.error("Live API Error:", e);
            setError("Connection error occurred.");
            disconnect();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } },
          },
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });
      
      sessionRef.current = await sessionPromise;
      
    } catch (err: any) {
      console.error("Failed to connect:", err);
      setError(err.message || "Failed to connect to Live API");
      setIsConnecting(false);
      disconnect();
    }
  }, []);

  const disconnect = useCallback(() => {
    if (sessionRef.current) {
      try {
        sessionRef.current.close();
      } catch (e) {}
      sessionRef.current = null;
    }
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop();
      audioRecorderRef.current = null;
    }
    if (audioStreamerRef.current) {
      audioStreamerRef.current.close();
      audioStreamerRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  return {
    isConnected,
    isConnecting,
    error,
    transcripts,
    connect,
    disconnect
  };
}
