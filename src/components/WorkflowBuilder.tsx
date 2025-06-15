
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import WorkflowCanvas from "@/components/workflow/WorkflowCanvas";
import NodePalette from "@/components/workflow/NodePalette";
import AIAssistant from "@/components/workflow/AIAssistant";
import ExecutionPanel from "@/components/workflow/ExecutionPanel";
import { workflowMissions } from "@/data/workflowMissions";
import { sampleCsvData, simulateApiCall } from "@/services/sampleDataService";
import { GitBranch, Brain, Play, CheckCircle } from "lucide-react";

interface WorkflowBuilderProps {
  onScoreUpdate: (points: number) => void;
}

export interface WorkflowNode {
  id: string;
  type: string;
  title: string;
  position: { x: number; y: number };
  status: 'idle' | 'running' | 'success' | 'error';
  config: Record<string, any>;
  connections: string[];
}

const WorkflowBuilder = ({ onScoreUpdate }: WorkflowBuilderProps) => {
  const [currentMission, setCurrentMission] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const mission = workflowMissions[currentMission];
  const progressPercentage = (completedMissions.length / workflowMissions.length) * 100;

  const addNode = (nodeType: string, position: { x: number; y: number }) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: nodeType,
      title: nodeType.replace(/([A-Z])/g, ' $1').trim(),
      position,
      status: 'idle',
      config: {},
      connections: []
    };
    setNodes([...nodes, newNode]);
    console.log('Added node:', nodeType, 'Total nodes:', nodes.length + 1);
  };

  const updateNode = (nodeId: string, updates: Partial<WorkflowNode>) => {
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
    console.log('Updated node:', nodeId, 'Updates:', updates);
  };

  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter(node => node.id !== nodeId));
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    }
    console.log('Deleted node:', nodeId);
  };

  const executeWorkflow = async () => {
    if (nodes.length === 0) return;
    
    console.log('Starting workflow execution with sample data...');
    setIsExecuting(true);
    setExecutionResult(null);
    
    // Reset all node statuses
    nodes.forEach(node => updateNode(node.id, { status: 'idle' }));
    
    const executionLogs: string[] = [];
    let totalScore = mission.baseScore;
    let hasErrors = false;
    let processedData = null;
    
    executionLogs.push('🚀 Starting workflow execution with sample data...');
    executionLogs.push(`📊 Available data: ${sampleCsvData.length} sample records`);
    executionLogs.push('');
    
    for (const node of nodes) {
      updateNode(node.id, { status: 'running' });
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      try {
        // Execute node with real sample data
        let nodeResult;
        
        switch (node.type) {
          case "CSV Read":
            nodeResult = { data: sampleCsvData, count: sampleCsvData.length };
            processedData = sampleCsvData;
            executionLogs.push(`✅ ${node.title} loaded ${sampleCsvData.length} records from sample CSV`);
            break;
            
          case "HTTP Request":
            const apiData = await simulateApiCall(node.config?.url || "");
            nodeResult = { data: apiData, count: apiData.length };
            processedData = apiData;
            executionLogs.push(`✅ ${node.title} fetched ${apiData.length} records from API`);
            break;
            
          case "Set":
            if (processedData) {
              const transformedData = processedData.map((item: any) => ({
                product_name: item.name || item.title,
                owner_email: item.owner?.email || `user${item.id}@example.com`,
                created_date: item.created_at || new Date().toISOString(),
                price_category: (item.price || 50) > 100 ? 'expensive' : 'affordable',
                is_available: item.status === 'active' && (item.quantity || 0) > 0
              }));
              processedData = transformedData;
              executionLogs.push(`✅ ${node.title} transformed ${transformedData.length} records with field mappings`);
            }
            break;
            
          case "Filter":
            if (processedData) {
              const filteredData = processedData.filter((item: any) => 
                item.status === 'active' || item.is_available
              );
              processedData = filteredData;
              executionLogs.push(`✅ ${node.title} filtered to ${filteredData.length} active records`);
            }
            break;
            
          case "Database":
            if (processedData) {
              executionLogs.push(`✅ ${node.title} inserted ${processedData.length} records into ${node.config?.table || 'products'} table`);
            }
            break;
            
          default:
            executionLogs.push(`✅ ${node.title} processed successfully`);
        }
        
        updateNode(node.id, { status: 'success' });
        totalScore += 15;
        
      } catch (error) {
        updateNode(node.id, { status: 'error' });
        executionLogs.push(`❌ ${node.title} failed - ${error}`);
        hasErrors = true;
        totalScore -= 5;
      }
    }
    
    executionLogs.push('');
    if (!hasErrors) {
      executionLogs.push('🎉 Workflow completed successfully!');
      executionLogs.push(`📊 Final output: ${processedData ? processedData.length : 'N/A'} processed records`);
      executionLogs.push('💾 Data ready for analysis and reporting');
      
      if (!completedMissions.includes(currentMission)) {
        setCompletedMissions([...completedMissions, currentMission]);
        onScoreUpdate(totalScore);
        executionLogs.push(`🏆 Mission completed! +${totalScore} points earned`);
      }
    } else {
      executionLogs.push('⚠️ Workflow completed with errors');
      executionLogs.push('💡 Use AI Assistant to fix configuration issues');
    }
    
    setExecutionResult({
      success: !hasErrors,
      logs: executionLogs,
      score: Math.max(totalScore, 0),
      nodesProcessed: nodes.length,
      finalData: processedData
    });
    
    setIsExecuting(false);
    console.log('Workflow execution completed:', { success: !hasErrors, nodes: nodes.length });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <GitBranch className="text-purple-400 animate-pulse" size={32} />
          AI FlowForge: Visual Workflow Builder
          <Brain className="text-cyan-400 animate-bounce" size={32} />
        </h2>
        <p className="text-gray-300 text-lg mb-4">
          Build automated ETL workflows with AI assistance. Use sample data, configure transformations, and deploy real pipelines!
        </p>
        
        {/* Mission Progress */}
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Mission Progress</span>
            <span>{completedMissions.length}/{workflowMissions.length}</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
      </div>

      {/* Current Mission */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Mission: {mission.name}</span>
            <Badge variant={completedMissions.includes(currentMission) ? "default" : "outline"}>
              {completedMissions.includes(currentMission) ? (
                <><CheckCircle size={16} className="mr-1" /> Completed</>
              ) : (
                <><Play size={16} className="mr-1" /> In Progress</>
              )}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">{mission.description}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {mission.requiredNodes.map((nodeType, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {nodeType}
              </Badge>
            ))}
          </div>
          <div className="text-sm text-cyan-400">
            💡 Sample data and APIs are ready for testing your workflow!
          </div>
        </CardContent>
      </Card>

      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
        {/* Node Palette */}
        <div className="lg:col-span-1">
          <NodePalette onNodeSelect={addNode} />
        </div>

        {/* Workflow Canvas */}
        <div className="lg:col-span-2">
          <WorkflowCanvas
            nodes={nodes}
            selectedNode={selectedNode}
            onNodeSelect={setSelectedNode}
            onNodeUpdate={updateNode}
            onNodeDelete={deleteNode}
            onExecute={executeWorkflow}
            isExecuting={isExecuting}
          />
        </div>

        {/* AI Assistant */}
        <div className="lg:col-span-1">
          <AIAssistant
            selectedNode={selectedNode ? nodes.find(n => n.id === selectedNode) : null}
            onNodeUpdate={updateNode}
          />
        </div>
      </div>

      {/* Execution Results */}
      {executionResult && (
        <ExecutionPanel
          result={executionResult}
          onRetry={executeWorkflow}
        />
      )}
    </div>
  );
};

export default WorkflowBuilder;
