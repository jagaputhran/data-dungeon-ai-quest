import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BookOpen, Code, Cpu, Database, Workflow, GitBranch, Monitor, Zap, Star, Trophy, Award } from "lucide-react";

const LearningResources = () => {
  const realWorldTools = [
    {
      category: "AI-Powered ETL & Pipelines",
      icon: <Workflow className="text-blue-400" />,
      gradient: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      tools: [
        { name: "Apache Airflow + LLMs", url: "https://airflow.apache.org/", description: "AI orchestrates complex data workflows with self-healing capabilities", badge: "Popular" },
        { name: "dbt + GPT Code Generation", url: "https://www.getdbt.com/", description: "Auto-generate SQL transformations using natural language", badge: "Trending" },
        { name: "Fivetran AI Connectors", url: "https://fivetran.com/", description: "Intelligent data connectors that adapt to schema changes", badge: "Enterprise" },
        { name: "Prefect AI Agents", url: "https://www.prefect.io/", description: "AI agents monitor and auto-fix pipeline failures", badge: "New" }
      ]
    },
    {
      category: "LLM-Powered Data Tools",
      icon: <Cpu className="text-purple-400" />,
      gradient: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      tools: [
        { name: "LangChain for DataOps", url: "https://docs.langchain.com/", description: "Chain LLMs for complex data workflows and transformations", badge: "Hot" },
        { name: "Pandas AI", url: "https://pandas-ai.readthedocs.io/", description: "Natural language data analysis and manipulation", badge: "Popular" },
        { name: "ChatGPT Code Interpreter", url: "https://openai.com/api/", description: "AI writes and executes data processing code on demand", badge: "Featured" },
        { name: "GitHub Copilot for Data", url: "https://github.com/features/copilot", description: "AI pair programming for data engineering tasks", badge: "Essential" }
      ]
    },
    {
      category: "AI Data Quality & Governance",
      icon: <Monitor className="text-green-400" />,
      gradient: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
      tools: [
        { name: "Great Expectations AI", url: "https://greatexpectations.io/", description: "AI-generated data quality tests and expectations", badge: "Reliable" },
        { name: "Monte Carlo AI Observability", url: "https://www.montecarlodata.com/", description: "ML-powered data incident detection and root cause analysis", badge: "Advanced" },
        { name: "Datadog AI Monitoring", url: "https://www.datadoghq.com/", description: "Intelligent monitoring with anomaly detection for data pipelines", badge: "Industry Standard" },
        { name: "Collibra AI Governance", url: "https://www.collibra.com/", description: "AI automates data cataloging and compliance workflows", badge: "Enterprise" }
      ]
    },
    {
      category: "Schema & Metadata Automation",
      icon: <Database className="text-cyan-400" />,
      gradient: "from-cyan-500/20 to-blue-500/20",
      borderColor: "border-cyan-500/30",
      tools: [
        { name: "Apache Atlas + ML", url: "https://atlas.apache.org/", description: "AI-powered metadata discovery and lineage tracking", badge: "Open Source" },
        { name: "DataHub AI Cataloging", url: "https://datahubproject.io/", description: "Intelligent data discovery and automated documentation", badge: "Community Favorite" },
        { name: "Amundsen AI Search", url: "https://www.amundsen.io/", description: "ML-enhanced data discovery and recommendation engine", badge: "Innovative" },
        { name: "Alation AI Assistant", url: "https://www.alation.com/", description: "AI chatbot for data catalog queries and insights", badge: "Smart" }
      ]
    }
  ];

  const etlExamples = [
    {
      title: "AI-Powered ETL Pipeline Orchestration",
      language: "Python + Airflow",
      icon: "🚀",
      complexity: "Advanced",
      code: `from airflow import DAG
from airflow.operators.python import PythonOperator
import openai

def ai_generate_sql_transform(**context):
    """AI generates SQL based on business requirements"""
    requirements = context['params']['business_logic']
    
    prompt = f"""
    Generate SQL transformation for: {requirements}
    
    Source tables: users, orders, products
    Target: customer_analytics table
    
    Include: data validation, error handling, and performance optimization
    """
    
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    
    sql_code = response.choices[0].message.content
    return sql_code

def ai_data_quality_check(**context):
    """AI performs intelligent data quality validation"""
    import pandas as pd
    
    df = pd.read_sql(context['params']['table'], connection)
    
    # AI analyzes data patterns and generates quality rules
    quality_prompt = f"""
    Analyze this dataset and generate data quality rules:
    {df.describe().to_string()}
    
    Schema: {df.dtypes.to_string()}
    Sample data: {df.head().to_string()}
    """
    
    # AI generates validation logic
    validation_rules = llm_generate_rules(quality_prompt)
    return execute_quality_checks(df, validation_rules)

dag = DAG(
    'ai_etl_pipeline',
    schedule_interval='@daily',
    catchup=False
)

# AI-driven pipeline tasks
extract_task = PythonOperator(
    task_id='ai_extract',
    python_callable=ai_smart_extraction,
    dag=dag
)

transform_task = PythonOperator(
    task_id='ai_transform', 
    python_callable=ai_generate_sql_transform,
    params={'business_logic': 'Calculate customer lifetime value'},
    dag=dag
)

quality_task = PythonOperator(
    task_id='ai_quality_check',
    python_callable=ai_data_quality_check,
    dag=dag
)

extract_task >> transform_task >> quality_task`
    },
    {
      title: "LLM-Powered Schema Evolution",
      language: "Python + dbt",
      icon: "🧠",
      complexity: "Intermediate",
      code: `import openai
import yaml

def ai_schema_evolution(source_schema, target_requirements):
    """AI automatically evolves database schemas"""
    
    prompt = f"""
    Current schema: {source_schema}
    New requirements: {target_requirements}
    
    Generate:
    1. Migration SQL scripts
    2. dbt models for new transformations  
    3. Data quality tests
    4. Documentation updates
    
    Ensure backward compatibility and zero-downtime deployment.
    """
    
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a senior data engineer."},
            {"role": "user", "content": prompt}
        ]
    )
    
    return parse_ai_response(response.choices[0].message.content)

def generate_dbt_models_with_ai(business_logic):
    """AI writes dbt transformation models"""
    
    dbt_template = """
    {{{{ config(materialized='incremental') }}}}
    
    -- AI-generated model based on: {business_logic}
    
    SELECT 
        -- AI determines optimal column selection
        {ai_generated_columns}
    FROM {{{{ ref('source_table') }}}}
    WHERE {{{{ ai_generated_conditions }}}}
    
    {%% if is_incremental() %%}
        -- AI adds intelligent incremental logic
        AND updated_at > (SELECT MAX(updated_at) FROM {{{{ this }}}})
    {%% endif %%}
    """
    
    # AI fills in the template based on requirements
    return ai_complete_dbt_model(dbt_template, business_logic)

# Example usage
new_requirements = """
Add customer segmentation based on:
- Purchase frequency
- Order value trends  
- Product category preferences
- Seasonal behavior patterns
"""

schema_changes = ai_schema_evolution(current_schema, new_requirements)
dbt_models = generate_dbt_models_with_ai(new_requirements)`
    },
    {
      title: "Real-time Data Pipeline with AI Monitoring",
      language: "Python + Kafka + ML",
      icon: "⚡",
      complexity: "Expert",
      code: `from kafka import KafkaConsumer, KafkaProducer
import json
from sklearn.ensemble import IsolationForest
import pandas as pd

class AIDataPipelineMonitor:
    def __init__(self):
        self.anomaly_detector = IsolationForest(contamination=0.1)
        self.consumer = KafkaConsumer('raw_data', value_deserializer=json.loads)
        self.producer = KafkaProducer(value_serializer=json.dumps)
        
    def ai_stream_processor(self):
        """AI processes streaming data in real-time"""
        
        for message in self.consumer:
            data = message.value
            
            # AI-powered data cleaning
            cleaned_data = self.ai_clean_streaming_data(data)
            
            # ML anomaly detection
            is_anomaly = self.detect_anomalies(cleaned_data)
            
            if is_anomaly:
                # AI determines corrective action
                action = self.ai_decide_action(cleaned_data)
                self.execute_ai_action(action)
            else:
                # Send to downstream systems
                self.producer.send('processed_data', cleaned_data)
    
    def ai_clean_streaming_data(self, raw_data):
        """AI cleans data on-the-fly using learned patterns"""
        
        # AI applies learned cleaning rules
        cleaning_prompt = f"""
        Clean this streaming data point: {raw_data}
        
        Apply these learned patterns:
        - Fix common format issues
        - Handle missing values intelligently  
        - Standardize categorical values
        - Validate business rules
        """
        
        # In production, this would use a fine-tuned model
        cleaned = apply_ai_cleaning_rules(raw_data, cleaning_prompt)
        return cleaned
    
    def ai_decide_action(self, anomalous_data):
        """AI decides how to handle data anomalies"""
        
        decision_prompt = f"""
        Anomaly detected: {anomalous_data}
        
        Historical context: {self.get_historical_context()}
        
        Decide action:
        1. Auto-fix if pattern is known
        2. Alert human if critical
        3. Quarantine if suspicious
        4. Apply business rules override
        """
        
        return llm_make_decision(decision_prompt)

# MLOps for Data Pipelines
class MLDataPipelineOps:
    def auto_tune_pipeline(self):
        """AI continuously optimizes pipeline performance"""
        
        metrics = self.collect_pipeline_metrics()
        
        optimization_prompt = f"""
        Pipeline metrics: {metrics}
        
        Optimize for:
        - Throughput: {metrics['throughput']}
        - Latency: {metrics['latency']} 
        - Error rate: {metrics['error_rate']}
        - Resource usage: {metrics['resources']}
        
        Suggest configuration changes and code optimizations.
        """
        
        optimizations = llm_optimize_pipeline(optimization_prompt)
        self.apply_optimizations(optimizations)

# Start the AI-powered pipeline
monitor = AIDataPipelineMonitor()
monitor.ai_stream_processor()`
    }
  ];

  const etlConcepts = [
    {
      title: "Traditional ETL vs AI-Powered ETL",
      items: [
        "❌ Manual schema mapping → ✅ AI auto-generates mappings from business logic",
        "❌ Static data quality rules → ✅ ML learns quality patterns dynamically", 
        "❌ Fixed transformation logic → ✅ AI adapts transformations to data changes",
        "❌ Manual error handling → ✅ AI predicts and prevents pipeline failures",
        "❌ Scheduled batch processing → ✅ AI optimizes processing timing and resources"
      ]
    },
    {
      title: "AI-Enhanced Data Engineering Workflow",
      items: [
        "🤖 **Discovery**: AI scans and catalogs data sources automatically",
        "🧠 **Ingestion**: LLMs generate connectors for new data formats",
        "⚡ **Processing**: AI optimizes SQL queries and transformations",
        "🔍 **Quality**: ML detects anomalies and data drift in real-time",
        "📊 **Delivery**: AI routes data to optimal storage/compute systems",
        "🚨 **Monitoring**: Intelligent alerting with root cause analysis"
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section with Enhanced Graphics */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-green-900/40 via-blue-900/40 to-purple-900/40 border-2 border-green-500/50 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2310B981" fill-opacity="0.1"%3E%3Cpath d="M50 50L0 0h100v100z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <CardHeader className="relative">
          <CardTitle className="text-white flex items-center gap-3 text-3xl">
            <div className="p-3 bg-green-500/20 rounded-xl backdrop-blur-sm">
              <BookOpen className="text-green-400" size={36} />
            </div>
            AI is Revolutionizing the Entire Data Engineering Stack
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          <p className="text-gray-200 leading-relaxed text-lg">
            This game demonstrates how AI is transforming every aspect of data engineering - from ETL pipelines to real-time processing. Modern data teams use LLMs to generate code, ML to monitor quality, and AI agents to orchestrate complex workflows that traditionally required extensive manual coding and maintenance.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 p-6 rounded-xl border-2 border-red-500/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <h4 className="text-red-400 font-bold text-lg">Legacy Approach</h4>
                </div>
                <p className="text-gray-300">Manual ETL coding, static schemas, reactive monitoring, siloed tools</p>
              </div>
            </div>
            <div className="group transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 p-6 rounded-xl border-2 border-blue-500/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <h4 className="text-blue-400 font-bold text-lg">AI-Native Approach</h4>
                </div>
                <p className="text-gray-300">Code generation, adaptive schemas, predictive monitoring, unified AI platform</p>
              </div>
            </div>
            <div className="group transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 p-6 rounded-xl border-2 border-green-500/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h4 className="text-green-400 font-bold text-lg">Future Vision</h4>
                </div>
                <p className="text-gray-300">Autonomous data operations, self-optimizing pipelines, natural language interfaces</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced ETL Concepts */}
      {etlConcepts.map((concept, index) => (
        <Card key={index} className="relative overflow-hidden bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-2 border-purple-500/50 shadow-xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%238B5CF6" fill-opacity="0.08"%3E%3Cpath d="M30 30L0 0h60v60z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
          <CardHeader className="relative">
            <CardTitle className="text-white flex items-center gap-3 text-2xl">
              <div className="p-2 bg-purple-500/20 rounded-lg backdrop-blur-sm">
                <GitBranch className="text-purple-400" size={28} />
              </div>
              {concept.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-3">
              {concept.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start gap-3 p-3 bg-black/20 rounded-lg border border-purple-500/20 backdrop-blur-sm hover:bg-black/30 transition-all duration-300">
                  <span className="text-lg leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Enhanced Real-world Tools */}
      {realWorldTools.map((category, categoryIndex) => (
        <Card key={categoryIndex} className={`relative overflow-hidden bg-gradient-to-br ${category.gradient} border-2 ${category.borderColor} shadow-xl`}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23FFFFFF" fill-opacity="0.05"%3E%3Cpolygon points="20 0 40 20 20 40 0 20"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
          <CardHeader className="relative">
            <CardTitle className="text-white flex items-center gap-3 text-2xl">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                {category.icon}
              </div>
              {category.category}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid gap-4">
              {category.tools.map((tool, toolIndex) => (
                <div key={toolIndex} className="group flex items-center justify-between p-4 bg-black/30 rounded-xl border border-gray-700/50 backdrop-blur-sm hover:bg-black/40 transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-cyan-400 font-bold text-lg">{tool.name}</h4>
                      <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
                        {tool.badge}
                      </Badge>
                    </div>
                    <p className="text-gray-300">{tool.description}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild className="border-gray-600 text-white hover:bg-gray-800 ml-4 group-hover:scale-110 transition-transform duration-200">
                    <a href={tool.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={16} className="mr-1" />
                      Explore
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Enhanced Code Examples */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-black/50 border-2 border-gray-600/50 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23F97316" fill-opacity="0.1"%3E%3Crect width="2" height="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <CardHeader className="relative">
          <CardTitle className="text-white flex items-center gap-3 text-2xl">
            <div className="p-2 bg-orange-500/20 rounded-lg backdrop-blur-sm">
              <Code className="text-orange-400" size={32} />
            </div>
            Production ETL Pipeline Examples with AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 relative">
          {etlExamples.map((example, index) => (
            <div key={index} className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl">{example.icon}</div>
                <div>
                  <h4 className="text-orange-400 font-bold text-xl">{example.title}</h4>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="outline" className="text-gray-300 border-gray-600 bg-black/30">
                      {example.language}
                    </Badge>
                    <Badge className={`${
                      example.complexity === 'Expert' ? 'bg-red-600' :
                      example.complexity === 'Advanced' ? 'bg-orange-600' : 'bg-blue-600'
                    }`}>
                      {example.complexity}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="relative">
                <pre className="bg-black/80 p-6 rounded-xl text-green-400 font-mono text-sm overflow-x-auto border-2 border-gray-700/50 backdrop-blur-sm group-hover:border-orange-500/30 transition-all duration-300">
                  {example.code}
                </pre>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-orange-600 to-red-600">
                    <Star size={14} className="mr-1" />
                    Example
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Enhanced Career Guide */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-pink-900/40 border-2 border-blue-500/50 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%234F46E5" fill-opacity="0.1"%3E%3Cpath d="M0 0h80v80H0z" transform="rotate(45 40 40)"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <CardHeader className="relative">
          <CardTitle className="text-white flex items-center gap-3 text-3xl">
            <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl backdrop-blur-sm">
              <Trophy size={36} className="text-yellow-400" />
            </div>
            Master Modern Data Engineering with AI
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Award className="text-blue-400" size={24} />
                <h4 className="text-blue-400 font-bold text-xl">Foundation Skills</h4>
              </div>
              <div className="space-y-3">
                {[
                  "Learn Python, SQL, and cloud platforms (AWS/GCP/Azure)",
                  "Master Apache Airflow for workflow orchestration", 
                  "Understand dbt for data transformations",
                  "Practice with real datasets and ETL scenarios",
                  "Study data modeling and warehouse design"
                ].map((skill, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-blue-900/20 rounded-lg border border-blue-500/20">
                    <Zap size={16} className="text-blue-400" />
                    <span className="text-gray-300">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Star className="text-purple-400" size={24} />
                <h4 className="text-purple-400 font-bold text-xl">AI-Enhanced Skills</h4>
              </div>
              <div className="space-y-3">
                {[
                  "Integrate LLMs into data workflows (LangChain, GPT APIs)",
                  "Build ML-powered data quality monitoring",
                  "Create AI agents for pipeline automation", 
                  "Implement vector databases for semantic search",
                  "Design self-healing data architectures"
                ].map((skill, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
                    <Zap size={16} className="text-purple-400" />
                    <span className="text-gray-300">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-xl border-2 border-cyan-500/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Trophy className="text-cyan-400" size={24} />
              </div>
              <h4 className="text-cyan-400 font-bold text-xl">🎯 Career Path: AI Data Engineer</h4>
            </div>
            <p className="text-gray-300 leading-relaxed">
              The future belongs to data engineers who can leverage AI to build intelligent, self-managing data systems. 
              Start with traditional ETL, then progressively add AI capabilities to automate and optimize every aspect of your pipelines.
            </p>
            <div className="flex gap-4 mt-4">
              <Badge className="bg-gradient-to-r from-green-600 to-emerald-600">
                High Demand
              </Badge>
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">
                Future-Proof
              </Badge>
              <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600">
                High Impact
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningResources;
