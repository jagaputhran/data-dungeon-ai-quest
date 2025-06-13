
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BookOpen, Code, Cpu, Database, Workflow, GitBranch, Monitor } from "lucide-react";

const LearningResources = () => {
  const realWorldTools = [
    {
      category: "AI-Powered ETL & Pipelines",
      icon: <Workflow className="text-blue-400" />,
      tools: [
        { name: "Apache Airflow + LLMs", url: "https://airflow.apache.org/", description: "AI orchestrates complex data workflows with self-healing capabilities" },
        { name: "dbt + GPT Code Generation", url: "https://www.getdbt.com/", description: "Auto-generate SQL transformations using natural language" },
        { name: "Fivetran AI Connectors", url: "https://fivetran.com/", description: "Intelligent data connectors that adapt to schema changes" },
        { name: "Prefect AI Agents", url: "https://www.prefect.io/", description: "AI agents monitor and auto-fix pipeline failures" }
      ]
    },
    {
      category: "LLM-Powered Data Tools",
      icon: <Cpu className="text-purple-400" />,
      tools: [
        { name: "LangChain for DataOps", url: "https://docs.langchain.com/", description: "Chain LLMs for complex data workflows and transformations" },
        { name: "Pandas AI", url: "https://pandas-ai.readthedocs.io/", description: "Natural language data analysis and manipulation" },
        { name: "ChatGPT Code Interpreter", url: "https://openai.com/api/", description: "AI writes and executes data processing code on demand" },
        { name: "GitHub Copilot for Data", url: "https://github.com/features/copilot", description: "AI pair programming for data engineering tasks" }
      ]
    },
    {
      category: "AI Data Quality & Governance",
      icon: <Monitor className="text-green-400" />,
      tools: [
        { name: "Great Expectations AI", url: "https://greatexpectations.io/", description: "AI-generated data quality tests and expectations" },
        { name: "Monte Carlo AI Observability", url: "https://www.montecarlodata.com/", description: "ML-powered data incident detection and root cause analysis" },
        { name: "Datadog AI Monitoring", url: "https://www.datadoghq.com/", description: "Intelligent monitoring with anomaly detection for data pipelines" },
        { name: "Collibra AI Governance", url: "https://www.collibra.com/", description: "AI automates data cataloging and compliance workflows" }
      ]
    },
    {
      category: "Schema & Metadata Automation",
      icon: <Database className="text-cyan-400" />,
      tools: [
        { name: "Apache Atlas + ML", url: "https://atlas.apache.org/", description: "AI-powered metadata discovery and lineage tracking" },
        { name: "DataHub AI Cataloging", url: "https://datahubproject.io/", description: "Intelligent data discovery and automated documentation" },
        { name: "Amundsen AI Search", url: "https://www.amundsen.io/", description: "ML-enhanced data discovery and recommendation engine" },
        { name: "Alation AI Assistant", url: "https://www.alation.com/", description: "AI chatbot for data catalog queries and insights" }
      ]
    }
  ];

  const etlExamples = [
    {
      title: "AI-Powered ETL Pipeline Orchestration",
      language: "Python + Airflow",
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
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BookOpen className="text-green-400" />
            AI is Revolutionizing the Entire Data Engineering Stack
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-200 leading-relaxed">
            This game demonstrates how AI is transforming every aspect of data engineering - from ETL pipelines to real-time processing. Modern data teams use LLMs to generate code, ML to monitor quality, and AI agents to orchestrate complex workflows that traditionally required extensive manual coding and maintenance.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-black/30 p-4 rounded-lg border border-red-500">
              <h4 className="text-red-400 font-semibold mb-2">Legacy Approach</h4>
              <p className="text-gray-300 text-sm">Manual ETL coding, static schemas, reactive monitoring, siloed tools</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg border border-blue-500">
              <h4 className="text-blue-400 font-semibold mb-2">AI-Native Approach</h4>
              <p className="text-gray-300 text-sm">Code generation, adaptive schemas, predictive monitoring, unified AI platform</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg border border-green-500">
              <h4 className="text-green-400 font-semibold mb-2">Future Vision</h4>
              <p className="text-gray-300 text-sm">Autonomous data operations, self-optimizing pipelines, natural language interfaces</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ETL Concepts */}
      {etlConcepts.map((concept, index) => (
        <Card key={index} className="bg-purple-900/20 border-purple-500">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <GitBranch className="text-purple-400" />
              {concept.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {concept.items.map((item, itemIndex) => (
                <div key={itemIndex} className="text-gray-200 flex items-start gap-2">
                  <span className="text-lg">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Real-world Tools */}
      {realWorldTools.map((category, categoryIndex) => (
        <Card key={categoryIndex} className="bg-black/20 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {category.icon}
              {category.category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {category.tools.map((tool, toolIndex) => (
                <div key={toolIndex} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-gray-700">
                  <div>
                    <h4 className="text-cyan-400 font-semibold">{tool.name}</h4>
                    <p className="text-gray-300 text-sm">{tool.description}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild className="border-gray-600 text-white hover:bg-gray-800">
                    <a href={tool.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={16} className="mr-1" />
                      Learn
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* ETL Code Examples */}
      <Card className="bg-gray-900/30 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Code className="text-orange-400" />
            Production ETL Pipeline Examples with AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {etlExamples.map((example, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="text-orange-400 font-semibold">{example.title}</h4>
                <Badge variant="outline" className="text-gray-300 border-gray-600">
                  {example.language}
                </Badge>
              </div>
              <pre className="bg-black/60 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto border border-gray-700">
                {example.code}
              </pre>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500">
        <CardHeader>
          <CardTitle className="text-white">🚀 Master Modern Data Engineering with AI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-blue-400 font-semibold">Foundation Skills</h4>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Learn Python, SQL, and cloud platforms (AWS/GCP/Azure)</li>
                <li>• Master Apache Airflow for workflow orchestration</li>
                <li>• Understand dbt for data transformations</li>
                <li>• Practice with real datasets and ETL scenarios</li>
                <li>• Study data modeling and warehouse design</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-purple-400 font-semibold">AI-Enhanced Skills</h4>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Integrate LLMs into data workflows (LangChain, GPT APIs)</li>
                <li>• Build ML-powered data quality monitoring</li>
                <li>• Create AI agents for pipeline automation</li>
                <li>• Implement vector databases for semantic search</li>
                <li>• Design self-healing data architectures</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-black/30 rounded-lg border border-cyan-500">
            <h4 className="text-cyan-400 font-semibold mb-2">🎯 Career Path: AI Data Engineer</h4>
            <p className="text-gray-300 text-sm">
              The future belongs to data engineers who can leverage AI to build intelligent, self-managing data systems. 
              Start with traditional ETL, then progressively add AI capabilities to automate and optimize every aspect of your pipelines.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningResources;
