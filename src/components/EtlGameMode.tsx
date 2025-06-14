import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import DatasetDisplay from "@/components/DatasetDisplay";
import { 
  Database, 
  ArrowRight, 
  Zap, 
  Target, 
  Search, 
  RefreshCw, 
  Droplets, 
  Link, 
  Eye, 
  Tag, 
  FileSpreadsheet, 
  FileText, 
  Activity, 
  TestTube, 
  MessageSquare,
  Play,
  Star,
  Trophy,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  Upload,
  Download
} from "lucide-react";

interface EtlGameModeProps {
  onScoreUpdate: (points: number) => void;
}

const EtlGameMode = ({ onScoreUpdate }: EtlGameModeProps) => {
  const [currentLevel, setCurrentLevel] = useState<string | null>(null);
  const [gameProgress, setGameProgress] = useState(0);
  const [naturalLanguagePrompt, setNaturalLanguagePrompt] = useState("");
  const [generatedPipeline, setGeneratedPipeline] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<string | null>(null);
  const [simulationResults, setSimulationResults] = useState<any | null>(null);
  const [uploadedData, setUploadedData] = useState<string | null>(null);
  const [selectedSampleData, setSelectedSampleData] = useState<string | null>(null);
  const [dataFileName, setDataFileName] = useState<string>("");
  const { toast } = useToast();

  // Sample datasets for educational purposes
  const sampleDatasets = {
    sales: {
      name: "E-commerce Sales Data",
      description: "Sample sales data with missing values and inconsistent formats",
      data: `order_id,customer_name,product,price,order_date,status,email
1001,John Smith,Laptop,999.99,2024-01-15,completed,john@email.com
1002,Jane Doe,Mouse,25.50,01/16/2024,pending,jane@email.com
1003,,Keyboard,75.00,2024-01-17,cancelled,
1004,Bob Johnson,Monitor,,2024/01/18,completed,bob@email.com
1005,Alice Brown,Headphones,150.00,19-01-2024,completed,alice@email.com
1006,Charlie Wilson,Webcam,89.99,,pending,charlie@email.com`
    },
    employees: {
      name: "Employee Database",
      description: "HR data with various data quality issues",
      data: `emp_id,name,department,salary,hire_date,manager_id,location
101,Sarah Connor,Engineering,95000,2023-03-15,201,New York
102,John Connor,Marketing,,2023-04-20,202,Los Angeles
103,,Sales,45000,2023/05/10,203,Chicago
104,Kyle Reese,Engineering,87000,15-06-2023,201,New York
105,Miles Dyson,R&D,120000,2023-07-01,,San Francisco
106,T-800,Security,65000,2023-08-15,204,`
    },
    inventory: {
      name: "Warehouse Inventory",
      description: "Inventory data with missing quantities and categories",
      data: `sku,product_name,category,quantity,unit_price,supplier,last_updated
SKU001,Gaming Laptop,Electronics,50,1299.99,TechCorp,2024-01-20
SKU002,Office Chair,,25,199.99,FurniturePlus,2024-01-19
SKU003,Wireless Mouse,Electronics,,29.99,TechCorp,
SKU004,Standing Desk,Furniture,15,399.99,,2024-01-18
SKU005,,Electronics,100,15.99,GadgetWorld,2024-01-21
SKU006,Coffee Maker,Appliances,8,89.99,HomeGoods,2024/01/20`
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a CSV file.",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const csvData = e.target?.result as string;
        setUploadedData(csvData);
        setSelectedSampleData(null);
        setDataFileName(file.name);
        
        toast({
          title: "✅ Data Uploaded!",
          description: `Successfully loaded ${file.name}`,
        });
      };
      reader.readAsText(file);
    }
  };

  const loadSampleData = (datasetKey: string) => {
    const dataset = sampleDatasets[datasetKey as keyof typeof sampleDatasets];
    setSelectedSampleData(dataset.data);
    setUploadedData(null);
    setDataFileName(dataset.name);
    
    toast({
      title: "📊 Sample Data Loaded!",
      description: `Loaded ${dataset.name} for practice`,
    });
  };

  const getCurrentData = () => {
    return uploadedData || selectedSampleData;
  };

  const getDataStats = (data: string) => {
    const lines = data.trim().split('\n');
    const headers = lines[0].split(',');
    const dataRows = lines.slice(1);
    
    let emptyCount = 0;
    dataRows.forEach(row => {
      row.split(',').forEach(cell => {
        if (!cell.trim()) emptyCount++;
      });
    });

    return {
      totalRecords: dataRows.length,
      totalFields: headers.length,
      emptyFields: emptyCount,
      completenessRate: Math.round(((dataRows.length * headers.length - emptyCount) / (dataRows.length * headers.length)) * 100)
    };
  };

  const etlStages = {
    extract: {
      title: "🧲 Extract Arena",
      description: "Master data extraction with AI-powered tools",
      levels: [
        {
          id: "schema-detection",
          name: "Auto-Detect Schema",
          icon: <Target className="w-5 h-5" />,
          description: "Drag data from sources to matching schema bubbles",
          difficulty: "Beginner",
          points: 100
        },
        {
          id: "source-discovery",
          name: "Data Source Discovery",
          icon: <Search className="w-5 h-5" />,
          description: "Clue-based puzzle to find data sources in a 'data forest'",
          difficulty: "Intermediate",
          points: 150
        }
      ]
    },
    transform: {
      title: "🔄 Transform Arena",
      description: "Clean and transform data using AI automation",
      levels: [
        {
          id: "column-normalization",
          name: "Column Normalization",
          icon: <RefreshCw className="w-5 h-5" />,
          description: "Match messy column formats with AI-suggested fixes",
          difficulty: "Beginner",
          points: 120
        },
        {
          id: "null-imputation",
          name: "AI Null Value Imputation",
          icon: <Droplets className="w-5 h-5" />,
          description: "Pick the best AI-suggested imputation method",
          difficulty: "Intermediate",
          points: 140
        },
        {
          id: "smart-joins",
          name: "Smart Joins",
          icon: <Link className="w-5 h-5" />,
          description: "Combine tables using AI-recommended relationship cards",
          difficulty: "Advanced",
          points: 180
        },
        {
          id: "anomaly-detection",
          name: "Anomaly Detection",
          icon: <Eye className="w-5 h-5" />,
          description: "Spot the 'data intruder' in a visualized dataset",
          difficulty: "Advanced",
          points: 200
        },
        {
          id: "semantic-tagging",
          name: "Semantic Tagging",
          icon: <Tag className="w-5 h-5" />,
          description: "Match AI-suggested labels to unstructured text fields",
          difficulty: "Expert",
          points: 220
        }
      ]
    },
    load: {
      title: "📦 Load & Monitor Dock",
      description: "Optimize loading and monitor data pipelines",
      levels: [
        {
          id: "schema-optimization",
          name: "Optimize Target Schema",
          icon: <FileSpreadsheet className="w-5 h-5" />,
          description: "Drag & drop fields into normalized target schema zones",
          difficulty: "Intermediate",
          points: 160
        },
        {
          id: "auto-documentation",
          name: "Auto Documentation",
          icon: <FileText className="w-5 h-5" />,
          description: "Unlock hidden 'Docs' by choosing the best LLM summary",
          difficulty: "Beginner",
          points: 110
        },
        {
          id: "drift-detection",
          name: "Drift Detection Battle",
          icon: <Activity className="w-5 h-5" />,
          description: "Battle a 'Schema Shapeshifter' by identifying drifted columns",
          difficulty: "Expert",
          points: 250
        }
      ]
    },
    qa: {
      title: "🧪 QA Labs",
      description: "Quality assurance with AI-powered testing",
      levels: [
        {
          id: "test-generation",
          name: "AI Test Case Generator",
          icon: <TestTube className="w-5 h-5" />,
          description: "Choose the right generated test case for sample ETL output",
          difficulty: "Advanced",
          points: 190
        }
      ]
    }
  };

  const playLevel = (stageKey: string, levelId: string) => {
    const stage = etlStages[stageKey as keyof typeof etlStages];
    const level = stage.levels.find(l => l.id === levelId);
    
    if (level) {
      setCurrentLevel(`${stageKey}-${levelId}`);
      
      // Simulate playing the level
      setTimeout(() => {
        const points = level.points;
        onScoreUpdate(points);
        setGameProgress(prev => Math.min(prev + 10, 100));
        
        toast({
          title: "🎉 Level Complete!",
          description: `You earned ${points} XP for completing ${level.name}!`,
        });
        
        setCurrentLevel(null);
      }, 2000);
    }
  };

  const generatePipeline = () => {
    if (!naturalLanguagePrompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a natural language instruction for your ETL pipeline.",
        variant: "destructive"
      });
      return;
    }

    const currentData = getCurrentData();
    let dataContext = "";
    if (currentData) {
      const stats = getDataStats(currentData);
      dataContext = `\n# Data Context: Working with ${dataFileName}
# Records: ${stats.totalRecords}, Fields: ${stats.totalFields}
# Data Quality: ${stats.completenessRate}% complete (${stats.emptyFields} empty fields detected)
`;
    }

    // Simulate AI pipeline generation
    const mockPipeline = `${dataContext}
# AI-Generated ETL Pipeline for: "${naturalLanguagePrompt}"

from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.ml.feature import Imputer

# Initialize Spark Session
spark = SparkSession.builder.appName("JAGA_AutoETL").getOrCreate()

# EXTRACT: Load data based on your request
${currentData ? `df = spark.read.option("header", "true").csv("${dataFileName}")` : `df = spark.read.option("header", "true").csv("your_data_source.csv")`}

# TRANSFORM: AI-suggested transformations
# 1. Handle missing values with intelligent imputation
imputer = Imputer(inputCols=["numeric_column"], outputCols=["numeric_column_imputed"])
df_clean = imputer.fit(df).transform(df)

# 2. Data quality checks
df_validated = df_clean.filter(col("important_field").isNotNull())

# 3. Schema optimization
df_optimized = df_validated.select(
    col("id").cast("integer"),
    col("name").cast("string"),
    col("value").cast("double")
)

# LOAD: Write to target destination
df_optimized.write.mode("overwrite").saveAsTable("clean_data_table")

# MONITOR: Add data quality metrics
row_count = df_optimized.count()
print(f"Pipeline completed successfully! Processed {row_count} records.")
`;

    setGeneratedPipeline(mockPipeline);
    onScoreUpdate(300); // Bonus points for using natural language feature
    
    toast({
      title: "🤖 Pipeline Generated!",
      description: "JAGA has created an intelligent ETL pipeline from your prompt!",
    });
  };

  const deployPipeline = async () => {
    if (!generatedPipeline) {
      toast({
        title: "No Pipeline to Deploy",
        description: "Please generate a pipeline first before deploying.",
        variant: "destructive"
      });
      return;
    }

    setIsDeploying(true);
    setDeploymentStatus("Initializing deployment...");

    // Simulate deployment process
    const deploymentSteps = [
      "Validating pipeline syntax...",
      "Checking dependencies...",
      "Setting up Spark cluster...",
      "Uploading pipeline code...",
      "Configuring data connections...",
      "Starting pipeline deployment...",
      "Pipeline successfully deployed!"
    ];

    for (let i = 0; i < deploymentSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setDeploymentStatus(deploymentSteps[i]);
    }

    setIsDeploying(false);
    onScoreUpdate(500); // Bonus points for deployment
    
    toast({
      title: "🚀 Pipeline Deployed!",
      description: "Your ETL pipeline is now live and ready to process data!",
    });
  };

  const simulateRun = async () => {
    if (!generatedPipeline) {
      toast({
        title: "No Pipeline to Simulate",
        description: "Please generate a pipeline first before simulating.",
        variant: "destructive"
      });
      return;
    }

    setIsSimulating(true);
    setSimulationResults(null);

    // Simulate pipeline execution
    await new Promise(resolve => setTimeout(resolve, 2000));

    const currentData = getCurrentData();
    let mockResults;

    if (currentData) {
      // Use actual data stats when available
      const stats = getDataStats(currentData);
      const processedRecords = stats.totalRecords;
      const cleanedRecords = Math.floor(processedRecords * (stats.completenessRate / 100));
      const skippedRecords = processedRecords - cleanedRecords;

      mockResults = {
        status: "SUCCESS",
        dataSource: uploadedData ? "Uploaded Data" : "Sample Data",
        dataFile: dataFileName,
        executionTime: "1.87 seconds",
        recordsProcessed: processedRecords,
        recordsCleaned: cleanedRecords,
        recordsSkipped: skippedRecords,
        dataQualityScore: stats.completenessRate,
        isRealData: true,
        stages: [
          { name: "Extract", status: "✅ Success", duration: "0.32s", records: processedRecords },
          { name: "Transform", status: "✅ Success", duration: "0.98s", records: cleanedRecords },
          { name: "Load", status: "✅ Success", duration: "0.57s", records: cleanedRecords }
        ]
      };
    } else {
      // Use mock data when no real data is available
      mockResults = {
        status: "SUCCESS",
        dataSource: "Simulated Data",
        dataFile: "demo_dataset.csv",
        executionTime: "2.34 seconds",
        recordsProcessed: 15420,
        recordsCleaned: 14892,
        recordsSkipped: 528,
        dataQualityScore: 96.8,
        isRealData: false,
        stages: [
          { name: "Extract", status: "✅ Success", duration: "0.45s", records: 15420 },
          { name: "Transform", status: "✅ Success", duration: "1.23s", records: 14892 },
          { name: "Load", status: "✅ Success", duration: "0.66s", records: 14892 }
        ]
      };
    }

    setSimulationResults(mockResults);
    setIsSimulating(false);
    onScoreUpdate(400); // Bonus points for simulation
    
    toast({
      title: "🧪 Simulation Complete!",
      description: `Pipeline processed ${mockResults.recordsProcessed} records successfully!`,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-500";
      case "Intermediate": return "bg-yellow-500";
      case "Advanced": return "bg-orange-500";
      case "Expert": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  if (currentLevel) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-400">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <Zap className="w-16 h-16 text-yellow-400 mx-auto animate-pulse" />
              <h3 className="text-2xl font-bold text-white">Playing Level...</h3>
              <p className="text-gray-300">JAGA is analyzing your performance!</p>
              <Progress value={50} className="w-full max-w-md mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-cyan-400">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Database className="w-12 h-12 text-cyan-400" />
              <h2 className="text-4xl font-bold text-white">ETL Ops: AI Edition</h2>
              <Zap className="w-12 h-12 text-yellow-400" />
            </div>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              🎯 Learn how AI enhances every ETL stage through fun, interactive challenges!
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <Badge variant="outline" className="text-white border-white">
                <Trophy className="w-4 h-4 mr-2" />
                Game Progress: {gameProgress}%
              </Badge>
              <Progress value={gameProgress} className="w-48" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Upload Section */}
      <Card className="bg-gradient-to-r from-green-900/50 to-teal-900/50 border-green-400">
        <CardHeader>
          <CardTitle className="text-white text-2xl flex items-center gap-2">
            <Upload className="w-6 h-6" />
            📊 Data Playground
          </CardTitle>
          <p className="text-gray-200">
            Upload your own CSV data or use our sample datasets to practice ETL operations!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Upload */}
            <div className="space-y-4">
              <h4 className="text-white font-bold">📁 Upload Your Data</h4>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="bg-gray-800 border-gray-600 text-white"
                />
                <p className="text-gray-400 text-sm mt-2">Upload a CSV file to work with real data</p>
              </div>
            </div>

            {/* Sample Datasets */}
            <div className="space-y-4">
              <h4 className="text-white font-bold">🎓 Sample Datasets</h4>
              <div className="space-y-2">
                {Object.entries(sampleDatasets).map(([key, dataset]) => (
                  <Button
                    key={key}
                    onClick={() => loadSampleData(key)}
                    variant="outline"
                    className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">{dataset.name}</div>
                      <div className="text-xs opacity-75">{dataset.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Display Current Data */}
          {getCurrentData() && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-bold">Current Dataset: {dataFileName}</span>
                {!uploadedData && (
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                    Sample Data
                  </Badge>
                )}
              </div>
              <DatasetDisplay 
                data={getCurrentData()!} 
                title={`Preview: ${dataFileName}`} 
              />
              <div className="mt-2 flex gap-4 text-sm text-gray-400">
                {(() => {
                  const stats = getDataStats(getCurrentData()!);
                  return (
                    <>
                      <span>{stats.totalRecords} records</span>
                      <span>{stats.totalFields} fields</span>
                      <span>{stats.completenessRate}% complete</span>
                      <span>{stats.emptyFields} missing values</span>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Game Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(etlStages).map(([stageKey, stage]) => (
          <Card key={stageKey} className="bg-gray-800/50 border-gray-600 hover:border-blue-400 transition-colors">
            <CardHeader>
              <CardTitle className="text-white text-xl">{stage.title}</CardTitle>
              <p className="text-gray-300">{stage.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {stage.levels.map((level) => (
                <div key={level.id} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {level.icon}
                      <span className="font-semibold text-white">{level.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getDifficultyColor(level.difficulty)} text-white`}>
                        {level.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                        <Star className="w-3 h-3 mr-1" />
                        {level.points} XP
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{level.description}</p>
                  <Button 
                    onClick={() => playLevel(stageKey, level.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Play Level
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bonus: Natural Language Pipeline Builder */}
      <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-400">
        <CardHeader>
          <CardTitle className="text-white text-2xl flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            🔥 Bonus: Natural Language Pipeline Builder
          </CardTitle>
          <p className="text-gray-200">
            Speak your ETL needs and let JAGA's AI automatically generate a complete pipeline!
            {getCurrentData() && (
              <Badge className="ml-2 bg-green-600">
                ✅ Data Loaded: {dataFileName}
              </Badge>
            )}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-white font-medium">Enter your ETL instruction:</label>
            <Textarea
              placeholder="Example: Clean all sales data with missing values, normalize date formats, and load to Snowflake table"
              value={naturalLanguagePrompt}
              onChange={(e) => setNaturalLanguagePrompt(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              rows={3}
            />
          </div>
          <Button 
            onClick={generatePipeline}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            size="lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            Generate AI Pipeline
          </Button>
          
          {generatedPipeline && (
            <div className="mt-6">
              <h4 className="text-white font-bold mb-2">🤖 Generated Pipeline:</h4>
              <pre className="bg-gray-900 border border-gray-600 rounded-lg p-4 text-green-400 text-sm overflow-x-auto">
                {generatedPipeline}
              </pre>
              <div className="mt-4 flex gap-2">
                <Button 
                  onClick={deployPipeline}
                  disabled={isDeploying}
                  className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                  variant="outline"
                >
                  {isDeploying ? (
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4 mr-2" />
                  )}
                  {isDeploying ? "Deploying..." : "Deploy Pipeline"}
                </Button>
                <Button 
                  onClick={simulateRun}
                  disabled={isSimulating}
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black"
                  variant="outline"
                >
                  {isSimulating ? (
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Eye className="w-4 h-4 mr-2" />
                  )}
                  {isSimulating ? "Simulating..." : "Simulate Run"}
                </Button>
              </div>

              {/* Deployment Status */}
              {deploymentStatus && (
                <div className="mt-4 p-4 bg-green-900/20 border border-green-400 rounded-lg">
                  <div className="flex items-center gap-2">
                    {isDeploying ? (
                      <Clock className="w-5 h-5 text-green-400 animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                    <span className="text-green-400 font-medium">Deployment Status:</span>
                  </div>
                  <p className="text-green-300 mt-1">{deploymentStatus}</p>
                </div>
              )}

              {/* Simulation Results */}
              {simulationResults && (
                <div className="mt-4 p-4 bg-blue-900/20 border border-blue-400 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-400 font-bold">Simulation Results</span>
                    {!simulationResults.isRealData && (
                      <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Demo Data
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-gray-300 text-sm">
                      <strong>Data Source:</strong> {simulationResults.dataSource} ({simulationResults.dataFile})
                      {!simulationResults.isRealData && (
                        <span className="text-yellow-400 ml-2">
                          ⚠️ This is simulated data. Upload your own CSV or select sample data for realistic results.
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400">{simulationResults.recordsProcessed.toLocaleString()}</p>
                      <p className="text-blue-300 text-sm">Records Processed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">{simulationResults.recordsCleaned.toLocaleString()}</p>
                      <p className="text-green-300 text-sm">Records Cleaned</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-400">{simulationResults.dataQualityScore}%</p>
                      <p className="text-yellow-300 text-sm">Quality Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-cyan-400">{simulationResults.executionTime}</p>
                      <p className="text-cyan-300 text-sm">Execution Time</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-white font-medium">Stage Breakdown:</h5>
                    {simulationResults.stages.map((stage: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                        <span className="text-white">{stage.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-300 text-sm">{stage.records.toLocaleString()} records</span>
                          <span className="text-gray-300 text-sm">{stage.duration}</span>
                          <span className="text-sm">{stage.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EtlGameMode;
