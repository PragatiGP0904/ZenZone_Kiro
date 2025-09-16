// src/components/ProgressChart.jsx
import { useEffect, useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ComposedChart, Bar } from "recharts";
import { getLogs, clearLogs, getStreak, getTrend } from "../Memory";
import { progressTrackingService } from "../services/ProgressTrackingService";

export default function ProgressChart() {
  const [logs, setLogs] = useState(getLogs());
  const [streak, setStreak] = useState(0);
  const [trend, setTrend] = useState("flat");
  const [enhancedProgress, setEnhancedProgress] = useState(null);
  const [showAIInsights, setShowAIInsights] = useState(false);

  const refresh = () => {
    setLogs(getLogs());
    setStreak(getStreak());
    setTrend(getTrend());
    
    // Load AI-enhanced progress data
    try {
      const enhanced = progressTrackingService.getEnhancedProgress();
      setEnhancedProgress(enhanced);
    } catch (error) {
      console.error('Error loading enhanced progress:', error);
      setEnhancedProgress(null);
    }
  };

  useEffect(() => { refresh(); }, []);

  const data = useMemo(() => {
    return logs.map(l => ({
      date: new Date(l.date).toLocaleDateString(),
      mood: l.mood,
      note: l.note
    }));
  }, [logs]);

  // AI-enhanced correlation data
  const correlationData = useMemo(() => {
    try {
      return progressTrackingService.getMoodConversationCorrelation();
    } catch (error) {
      console.error('Error getting correlation data:', error);
      return [];
    }
  }, [logs, enhancedProgress]);

  const peek = useMemo(() => {
    // Enhanced insights with AI conversation data
    const aiStats = enhancedProgress?.aiInteractionStats;
    const aiMetrics = enhancedProgress?.aiMetrics;
    
    if (aiStats && aiStats.totalInteractions > 0) {
      const qualityRatio = aiStats.highQualityCount / aiStats.totalInteractions;
      const positiveImpactRatio = aiMetrics?.moodImpactDistribution?.positive / aiStats.totalInteractions || 0;
      
      if (streak >= 7 && qualityRatio > 0.6) {
        return "🔥 Amazing! 7-day streak with high-quality AI conversations!";
      }
      if (positiveImpactRatio > 0.7) {
        return "🌟 Your AI conversations are having a positive impact on your mood!";
      }
      if (qualityRatio > 0.5) {
        return "💬 Great engagement with your AI companion - keep it up!";
      }
    }
    
    // Fallback to original insights
    if (streak >= 7) return "🔥 7-day consistency! Habits are forming.";
    if (streak >= 3) return "🎉 3-day streak—keep the momentum!";
    if (trend === "up") return "🌟 Upward trend—something's working!";
    if (trend === "down") return "💙 Rough patch—be extra kind to yourself.";
    return "✨ Showing up matters. One check-in at a time.";
  }, [streak, trend, enhancedProgress]);

  // AI insights summary
  const aiInsights = useMemo(() => {
    if (!enhancedProgress?.aiInteractionStats) return null;
    
    const stats = enhancedProgress.aiInteractionStats;
    const metrics = enhancedProgress.aiMetrics;
    
    return {
      totalConversations: stats.totalInteractions,
      qualityScore: Math.round(stats.averageQuality * 100),
      positiveImpact: Math.round((metrics?.moodImpactDistribution?.positive / stats.totalInteractions || 0) * 100),
      supportLevel: enhancedProgress.supportLevel,
      achievements: enhancedProgress.achievements?.length || 0
    };
  }, [enhancedProgress]);

  return (
    <div className="card" style={{ display:"grid", gap:12 }}>
      <div className="flex" style={{ justifyContent:"space-between" }}>
        <div>
          <div style={{ fontWeight:700, fontSize:18 }}>Your Mood Over Time</div>
          <div className="small">
            Streak: {streak} day(s) • Trend: {trend}
            {aiInsights && (
              <span> • AI Conversations: {aiInsights.totalConversations}</span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {aiInsights && (
            <button 
              className="button" 
              style={{ background: showAIInsights ? "#3b82f6" : "#6b7280" }}
              onClick={() => setShowAIInsights(!showAIInsights)}
            >
              AI Insights
            </button>
          )}
          <button className="button" style={{ background:"#ef4444" }} onClick={() => { if (confirm("Clear all logs?")) { clearLogs(); refresh(); }}}>
            Clear Logs
          </button>
        </div>
      </div>

      <div className="badge" style={{ background:"#fff7ed" }}>{peek}</div>

      {/* AI Insights Panel */}
      {showAIInsights && aiInsights && (
        <div className="card" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <div style={{ fontWeight: 600, marginBottom: 12, color: "#1e293b" }}>
            🤖 AI Conversation Insights
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#3b82f6" }}>
                {aiInsights.totalConversations}
              </div>
              <div className="small">Conversations</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#10b981" }}>
                {aiInsights.qualityScore}%
              </div>
              <div className="small">Quality Score</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#f59e0b" }}>
                {aiInsights.positiveImpact}%
              </div>
              <div className="small">Positive Impact</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#8b5cf6" }}>
                {aiInsights.achievements}
              </div>
              <div className="small">Achievements</div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Chart */}
      <div style={{ height: showAIInsights && correlationData.length > 0 ? 320 : 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          {showAIInsights && correlationData.length > 0 ? (
            <ComposedChart data={correlationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedDate" />
              <YAxis yAxisId="mood" domain={[0, 10]} ticks={[0,2,4,6,8,10]} />
              <YAxis yAxisId="quality" orientation="right" domain={[0, 1]} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'mood' ? value : (value * 100).toFixed(0) + '%',
                  name === 'mood' ? 'Mood' : 'Conversation Quality'
                ]}
              />
              <ReferenceLine y={5} strokeDasharray="4 4" yAxisId="mood" />
              <Line yAxisId="mood" type="monotone" dataKey="mood" stroke="#3b82f6" strokeWidth={2} dot />
              <Bar yAxisId="quality" dataKey="conversationQuality" fill="#10b981" opacity={0.6} />
            </ComposedChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} ticks={[0,2,4,6,8,10]} />
              <Tooltip />
              <ReferenceLine y={5} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="mood" dot />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div>
        <div style={{ fontWeight:600, marginBottom:6 }}>Recent notes</div>
        <ul style={{ margin:0, paddingLeft:18 }}>
          {logs.slice(-5).reverse().map(l => (
            <li key={l.id} className="small">
              {new Date(l.date).toLocaleString()} — <strong>{l.mood}</strong> — {l.note || "—"}
              {l.aiContext && (
                <span style={{ color: "#6b7280", marginLeft: 8 }}>
                  (AI: {l.aiContext.recentSupportLevel})
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}