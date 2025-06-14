
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import WorkflowCanvas from "@/components/workflow/WorkflowCanvas";
import NodePalette from "@/components/workflow/NodePalette";
import AIAssistant from "@/components/workflow/AIAssistant";
import ExecutionPanel from "@/components/workflow/ExecutionPanel";
import { workflowMissions } from "@/data/workflowMissions";
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
  };

  const updateNode = (nodeId: string, updates: Partial<WorkflowNode>) => {
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  };

  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter(node => node.id !== nodeId));
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    }
  };

  const executeWorkflow = async () => {
    if (nodes.length === 0) return;
    
    setIsExecuting(true);
    setExecutionResult(null);
    
    // Reset all node statuses
    nodes.forEach(node => updateNode(node.id, { status: 'idle' }));
    
    // Simulate workflow execution
    const executionLogs: string[] = [];
    let totalScore = mission.baseScore;
    let hasErrors = false;
    
    executionLogs.push('🚀 Starting workflow execution...');
    executionLogs.push('');
    
    for (const node of nodes) {
      updateNode(node.id, { status: 'running' });
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
      
      // Simulate node execution based on type
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      if (success) {
        updateNode(node.id, { status: 'success' });
        executionLogs.push(`✅ ${node.title} completed successfully`);
        totalScore += 10;
      } else {
        updateNode(node.id, { status: 'error' });
        executionLogs.push(`❌ ${node.title} failed - check configuration`);
        hasErrors = true;
        totalScore -= 5;
      }
    }
    
    executionLogs.push('');
    if (!hasErrors) {
      executionLogs.push('🎉 Workflow completed successfully!');
      executionLogs.push('📊 All data processed and loaded correctly');
      
      if (!completedMissions.includes(currentMission)) {
        setCompletedMissions([...completedMissions, currentMission]);
        onScoreUpdate(totalScore);
      }
    } else {
      executionLogs.push('⚠️ Workflow completed with errors');
      executionLogs.push('💡 Use AI Assistant to fix issues and retry');
    }
    
    setExecutionResult({
      success: !hasErrors,
      logs: executionLogs,
      score: Math.max(totalScore, 0),
      nodesProcessed: nodes.length
    });
    
    setIsExecuting(false);
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
          Build automated ETL workflows with AI assistance. Drag nodes, connect them, and deploy real data pipelines!
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
          <div className="flex flex-wrap gap-2">
            {mission.requiredNodes.map((nodeType, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {nodeType}
              </Badge>
            ))}
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
