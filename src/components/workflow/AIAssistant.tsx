import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WorkflowNode } from "@/components/WorkflowBuilder";
import { Brain, Sparkles, MessageCircle, Settings } from "lucide-react";
import { useState } from "react";
import FilterConfig from "./FilterConfig";
import HttpConfig from "./HttpConfig";
import CsvConfig from "./CsvConfig";
import SetConfig from "./SetConfig";
import DatabaseConfig from "./DatabaseConfig";

interface AIAssistantProps {
  selectedNode: WorkflowNode | null;
  onNodeUpdate: (nodeId: string, updates: Partial<WorkflowNode>) => void;
}

const AIAssistant = ({ selectedNode, onNodeUpdate }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m your AI Workflow Assistant. Select a node to configure it, or ask me about:\n\n• Data transformation strategies\n• Filter conditions\n• API integration\n• Database connections\n• Best practices'
    }
  ]);

  const getNodeConfigComponent = () => {
    if (!selectedNode) return null;

    switch (selectedNode.type) {
      case 'Filter':
      case 'Advanced Filter':
        return <FilterConfig node={selectedNode} onUpdate={onNodeUpdate} />;
      case 'HTTP Request':
      case 'JSON API':
      case 'Webhook':
        return <HttpConfig node={selectedNode} onUpdate={onNodeUpdate} />;
      case 'CSV Read':
        return <CsvConfig node={selectedNode} onUpdate={onNodeUpdate} />;
      case 'Set':
        return <SetConfig node={selectedNode} onUpdate={onNodeUpdate} />;
      case 'Database':
      case 'NoSQL':
      case 'Snowflake':
        return <DatabaseConfig node={selectedNode} onUpdate={onNodeUpdate} />;
      default:
        return (
          <Card className="bg-gray-800/50 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings size={20} />
                {selectedNode.title} Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Configuration panel for {selectedNode.type} nodes coming soon!
              </p>
              <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-500/30">
                <p className="text-blue-300 text-sm">
                  💡 This node type will execute with default settings. Add more configuration options as needed.
                </p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  const quickResponses = [
    "How do I filter data by conditions?",
    "What's the best way to transform fields?",
    "How to connect to external APIs?",
    "Database connection best practices",
    "Sample data transformation examples"
  ];

  const handleQuickResponse = (question: string) => {
    const newMessages = [
      ...messages,
      { role: 'user' as const, content: question }
    ];

    let response = '';
    
    switch (question) {
      case "How do I filter data by conditions?":
        response = "🔍 **Data Filtering Guide:**\n\n1. **Simple Filters:** Use basic conditions like `price > 100` or `status === 'active'`\n\n2. **Multiple Conditions:** Combine with AND/OR: `price > 100 AND category === 'Electronics'`\n\n3. **Advanced Filters:** Use complex expressions: `(price > 100 OR category === 'Premium') AND quantity > 0`\n\n4. **Field Validation:** Check if fields exist: `name && name.length > 0`\n\n💡 **Pro Tip:** Test your filters with sample data first!";
        break;
      case "What's the best way to transform fields?":
        response = "🔧 **Field Transformation Best Practices:**\n\n1. **Simple Mapping:** `new_name = old_name`\n\n2. **Calculations:** `total_price = price * quantity`\n\n3. **Conditional Logic:** `category = price > 100 ? 'expensive' : 'affordable'`\n\n4. **String Operations:** `full_name = first_name + ' ' + last_name`\n\n5. **Date Formatting:** `formatted_date = new Date(created_at).toLocaleDateString()`\n\n⚡ **Advanced:** Use JavaScript expressions for complex transformations!";
        break;
      case "How to connect to external APIs?":
        response = "🌐 **API Integration Guide:**\n\n1. **Basic Setup:** Enter the API URL in HTTP Request node\n\n2. **Authentication:** Add API keys in headers: `Authorization: Bearer YOUR_KEY`\n\n3. **Parameters:** Use query parameters: `?page=1&limit=100`\n\n4. **Error Handling:** Set timeout and retry options\n\n5. **Data Processing:** Transform API response to match your schema\n\n🔒 **Security:** Store API keys securely, never in plain text!";
        break;
      case "Database connection best practices":
        response = "💾 **Database Best Practices:**\n\n1. **Connection Pooling:** Use connection limits and timeouts\n\n2. **Batch Operations:** Insert/update in batches for better performance\n\n3. **Error Handling:** Implement retry logic for failed operations\n\n4. **Schema Validation:** Ensure data types match table schema\n\n5. **Indexing:** Create indexes on frequently queried columns\n\n🔧 **Optimization:** Use prepared statements and avoid N+1 queries!";
        break;
      case "Sample data transformation examples":
        response = "📊 **Sample Data Transformations:**\n\n**E-commerce Data:**\n```\nproduct_name = name\nowner_email = owner.email\nprice_tier = price > 100 ? 'premium' : 'standard'\nis_available = status === 'active' && quantity > 0\n```\n\n**User Data:**\n```\nfull_name = first_name + ' ' + last_name\nage_group = age < 30 ? 'young' : 'mature'\nemail_domain = email.split('@')[1]\n```\n\n🎯 **Try these with your sample data!**";
        break;
      default:
        response = "I'd be happy to help! Could you be more specific about what you'd like to know?";
    }

    setMessages([...newMessages, { role: 'assistant', content: response }]);
  };

  const getNodeAdvice = (nodeType: string) => {
    const advice: Record<string, string> = {
      'HTTP Request': '🌐 Configure your API endpoint and authentication. Test with sample endpoints first!',
      'CSV Read': '📄 Sample CSV data is loaded automatically. Configure parsing options as needed.',
      'Set': '🔧 Map input fields to output fields. Use JavaScript expressions for complex transformations.',
      'Filter': '🔍 Create conditions to filter your data. Combine multiple conditions with AND/OR logic.',
      'Database': '💾 Configure your database connection. For demo purposes, data will be logged to console.',
      'Merge': '🔗 Combine multiple data sources. Specify join keys and merge strategies.',
      'Code': '💻 Write custom JavaScript code for complex data processing.',
      'If': '🔀 Add conditional logic to your workflow based on data conditions.'
    };
    return advice[nodeType] || '⚙️ Configure this node according to your data processing needs.';
  };

  return (
    <Card className="bg-gray-800/50 border-gray-600 h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2 text-lg">
          <Brain className="text-cyan-400 animate-pulse" size={18} />
          AI Assistant
          {selectedNode && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {selectedNode.type}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4">
        {selectedNode ? (
          <div className="space-y-3 h-full flex flex-col">
            {/* Conversational header - more compact */}
            <div className="bg-purple-900/20 p-2.5 rounded-lg border border-purple-500/30">
              <div className="flex gap-2 items-center">
                <Sparkles size={14} className="text-purple-300" />
                <p className="text-purple-200 text-sm font-medium">
                  Configure {selectedNode.type} Node
                </p>
              </div>
              <p className="text-gray-300 text-xs mt-1.5 pl-5">
                {getNodeAdvice(selectedNode.type)}
              </p>
            </div>
            
            {/* Full-width configuration panel with better spacing */}
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="pr-2">
                  {getNodeConfigComponent()}
                </div>
              </ScrollArea>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-3 pr-2">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-purple-900/30 border border-purple-500/30 ml-4'
                        : 'bg-gray-700/50 border border-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.role === 'assistant' ? (
                        <Brain size={16} className="text-cyan-400 mt-1 flex-shrink-0" />
                      ) : (
                        <MessageCircle size={16} className="text-purple-400 mt-1 flex-shrink-0" />
                      )}
                      <div className="text-sm text-gray-200 whitespace-pre-line">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* Quick Help Panel - more compact */}
            <div className="bg-gray-900/80 rounded-lg border border-cyan-700/50 p-2.5 space-y-2">
              <p className="text-xs text-cyan-300 font-semibold mb-1">Quick Help</p>
              <div className="grid gap-1.5">
                {quickResponses.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickResponse(question)}
                    className="w-full justify-start text-left h-auto py-1.5 px-2.5 text-xs rounded border border-cyan-700/20 hover:border-cyan-500/70 bg-cyan-900/10 text-cyan-200 hover:bg-cyan-900/30 transition"
                  >
                    <Sparkles size={12} className="mr-1.5 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{question}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAssistant;
