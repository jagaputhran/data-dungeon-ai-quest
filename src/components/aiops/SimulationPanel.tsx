
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AiOpsMission } from "@/data/aiOpsMissions";
import { Play, AlertTriangle, CheckCircle, Terminal, Zap } from "lucide-react";

interface SimulationPanelProps {
  mission: AiOpsMission;
  generatedCode: any;
  isSimulating: boolean;
  simulationResult: any;
  onSimulate: () => void;
}

const SimulationPanel = ({
  mission,
  generatedCode,
  isSimulating,
  simulationResult,
  onSimulate
}: SimulationPanelProps) => {

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="text-green-400" size={20} />
    ) : (
      <AlertTriangle className="text-red-400" size={20} />
    );
  };

  const getStatusColor = (success: boolean) => {
    return success ? "text-green-400" : "text-red-400";
  };

  return (
    <div className="space-y-4">
      {/* Mission Info */}
      <div>
        <h4 className="text-white font-semibold mb-2">Current Mission</h4>
        <div className="bg-gray-900 p-3 rounded-md border border-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{mission.icon}</span>
            <span className="text-white font-medium">{mission.name}</span>
          </div>
          <p className="text-gray-400 text-sm">{mission.description}</p>
        </div>
      </div>

      {/* Simulation Button */}
      <Button
        onClick={onSimulate}
        disabled={!generatedCode || isSimulating}
        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
      >
        {isSimulating ? (
          <>
            <Terminal className="mr-2 animate-pulse" size={16} />
            Simulating Deployment...
          </>
        ) : (
          <>
            <Play className="mr-2" size={16} />
            Run Simulation
          </>
        )}
      </Button>

      {/* Simulation Progress */}
      {isSimulating && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Deployment Progress</span>
            <span>Running...</span>
          </div>
          <Progress value={75} className="h-2" />
          <div className="text-xs text-gray-500 space-y-1">
            <div>🔧 Validating configuration...</div>
            <div>🚀 Preparing deployment...</div>
            <div>📊 Running health checks...</div>
          </div>
        </div>
      )}

      {/* Simulation Results */}
      {simulationResult && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <Terminal size={16} />
              Simulation Results
            </h4>
            <Badge 
              variant={simulationResult.success ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              {getStatusIcon(simulationResult.success)}
              {simulationResult.success ? "Success" : "Failed"}
            </Badge>
          </div>

          {/* Logs */}
          <div className="bg-gray-900 p-3 rounded-md border border-gray-600">
            <div className="text-xs font-mono space-y-1">
              {simulationResult.logs.map((log: string, index: number) => (
                <div 
                  key={index}
                  className={`${
                    log.includes('✅') ? 'text-green-400' : 
                    log.includes('❌') ? 'text-red-400' : 
                    log.includes('💡') ? 'text-yellow-400' : 
                    'text-gray-300'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md border border-gray-600">
            <span className="text-white font-medium">Mission Score</span>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-yellow-400" />
              <span className={`font-bold ${getStatusColor(simulationResult.success)}`}>
                +{simulationResult.score} XP
              </span>
            </div>
          </div>

          {/* Next Steps */}
          {simulationResult.success && (
            <div className="p-3 bg-green-900/20 border border-green-600 rounded-md">
              <div className="text-green-400 font-medium mb-1">🎉 Mission Accomplished!</div>
              <div className="text-green-300 text-sm">
                You've successfully completed {mission.name}. Ready for the next challenge?
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SimulationPanel;
