import React, { useState, useRef, useEffect } from 'react';
import { HistoryEntry, Tool } from '@/types';
import { sendAdminCommand } from '@/services/geminiService';
import Spinner from '@/components/ui/Spinner';

interface AdminCommandChatProps {
    onToolAdd: (name: string, category: string) => void;
    addToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
    tools: Tool[];
    onToolToggle: (toolId: string) => void;
}

interface CommandMessage {
    role: 'admin' | 'system' | 'model';
    text: string;
}

const AdminCommandChat: React.FC<AdminCommandChatProps> = ({ onToolAdd, addToHistory, tools, onToolToggle }) => {
    const [messages, setMessages] = useState<CommandMessage[]>([]);
    const [command, setCommand] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const addMessage = (role: CommandMessage['role'], text: string) => {
        const historyRole = role === 'admin' ? 'admin' : 'system';
        setMessages(prev => [...prev, { role, text }]);
        addToHistory({ role: historyRole, text, context: 'admin' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!command.trim() || isLoading) return;

        const currentCommand = command;
        addMessage('admin', currentCommand);
        setCommand('');
        setIsLoading(true);

        try {
            const historyForApi = messages.map(m => ({
                role: m.role === 'admin' ? 'user' : 'model',
                parts: [{ text: m.text }],
            }));
            
            let response = await sendAdminCommand(currentCommand, historyForApi, tools);

            if (response.functionCalls) {
                const functionResponses: any[] = [];

                for (const call of response.functionCalls) {
                    addMessage('system', `Executing function: ${call.name}(${JSON.stringify(call.args)})`);
                    let functionResult: any;

                    switch (call.name) {
                        case 'addTool':
                            onToolAdd(call.args.toolName, call.args.category);
                            functionResult = { success: true, message: `Tool '${call.args.toolName}' created.` };
                            break;
                        case 'toggleToolStatus':
                            const toolToToggle = tools.find(t => t.name.toLowerCase() === call.args.toolName.toLowerCase());
                            if (toolToToggle) {
                                onToolToggle(toolToToggle.id);
                                functionResult = { success: true, message: `Tool '${toolToToggle.name}' status has been toggled.` };
                            } else {
                                functionResult = { success: false, message: `Tool '${call.args.toolName}' not found.` };
                            }
                            break;
                        case 'listTools':
                             const filteredTools = call.args.category
                                ? tools.filter(t => t.category.toLowerCase() === call.args.category.toLowerCase())
                                : tools;
                            const toolList = filteredTools.map(t => `- ${t.name} (${t.enabled ? 'Enabled' : 'Disabled'})`).join('\n');
                            functionResult = { success: true, tools: toolList || "No tools found in that category." };
                            break;
                        case 'runSystemDiagnostics':
                            functionResult = { success: true, status: "All systems nominal. GPU: 75%, API Latency: 110ms, Active Users: 1,234" };
                            break;
                        default:
                             functionResult = { success: false, message: `Unknown function: ${call.name}` };
                    }
                    
                    functionResponses.push({
                         id: call.id,
                         name: call.name,
                         response: { result: functionResult },
                    });
                }
                
                 const secondHistoryForApi = [
                    ...historyForApi, 
                    { role: 'user', parts: [{ text: currentCommand }] },
                    { role: 'model', parts: [{ functionCalls: response.functionCalls }] }
                ];
                
                response = await sendAdminCommand("", secondHistoryForApi, tools, functionResponses[0]);
            }

            if (response.text) {
                addMessage('model', response.text);
            } else {
                 addMessage('system', 'Action completed, but no further response from AI.');
            }

        } catch (error) {
            console.error("Admin command error:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            addMessage('system', `Error: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[80vh] bg-[#1a1a3a]/50 rounded-lg">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold text-orange-400">AI Core Command Center</h2>
                <p className="text-sm text-gray-400">Issue natural language commands to the Indomind AI Core.</p>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-2xl px-4 py-2 rounded-xl font-mono text-sm ${
                            msg.role === 'admin' ? 'bg-orange-600' :
                            msg.role === 'system' ? 'bg-gray-600 text-yellow-300' :
                            'bg-gray-700'
                        }`}>
                           <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="px-4 py-2 rounded-xl bg-gray-700">
                            <Spinner />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 flex gap-4">
                <input
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="e.g., 'List all tools in the Creative Media category'"
                    className="flex-grow px-4 py-2 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-white font-mono"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !command.trim()} className="px-6 py-2 bg-orange-600 rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                    Execute
                </button>
            </form>
        </div>
    );
};

export default AdminCommandChat;