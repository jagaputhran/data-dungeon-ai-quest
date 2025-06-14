
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AiOpsMission } from "@/data/aiOpsMissions";
import { Zap, Copy, CheckCircle } from "lucide-react";

interface CodeEditorProps {
  mission: AiOpsMission;
  onCodeGenerated: (code: Record<string, string>) => void;
}

const CodeEditor = ({ mission, onCodeGenerated }: CodeEditorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<Record<string, string> | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerateCode = () => {
    setIsGenerating(true);
    
    // Simulate AI code generation
    setTimeout(() => {
      const code = { ...mission.codeTemplates };
      setGeneratedCode(code);
      onCodeGenerated(code);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopyCode = (codeType: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedField(codeType);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getLanguage = (codeType: string) => {
    const languageMap: { [key: string]: string } = {
      dockerfile: 'Dockerfile',
      githubActions: 'GitHub Actions YAML',
      terraform: 'Terraform HCL',
      kubernetes: 'Kubernetes YAML',
      canary: 'Argo Rollouts YAML',
      security: 'Security Pipeline YAML',
      prometheus: 'Prometheus Config',
      grafana: 'Grafana Dashboard JSON',
      gitops: 'ArgoCD Application YAML'
    };
    return languageMap[codeType] || 'Code';
  };

  return (
    <div className="space-y-4">
      {/* AI Features */}
      <div>
        <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
          <Zap size={16} className="text-yellow-400" />
          AI-Powered Features
        </h4>
        <div className="flex flex-wrap gap-2">
          {mission.aiFeatures.map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerateCode}
        disabled={isGenerating}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        {isGenerating ? (
          <>
            <Zap className="mr-2 animate-spin" size={16} />
            AI Generating Code...
          </>
        ) : (
          <>
            <Zap className="mr-2" size={16} />
            Generate AI Code
          </>
        )}
      </Button>

      {/* Generated Code Display */}
      {generatedCode && (
        <div className="space-y-4">
          <h4 className="text-white font-semibold">Generated Configuration Files</h4>
          
          <Tabs defaultValue={Object.keys(generatedCode)[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
              {Object.keys(generatedCode).map((codeType) => (
                <TabsTrigger 
                  key={codeType} 
                  value={codeType}
                  className="text-xs"
                >
                  {getLanguage(codeType)}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.entries(generatedCode).map(([codeType, code]) => (
              <TabsContent key={codeType} value={codeType} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-xs">
                    {getLanguage(codeType)}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopyCode(codeType, code)}
                    className="text-xs"
                  >
                    {copiedField === codeType ? (
                      <>
                        <CheckCircle size={14} className="mr-1 text-green-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} className="mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="bg-gray-900 p-3 rounded-md border border-gray-600">
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono overflow-x-auto">
                    {code}
                  </pre>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
