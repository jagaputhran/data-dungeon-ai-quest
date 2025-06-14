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
import { Container, Settings, Zap, AlertTriangle, Check } from "lucide-react";

interface AiOpsArenaProps {
  onScoreUpdate: (points: number) => void;
}

const AiOpsArena = ({ onScoreUpdate }: AiOpsArenaProps) => {
  const [currentMission, setCurrentMission] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [generatedCode, setGeneratedCode] = useState<Record<string, string> | null>(null);

  const mission = aiOpsMissions[currentMission];
  const progressPercentage = (completedMissions.length / aiOpsMissions.length) * 100;

  const handleMissionSelect = (missionIndex: number) => {
    setCurrentMission(missionIndex);
    setSimulationResult(null);
    setGeneratedCode(null);
  };

  const handleCodeGeneration = (code: Record<string, string>) => {
    setGeneratedCode(code);
  };

  // Realistic validation functions
  const validateDockerfile = (dockerfile: string): { valid: boolean; issues: string[] } => {
    const issues: string[] = [];
    
    if (!dockerfile.includes('FROM')) {
      issues.push('Missing base image declaration');
    }
    if (!dockerfile.includes('WORKDIR')) {
      issues.push('No working directory set - potential security risk');
    }
    if (dockerfile.includes('RUN npm install') && !dockerfile.includes('package*.json')) {
      issues.push('Installing dependencies without copying package files first');
    }
    if (!dockerfile.includes('USER') && !dockerfile.includes('--chown')) {
      issues.push('Running as root user - security vulnerability');
    }
    
    return { valid: issues.length === 0, issues };
  };

  const validateKubernetes = (yaml: string): { valid: boolean; issues: string[] } => {
    const issues: string[] = [];
    
    if (!yaml.includes('apiVersion')) {
      issues.push('Missing apiVersion specification');
    }
    if (!yaml.includes('metadata:') || !yaml.includes('name:')) {
      issues.push('Missing metadata or name field');
    }
    if (yaml.includes('resources:') && !yaml.includes('limits:')) {
      issues.push('Resource requests without limits - potential resource exhaustion');
    }
    if (!yaml.includes('readinessProbe') && !yaml.includes('livenessProbe')) {
      issues.push('Missing health checks - deployment reliability risk');
    }
    if (yaml.includes('image:') && yaml.includes(':latest')) {
      issues.push('Using :latest tag - not recommended for production');
    }
    
    return { valid: issues.length === 0, issues };
  };

  const validateTerraform = (tf: string): { valid: boolean; issues: string[] } => {
    const issues: string[] = [];
    
    if (!tf.includes('provider')) {
      issues.push('No provider configuration found');
    }
    if (!tf.includes('tags')) {
      issues.push('Resources missing tags - violates compliance standards');
    }
    if (tf.includes('0.0.0.0/0') && tf.includes('ingress')) {
      issues.push('Security group allows all inbound traffic - security risk');
    }
    
    return { valid: issues.length === 0, issues };
  };

  const validateCIPipeline = (yaml: string): { valid: boolean; issues: string[] } => {
    const issues: string[] = [];
    
    if (!yaml.includes('test') && !yaml.includes('Test')) {
      issues.push('No testing stage found in pipeline');
    }
    if (!yaml.includes('security') && !yaml.includes('scan')) {
      issues.push('Missing security scanning step');
    }
    if (!yaml.includes('artifact') && !yaml.includes('cache')) {
      issues.push('No artifact caching - slow build times');
    }
    if (yaml.includes('password') || yaml.includes('token')) {
      issues.push('Secrets hardcoded in pipeline - use secret management');
    }
    
    return { valid: issues.length === 0, issues };
  };

  const handleSimulation = async () => {
    if (!generatedCode) return;
    
    setIsSimulating(true);
    
    // Simulate realistic DevOps validation and deployment
    setTimeout(() => {
      const validationResults: any = {};
      const allLogs: string[] = [];
      let overallScore = mission.baseScore;
      let hasErrors = false;

      // Step 1: Code Validation
      allLogs.push('🔍 Starting DevOps validation pipeline...');
      allLogs.push('');

      if (generatedCode.dockerfile) {
        const dockerValidation = validateDockerfile(generatedCode.dockerfile);
        validationResults.docker = dockerValidation;
        
        if (dockerValidation.valid) {
          allLogs.push('✅ Dockerfile validation passed');
        } else {
          allLogs.push('❌ Dockerfile validation failed:');
          dockerValidation.issues.forEach(issue => {
            allLogs.push(`   • ${issue}`);
          });
          hasErrors = true;
          overallScore -= 20;
        }
      }

      if (generatedCode.kubernetes) {
        const k8sValidation = validateKubernetes(generatedCode.kubernetes);
        validationResults.kubernetes = k8sValidation;
        
        if (k8sValidation.valid) {
          allLogs.push('✅ Kubernetes manifests validated');
        } else {
          allLogs.push('❌ Kubernetes validation failed:');
          k8sValidation.issues.forEach(issue => {
            allLogs.push(`   • ${issue}`);
          });
          hasErrors = true;
          overallScore -= 30;
        }
      }

      if (generatedCode.terraform) {
        const tfValidation = validateTerraform(generatedCode.terraform);
        validationResults.terraform = tfValidation;
        
        if (tfValidation.valid) {
          allLogs.push('✅ Terraform configuration validated');
        } else {
          allLogs.push('❌ Terraform validation failed:');
          tfValidation.issues.forEach(issue => {
            allLogs.push(`   • ${issue}`);
          });
          hasErrors = true;
          overallScore -= 25;
        }
      }

      if (generatedCode.githubActions) {
        const ciValidation = validateCIPipeline(generatedCode.githubActions);
        validationResults.ci = ciValidation;
        
        if (ciValidation.valid) {
          allLogs.push('✅ CI/CD pipeline validated');
        } else {
          allLogs.push('❌ CI/CD validation failed:');
          ciValidation.issues.forEach(issue => {
            allLogs.push(`   • ${issue}`);
          });
          hasErrors = true;
          overallScore -= 15;
        }
      }

      // Step 2: Deployment Simulation
      allLogs.push('');
      allLogs.push('🚀 Simulating deployment process...');
      
      if (!hasErrors) {
        allLogs.push('📦 Building container image...');
        allLogs.push('🔧 Applying infrastructure changes...');
        allLogs.push('☸️ Deploying to Kubernetes cluster...');
        allLogs.push('🔍 Running health checks...');
        allLogs.push('📊 Monitoring deployment status...');
        allLogs.push('');
        allLogs.push('✅ Deployment completed successfully!');
        allLogs.push('🎉 All services are running and healthy');
        
        // Bonus points for clean deployment
        overallScore += 25;
      } else {
        allLogs.push('⚠️ Deployment would fail with current configuration');
        allLogs.push('💡 Fix validation issues and try again');
        overallScore = Math.max(overallScore, 10); // Minimum score for effort
      }

      const result = {
        success: !hasErrors,
        logs: allLogs,
        score: Math.max(overallScore, 0),
        validationResults,
        deploymentTime: !hasErrors ? `${Math.floor(Math.random() * 120) + 60}s` : null
      };
      
      setSimulationResult(result);
      setIsSimulating(false);
      
      if (result.success && !completedMissions.includes(currentMission)) {
        setCompletedMissions([...completedMissions, currentMission]);
        onScoreUpdate(result.score);
      }
    }, 3000); // Longer simulation time for realism
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
              <Container size={20} />
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
              DevOps Simulator
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
                <div>Bonus: Clean Deployment (+25 XP)</div>
                <div>Penalty: Validation Errors (-15 to -30 XP)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiOpsArena;
