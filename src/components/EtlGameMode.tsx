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
  Download,
  ArrowLeft,
  Check,
  X
} from "lucide-react";

interface EtlGameModeProps {
  onScoreUpdate: (points: number) => void;
}

interface LevelChallenge {
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  dataPreview?: string;
}

const EtlGameMode = ({ onScoreUpdate }: EtlGameModeProps) => {
  const [currentLevel, setCurrentLevel] = useState<string | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<LevelChallenge | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
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

  const generateDataDrivenChallenge = (stageKey: string, levelId: string): LevelChallenge | null => {
    const currentData = getCurrentData();
    if (!currentData) {
      toast({
        title: "No Data Available",
        description: "Please upload data or select a sample dataset first to play data-driven levels!",
        variant: "destructive"
      });
      return null;
    }

    const lines = currentData.trim().split('\n');
    const headers = lines[0].split(',');
    const dataRows = lines.slice(1);

    // Generate different challenges based on stage and level
    switch (`${stageKey}-${levelId}`) {
      case 'extract-schema-detection':
        return {
          type: 'multiple-choice',
          question: `Auto-detecting schema for ${dataFileName}. How many columns does this dataset have?`,
          options: [
            `${headers.length - 1} columns`,
            `${headers.length} columns`,
            `${headers.length + 1} columns`,
            `${headers.length + 2} columns`
          ],
          correctAnswer: 1,
          explanation: `Schema detection identified ${headers.length} columns: ${headers.join(', ')}. This helps automate data extraction setup.`,
          dataPreview: currentData.split('\n').slice(0, 4).join('\n')
        };

      case 'extract-source-discovery':
        const emptyFields = dataRows.reduce((count, row) => {
          return count + row.split(',').filter(cell => !cell.trim()).length;
        }, 0);
        return {
          type: 'multiple-choice',
          question: `Data source discovery found quality issues. How many missing/empty values need attention in this dataset?`,
          options: [
            `${emptyFields - 2} missing values`,
            `${emptyFields} missing values`,
            `${emptyFields + 1} missing values`,
            `${emptyFields + 3} missing values`
          ],
          correctAnswer: 1,
          explanation: `Source discovery identified ${emptyFields} missing values that need handling during extraction. This affects data completeness planning.`,
          dataPreview: currentData.split('\n').slice(0, 4).join('\n')
        };

      case 'transform-column-normalization':
        // Find inconsistent formats in the data
        const dateColumn = headers.find(h => h.toLowerCase().includes('date'));
        if (dateColumn) {
          return {
            type: 'multiple-choice',
            question: `Column normalization detected inconsistent date formats in "${dateColumn}". What's the best standardization approach?`,
            options: [
              'Convert all dates to YYYY-MM-DD ISO format',
              'Keep original mixed formats for flexibility',
              'Remove all date columns to avoid issues',
              'Convert to Unix timestamps only'
            ],
            correctAnswer: 0,
            explanation: 'ISO date format (YYYY-MM-DD) ensures consistency across systems and prevents parsing errors in downstream processes.',
            dataPreview: currentData.split('\n').slice(0, 6).join('\n')
          };
        }
        
        // Fallback for non-date normalization
        return {
          type: 'multiple-choice',
          question: `Column normalization analysis: Which transformation strategy works best for standardizing text fields?`,
          options: [
            'Convert all text to lowercase and trim whitespace',
            'Leave text fields exactly as they are',
            'Convert everything to uppercase only',
            'Remove all special characters completely'
          ],
          correctAnswer: 0,
          explanation: 'Lowercase conversion and whitespace trimming creates consistent text formatting without losing important data.',
          dataPreview: currentData.split('\n').slice(0, 4).join('\n')
        };

      case 'transform-null-imputation':
        const nullFields = headers.filter(header => {
          return dataRows.some(row => {
            const values = row.split(',');
            const index = headers.indexOf(header);
            return !values[index]?.trim();
          });
        });
        
        if (nullFields.length > 0) {
          const targetField = nullFields[0];
          return {
            type: 'multiple-choice',
            question: `AI Null Imputation detected missing values in "${targetField}". What's the smartest imputation strategy?`,
            options: [
              'Replace all nulls with zero values',
              'Delete all rows containing any null values',
              'Use mean for numeric, mode for categorical data',
              'Leave all null values unchanged'
            ],
            correctAnswer: 2,
            explanation: 'AI-powered imputation uses statistical methods: mean for numbers preserves distribution, mode for categories maintains most common patterns.',
            dataPreview: currentData.split('\n').slice(0, 6).join('\n')
          };
        }
        break;

      case 'transform-smart-joins':
        // Look for potential foreign key relationships
        const idColumns = headers.filter(h => h.toLowerCase().includes('id'));
        if (idColumns.length > 0) {
          return {
            type: 'multiple-choice',
            question: `Smart Joins AI detected "${idColumns[0]}" as a key field. How should this be used for joining with related tables?`,
            options: [
              'Use as PRIMARY KEY for main table joins',
              'Use as FOREIGN KEY to reference other tables',
              'Ignore ID fields in join operations',
              'Both PRIMARY and FOREIGN KEY depending on context'
            ],
            correctAnswer: 3,
            explanation: 'Smart joins recognize that ID fields can serve as both primary keys (unique identifiers) and foreign keys (references), depending on the join context.',
            dataPreview: currentData.split('\n').slice(0, 4).join('\n')
          };
        }
        
        return {
          type: 'multiple-choice',
          question: `Smart Joins analysis: What's the recommended join strategy when combining multiple data sources?`,
          options: [
            'Always use INNER JOIN to avoid null values',
            'Always use LEFT JOIN to keep all records',
            'Choose join type based on business requirements',
            'Use CROSS JOIN for maximum data combinations'
          ],
          correctAnswer: 2,
          explanation: 'Smart join recommendations depend on whether you need all records (LEFT/RIGHT), only matching records (INNER), or all combinations (FULL OUTER).',
          dataPreview: currentData.split('\n').slice(0, 4).join('\n')
        };

      case 'transform-anomaly-detection':
        // Look for potential anomalies in numeric data
        const numericColumns = headers.filter(h => {
          return dataRows.some(row => {
            const values = row.split(',');
            const index = headers.indexOf(h);
            const value = values[index];
            return value && !isNaN(parseFloat(value));
          });
        });
        
        if (numericColumns.length > 0) {
          return {
            type: 'multiple-choice',
            question: `Anomaly Detection found unusual patterns in "${numericColumns[0]}". What should trigger an anomaly alert?`,
            options: [
              'Values that are more than 3 standard deviations from mean',
              'Any value that appears only once in the dataset',
              'All values above the dataset average',
              'Only negative numbers in the data'
            ],
            correctAnswer: 0,
            explanation: 'Statistical anomaly detection uses the 3-sigma rule: values beyond 3 standard deviations are statistically unusual and likely anomalies.',
            dataPreview: currentData.split('\n').slice(0, 6).join('\n')
          };
        }
        
        return {
          type: 'multiple-choice',
          question: `Anomaly Detection scan complete. Which pattern indicates a data quality issue?`,
          options: [
            'Consistent data formats across all records',
            'Sudden spikes or drops in expected value ranges',
            'Normal distribution of numeric values',
            'Complete data with no missing fields'
          ],
          correctAnswer: 1,
          explanation: 'Anomaly detection flags unexpected spikes, drops, or outliers that deviate from normal data patterns and may indicate errors or fraud.',
          dataPreview: currentData.split('\n').slice(0, 4).join('\n')
        };

      case 'transform-semantic-tagging':
        return {
          type: 'multiple-choice',
          question: `Semantic Tagging AI analyzed your data. Which field type classification is most accurate for email-like data?`,
          options: [
            'Tag as "CONTACT_INFO" with email validation rules',
            'Tag as "TEXT_STRING" with no special handling',
            'Tag as "IDENTIFIER" like an ID number',
            'Tag as "SENSITIVE_DATA" requiring encryption'
          ],
          correctAnswer: 0,
          explanation: 'Semantic tagging recognizes email patterns and applies appropriate validation, formatting, and privacy rules for contact information.',
          dataPreview: currentData.split('\n').slice(0, 4).join('\n')
        };

      case 'load-schema-optimization':
        const potentialPrimaryKey = headers[0]; // Usually first column is ID
        return {
          type: 'multiple-choice',
          question: `Schema Optimization for loading: Which column should be the PRIMARY KEY for efficient data retrieval?`,
          options: headers.slice(0, 4),
          correctAnswer: 0,
          explanation: `"${potentialPrimaryKey}" is the optimal primary key as it provides unique identification for efficient indexing and data retrieval operations.`,
          dataPreview: currentData.split('\n').slice(0, 4).join('\n')
        };

      case 'load-auto-documentation':
        const totalRecords = dataRows.length;
        return {
          type: 'multiple-choice',
          question: `Auto Documentation generated metadata. What's the best description for this ${totalRecords}-record dataset?`,
          options: [
            `Small dataset with ${totalRecords} records for testing purposes`,
            `Production dataset with ${totalRecords} business records requiring monitoring`,
            `Archive dataset with ${totalRecords} historical records`,
            `Temporary dataset with ${totalRecords} records for one-time analysis`
          ],
          correctAnswer: 1,
          explanation: 'Auto-documentation categorizes datasets based on size, usage patterns, and business context for proper governance and monitoring.',
          dataPreview: currentData.split('\n').slice(0, 4).join('\n')
        };

      case 'load-drift-detection':
        return {
          type: 'multiple-choice',
          question: `Drift Detection Battle: Schema changes detected! What indicates the most critical schema drift?`,
          options: [
            'New optional columns added to existing tables',
            'Primary key column data type changed from INT to STRING',
            'Column order rearranged but same data types',
            'New indexes added for performance optimization'
          ],
          correctAnswer: 1,
          explanation: 'Primary key data type changes break referential integrity and require immediate attention, while other changes are less critical.',
          dataPreview: currentData.split('\n').slice(0, 4).join('\n')
        };

      case 'qa-test-generation':
        const completenessRate = Math.round(((dataRows.length * headers.length - dataRows.reduce((count, row) => {
          return count + row.split(',').filter(cell => !cell.trim()).length;
        }, 0)) / (dataRows.length * headers.length)) * 100);
        
        return {
          type: 'multiple-choice',
          question: `AI Test Case Generator created quality tests. What's the priority test for ${completenessRate}% complete data?`,
          options: [
            'Test only for duplicate primary keys',
            'Test data completeness and missing value patterns',
            'Test only for correct data types',
            'Test only for referential integrity'
          ],
          correctAnswer: 1,
          explanation: `With ${completenessRate}% completeness, testing missing value patterns helps identify systematic data quality issues affecting reliability.`,
          dataPreview: currentData.split('\n').slice(0, 4).join('\n')
        };

      default:
        return {
          type: 'multiple-choice',
          question: `Basic data analysis: How many data records are in the ${dataFileName} dataset?`,
          options: [
            `${dataRows.length - 1} records`,
            `${dataRows.length} records`,
            `${dataRows.length + 1} records`,
            `${dataRows.length + 2} records`
          ],
          correctAnswer: 1,
          explanation: `The dataset contains ${dataRows.length} data records (excluding the header row).`,
          dataPreview: currentData.split('\n').slice(0, 4).join('\n')
        };
    }

    return null;
  };

  const playLevel = (stageKey: string, levelId: string) => {
    const stage = etlStages[stageKey as keyof typeof etlStages];
    const level = stage.levels.find(l => l.id === levelId);
    
    if (level) {
      const challenge = generateDataDrivenChallenge(stageKey, levelId);
      
      if (!challenge) {
        return; // Error already shown in generateDataDrivenChallenge
      }

      setCurrentLevel(`${stageKey}-${levelId}`);
      setCurrentChallenge(challenge);
      setSelectedAnswer("");
      setShowResult(false);
      setIsCorrect(false);
    }
  };

  const submitAnswer = () => {
    if (!currentChallenge || !selectedAnswer) {
      toast({
        title: "No Answer Selected",
        description: "Please select an answer before submitting.",
        variant: "destructive"
      });
      return;
    }

    const isAnswerCorrect = selectedAnswer === currentChallenge.correctAnswer.toString();
    setIsCorrect(isAnswerCorrect);
    setShowResult(true);

    if (isAnswerCorrect) {
      const points = 150; // Points for data-driven challenges
      onScoreUpdate(points);
      setGameProgress(prev => Math.min(prev + 10, 100));
      
      toast({
        title: "🎉 Correct!",
        description: `You earned ${points} XP! Great job understanding the data!`,
      });
    } else {
      toast({
        title: "❌ Incorrect",
        description: "Don't worry! Learn from the explanation and try another level.",
        variant: "destructive"
      });
    }
  };

  const goBackToLevels = () => {
    setCurrentLevel(null);
    setCurrentChallenge(null);
    setSelectedAnswer("");
    setShowResult(false);
    setIsCorrect(false);
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

  if (currentLevel && currentChallenge) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-green-900/50 to-teal-900/50 border-green-400">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-2xl flex items-center gap-2">
                <Target className="w-6 h-6" />
                Data Challenge: {dataFileName}
              </CardTitle>
              <Button onClick={goBackToLevels} variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Levels
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Data Preview */}
            {currentChallenge.dataPreview && (
              <div>
                <h4 className="text-white font-bold mb-2">📊 Data Preview:</h4>
                <pre className="bg-gray-900 border border-gray-600 rounded-lg p-4 text-green-400 text-sm overflow-x-auto">
                  {currentChallenge.dataPreview}
                </pre>
              </div>
            )}

            {/* Question */}
            <div className="space-y-4">
              <h3 className="text-white text-xl font-bold">{currentChallenge.question}</h3>
              
              {/* Multiple Choice Options */}
              {currentChallenge.options && (
                <div className="space-y-3">
                  {currentChallenge.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => setSelectedAnswer(index.toString())}
                      variant={selectedAnswer === index.toString() ? "default" : "outline"}
                      className={`w-full justify-start text-left p-4 h-auto ${
                        selectedAnswer === index.toString() 
                          ? "bg-blue-600 text-white border-blue-500" 
                          : "bg-gray-800 border-gray-500 text-white hover:bg-gray-700 hover:border-gray-400"
                      }`}
                      disabled={showResult}
                    >
                      <span className="font-bold mr-3 text-yellow-400">{String.fromCharCode(65 + index)}.</span>
                      <span className="text-white">{option}</span>
                    </Button>
                  ))}
                </div>
              )}

              {/* Submit Button */}
              {!showResult && (
                <Button 
                  onClick={submitAnswer}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                  disabled={!selectedAnswer}
                >
                  <Check className="w-5 h-5 mr-2" />
                  Submit Answer
                </Button>
              )}

              {/* Result */}
              {showResult && (
                <div className={`p-4 rounded-lg border ${
                  isCorrect 
                    ? "bg-green-900/20 border-green-400" 
                    : "bg-red-900/20 border-red-400"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <X className="w-5 h-5 text-red-400" />
                    )}
                    <span className={`font-bold ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                      {isCorrect ? "Correct!" : "Incorrect"}
                    </span>
                  </div>
                  <p className="text-gray-300">{currentChallenge.explanation}</p>
                  
                  <Button 
                    onClick={goBackToLevels}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Continue Learning
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <Badge className="ml-2 bg-yellow-600">
              ⚡ Required for interactive challenges
            </Badge>
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
                    className={`w-full ${
                      getCurrentData() 
                        ? "bg-blue-600 hover:bg-blue-700" 
                        : "bg-gray-600 hover:bg-gray-700"
                    }`}
                    disabled={!getCurrentData()}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {getCurrentData() ? "Play Level" : "Load Data First"}
                  </Button>
                  {!getCurrentData() && (
                    <p className="text-yellow-400 text-xs mt-2">
                      ⚠️ Upload data or select a sample dataset to play
                    </p>
                  )}
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
                  {isSimulating ? "Simulate Run..." : "Simulate Run"}
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
