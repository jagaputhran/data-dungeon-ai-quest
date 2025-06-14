
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { WorkflowNode } from "@/components/WorkflowBuilder";
import { Brain, MessageSquare, Wand2, AlertCircle } from "lucide-react";

interface AIAssistantProps {
  selectedNode: WorkflowNode | null;
  onNodeUpdate: (nodeId: string, updates: Partial<WorkflowNode>) => void;
}

const AIAssistant = ({ selectedNode, onNodeUpdate }: AIAssistantProps) => {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{role: string, message: string}>>([
    {
      role: "assistant",
      message: "👋 Hi! I'm your AI workflow assistant. I can help you:\n\n• Configure node settings\n• Debug connection issues\n• Suggest optimizations\n• Explain workflow concepts\n\nSelect a node or ask me anything!"
    }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    
    setIsGenerating(true);
    const newUserMessage = { role: "user", message: userMessage };
    setChatHistory(prev => [...prev, newUserMessage]);
    setUserMessage("");
    
    // Simulate AI response based on context
    setTimeout(() => {
      let aiResponse = "";
      
      if (selectedNode) {
        if (userMessage.toLowerCase().includes("configure") || userMessage.toLowerCase().includes("setup")) {
          aiResponse = `🔧 For your ${selectedNode.type} node, here are the key configurations:\n\n`;
          
          switch (selectedNode.type) {
            case "HTTP Request":
              aiResponse += "• URL: Enter your API endpoint\n• Method: GET/POST/PUT/DELETE\n• Headers: Add authentication tokens\n• Parameters: Query or body parameters";
              break;
            case "Set":
              aiResponse += "• Field Mapping: Map input fields to output\n• Data Types: Ensure proper type conversion\n• Expressions: Use JavaScript expressions for complex logic";
              break;
            case "Database":
              aiResponse += "• Connection: Database credentials\n• Operation: INSERT/UPDATE/SELECT\n• Table: Target table name\n• Mapping: Field to column mapping";
              break;
            case "Snowflake":
              aiResponse += "• Account: Snowflake account identifier\n• Warehouse: Compute warehouse name\n• Database & Schema: Target location\n• Credentials: Username/password or key pair";
              break;
            default:
              aiResponse += "• Check the node documentation for specific parameters\n• Use the configuration panel to set required fields";
          }
          
          // Auto-configure some basic settings
          if (selectedNode.type === "HTTP Request") {
            onNodeUpdate(selectedNode.id, {
              config: {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                timeout: 30000
              }
            });
          }
          
        } else if (userMessage.toLowerCase().includes("error") || userMessage.toLowerCase().includes("fix")) {
          aiResponse = `🔍 Let me help debug your ${selectedNode.type} node:\n\n`;
          aiResponse += "Common issues:\n";
          aiResponse += "• Check authentication credentials\n";
          aiResponse += "• Verify API endpoints are accessible\n";
          aiResponse += "• Ensure data mapping is correct\n";
          aiResponse += "• Add error handling and retries\n\n";
          aiResponse += "💡 Tip: Enable verbose logging to see detailed error messages.";
        } else {
          aiResponse = `ℹ️ About ${selectedNode.type} nodes:\n\n`;
          aiResponse += getNodeExplanation(selectedNode.type);
        }
      } else {
        if (userMessage.toLowerCase().includes("workflow") || userMessage.toLowerCase().includes("pipeline")) {
          aiResponse = "🚀 Workflow Best Practices:\n\n";
          aiResponse += "1. **Start Simple**: Begin with input → transform → output\n";
          aiResponse += "2. **Error Handling**: Add error nodes for resilience\n";
          aiResponse += "3. **Testing**: Test each node individually first\n";
          aiResponse += "4. **Monitoring**: Add logging and notifications\n";
          aiResponse += "5. **Documentation**: Name nodes clearly and add descriptions";
        } else {
          aiResponse = "🤖 I can help with workflow design, node configuration, debugging, and best practices. What would you like to know?";
        }
      }
      
      setChatHistory(prev => [...prev, { role: "assistant", message: aiResponse }]);
      setIsGenerating(false);
    }, 1500);
  };

  const getNodeExplanation = (nodeType: string): string => {
    const explanations: Record<string, string> = {
      "HTTP Request": "Makes API calls to external services. Perfect for fetching data from REST APIs, webhooks, or any HTTP endpoint.",
      "Set": "Transforms and maps data fields. Use JavaScript expressions to manipulate data, rename fields, or perform calculations.",
      "Database": "Connects to SQL databases for reading/writing data. Supports MySQL, PostgreSQL, and other popular databases.",
      "CSV Read": "Reads data from CSV files. Useful for batch processing of uploaded files or scheduled data imports.",
      "Filter": "Filters data based on conditions. Only rows meeting your criteria will pass through to the next node.",
      "If": "Creates conditional logic in your workflow. Routes data based on boolean conditions.",
      "Slack": "Sends messages to Slack channels. Great for notifications, alerts, and workflow status updates.",
      "Snowflake": "Connects to Snowflake data warehouse. Ideal for analytics and big data processing workflows.",
    };
    
    return explanations[nodeType] || "This node performs specific operations in your workflow. Check the documentation for detailed usage.";
  };

  const quickActions = [
    { label: "Explain this node", action: "What does this node do and how should I configure it?" },
    { label: "Fix configuration", action: "Help me configure this node properly" },
    { label: "Add error handling", action: "How can I add error handling to my workflow?" },
    { label: "Optimize performance", action: "How can I make my workflow faster and more reliable?" }
  ];

  return (
    <Card className="bg-gray-800/50 border-gray-600 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="text-purple-400" size={20} />
          AI Assistant
        </CardTitle>
        {selectedNode && (
          <Badge variant="outline" className="w-fit">
            Helping with: {selectedNode.type}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        {/* Chat History */}
        <div className="flex-1 space-y-3 mb-4 max-h-64 overflow-y-auto">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`p-3 rounded-lg ${
              chat.role === "user" 
                ? "bg-purple-600/20 border border-purple-500/30 ml-2" 
                : "bg-gray-700/50 border border-gray-600 mr-2"
            }`}>
              <div className="flex items-start gap-2">
                {chat.role === "assistant" ? (
                  <Brain size={16} className="text-purple-400 mt-0.5" />
                ) : (
                  <MessageSquare size={16} className="text-blue-400 mt-0.5" />
                )}
                <pre className="text-xs text-gray-200 whitespace-pre-wrap font-sans">
                  {chat.message}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        {selectedNode && (
          <div className="mb-4">
            <h4 className="text-white text-sm font-semibold mb-2">Quick Actions:</h4>
            <div className="grid grid-cols-1 gap-1">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="justify-start text-xs h-8 text-gray-300 hover:text-white hover:bg-purple-600/20"
                  onClick={() => setUserMessage(action.action)}
                >
                  <Wand2 size={12} className="mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input */}
        <div className="space-y-2">
          <Textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Ask me anything about workflows, nodes, or configurations..."
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-sm"
            rows={3}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isGenerating || !userMessage.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700"
            size="sm"
          >
            {isGenerating ? (
              <>
                <Brain className="animate-pulse mr-2" size={14} />
                AI is thinking...
              </>
            ) : (
              <>
                <MessageSquare className="mr-2" size={14} />
                Send Message
              </>
            )}
          </Button>
        </div>

        {!selectedNode && (
          <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle size={14} className="text-blue-400" />
              <span className="text-blue-400 text-xs font-semibold">Tip</span>
            </div>
            <p className="text-gray-300 text-xs">
              Select a node on the canvas to get specific configuration help!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAssistant;
