import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { WorkflowNode } from "@/components/WorkflowBuilder";
import { Brain, MessageSquare, Wand2, AlertCircle } from "lucide-react";
import { sampleCsvData, sampleApiEndpoints } from "@/services/sampleDataService";
import FilterConfig from "./FilterConfig";
import HttpConfig from "./HttpConfig";

interface AIAssistantProps {
  selectedNode: WorkflowNode | null;
  onNodeUpdate: (nodeId: string, updates: Partial<WorkflowNode>) => void;
}

const AIAssistant = ({ selectedNode, onNodeUpdate }: AIAssistantProps) => {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{role: string, message: string}>>([
    {
      role: "assistant",
      message: "🚀 **Complete ETL Workflow System Ready!**\n\n💾 **Data Sources:**\n• CSV: 5 product records\n• HTTP: Any public API or website\n• Real-time: Webhooks and streaming\n\n🔄 **Complete Pipeline:**\n1. **Input**: HTTP Request (any API) or CSV Read\n2. **Transform**: Set node for field mapping\n3. **Filter**: Advanced filtering with multiple conditions\n4. **Output**: Database, CSV, or any destination\n\n💡 **Quick Start**: Add an HTTP Request node and I'll help you configure it to fetch data from any website!"
    }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFilterConfig, setShowFilterConfig] = useState(false);
  const [showHttpConfig, setShowHttpConfig] = useState(false);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    
    console.log('AI Assistant - Processing:', userMessage, 'Selected node:', selectedNode?.type);
    
    setIsGenerating(true);
    const newUserMessage = { role: "user", message: userMessage };
    setChatHistory(prev => [...prev, newUserMessage]);
    const currentMessage = userMessage;
    setUserMessage("");
    
    setTimeout(() => {
      let aiResponse = "";
      
      try {
        if (selectedNode) {
          console.log('AI Assistant - Configuring node:', selectedNode.type);
          
          if (currentMessage.toLowerCase().includes("configure") || 
              currentMessage.toLowerCase().includes("setup") ||
              currentMessage.toLowerCase().includes("how")) {
            
            aiResponse = generateEnhancedConfigurationResponse(selectedNode, currentMessage);
            
          } else if (currentMessage.toLowerCase().includes("filter") || 
                    currentMessage.toLowerCase().includes("condition")) {
            
            aiResponse = generateFilterResponse(selectedNode);
            
          } else if (currentMessage.toLowerCase().includes("api") || 
                    currentMessage.toLowerCase().includes("http") || 
                    currentMessage.toLowerCase().includes("website")) {
            
            aiResponse = generateHttpResponse(selectedNode);
            
          } else {
            aiResponse = generateEnhancedConfigurationResponse(selectedNode, currentMessage);
          }
          
        } else {
          aiResponse = generateGeneralGuidance(currentMessage);
        }
        
        console.log('AI Assistant - Response generated:', aiResponse.substring(0, 100) + '...');
        setChatHistory(prev => [...prev, { role: "assistant", message: aiResponse }]);
        
      } catch (error) {
        console.error('AI Assistant Error:', error);
        setChatHistory(prev => [...prev, { 
          role: "assistant", 
          message: "❌ Error generating response. Please try again or rephrase your question." 
        }]);
      }
      
      setIsGenerating(false);
    }, 800);
  };

  const generateEnhancedConfigurationResponse = (node: WorkflowNode, message: string): string => {
    let response = `🔧 **Configuring ${node.type} Node**\n\n`;
    
    switch (node.type) {
      case "HTTP Request":
      case "JSON API":
        response += "🌐 **HTTP Request Configuration:**\n";
        response += "• **Any Website/API**: Fetch data from any public endpoint\n";
        response += "• **Popular APIs**: JSONPlaceholder, REST Countries, CoinGecko, News API\n";
        response += "• **Custom Headers**: Authentication, Content-Type, etc.\n";
        response += "• **Methods**: GET, POST, PUT, DELETE, PATCH\n\n";
        response += "🎯 **Ready-to-Use APIs:**\n";
        response += "• `https://jsonplaceholder.typicode.com/posts` - Sample posts\n";
        response += "• `https://restcountries.com/v3.1/all` - Country data\n";
        response += "• `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10` - Crypto prices\n";
        response += "• `https://catfact.ninja/facts` - Random cat facts\n\n";
        response += "💡 **Click 'Advanced Config' below for visual setup!**";
        
        // Show HTTP config panel
        setShowHttpConfig(true);
        break;
        
      case "Filter":
      case "Advanced Filter":
        response += "🔍 **Advanced Filter Configuration:**\n";
        response += "• **Visual Builder**: Create conditions with dropdowns\n";
        response += "• **Multiple Conditions**: AND/OR logic support\n";
        response += "• **Data Types**: String, Number, Boolean, Date\n";
        response += "• **Operators**: Equals, Contains, Greater Than, Between, etc.\n\n";
        response += "🎯 **Common Filter Examples:**\n";
        response += "• `status === 'active'` - Active records only\n";
        response += "• `price > 100` - Expensive items\n";
        response += "• `category === 'Electronics' && quantity > 0` - Available electronics\n";
        response += "• `created_at > '2024-01-01'` - Recent records\n\n";
        response += "💡 **Click 'Advanced Config' below for visual filter builder!**";
        
        // Show filter config panel
        setShowFilterConfig(true);
        break;
        
      case "Set":
        response += "🔧 **Data Transformation Configuration:**\n";
        response += "• **Field Mapping**: Transform input fields to desired output\n";
        response += "• **JavaScript Expressions**: Use custom logic for complex transformations\n";
        response += "• **Data Types**: Convert strings to numbers, dates, booleans\n\n";
        response += "💡 **Smart Mapping Examples:**\n";
        response += "```json\n{\n  \"product_name\": \"{{$json.name || $json.title}}\",\n  \"owner_email\": \"{{$json.owner?.email || $json.email}}\",\n  \"created_date\": \"{{new Date($json.created_at).toISOString()}}\",\n  \"price_category\": \"{{$json.price > 100 ? 'expensive' : 'affordable'}}\",\n  \"is_available\": \"{{$json.status === 'active' && $json.quantity > 0}}\",\n  \"full_name\": \"{{$json.first_name + ' ' + $json.last_name}}\"\n}\n```";
        
        onNodeUpdate(node.id, {
          config: {
            mappings: {
              "product_name": "{{$json.name || $json.title}}",
              "owner_email": "{{$json.owner?.email || $json.email}}",
              "created_date": "{{new Date($json.created_at).toISOString()}}",
              "price_category": "{{$json.price > 100 ? 'expensive' : 'affordable'}}",
              "is_available": "{{$json.status === 'active' && $json.quantity > 0}}"
            },
            keepOnlySet: false,
            options: { dateFormat: "ISO" }
          }
        });
        response += "\n\n✅ **Auto-configured**: Smart mappings applied!";
        break;
        
      case "Database":
      case "NoSQL":
        response += "🗄️ **Database Configuration:**\n";
        response += "• **Operation**: INSERT, UPDATE, UPSERT\n";
        response += "• **Table/Collection**: Auto-created if not exists\n";
        response += "• **Batch Processing**: Handle large datasets efficiently\n";
        response += "• **Error Handling**: Skip invalid records or halt on error\n\n";
        response += "📊 **Optimized Schema for Sample Data:**\n";
        response += "```sql\nCREATE TABLE products (\n  id SERIAL PRIMARY KEY,\n  product_name VARCHAR(255),\n  owner_email VARCHAR(255),\n  created_date TIMESTAMP,\n  price_category VARCHAR(50),\n  is_available BOOLEAN,\n  raw_data JSONB\n);\n```";
        
        onNodeUpdate(node.id, {
          config: {
            operation: "INSERT",
            table: "products",
            columns: ["product_name", "owner_email", "created_date", "price_category", "is_available"],
            batchSize: 1000,
            onConflict: "UPDATE",
            createTable: true
          }
        });
        response += "\n\n✅ **Ready**: Configured for high-performance data insertion!";
        break;
        
      default:
        response += `• **Node Type**: ${node.type}\n`;
        response += "• **Purpose**: Processes data according to your configuration\n";
        response += "• **Integration**: Works seamlessly with other workflow nodes\n\n";
        response += "💡 **Need specific help?** Ask about the exact configuration you need!";
    }
    
    return response;
  };

  const generateFilterResponse = (node: WorkflowNode): string => {
    return `🔍 **Advanced Filtering Guide**\n\n` +
           "🎯 **Visual Filter Builder Features:**\n" +
           "• **Multiple Conditions**: Combine with AND/OR logic\n" +
           "• **Smart Operators**: Contains, Starts With, Between, etc.\n" +
           "• **Data Type Support**: Auto-detect strings, numbers, dates\n" +
           "• **Custom Expressions**: Write JavaScript for complex logic\n\n" +
           "💡 **Real-World Examples:**\n" +
           "• E-commerce: `price > 50 && category === 'Electronics'`\n" +
           "• CRM: `status === 'active' && last_contact > '2024-01-01'`\n" +
           "• Analytics: `page_views > 1000 || conversion_rate > 0.05`\n\n" +
           "🚀 **Click 'Advanced Config' to build filters visually!**";
  };

  const generateHttpResponse = (node: WorkflowNode): string => {
    return `🌐 **HTTP Request Capabilities**\n\n` +
           "🎯 **Fetch Data From Any Source:**\n" +
           "• **Public APIs**: REST, GraphQL endpoints\n" +
           "• **Website Data**: JSON endpoints, API responses\n" +
           "• **Real-time**: Live data feeds and webhooks\n" +
           "• **Authentication**: API keys, Bearer tokens, Basic auth\n\n" +
           "💡 **Popular Data Sources:**\n" +
           "• **Financial**: CoinGecko, Alpha Vantage\n" +
           "• **Social**: Twitter API, Reddit API\n" +
           "• **News**: NewsAPI, Guardian API\n" +
           "• **Weather**: OpenWeatherMap\n" +
           "• **E-commerce**: Product APIs, inventory feeds\n\n" +
           "🚀 **Use the HTTP configurator below to set up any API connection!**";
  };

  const generateGeneralGuidance = (message: string): string => {
    if (message.toLowerCase().includes("filter")) {
      return "🔍 **Advanced Filtering System**\n\n" +
             "Build complex data filters with our visual editor:\n" +
             "• **Multiple Conditions**: AND/OR logic\n" +
             "• **Smart Operators**: Contains, Greater Than, Between\n" +
             "• **All Data Types**: Strings, Numbers, Dates, Booleans\n\n" +
             "🎯 **Add a Filter node** and I'll help you configure powerful filtering logic!";
    }
    
    if (message.toLowerCase().includes("http") || message.toLowerCase().includes("api")) {
      return "🌐 **Universal Data Fetching**\n\n" +
             "Connect to any website or API:\n" +
             "• **Public APIs**: Thousands of free endpoints\n" +
             "• **Real-time Data**: Live feeds and updates\n" +
             "• **Custom APIs**: Your own backend services\n\n" +
             "🚀 **Add an HTTP Request node** and I'll help you connect to any data source!";
    }
    
    return "🤖 **Complete ETL Workflow Assistant**\n\n" +
           "💾 **Build Any Data Pipeline:**\n" +
           "• **Input**: HTTP requests from any website/API\n" +
           "• **Transform**: Advanced field mapping and data cleaning\n" +
           "• **Filter**: Multi-condition filtering with visual builder\n" +
           "• **Output**: Databases, files, APIs, notifications\n\n" +
           "🎯 **Try**: Add nodes and ask 'configure this node' for guided setup!";
  };

  const quickActions = selectedNode ? [
    { label: "Configure Node", action: "Configure this node with all available options" },
    { label: "Filter Logic", action: "Show me advanced filtering options" },
    { label: "HTTP Setup", action: "Help me set up HTTP requests to fetch data" },
    { label: "Complete Pipeline", action: "How does this fit in a complete workflow?" }
  ] : [
    { label: "HTTP + Filter Pipeline", action: "Build a workflow with HTTP requests and advanced filtering" },
    { label: "Available APIs", action: "What APIs and data sources can I connect to?" },
    { label: "Filter Examples", action: "Show me advanced filtering examples" },
    { label: "Complete ETL Guide", action: "Give me a complete ETL workflow guide" }
  ];

  return (
    <Card className="bg-gray-800/50 border-gray-600 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="text-purple-400" size={20} />
          AI Workflow Assistant
        </CardTitle>
        {selectedNode && (
          <Badge variant="outline" className="w-fit">
            Configuring: {selectedNode.type}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        {/* Advanced Configuration Panels */}
        {selectedNode && (showFilterConfig || showHttpConfig) && (
          <div className="mb-4">
            {showFilterConfig && (selectedNode.type.includes('Filter')) && (
              <FilterConfig
                nodeId={selectedNode.id}
                config={selectedNode.config}
                onConfigUpdate={(config) => {
                  onNodeUpdate(selectedNode.id, { config });
                  setShowFilterConfig(false);
                }}
              />
            )}
            
            {showHttpConfig && (selectedNode.type.includes('HTTP') || selectedNode.type.includes('API')) && (
              <HttpConfig
                nodeId={selectedNode.id}
                config={selectedNode.config}
                onConfigUpdate={(config) => {
                  onNodeUpdate(selectedNode.id, { config });
                  setShowHttpConfig(false);
                }}
              />
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowFilterConfig(false);
                setShowHttpConfig(false);
              }}
              className="mt-2"
            >
              Close Advanced Config
            </Button>
          </div>
        )}

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

        {/* Advanced Config Buttons */}
        {selectedNode && (
          <div className="mb-4 flex gap-2">
            {(selectedNode.type.includes('Filter')) && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowFilterConfig(!showFilterConfig)}
                className="text-xs bg-purple-600/20 border-purple-500/30"
              >
                Advanced Filter Config
              </Button>
            )}
            
            {(selectedNode.type.includes('HTTP') || selectedNode.type.includes('API')) && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowHttpConfig(!showHttpConfig)}
                className="text-xs bg-blue-600/20 border-blue-500/30"
              >
                Advanced HTTP Config
              </Button>
            )}
          </div>
        )}

        {/* Quick Actions */}
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

        {/* Chat Input */}
        <div className="space-y-2">
          <Textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder={selectedNode ? 
              `Ask about ${selectedNode.type} configuration, filtering logic, HTTP setup, or workflow integration...` : 
              "Ask about HTTP requests, advanced filtering, data sources, or complete ETL workflows..."
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
              <span className="text-blue-400 text-xs font-semibold">Ready for Complete ETL</span>
            </div>
            <p className="text-gray-300 text-xs">
              Add HTTP Request + Advanced Filter + Database nodes for a complete data pipeline!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAssistant;
