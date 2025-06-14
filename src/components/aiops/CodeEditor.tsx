
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AiOpsMission } from "@/data/aiOpsMissions";
import { Zap, Copy, CheckCircle, Wrench, AlertTriangle } from "lucide-react";

interface CodeEditorProps {
  mission: AiOpsMission;
  onCodeGenerated: (code: Record<string, string>) => void;
}

const CodeEditor = ({ mission, onCodeGenerated }: CodeEditorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<Record<string, string> | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [lastValidationErrors, setLastValidationErrors] = useState<string[]>([]);

  const generateSecureDockerfile = (appType: string) => {
    return `# Multi-stage build for security and efficiency
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs . .

# Security: Use non-root user
USER nextjs

EXPOSE 3000
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "start"]`;
  };

  const generateSecureKubernetes = (appName: string) => {
    return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${appName}-deployment
  labels:
    app: ${appName}
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ${appName}
  template:
    metadata:
      labels:
        app: ${appName}
    spec:
      containers:
      - name: ${appName}
        image: ${appName}:v1.0.0
        ports:
        - containerPort: 3000
        # Security: Resource limits
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        # Health checks for reliability
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 20
        # Security context
        securityContext:
          runAsNonRoot: true
          runAsUser: 1001
          allowPrivilegeEscalation: false
---
apiVersion: v1
kind: Service
metadata:
  name: ${appName}-service
spec:
  selector:
    app: ${appName}
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP`;
  };

  const generateSecureTerraform = () => {
    return `terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

# Security group with restricted access
resource "aws_security_group" "app_sg" {
  name        = "\${var.environment}-app-sg"
  description = "Security group for application"

  # Only allow HTTP/HTTPS from ALB
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"]  # Internal only
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "\${var.environment}-app-sg"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}`;
  };

  const generateSecureGithubActions = () => {
    return `name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint

  security-scan:
    runs-on: ubuntu-latest
    needs: test
    steps:
    - uses: actions/checkout@v4
    
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'fs'
        scan-ref: '.'
    
    - name: Run SAST scan
      uses: github/codeql-action/init@v2
      with:
        languages: javascript

  build-and-deploy:
    runs-on: ubuntu-latest
    needs: [test, security-scan]
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v4
    
    - name: Build Docker image
      run: |
        docker build -t app:latest .
        docker save app:latest > app.tar
    
    - name: Cache Docker image
      uses: actions/cache@v3
      with:
        path: app.tar
        key: docker-\${{ github.sha }}
    
    - name: Deploy to staging
      run: echo "Deploying to staging environment"
      env:
        DEPLOY_TOKEN: \${{ secrets.DEPLOY_TOKEN }}`;
  };

  const handleGenerateCode = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const code: Record<string, string> = {};
      
      // Generate basic code first (with potential issues for demo)
      if (mission.codeTemplates.dockerfile) {
        code.dockerfile = mission.codeTemplates.dockerfile;
      }
      if (mission.codeTemplates.kubernetes) {
        code.kubernetes = mission.codeTemplates.kubernetes;
      }
      if (mission.codeTemplates.terraform) {
        code.terraform = mission.codeTemplates.terraform;
      }
      if (mission.codeTemplates.githubActions) {
        code.githubActions = mission.codeTemplates.githubActions;
      }
      
      setGeneratedCode(code);
      onCodeGenerated(code);
      setIsGenerating(false);
    }, 1500);
  };

  const handleAiFixIssues = () => {
    if (!generatedCode) return;
    
    setIsFixing(true);
    
    setTimeout(() => {
      const fixedCode: Record<string, string> = {};
      
      // Apply AI-powered fixes
      if (generatedCode.dockerfile) {
        fixedCode.dockerfile = generateSecureDockerfile("webapp");
      }
      if (generatedCode.kubernetes) {
        fixedCode.kubernetes = generateSecureKubernetes("webapp");
      }
      if (generatedCode.terraform) {
        fixedCode.terraform = generateSecureTerraform();
      }
      if (generatedCode.githubActions) {
        fixedCode.githubActions = generateSecureGithubActions();
      }
      
      setGeneratedCode(fixedCode);
      onCodeGenerated(fixedCode);
      setIsFixing(false);
      setLastValidationErrors([]);
    }, 2000);
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

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          onClick={handleGenerateCode}
          disabled={isGenerating || isFixing}
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

        {generatedCode && (
          <Button
            onClick={handleAiFixIssues}
            disabled={isFixing || isGenerating}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            {isFixing ? (
              <>
                <Wrench className="mr-2 animate-spin" size={16} />
                AI Fixing Issues...
              </>
            ) : (
              <>
                <Wrench className="mr-2" size={16} />
                🤖 AI Auto-Fix Security Issues
              </>
            )}
          </Button>
        )}
      </div>

      {/* AI Fix Explanation */}
      {generatedCode && (
        <div className="bg-blue-900/20 border border-blue-600 rounded-md p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-blue-400" />
            <span className="text-blue-400 font-medium">AI DevOps Assistant</span>
          </div>
          <div className="text-blue-300 text-sm space-y-1">
            <div>• Click "AI Auto-Fix" to resolve security vulnerabilities</div>
            <div>• AI will add non-root users, health checks, and resource limits</div>
            <div>• Implements DevOps best practices automatically</div>
          </div>
        </div>
      )}

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
