
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
    
    console.log('AI Assistant - Sending message:', userMessage);
    console.log('AI Assistant - Selected node:', selectedNode);
    
    setIsGenerating(true);
    const newUserMessage = { role: "user", message: userMessage };
    setChatHistory(prev => [...prev, newUserMessage]);
    const currentMessage = userMessage;
    setUserMessage("");
    
    // Simulate AI response with better error handling
    setTimeout(() => {
      let aiResponse = "";
      
      try {
        if (selectedNode) {
          console.log('AI Assistant - Processing message for node:', selectedNode.type, selectedNode.id);
          
          if (currentMessage.toLowerCase().includes("configure") || currentMessage.toLowerCase().includes("setup")) {
            aiResponse = `🔧 Configuring your ${selectedNode.type} node "${selectedNode.title}":\n\n`;
            
            switch (selectedNode.type) {
              case "HTTP Request":
                aiResponse += "✅ **HTTP Request Configuration:**\n";
                aiResponse += "• URL: Enter your API endpoint\n";
                aiResponse += "• Method: GET/POST/PUT/DELETE\n";
                aiResponse += "• Headers: Add authentication tokens\n";
                aiResponse += "• Parameters: Query or body parameters\n\n";
                aiResponse += "💡 **Example for API fetching:**\n";
                aiResponse += "```json\n{\n  \"Authorization\": \"Bearer YOUR_TOKEN\",\n  \"Content-Type\": \"application/json\"\n}\n```";
                
                // Auto-configure basic settings
                onNodeUpdate(selectedNode.id, {
                  config: {
                    method: "GET",
                    url: "https://api.example.com/data",
                    headers: { 
                      "Content-Type": "application/json",
                      "Authorization": "Bearer YOUR_TOKEN_HERE"
                    },
                    timeout: 30000
                  }
                });
                aiResponse += "\n\n✅ I've pre-configured basic settings for you!";
                break;
                
              case "Set":
                aiResponse += "✅ **Data Mapping Configuration:**\n";
                aiResponse += "• **Field Mapping**: Map input fields to output fields\n";
                aiResponse += "• **Data Types**: Ensure proper type conversion\n";
                aiResponse += "• **Expressions**: Use JavaScript expressions for complex logic\n\n";
                aiResponse += "💡 **Example mapping configuration:**\n";
                aiResponse += "```json\n{\n  \"feature_name\": \"{{$json.title}}\",\n  \"owner_email\": \"{{$json.owner.email}}\",\n  \"created_date\": \"{{$json.createdAt}}\",\n  \"status\": \"{{$json.status || 'active'}}\"\n}\n```\n\n";
                aiResponse += "🎯 **Common use cases:**\n";
                aiResponse += "• Rename fields from API responses\n";
                aiResponse += "• Calculate new values\n";
                aiResponse += "• Format dates and numbers\n";
                aiResponse += "• Set default values";
                
                // Auto-configure mapping
                onNodeUpdate(selectedNode.id, {
                  config: {
                    mappings: {
                      "feature_name": "{{$json.title}}",
                      "owner_email": "{{$json.owner.email}}",
                      "created_date": "{{$json.createdAt}}",
                      "status": "{{$json.status || 'active'}}"
                    },
                    keepOnlySet: false,
                    options: {}
                  }
                });
                aiResponse += "\n\n✅ I've configured basic field mappings for you!";
                break;
                
              case "Database":
                aiResponse += "✅ **Database Configuration:**\n";
                aiResponse += "• **Connection**: Database credentials and host\n";
                aiResponse += "• **Operation**: INSERT/UPDATE/SELECT/DELETE\n";
                aiResponse += "• **Table**: Target table name\n";
                aiResponse += "• **Mapping**: Field to column mapping\n\n";
                aiResponse += "💡 **Example configuration:**\n";
                aiResponse += "```json\n{\n  \"operation\": \"INSERT\",\n  \"table\": \"features\",\n  \"columns\": [\"name\", \"owner\", \"created_at\"]\n}\n```";
                
                onNodeUpdate(selectedNode.id, {
                  config: {
                    operation: "INSERT",
                    table: "features",
                    columns: ["name", "owner", "created_at"]
                  }
                });
                aiResponse += "\n\n✅ Basic database configuration applied!";
                break;
                
              case "Snowflake":
                aiResponse += "✅ **Snowflake Configuration:**\n";
                aiResponse += "• **Account**: Snowflake account identifier\n";
                aiResponse += "• **Warehouse**: Compute warehouse name\n";
                aiResponse += "• **Database & Schema**: Target location\n";
                aiResponse += "• **Credentials**: Username/password or key pair\n\n";
                aiResponse += "💡 **Connection example:**\n";
                aiResponse += "```json\n{\n  \"account\": \"abc12345.snowflakecomputing.com\",\n  \"warehouse\": \"COMPUTE_WH\",\n  \"database\": \"ANALYTICS\",\n  \"schema\": \"RAW_DATA\"\n}\n```";
                break;
                
              default:
                aiResponse += `• **Node Type**: ${selectedNode.type}\n`;
                aiResponse += "• Check the node documentation for specific parameters\n";
                aiResponse += "• Use the configuration panel to set required fields\n\n";
                aiResponse += "💡 **Tip**: Each node type has different configuration options. Let me know what specific settings you need help with!";
            }
            
          } else if (currentMessage.toLowerCase().includes("error") || currentMessage.toLowerCase().includes("fix")) {
            aiResponse = `🔍 **Debugging your ${selectedNode.type} node:**\n\n`;
            aiResponse += "**Common issues to check:**\n";
            aiResponse += "• ✅ Authentication credentials are correct\n";
            aiResponse += "• ✅ API endpoints are accessible and valid\n";
            aiResponse += "• ✅ Data mapping fields match input structure\n";
            aiResponse += "• ✅ Required fields are not empty\n";
            aiResponse += "• ✅ Network connectivity is working\n\n";
            aiResponse += "💡 **Tip**: Enable verbose logging to see detailed error messages and check the execution panel for specific error details.";
            
          } else {
            aiResponse = `ℹ️ **About ${selectedNode.type} nodes:**\n\n`;
            aiResponse += getNodeExplanation(selectedNode.type);
            aiResponse += "\n\n💡 **Quick actions**: Try asking me to 'configure this node' or 'help me set up this node'!";
          }
        } else {
          // No node selected responses
          if (currentMessage.toLowerCase().includes("workflow") || currentMessage.toLowerCase().includes("pipeline")) {
            aiResponse = "🚀 **Workflow Best Practices:**\n\n";
            aiResponse += "1. **Start Simple**: Begin with input → transform → output\n";
            aiResponse += "2. **Error Handling**: Add error nodes for resilience\n";
            aiResponse += "3. **Testing**: Test each node individually first\n";
            aiResponse += "4. **Monitoring**: Add logging and notifications\n";
            aiResponse += "5. **Documentation**: Name nodes clearly and add descriptions\n\n";
            aiResponse += "💡 **Tip**: Select a node first to get specific configuration help!";
          } else if (currentMessage.toLowerCase().includes("api") || currentMessage.toLowerCase().includes("fetch")) {
            aiResponse = "🌐 **To fetch data from APIs:**\n\n";
            aiResponse += "1. **Add HTTP Request Node**: Drag from the Input section\n";
            aiResponse += "2. **Configure URL**: Set your API endpoint\n";
            aiResponse += "3. **Add Authentication**: Include API keys or tokens\n";
            aiResponse += "4. **Test Connection**: Run a single node test\n\n";
            aiResponse += "💡 **Next step**: Select an HTTP Request node and ask me to configure it!";
          } else {
            aiResponse = "🤖 **I can help with:**\n\n";
            aiResponse += "• **Node Configuration**: Select any node and ask me to configure it\n";
            aiResponse += "• **Workflow Design**: Best practices and architecture\n";
            aiResponse += "• **Debugging**: Fix errors and connection issues\n";
            aiResponse += "• **Learning**: Explain concepts and node types\n\n";
            aiResponse += "💡 **Try this**: Select a node on the canvas, then ask 'configure this node'!";
          }
        }
        
        console.log('AI Assistant - Generated response:', aiResponse);
        setChatHistory(prev => [...prev, { role: "assistant", message: aiResponse }]);
        
      } catch (error) {
        console.error('AI Assistant - Error generating response:', error);
        setChatHistory(prev => [...prev, { 
          role: "assistant", 
          message: "❌ Sorry, I encountered an error. Please try again or rephrase your question." 
        }]);
      }
      
      setIsGenerating(false);
    }, 1000);
  };

  const getNodeExplanation = (nodeType: string): string => {
    const explanations: Record<string, string> = {
      "HTTP Request": "**Makes API calls** to external services. Perfect for fetching data from REST APIs, webhooks, or any HTTP endpoint. Configure the URL, method, headers, and authentication.",
      "Set": "**Transforms and maps data** fields. Use JavaScript expressions to manipulate data, rename fields, perform calculations, or set default values. Essential for data transformation between different formats.",
      "Database": "**Connects to SQL databases** for reading/writing data. Supports MySQL, PostgreSQL, and other popular databases. Configure connection details and SQL operations.",
      "CSV Read": "**Reads data from CSV files**. Useful for batch processing of uploaded files or scheduled data imports from file sources.",
      "Filter": "**Filters data based on conditions**. Only rows meeting your criteria will pass through to the next node. Use for data quality and filtering.",
      "If": "**Creates conditional logic** in your workflow. Routes data based on boolean conditions to different paths in your workflow.",
      "Slack": "**Sends messages to Slack** channels. Great for notifications, alerts, and workflow status updates. Configure webhook URL and message format.",
      "Snowflake": "**Connects to Snowflake** data warehouse. Ideal for analytics and big data processing workflows. Configure account, warehouse, and credentials.",
    };
    
    return explanations[nodeType] || "This node performs specific operations in your workflow. Check the documentation for detailed usage.";
  };

  const quickActions = [
    { label: "Configure Node", action: "Configure this node for me" },
    { label: "Explain Node", action: "What does this node do and how should I configure it?" },
    { label: "Fix Issues", action: "Help me debug and fix any issues with this node" },
    { label: "Best Practices", action: "What are the best practices for this node type?" }
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
            Configuring: {selectedNode.type}
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
          {isGenerating && (
            <div className="bg-gray-700/50 border border-gray-600 mr-2 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Brain size={16} className="text-purple-400 animate-pulse" />
                <span className="text-xs text-gray-300">AI is thinking...</span>
              </div>
            </div>
          )}
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
            placeholder={selectedNode ? 
              `Ask about configuring your ${selectedNode.type} node...` : 
              "Ask me anything about workflows, nodes, or configurations..."
            }
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-sm"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
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
