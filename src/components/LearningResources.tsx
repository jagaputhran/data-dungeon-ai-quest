
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BookOpen, Code, Cpu, Database } from "lucide-react";

const LearningResources = () => {
  const realWorldTools = [
    {
      category: "LLM-Powered Data Tools",
      icon: <Cpu className="text-purple-400" />,
      tools: [
        { name: "LangChain for DataOps", url: "https://docs.langchain.com/", description: "Chain LLMs for complex data workflows" },
        { name: "GPT-powered ETL", url: "https://openai.com/api/", description: "Use GPT for intelligent data transformation" },
        { name: "Pandas AI", url: "https://pandas-ai.readthedocs.io/", description: "Natural language data analysis" }
      ]
    },
    {
      category: "AI Orchestration",
      icon: <Database className="text-blue-400" />,
      tools: [
        { name: "Apache Airflow + AI", url: "https://airflow.apache.org/", description: "Orchestrate AI-powered data pipelines" },
        { name: "Databricks AutoML", url: "https://databricks.com/product/automl", description: "Automated machine learning workflows" },
        { name: "Prefect with LLMs", url: "https://www.prefect.io/", description: "Modern workflow orchestration" }
      ]
    },
    {
      category: "Schema & Quality",
      icon: <BookOpen className="text-green-400" />,
      tools: [
        { name: "Great Expectations AI", url: "https://greatexpectations.io/", description: "AI-assisted data quality testing" },
        { name: "dbt + LLM", url: "https://www.getdbt.com/", description: "AI-generated data transformations" },
        { name: "Monte Carlo AI", url: "https://www.montecarlodata.com/", description: "AI-powered data observability" }
      ]
    }
  ];

  const codeExamples = [
    {
      title: "LLM-Powered Data Cleaning",
      language: "Python",
      code: `import openai
import pandas as pd

def ai_clean_dataset(df, issues_description):
    prompt = f"""
    Clean this dataset: {df.to_csv()}
    Issues: {issues_description}
    Return cleaned CSV format.
    """
    
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return pd.read_csv(StringIO(response.choices[0].message.content))`
    },
    {
      title: "Automated Schema Generation",
      language: "Python", 
      code: `def generate_schema_with_ai(sample_data):
    prompt = f"""
    Generate a JSON schema for this data:
    {sample_data}
    
    Include data types, constraints, and validation rules.
    """
    
    schema = llm.invoke(prompt)
    return json.loads(schema)`
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BookOpen className="text-green-400" />
            How This Game Reflects Real AI + Data Engineering
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-200 leading-relaxed">
            This game simulates how AI is transforming data engineering from manual, rule-based processes to intelligent, automated workflows. In production, teams are replacing traditional ETL scripts with LLM-powered agents that can understand context, adapt to new data patterns, and self-heal when issues arise.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-black/30 p-4 rounded-lg border border-purple-500">
              <h4 className="text-purple-400 font-semibold mb-2">Traditional Way</h4>
              <p className="text-gray-300 text-sm">Write custom scripts for each data issue, manual quality checks, rigid schemas</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg border border-blue-500">
              <h4 className="text-blue-400 font-semibold mb-2">AI-Powered Way</h4>
              <p className="text-gray-300 text-sm">LLMs understand data context, auto-generate cleaning logic, adaptive schemas</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg border border-green-500">
              <h4 className="text-green-400 font-semibold mb-2">Future Impact</h4>
              <p className="text-gray-300 text-sm">Self-healing pipelines, natural language data queries, autonomous data governance</p>
            </div>
          </div>
        </CardContent>
      </Card>

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

      <Card className="bg-gray-900/30 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Code className="text-orange-400" />
            Code Examples: AI in Production
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {codeExamples.map((example, index) => (
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

      <Card className="bg-purple-900/20 border-purple-500">
        <CardHeader>
          <CardTitle className="text-white">🚀 Next Steps for Your AI Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-purple-400 font-semibold">Beginner Path</h4>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Start with Pandas AI for data analysis</li>
                <li>• Experiment with OpenAI API for data cleaning</li>
                <li>• Build simple LangChain workflows</li>
                <li>• Learn prompt engineering for data tasks</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-blue-400 font-semibold">Advanced Path</h4>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Implement vector databases for metadata search</li>
                <li>• Build AI agents for data pipeline monitoring</li>
                <li>• Create self-healing data quality systems</li>
                <li>• Develop natural language data interfaces</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningResources;
