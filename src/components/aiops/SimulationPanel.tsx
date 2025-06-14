
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AiOpsMission } from "@/data/aiOpsMissions";
import { Play, AlertTriangle, CheckCircle, Terminal, Zap, Clock } from "lucide-react";

interface SimulationPanelProps {
  mission: AiOpsMission;
  generatedCode: Record<string, string> | null;
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

  // Realistic DevOps validation functions
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
    if (dockerfile.split('\n').length > 20) {
      issues.push('Dockerfile is too complex - consider multi-stage build');
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
    if (!tf.includes('variable') && tf.includes('hardcoded')) {
      issues.push('Hardcoded values detected - use variables instead');
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

  const runRealisticSimulation = (): Promise<any> => {
    return new Promise((resolve) => {
      if (!generatedCode) {
        resolve({
          success: false,
          logs: ['❌ No code to validate'],
          score: 0,
          validationResults: {}
        });
        return;
      }

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

      resolve({
        success: !hasErrors,
        logs: allLogs,
        score: Math.max(overallScore, 0),
        validationResults,
        deploymentTime: hasErrors ? null : `${Math.floor(Math.random() * 120) + 60}s`
      });
    });
  };

  const handleRealisticSimulation = async () => {
    const result = await runRealisticSimulation();
    // This would be called by the parent component's onSimulate
    // For now, we'll just log it
    console.log('Simulation result:', result);
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

      {/* Code Status */}
      {generatedCode && (
        <div className="bg-gray-900 p-3 rounded-md border border-gray-600">
          <h5 className="text-white font-medium mb-2">Generated Files</h5>
          <div className="flex flex-wrap gap-2">
            {Object.keys(generatedCode).map((fileType) => (
              <Badge key={fileType} variant="secondary" className="text-xs">
                {fileType}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Simulation Button */}
      <Button
        onClick={onSimulate}
        disabled={!generatedCode || isSimulating}
        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
      >
        {isSimulating ? (
          <>
            <Terminal className="mr-2 animate-pulse" size={16} />
            Running DevOps Simulation...
          </>
        ) : (
          <>
            <Play className="mr-2" size={16} />
            Run DevOps Simulation
          </>
        )}
      </Button>

      {/* Simulation Progress */}
      {isSimulating && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Validation & Deployment</span>
            <span>Processing...</span>
          </div>
          <Progress value={75} className="h-2" />
          <div className="text-xs text-gray-500 space-y-1">
            <div>🔍 Validating configuration files...</div>
            <div>🔧 Checking security standards...</div>
            <div>🚀 Simulating deployment process...</div>
            <div>📊 Running compliance checks...</div>
          </div>
        </div>
      )}

      {/* Simulation Results */}
      {simulationResult && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <Terminal size={16} />
              DevOps Simulation Results
            </h4>
            <div className="flex items-center gap-2">
              <Badge 
                variant={simulationResult.success ? "default" : "destructive"}
                className="flex items-center gap-1"
              >
                {getStatusIcon(simulationResult.success)}
                {simulationResult.success ? "Deployed" : "Failed"}
              </Badge>
              {simulationResult.deploymentTime && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock size={12} />
                  {simulationResult.deploymentTime}
                </Badge>
              )}
            </div>
          </div>

          {/* Logs */}
          <div className="bg-gray-900 p-3 rounded-md border border-gray-600 max-h-64 overflow-y-auto">
            <div className="text-xs font-mono space-y-1">
              {simulationResult.logs.map((log: string, index: number) => (
                <div 
                  key={index}
                  className={`${
                    log.includes('✅') ? 'text-green-400' : 
                    log.includes('❌') ? 'text-red-400' : 
                    log.includes('⚠️') ? 'text-yellow-400' :
                    log.includes('💡') ? 'text-blue-400' : 
                    log.includes('🔍') || log.includes('🚀') || log.includes('📊') ? 'text-cyan-400' :
                    log.startsWith('   •') ? 'text-red-300 ml-4' :
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

          {/* Recommendations */}
          {!simulationResult.success && (
            <div className="p-3 bg-red-900/20 border border-red-600 rounded-md">
              <div className="text-red-400 font-medium mb-2">🔧 DevOps Recommendations</div>
              <div className="text-red-300 text-sm space-y-1">
                <div>• Review validation errors above</div>
                <div>• Follow DevOps best practices</div>
                <div>• Regenerate code with AI assistance</div>
                <div>• Test in staging environment first</div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {simulationResult.success && (
            <div className="p-3 bg-green-900/20 border border-green-600 rounded-md">
              <div className="text-green-400 font-medium mb-1">🎉 Mission Accomplished!</div>
              <div className="text-green-300 text-sm">
                Your DevOps pipeline passed all validation checks and deployed successfully! 
                Ready for the next challenge?
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SimulationPanel;
