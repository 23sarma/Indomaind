import React, { useState, useEffect } from 'react';

const initialMetrics = {
  gpuLoad: 78,
  activeUsers: 1248,
  avgResponse: 120,
  knowledgeSize: 45.2,
  skillsAcquired: 102,
  threatsNeutralized: 147,
};

const logTemplates = [
  { type: 'INFO', color: 'text-cyan-400', message: 'System check complete. All services operational.' },
  { type: 'REPAIR', color: 'text-green-400', message: "Automatically restarted 'video-generator' service instance #3 due to memory leak." },
  { type: 'WARN', color: 'text-yellow-400', message: "High latency detected on 'code-optimizer' model endpoint. Rerouting traffic." },
  { type: 'UPDATE', color: 'text-purple-400', message: "New model update for 'Indomind Chat' downloaded and verified." },
  { type: 'SECURITY', color: 'text-red-400', message: 'Blocked suspicious login attempt from IP 192.168.1.101.' },
  { type: 'LEARNING', color: 'text-blue-400', message: 'Integrated new dataset on quantum computing into knowledge base.' },
];

const StatusCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
  <div className="bg-[#1a1a3a]/70 p-6 rounded-lg border-l-4" style={{ borderColor: color }}>
    <p className="text-sm text-gray-400">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const SelfControlSystem: React.FC = () => {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const logInterval = setInterval(() => {
      const newLog = { ...logTemplates[Math.floor(Math.random() * logTemplates.length)], timestamp: new Date() };
      setLogs(prev => [newLog, ...prev.slice(0, 100)]);
    }, 3000);

    const metricsInterval = setInterval(() => {
      setMetrics(prev => ({
        gpuLoad: Math.max(20, Math.min(95, prev.gpuLoad + (Math.random() * 10 - 5))),
        activeUsers: prev.activeUsers + (Math.floor(Math.random() * 20 - 10)),
        avgResponse: Math.max(50, Math.min(300, prev.avgResponse + (Math.random() * 20 - 10))),
        knowledgeSize: parseFloat((prev.knowledgeSize + Math.random() * 0.1).toFixed(2)),
        skillsAcquired: prev.skillsAcquired,
        threatsNeutralized: prev.threatsNeutralized + (Math.random() > 0.8 ? 1 : 0),
      }));
       if (Math.random() > 0.95) {
        setMetrics(prev => ({ ...prev, skillsAcquired: prev.skillsAcquired + 1 }));
      }
    }, 1500);

    return () => {
      clearInterval(logInterval);
      clearInterval(metricsInterval);
    };
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Indomind Self-Control System</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-300">Core Performance</h3>
          <div className="space-y-4">
            <StatusCard title="GPU Load" value={`${metrics.gpuLoad.toFixed(0)}%`} color="#06b6d4" />
            <StatusCard title="Active Users" value={metrics.activeUsers.toLocaleString()} color="#10b981" />
            <StatusCard title="API Avg. Response" value={`${metrics.avgResponse.toFixed(0)}ms`} color="#f97316" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-300">Growth & Learning</h3>
           <div className="space-y-4">
             <StatusCard title="Knowledge Base Size" value={`${metrics.knowledgeSize} PB`} color="#8b5cf6" />
             <StatusCard title="New Skills Acquired" value={`${metrics.skillsAcquired}`} color="#3b82f6" />
             <StatusCard title="System Health" value="Optimal" color="#84cc16" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-300">Live Threat Feed</h3>
          <div className="p-4 bg-[#1a1a3a]/50 rounded-lg h-[284px] overflow-hidden">
             <p className="text-lg font-bold mb-4 text-red-400">Threats Neutralized: {metrics.threatsNeutralized}</p>
             <div className="font-mono text-xs space-y-2 text-gray-300">
                {logs.filter(log => log.type === 'SECURITY').slice(0, 5).map((log, i) => (
                    <p key={i}><span className={log.color}>{`[${log.type}]`}</span> {log.message}</p>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-[#1a1a3a]/50 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Live Activity Log</h3>
        <div className="font-mono text-sm space-y-2 text-gray-300 h-64 overflow-y-auto pr-2">
          {logs.map((log, i) => (
            <p key={i}>
              <span className="text-gray-500 mr-2">{log.timestamp.toLocaleTimeString()}</span>
              <span className={log.color}>{`[${log.type}]`}</span> {log.message}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelfControlSystem;
