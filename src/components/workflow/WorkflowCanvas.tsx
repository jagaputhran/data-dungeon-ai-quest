
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkflowNode } from "@/components/WorkflowBuilder";
import { Play, Trash2, Settings, CheckCircle, XCircle, Clock, Database } from "lucide-react";
import { sampleCsvData, simulateApiCall } from "@/services/sampleDataService";

interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  selectedNode: string | null;
  onNodeSelect: (nodeId: string) => void;
  onNodeUpdate: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  onNodeDelete: (nodeId: string) => void;
  onExecute: () => void;
  isExecuting: boolean;
}

const WorkflowCanvas = ({
  nodes,
  selectedNode,
  onNodeSelect,
  onNodeUpdate,
  onNodeDelete,
  onExecute,
  isExecuting
}: WorkflowCanvasProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Clock className="animate-spin" size={16} />;
      case 'success':
        return <CheckCircle className="text-green-400" size={16} />;
      case 'error':
        return <XCircle className="text-red-400" size={16} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'border-yellow-400 bg-yellow-400/10';
      case 'success':
        return 'border-green-400 bg-green-400/10';
      case 'error':
        return 'border-red-400 bg-red-400/10';
      default:
        return 'border-gray-600 bg-gray-800/50';
    }
  };

  const getNodeIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      'HTTP Request': '🌐',
      'Set': '🔧',
      'Database': '🗄️',
      'CSV Read': '📄',
      'Filter': '🔍',
      'Webhook': '📡',
      'If': '🔀',
      'Snowflake': '❄️',
      'Slack': '💬',
      'Merge': '🔗',
      'Code': '💻',
      'Switch': '🔀',
      'Function': '⚡',
      'Email': '📧',
      'OpenAI': '🤖',
      'Wait': '⏰',
      'Error Trigger': '⚠️',
      'Execute Workflow': '🚀'
    };
    return iconMap[type] || '📦';
  };

  const handleNodeClick = (nodeId: string) => {
    console.log('Node clicked:', nodeId);
    onNodeSelect(nodeId);
  };

  const executeNodeWithSampleData = async (node: WorkflowNode): Promise<any> => {
    console.log(`Executing ${node.type} node with sample data...`);
    
    switch (node.type) {
      case "CSV Read":
        console.log("CSV Read - Loading sample data:", sampleCsvData);
        return { data: sampleCsvData, count: sampleCsvData.length };
        
      case "HTTP Request":
        const endpoint = node.config?.url || "https://jsonplaceholder.typicode.com/posts";
        console.log("HTTP Request - Fetching from:", endpoint);
        const apiData = await simulateApiCall(endpoint);
        return { data: apiData, count: apiData.length };
        
      case "Set":
        console.log("Set - Applying transformations:", node.config?.mappings);
        return { 
          data: sampleCsvData.map(item => ({
            feature_name: item.name,
            owner_email: item.owner.email,
            created_date: item.created_at,
            status: item.status || 'active',
            price_category: item.price > 100 ? 'expensive' : 'affordable'
          })),
          transformationsApplied: Object.keys(node.config?.mappings || {}).length
        };
        
      case "Filter":
        const filteredData = sampleCsvData.filter(item => item.status === 'active');
        console.log("Filter - Filtered data:", filteredData);
        return { data: filteredData, filtered: sampleCsvData.length - filteredData.length };
        
      case "Database":
        console.log("Database - Inserting records:", node.config);
        return { inserted: sampleCsvData.length, table: node.config?.table || 'products' };
        
      default:
        return { processed: true, nodeType: node.type };
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-600 h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center gap-2">
            <Play size={20} />
            Workflow Canvas
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log("Sample data available:", { csv: sampleCsvData.length, apis: 3 });
              }}
              className="text-cyan-400 border-cyan-400 hover:bg-cyan-400/20"
            >
              <Database size={16} className="mr-1" />
              Sample Data Ready
            </Button>
            <Button
              onClick={onExecute}
              disabled={isExecuting || nodes.length === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isExecuting ? (
                <>
                  <Clock className="animate-spin mr-2" size={16} />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="mr-2" size={16} />
                  Run Workflow
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="min-h-[400px] border-2 border-dashed border-gray-600 rounded-lg p-4 relative bg-gray-900/20">
          {nodes.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              <Play size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">Drop nodes here to build your workflow</p>
              <p className="text-sm mt-2 text-cyan-400">
                💡 Try: CSV Read → Set → Filter → Database
              </p>
              <div className="mt-4 p-3 bg-cyan-900/20 rounded-lg border border-cyan-500/30">
                <p className="text-xs text-cyan-300">
                  Sample data includes: Products, Categories, Pricing, Inventory
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {nodes.map((node, index) => (
                <div key={node.id} className="flex items-center gap-4">
                  {/* Connection line */}
                  {index > 0 && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gray-500 -mt-6"></div>
                  )}
                  
                  {/* Node */}
                  <div
                    className={`
                      relative flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                      ${getStatusColor(node.status)}
                      ${selectedNode === node.id ? 'ring-2 ring-purple-400 bg-purple-900/20' : ''}
                      hover:scale-105 hover:bg-purple-900/10
                    `}
                    onClick={() => handleNodeClick(node.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getNodeIcon(node.type)}</span>
                        <div>
                          <h4 className="text-white font-semibold">{node.title}</h4>
                          <p className="text-gray-400 text-sm">{node.type}</p>
                          {selectedNode === node.id && (
                            <p className="text-purple-300 text-xs mt-1">
                              ✓ Selected - Configure in AI Assistant →
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusIcon(node.status)}
                        <Badge variant="outline" className="text-xs">
                          {node.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNodeClick(node.id);
                          }}
                        >
                          <Settings size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNodeDelete(node.id);
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Configuration preview */}
                    {Object.keys(node.config).length > 0 && (
                      <div className="mt-2 text-xs text-gray-400">
                        <span>Configured: {Object.keys(node.config).join(', ')}</span>
                      </div>
                    )}

                    {/* Sample data indicator */}
                    {(node.type === "CSV Read" || node.type === "HTTP Request") && (
                      <div className="mt-2 text-xs text-cyan-400">
                        📊 Sample data available: {node.type === "CSV Read" ? "5 products" : "API endpoints"}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {nodes.length > 0 && (
          <div className="mt-4 text-sm text-gray-400 flex justify-between">
            <span>{nodes.length} nodes in workflow</span>
            <span>
              {selectedNode ? 
                `Node "${nodes.find(n => n.id === selectedNode)?.title}" selected` : 
                'Click nodes to configure'
              }
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkflowCanvas;
