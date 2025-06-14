
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Database, Globe, Code, Zap } from "lucide-react";

interface NodePaletteProps {
  onNodeSelect: (nodeType: string, position: { x: number; y: number }) => void;
}

const NodePalette = ({ onNodeSelect }: NodePaletteProps) => {
  const nodeCategories = {
    input: [
      { type: "HTTP Request", icon: "🌐", description: "Fetch data from APIs" },
      { type: "CSV Read", icon: "📄", description: "Read CSV files" },
      { type: "Webhook", icon: "📡", description: "Receive webhooks" },
    ],
    transform: [
      { type: "Set", icon: "🔧", description: "Map and transform data" },
      { type: "Filter", icon: "🔍", description: "Filter data rows" },
      { type: "Merge", icon: "🔗", description: "Combine datasets" },
      { type: "Code", icon: "💻", description: "Custom JavaScript" },
    ],
    logic: [
      { type: "If", icon: "🔀", description: "Conditional branching" },
      { type: "Switch", icon: "🔀", description: "Multiple conditions" },
      { type: "Wait", icon: "⏰", description: "Add delays" },
      { type: "Error Trigger", icon: "⚠️", description: "Handle errors" },
    ],
    output: [
      { type: "Database", icon: "🗄️", description: "Store in database" },
      { type: "Snowflake", icon: "❄️", description: "Load to Snowflake" },
      { type: "Slack", icon: "💬", description: "Send to Slack" },
      { type: "Email", icon: "📧", description: "Send emails" },
    ],
    ai: [
      { type: "OpenAI", icon: "🤖", description: "AI processing" },
      { type: "Function", icon: "⚡", description: "AI functions" },
      { type: "Execute Workflow", icon: "🚀", description: "Run sub-workflows" },
    ]
  };

  const handleNodeAdd = (nodeType: string) => {
    // Add node at a default position - in a real implementation, this could be drag & drop
    onNodeSelect(nodeType, { x: 0, y: 0 });
  };

  return (
    <Card className="bg-gray-800/50 border-gray-600 h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Plus size={20} />
          Node Palette
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="input" className="text-xs">
              <Globe size={14} className="mr-1" />
              Input
            </TabsTrigger>
            <TabsTrigger value="transform" className="text-xs">
              <Code size={14} className="mr-1" />
              Transform
            </TabsTrigger>
          </TabsList>
          
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="logic" className="text-xs">
              <Zap size={14} className="mr-1" />
              Logic
            </TabsTrigger>
            <TabsTrigger value="output" className="text-xs">
              <Database size={14} className="mr-1" />
              Output
            </TabsTrigger>
          </TabsList>
          
          <TabsList className="grid w-full grid-cols-1 mb-4">
            <TabsTrigger value="ai" className="text-xs">
              🤖 AI/ML
            </TabsTrigger>
          </TabsList>

          {Object.entries(nodeCategories).map(([category, nodes]) => (
            <TabsContent key={category} value={category} className="space-y-2">
              {nodes.map((node) => (
                <Button
                  key={node.type}
                  variant="outline"
                  className="w-full justify-start p-3 h-auto hover:bg-purple-600/20 border-gray-600"
                  onClick={() => handleNodeAdd(node.type)}
                >
                  <div className="flex items-start gap-3 w-full text-left">
                    <span className="text-xl">{node.icon}</span>
                    <div className="flex-1">
                      <div className="text-white font-medium">{node.type}</div>
                      <div className="text-gray-400 text-xs">{node.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-6 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
          <h4 className="text-white text-sm font-semibold mb-2">💡 Quick Tip</h4>
          <p className="text-gray-300 text-xs">
            Start with an input node (HTTP Request or CSV), add transformation logic, 
            and finish with an output destination.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NodePalette;
