
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MissionSelector from "@/components/aiops/MissionSelector";
import CodeEditor from "@/components/aiops/CodeEditor";
import SimulationPanel from "@/components/aiops/SimulationPanel";
import { aiOpsMissions } from "@/data/aiOpsMissions";
import { Docker, Settings, Zap, AlertTriangle, Check } from "lucide-react";

interface AiOpsArenaProps {
  onScoreUpdate: (points: number) => void;
}

const AiOpsArena = ({ onScoreUpdate }: AiOpsArenaProps) => {
  const [currentMission, setCurrentMission] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [generatedCode, setGeneratedCode] = useState<any>(null);

  const mission = aiOpsMissions[currentMission];
  const progressPercentage = (completedMissions.length / aiOpsMissions.length) * 100;

  const handleMissionSelect = (missionIndex: number) => {
    setCurrentMission(missionIndex);
    setSimulationResult(null);
    setGeneratedCode(null);
  };

  const handleCodeGeneration = (code: any) => {
    setGeneratedCode(code);
  };

  const handleSimulation = async () => {
    if (!generatedCode) return;
    
    setIsSimulating(true);
    
    // Simulate deployment process
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      const result = {
        success,
        logs: success 
          ? [`✅ ${mission.name} completed successfully!`, "🚀 Deployment ready", "📊 All checks passed"]
          : [`❌ Deployment failed`, "🔧 Configuration error detected", "💡 AI suggests: Check your YAML syntax"],
        score: success ? mission.baseScore : Math.floor(mission.baseScore * 0.3)
      };
      
      setSimulationResult(result);
      setIsSimulating(false);
      
      if (success && !completedMissions.includes(currentMission)) {
        setCompletedMissions([...completedMissions, currentMission]);
        onScoreUpdate(result.score);
      }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Zap className="text-yellow-400 animate-pulse" size={32} />
          AI Ops Arena: Full-Stack DevOps Challenge
          <Settings className="text-cyan-400 animate-spin" size={32} />
        </h2>
        <p className="text-gray-300 text-lg mb-4">
          Master advanced DevOps workflows using AI assistants. From containerization to Kubernetes to observability — build full pipelines and deploy real apps!
        </p>
        
        {/* Progress Tracker */}
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Mission Progress</span>
            <span>{completedMissions.length}/{aiOpsMissions.length}</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
      </div>

      {/* Main Game Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mission Selector */}
        <Card className="bg-gray-800/50 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Docker size={20} />
              Mission Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MissionSelector
              missions={aiOpsMissions}
              currentMission={currentMission}
              completedMissions={completedMissions}
              onMissionSelect={handleMissionSelect}
            />
          </CardContent>
        </Card>

        {/* Code Editor Panel */}
        <Card className="bg-gray-800/50 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings size={20} />
              AI Code Generator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CodeEditor
              mission={mission}
              onCodeGenerated={handleCodeGeneration}
            />
          </CardContent>
        </Card>

        {/* Simulation Panel */}
        <Card className="bg-gray-800/50 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap size={20} />
              Deployment Simulator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimulationPanel
              mission={mission}
              generatedCode={generatedCode}
              isSimulating={isSimulating}
              simulationResult={simulationResult}
              onSimulate={handleSimulation}
            />
          </CardContent>
        </Card>
      </div>

      {/* Mission Details */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Current Mission: {mission.name}</span>
            <Badge variant={completedMissions.includes(currentMission) ? "default" : "outline"}>
              {completedMissions.includes(currentMission) ? (
                <><Check size={16} className="mr-1" /> Completed</>
              ) : (
                <><AlertTriangle size={16} className="mr-1" /> In Progress</>
              )}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-2">Mission Objective</h4>
              <p className="text-gray-300 mb-4">{mission.description}</p>
              
              <h4 className="text-white font-semibold mb-2">AI Features</h4>
              <ul className="text-gray-300 space-y-1">
                {mission.aiFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Zap size={14} className="text-yellow-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-2">Skills You'll Learn</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {mission.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
              
              <h4 className="text-white font-semibold mb-2">Scoring</h4>
              <div className="text-gray-300 text-sm space-y-1">
                <div>Base Score: {mission.baseScore} XP</div>
                <div>Bonus: Code Quality (+50 XP)</div>
                <div>Bonus: Fast Completion (+25 XP)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiOpsArena;
