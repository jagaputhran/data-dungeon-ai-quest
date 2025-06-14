
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

  // Advanced DevOps configurations for different mission types
  const generateCanaryDeployment = () => {
    return `apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: webapp-rollout
spec:
  replicas: 5
  strategy:
    canary:
      steps:
      - setWeight: 20
      - pause: {}
      - setWeight: 40
      - pause: {duration: 10}
      - setWeight: 60
      - pause: {duration: 10}
      - setWeight: 80
      - pause: {duration: 10}
      canaryService: webapp-canary
      stableService: webapp-stable
      trafficRouting:
        nginx:
          stableIngress: webapp-stable
          annotationPrefix: nginx.ingress.kubernetes.io
          additionalIngressAnnotations:
            canary-by-header: X-Canary
  selector:
    matchLabels:
      app: webapp
  template:
    metadata:
      labels:
        app: webapp
    spec:
      containers:
      - name: webapp
        image: webapp:v2.0.0
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
---
apiVersion: v1
kind: Service
metadata:
  name: webapp-stable
spec:
  selector:
    app: webapp
  ports:
  - port: 80
    targetPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: webapp-canary
spec:
  selector:
    app: webapp
  ports:
  - port: 80
    targetPort: 3000`;
  };

  const generateSecurityPipeline = () => {
    return `name: Security-First CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'fs'
        scan-ref: '.'
        format: 'sarif'
        output: 'trivy-results.sarif'
    
    - name: Upload Trivy scan results
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'
    
    - name: Run SAST with CodeQL
      uses: github/codeql-action/init@v2
      with:
        languages: javascript
    
    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v2
    
    - name: Run dependency check
      uses: dependency-check/Dependency-Check_Action@main
      with:
        project: 'webapp'
        path: '.'
        format: 'HTML'
    
    - name: OWASP ZAP Baseline Scan
      uses: zaproxy/action-baseline@v0.7.0
      with:
        target: 'https://staging.example.com'

  build-secure:
    needs: security-scan
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Build with security context
      run: |
        docker build --security-opt no-new-privileges:true \\
          --cap-drop ALL --cap-add NET_BIND_SERVICE \\
          -t webapp:secure .
    
    - name: Sign container image
      uses: sigstore/cosign-installer@v3
      with:
        cosign-release: 'v2.0.0'
    
    - name: Sign the published Docker image
      env:
        COSIGN_EXPERIMENTAL: 1
      run: cosign sign webapp:secure`;
  };

  const generatePrometheusConfig = () => {
    return `global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'webapp'
    static_configs:
      - targets: ['webapp:3000']
    metrics_path: '/metrics'
    scrape_interval: 10s
    
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
        
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
        
  - job_name: 'kube-state-metrics'
    static_configs:
      - targets: ['kube-state-metrics:8080']

  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']
    metrics_path: '/metrics'
    
# Custom metrics for application performance
  - job_name: 'webapp-custom-metrics'
    static_configs:
      - targets: ['webapp:3001']
    metrics_path: '/custom-metrics'
    scrape_interval: 5s`;
  };

  const generateGrafanaDashboard = () => {
    return `{
  "dashboard": {
    "id": null,
    "title": "DevOps Application Dashboard",
    "tags": ["devops", "kubernetes", "application"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "Application Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          },
          {
            "expr": "histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "50th percentile"
          }
        ],
        "yAxes": [
          {
            "label": "Response Time (seconds)",
            "min": 0
          }
        ],
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 0}
      },
      {
        "id": 2,
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "Requests per second"
          }
        ],
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 0}
      },
      {
        "id": 3,
        "title": "Error Rate",
        "type": "singlestat",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "5xx errors"
          }
        ],
        "thresholds": "0.01,0.05",
        "colorBackground": true,
        "gridPos": {"h": 4, "w": 6, "x": 0, "y": 8}
      },
      {
        "id": 4,
        "title": "Pod Restarts",
        "type": "singlestat",
        "targets": [
          {
            "expr": "sum(kube_pod_container_status_restarts_total)",
            "legendFormat": "Total Restarts"
          }
        ],
        "gridPos": {"h": 4, "w": 6, "x": 6, "y": 8}
      },
      {
        "id": 5,
        "title": "Memory Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "container_memory_usage_bytes{container!=\"POD\",container!=\"\"}/1024/1024",
            "legendFormat": "{{container}} Memory (MB)"
          }
        ],
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 8}
      }
    ],
    "time": {
      "from": "now-1h",
      "to": "now"
    },
    "refresh": "30s"
  }
}`;
  };

  const generateGitOpsConfig = () => {
    return `apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: webapp-production
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  source:
    repoURL: https://github.com/company/webapp-k8s-config
    targetRevision: HEAD
    path: production
    helm:
      valueFiles:
      - values-production.yaml
      parameters:
      - name: image.tag
        value: "v1.2.3"
      - name: replicaCount
        value: "3"
  destination:
    server: https://kubernetes.default.svc
    namespace: webapp-production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
    - CreateNamespace=true
    - PrunePropagationPolicy=foreground
    - PruneLast=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
  revisionHistoryLimit: 10
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: webapp-config
  namespace: webapp-production
data:
  environment: "production"
  debug: "false"
  database_url: "postgresql://webapp:password@postgres:5432/webapp_prod"
  redis_url: "redis://redis:6379/0"
  log_level: "info"
  metrics_enabled: "true"
---
apiVersion: v1
kind: Secret
metadata:
  name: webapp-secrets
  namespace: webapp-production
type: Opaque
stringData:
  jwt_secret: "your-super-secret-jwt-key"
  database_password: "secure-db-password"
  api_key: "external-api-key"`;
  };

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
      
      // Generate code based on mission's codeTemplates
      Object.keys(mission.codeTemplates).forEach(templateKey => {
        const template = mission.codeTemplates[templateKey];
        
        switch (templateKey) {
          case 'dockerfile':
            code.dockerfile = template; // Use basic template first
            break;
          case 'kubernetes':
            code.kubernetes = template;
            break;
          case 'terraform':
            code.terraform = template;
            break;
          case 'githubActions':
            code.githubActions = template;
            break;
          case 'canary':
            code.canary = generateCanaryDeployment();
            break;
          case 'security':
            code.security = generateSecurityPipeline();
            break;
          case 'prometheus':
            code.prometheus = generatePrometheusConfig();
            break;
          case 'grafana':
            code.grafana = generateGrafanaDashboard();
            break;
          case 'gitops':
            code.gitops = generateGitOpsConfig();
            break;
          default:
            code[templateKey] = template;
        }
      });
      
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
      
      // Apply AI-powered fixes for each code type
      Object.keys(generatedCode).forEach(codeType => {
        switch (codeType) {
          case 'dockerfile':
            fixedCode.dockerfile = generateSecureDockerfile("webapp");
            break;
          case 'kubernetes':
            fixedCode.kubernetes = generateSecureKubernetes("webapp");
            break;
          case 'terraform':
            fixedCode.terraform = generateSecureTerraform();
            break;
          case 'githubActions':
            fixedCode.githubActions = generateSecureGithubActions();
            break;
          case 'canary':
            fixedCode.canary = generateCanaryDeployment();
            break;
          case 'security':
            fixedCode.security = generateSecurityPipeline();
            break;
          case 'prometheus':
            fixedCode.prometheus = generatePrometheusConfig();
            break;
          case 'grafana':
            fixedCode.grafana = generateGrafanaDashboard();
            break;
          case 'gitops':
            fixedCode.gitops = generateGitOpsConfig();
            break;
          default:
            fixedCode[codeType] = generatedCode[codeType];
        }
      });
      
      setGeneratedCode(fixedCode);
      onCodeGenerated(fixedCode);
      setIsFixing(false);
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
