import React, { useState, useRef, useEffect } from 'react';
import { HistoryEntry } from '../../types';
import Spinner from '../ui/Spinner';

interface AdminCommandChatProps {
    onToolAdd: (name: string, category: string) => void;
    addToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
}

interface CommandMessage {
    role: 'admin' | 'system';
    text: string;
}

const AdminCommandChat: React.FC<AdminCommandChatProps> = ({ onToolAdd, addToHistory }) => {
    const [messages, setMessages] = useState<CommandMessage[]>([]);
    const [command, setCommand] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const addMessage = (role: 'admin' | 'system', text: string) => {
        setMessages(prev => [...prev, { role, text }]);
        addToHistory({ role, text, context: 'admin' });
    };
    
    const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!command.trim() || isLoading) return;

        const adminCommand = command.trim().toLowerCase();
        addMessage('admin', command); // Show original casing
        setCommand('');
        setIsLoading(true);

        await sleep(500);
        addMessage('system', `AI Core processing command: "${adminCommand}"`);
        await sleep(1000);

        const addToolRegex = /add new tool: "([^"]+)" in category "([^"]+)"/i;
        const addToolMatch = adminCommand.match(addToolRegex);

        if (addToolMatch) {
            const [, toolName, categoryName] = addToolMatch;
            addMessage('system', `Parameters identified: Tool Name = ${toolName}, Category = ${categoryName}.`);
            await sleep(1000);
            addMessage('system', `Generating new tool scaffold...`);
            onToolAdd(toolName, categoryName);
            await sleep(1500);
            addMessage('system', `SUCCESS: New tool "${toolName}" has been generated and deployed to the user dashboard.`);
        } else if (adminCommand.startsWith('run diagnostics')) {
            addMessage('system', `Initiating full system diagnostics...`);
            await sleep(1500);
            addMessage('system', `[1/3] Checking service health... OK`);
            await sleep(1000);
            addMessage('system', `[2/3] Verifying database integrity... OK`);
            await sleep(1000);
            addMessage('system', `[3/3] Scanning for security vulnerabilities... None found.`);
            await sleep(500);
            addMessage('system', `Diagnostics complete. All systems are nominal.`);
        } else if (adminCommand.startsWith('initiate self-repair')) {
            addMessage('system', `Self-repair sequence initiated.`);
            await sleep(1000);
            addMessage('system', `Searching for anomalies... Found 1: High latency on image_generator service.`);
            await sleep(1500);
            addMessage('system', `Applying fix: Rerouting traffic and restarting service instance...`);
            await sleep(2000);
            addMessage('system', `SUCCESS: Service latency returned to normal. Self-repair complete.`);
        } else if (adminCommand.startsWith('check for updates')) {
            addMessage('system', `Checking for system and model updates...`);
            await sleep(2000);
            addMessage('system', `Found new security patch (v1.2.1) and a model update for 'KnowledgeSummarizer'.`);
            addMessage('system', `Run 'apply updates' to install.`);
        } else if (adminCommand.startsWith('apply updates')) {
            addMessage('system', `Applying updates...`);
            await sleep(1500);
            addMessage('system', `[1/2] Security patch v1.2.1 installed successfully.`);
            await sleep(1500);
            addMessage('system', `[2/2] 'KnowledgeSummarizer' model updated to latest version.`);
            await sleep(500);
            addMessage('system', `SUCCESS: All updates applied.`);
        } else if (adminCommand.startsWith('strengthen security protocols')) {
            addMessage('system', `Analyzing current threat vectors...`);
            await sleep(1500);
            addMessage('system', `Applying adaptive firewall rules and updating threat definitions...`);
            await sleep(2000);
            addMessage('system', `SUCCESS: Security protocols have been enhanced.`);
        } else if (adminCommand.startsWith('start learning cycle')) {
            addMessage('system', `Initiating manual learning cycle...`);
            await sleep(1500);
            addMessage('system', `Processing new data from the last 24 hours...`);
            await sleep(2500);
            addMessage('system', `SUCCESS: Knowledge base expanded. Indomind is now smarter.`);
        } else if (adminCommand.startsWith('help')) {
            const helpText = `Available Commands:
- help: Shows this list.
- run diagnostics: Checks system health.
- initiate self-repair: Finds and fixes issues.
- check for updates: Looks for new updates.
- apply updates: Installs found updates.
- strengthen security protocols: Enhances system security.
- start learning cycle: Manually triggers AI learning.
- add new tool: "Tool Name" in category "Category Name": Creates a new tool.`;
            addMessage('system', helpText);
        } else {
            addMessage('system', `Error: Command not recognized. Type 'help' to see a list of available commands.`);
        }

        setIsLoading(false);
    };

    return (
        <div className="flex flex-col h-[80vh] bg-[#1a1a3a]/50 rounded-lg">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold text-orange-400">AI Core Command Center</h2>
                <p className="text-sm text-gray-400">Issue direct commands to the Indomind AI. Type 'help' for options.</p>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-2xl px-4 py-2 rounded-xl font-mono text-sm ${msg.role === 'admin' ? 'bg-orange-600' : 'bg-gray-700'}`}>
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
                    placeholder="Enter command for Indomind AI Core..."
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
