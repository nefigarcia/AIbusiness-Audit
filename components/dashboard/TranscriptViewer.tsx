import { MessageSquare, Clock } from "lucide-react";
import type { CallTranscript } from "@/types";

interface Props {
  transcript: CallTranscript;
}

export function TranscriptViewer({ transcript }: Props) {
  const lines = transcript.rawTranscript
    .split("\n")
    .filter((l: string) => l.trim().length > 0);

  return (
    <div className="bg-[#0f1625] border border-white/8 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-violet-400" />
          <h3 className="text-white font-semibold text-sm">Call Transcript</h3>
        </div>
        {transcript.callDuration && (
          <div className="flex items-center gap-1.5 text-white/30 text-xs">
            <Clock className="w-3 h-3" />
            {Math.floor(transcript.callDuration / 60)}m {transcript.callDuration % 60}s
          </div>
        )}
      </div>

      {transcript.summary && (
        <div className="px-5 py-4 bg-violet-500/5 border-b border-white/5">
          <div className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-1">
            Summary
          </div>
          <p className="text-white/70 text-sm leading-relaxed">{transcript.summary}</p>
        </div>
      )}

      <div className="p-5 max-h-96 overflow-y-auto space-y-3 scrollbar-thin">
        {lines.map((line: string, i: number) => {
          const isAI = line.toLowerCase().startsWith("ai:") ||
            line.toLowerCase().startsWith("assistant:") ||
            line.toLowerCase().startsWith("rosys:");
          const isHuman = line.toLowerCase().startsWith("user:") ||
            line.toLowerCase().startsWith("human:") ||
            line.toLowerCase().startsWith("lead:");

          const content = (isAI || isHuman)
            ? line.replace(/^[^:]+:\s*/i, "")
            : line;

          return (
            <div
              key={i}
              className={`flex gap-3 ${isHuman ? "justify-end" : ""}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
                  isAI
                    ? "bg-violet-500/10 text-violet-100 border border-violet-500/15"
                    : isHuman
                    ? "bg-white/8 text-white/80 border border-white/10"
                    : "text-white/40 text-xs italic max-w-full"
                }`}
              >
                {(isAI || isHuman) && (
                  <div className="text-[10px] font-bold uppercase tracking-wide opacity-40 mb-1">
                    {isAI ? "AI Auditor" : "Business Owner"}
                  </div>
                )}
                {content}
              </div>
            </div>
          );
        })}
        {lines.length === 0 && (
          <p className="text-white/20 text-sm">Transcript content unavailable.</p>
        )}
      </div>
    </div>
  );
}
