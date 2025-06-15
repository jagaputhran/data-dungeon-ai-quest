
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { WorkflowNode } from "@/components/WorkflowBuilder";
import { Brain, MessageSquare, Wand2, AlertCircle } from "lucide-react";
import { sampleCsvData, sampleApiEndpoints } from "@/services/sampleDataService";

interface AIAssistantProps {
  selectedNode: WorkflowNode | null;
  onNodeUpdate: (nodeId: string, updates: Partial<WorkflowNode>) => void;
}

const AIAssistant = ({ selectedNode, onNodeUpdate }: AIAssistantProps) => {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{role: string, message: string}>>([
    {
      role: "assistant",
      message: "🚀 **Complete Workflow Guide Ready!**\n\n💾 **Sample Data Available:**\n• CSV: 5 product records with categories, pricing, inventory\n• APIs: JSONPlaceholder endpoints for testing\n\n🔄 **Suggested Flow:**\n1. **Data Input**: CSV Read or HTTP Request\n2. **Transform**: Set node for field mapping\n3. **Logic**: Filter or If nodes for conditions\n4. **Output**: Database or Snowflake for storage\n\n💡 **Quick Start**: Add a CSV Read node and ask me to configure it!"
    }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

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
          
          // Handle different query types
          if (currentMessage.toLowerCase().includes("configure") || 
              currentMessage.toLowerCase().includes("setup") ||
              currentMessage.toLowerCase().includes("how")) {
            
            aiResponse = generateConfigurationResponse(selectedNode, currentMessage);
            
          } else if (currentMessage.toLowerCase().includes("data") || 
                    currentMessage.toLowerCase().includes("sample")) {
            
            aiResponse = generateDataResponse(selectedNode);
            
          } else if (currentMessage.toLowerCase().includes("flow") || 
                    currentMessage.toLowerCase().includes("workflow")) {
            
            aiResponse = generateWorkflowResponse(selectedNode);
            
          } else if (currentMessage.toLowerCase().includes("error") || 
                    currentMessage.toLowerCase().includes("debug")) {
            
            aiResponse = generateDebugResponse(selectedNode);
            
          } else {
            aiResponse = generateGeneralResponse(selectedNode, currentMessage);
          }
          
        } else {
          // No node selected - provide general guidance
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

  const generateConfigurationResponse = (node: WorkflowNode, message: string): string => {
    let response = `🔧 **Configuring ${node.type} Node**\n\n`;
    
    switch (node.type) {
      case "CSV Read":
        response += "📄 **CSV Read Configuration:**\n";
        response += "• **File Source**: Built-in sample data (5 product records)\n";
        response += "• **Columns**: id, name, category, price, quantity, status, created_at, owner\n";
        response += "• **Format**: Standard CSV with headers\n\n";
        response += "📊 **Sample Data Preview:**\n";
        response += "```json\n";
        response += JSON.stringify(sampleCsvData[0], null, 2);
        response += "\n```\n\n";
        response += "✅ **Auto-configured**: Ready to read sample product data!";
        
        onNodeUpdate(node.id, {
          config: {
            source: "sample_products.csv",
            hasHeaders: true,
            delimiter: ",",
            encoding: "utf-8",
            skipRows: 0,
            dataPreview: sampleCsvData.slice(0, 2)
          }
        });
        break;
        
      case "HTTP Request":
        response += "🌐 **HTTP Request Configuration:**\n";
        response += "• **Method**: GET (for data fetching)\n";
        response += "• **URL**: JSONPlaceholder API endpoint\n";
        response += "• **Headers**: Content-Type, Authorization (if needed)\n\n";
        response += "🔗 **Available Sample APIs:**\n";
        Object.entries(sampleApiEndpoints).forEach(([name, url]) => {
          response += `• **${name}**: ${url}\n`;
        });
        response += "\n💡 **Example Response Format:**\n";
        response += "```json\n{\n  \"id\": 1,\n  \"title\": \"Product Name\",\n  \"body\": \"Description\",\n  \"userId\": 1\n}\n```";
        
        onNodeUpdate(node.id, {
          config: {
            method: "GET",
            url: sampleApiEndpoints.products,
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            timeout: 30000,
            retries: 3
          }
        });
        response += "\n\n✅ **Configured**: Ready to fetch from sample API!";
        break;
        
      case "Set":
        response += "🔧 **Data Transformation Configuration:**\n";
        response += "• **Field Mapping**: Transform input fields to desired output\n";
        response += "• **Expressions**: Use JavaScript for complex transformations\n";
        response += "• **Type Conversion**: Ensure proper data types\n\n";
        response += "💡 **Smart Mapping for Sample Data:**\n";
        response += "```json\n{\n  \"product_name\": \"{{$json.name}}\",\n  \"owner_email\": \"{{$json.owner.email}}\",\n  \"created_date\": \"{{$json.created_at}}\",\n  \"price_category\": \"{{$json.price > 100 ? 'expensive' : 'affordable'}}\",\n  \"is_available\": \"{{$json.status === 'active' && $json.quantity > 0}}\"\n}\n```\n\n";
        response += "🎯 **Transformation Benefits:**\n";
        response += "• Standardize field names\n• Add calculated fields\n• Apply business logic\n• Format data for destination";
        
        onNodeUpdate(node.id, {
          config: {
            mappings: {
              "product_name": "{{$json.name}}",
              "owner_email": "{{$json.owner.email}}",
              "created_date": "{{$json.created_at}}",
              "price_category": "{{$json.price > 100 ? 'expensive' : 'affordable'}}",
              "is_available": "{{$json.status === 'active' && $json.quantity > 0}}"
            },
            keepOnlySet: false,
            options: { dateFormat: "ISO" }
          }
        });
        response += "\n\n✅ **Auto-configured**: Smart mappings applied!";
        break;
        
      case "Filter":
        response += "🔍 **Data Filter Configuration:**\n";
        response += "• **Condition Logic**: Keep only records that match criteria\n";
        response += "• **Multiple Conditions**: AND/OR logic support\n\n";
        response += "💡 **Smart Filters for Sample Data:**\n";
        response += "```javascript\n// Active products only\n{{$json.status === 'active'}}\n\n// Products with inventory\n{{$json.quantity > 0}}\n\n// Electronics over $100\n{{$json.category === 'Electronics' && $json.price > 100}}\n```\n\n";
        response += "📊 **Filter Impact**: From 5 records → ~3 active products";
        
        onNodeUpdate(node.id, {
          config: {
            condition: "{{$json.status === 'active'}}",
            conditions: {
              all: [
                { field: "status", operator: "equals", value: "active" },
                { field: "quantity", operator: "greater_than", value: 0 }
              ]
            }
          }
        });
        response += "\n\n✅ **Configured**: Filtering for active products with inventory!";
        break;
        
      case "Database":
        response += "🗄️ **Database Storage Configuration:**\n";
        response += "• **Operation**: INSERT new records\n";
        response += "• **Table**: products (auto-created)\n";
        response += "• **Mapping**: Field to column mapping\n\n";
        response += "💾 **Optimized Schema:**\n";
        response += "```sql\nCREATE TABLE products (\n  id SERIAL PRIMARY KEY,\n  product_name VARCHAR(255),\n  owner_email VARCHAR(255),\n  created_date TIMESTAMP,\n  price_category VARCHAR(50),\n  is_available BOOLEAN\n);\n```";
        
        onNodeUpdate(node.id, {
          config: {
            operation: "INSERT",
            table: "products",
            columns: ["product_name", "owner_email", "created_date", "price_category", "is_available"],
            onConflict: "UPDATE",
            batchSize: 100
          }
        });
        response += "\n\n✅ **Ready**: Will insert transformed product data!";
        break;
        
      default:
        response += `• **Node Type**: ${node.type}\n`;
        response += "• Configuration depends on specific requirements\n";
        response += "• Check node documentation for parameters\n\n";
        response += "💡 **Need specific help?** Ask about the exact configuration you need!";
    }
    
    return response;
  };

  const generateDataResponse = (node: WorkflowNode): string => {
    let response = `📊 **Data Information for ${node.type}**\n\n`;
    
    switch (node.type) {
      case "CSV Read":
        response += "📄 **Sample CSV Data:**\n";
        response += `• **Records**: ${sampleCsvData.length} products\n`;
        response += `• **Categories**: ${[...new Set(sampleCsvData.map(p => p.category))].join(', ')}\n`;
        response += `• **Price Range**: $${Math.min(...sampleCsvData.map(p => p.price))} - $${Math.max(...sampleCsvData.map(p => p.price))}\n`;
        response += `• **Active Products**: ${sampleCsvData.filter(p => p.status === 'active').length}\n\n`;
        response += "🔍 **Data Structure:**\n";
        response += "```json\n" + JSON.stringify(sampleCsvData[0], null, 2) + "\n```";
        break;
        
      case "HTTP Request":
        response += "🌐 **API Data Sources:**\n";
        Object.entries(sampleApiEndpoints).forEach(([name, url]) => {
          response += `• **${name}**: ${url}\n`;
        });
        response += "\n📡 **Expected Response**: JSON array with objects\n";
        response += "🔄 **Data Flow**: API → JSON → Transformation → Output";
        break;
        
      default:
        response += "• Data processing capabilities depend on input from previous nodes\n";
        response += "• Will work with any JSON-structured data\n";
        response += "• Supports arrays and nested objects";
    }
    
    return response;
  };

  const generateWorkflowResponse = (node: WorkflowNode): string => {
    return `🔄 **Complete Workflow with ${node.type}**\n\n` +
           "📋 **Recommended Flow:**\n" +
           "1. **📄 CSV Read** → Load sample product data\n" +
           "2. **🔧 Set** → Transform and map fields\n" +
           "3. **🔍 Filter** → Keep only active products\n" +
           "4. **🗄️ Database** → Store final results\n\n" +
           "💡 **Your current node** fits into this flow and will process the data according to your configuration.\n\n" +
           "🚀 **Next Steps**: Configure remaining nodes and run the workflow!";
  };

  const generateDebugResponse = (node: WorkflowNode): string => {
    return `🔍 **Debugging ${node.type} Node**\n\n` +
           "✅ **Common Checks:**\n" +
           "• Configuration is complete and valid\n" +
           "• Input data format matches expectations\n" +
           "• All required fields are mapped\n" +
           "• No syntax errors in expressions\n\n" +
           "🛠️ **Troubleshooting Tips:**\n" +
           "• Check the execution logs for detailed errors\n" +
           "• Verify sample data is loading correctly\n" +
           "• Test individual transformations\n" +
           "• Ensure proper data flow between nodes\n\n" +
           "💡 **Need specific help?** Describe the exact error you're seeing!";
  };

  const generateGeneralResponse = (node: WorkflowNode, message: string): string => {
    return `💡 **About ${node.type} Nodes**\n\n` +
           getNodeExplanation(node.type) + "\n\n" +
           "🎯 **Available Actions:**\n" +
           "• Ask me to 'configure this node'\n" +
           "• Request 'sample data information'\n" +
           "• Get 'workflow recommendations'\n" +
           "• Ask for 'debugging help'\n\n" +
           "💬 **Or ask specific questions** about your data processing needs!";
  };

  const generateGeneralGuidance = (message: string): string => {
    if (message.toLowerCase().includes("workflow") || message.toLowerCase().includes("flow")) {
      return "🔄 **Complete ETL Workflow Guide**\n\n" +
             "📊 **Data Sources Available:**\n" +
             "• CSV: 5 sample product records\n" +
             "• API: JSONPlaceholder endpoints\n\n" +
             "🛠️ **Recommended Workflow:**\n" +
             "1. **Input**: CSV Read or HTTP Request\n" +
             "2. **Transform**: Set node for mapping\n" +
             "3. **Filter**: Apply business logic\n" +
             "4. **Output**: Database or Snowflake\n\n" +
             "🚀 **Quick Start**: Add nodes from the palette and I'll help configure them!";
    }
    
    if (message.toLowerCase().includes("data") || message.toLowerCase().includes("sample")) {
      return "📊 **Sample Data Overview**\n\n" +
             `• **CSV Records**: ${sampleCsvData.length} products with full details\n` +
             "• **API Endpoints**: 3 test endpoints available\n" +
             "• **Data Types**: Products, categories, pricing, inventory\n" +
             "• **Use Cases**: E-commerce, inventory, analytics\n\n" +
             "💡 **Get Started**: Add a CSV Read or HTTP Request node and ask me to configure it!";
    }
    
    return "🤖 **AI Workflow Assistant Ready!**\n\n" +
           "💾 **I can help you with:**\n" +
           "• **Configure Nodes**: Select any node for specific setup\n" +
           "• **Sample Data**: Built-in CSV and API data sources\n" +
           "• **Complete Flows**: End-to-end ETL pipeline guidance\n" +
           "• **Debugging**: Fix errors and optimize performance\n\n" +
           "🎯 **Try This**: Add a CSV Read node, select it, and ask 'configure this node'!";
  };

  const getNodeExplanation = (nodeType: string): string => {
    const explanations: Record<string, string> = {
      "CSV Read": "**Loads data from CSV files**. Perfect for batch processing and data imports. Our sample includes 5 product records with categories, pricing, and inventory data.",
      "HTTP Request": "**Fetches data from APIs**. Ideal for real-time data integration. Sample endpoints include JSONPlaceholder for testing API workflows.",
      "Set": "**Transforms and maps data**. Essential for data cleaning and field mapping. Use JavaScript expressions for complex transformations and business logic.",
      "Filter": "**Filters data based on conditions**. Perfect for data quality and business rules. Keep only records that meet your criteria.",
      "Database": "**Stores data in databases**. Final destination for your processed data. Supports MySQL, PostgreSQL, and other SQL databases.",
      "Snowflake": "**Loads data to Snowflake**. Enterprise data warehouse solution for analytics and big data processing.",
    };
    
    return explanations[nodeType] || "This node performs specific operations in your data pipeline. Ask me about its configuration for detailed setup help.";
  };

  const quickActions = selectedNode ? [
    { label: "Configure Node", action: "Configure this node with sample data" },
    { label: "Show Sample Data", action: "What sample data is available for this node?" },
    { label: "Complete Workflow", action: "How does this node fit in a complete workflow?" },
    { label: "Debug Issues", action: "Help me debug any issues with this node" }
  ] : [
    { label: "Start Workflow", action: "How do I start building a workflow?" },
    { label: "Sample Data", action: "What sample data is available?" },
    { label: "Best Practices", action: "What are ETL workflow best practices?" },
    { label: "Quick Setup", action: "Give me a quick workflow setup guide" }
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
              `Ask about ${selectedNode.type} configuration, sample data, or workflow integration...` : 
              "Ask about workflows, sample data, configurations, or how to get started..."
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
              <span className="text-blue-400 text-xs font-semibold">Ready to Start</span>
            </div>
            <p className="text-gray-300 text-xs">
              Add nodes from the palette and select them for specific configuration help!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAssistant;
