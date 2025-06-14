
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { FileJson, Target, CheckCircle, Brain, Cog, Sparkles, Database } from "lucide-react";
import DatasetDisplay from "./DatasetDisplay";
import BattleResult from "./BattleResult";

interface JsonBattleModeProps {
  onScoreUpdate: (points: number) => void;
}

const JsonBattleMode = ({ onScoreUpdate }: JsonBattleModeProps) => {
  const [selectedTool, setSelectedTool] = useState("");
  const [battleResult, setBattleResult] = useState("");
  const [isBattling, setIsBattling] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [cleanedDataset, setCleanedDataset] = useState("");
  const [aiWorkflow, setAiWorkflow] = useState<string[]>([]);

  const corruptedJsonDataset = `{
  "users": [
    {
      "id": "user_001",
      "name": "John Doe",
      "email": "john.doe@email.com",
      "registration_date": "2023-01-15T10:30:00Z",
      "profile": {
        "age": 28,
        "address": {
          "street": "123 Main St",
          "city": "New York",
          "country": "USA"
        },
        "preferences": ["tech", "sports"],
        "metadata": {"last_login": "2023-12-01", "device": "mobile"}
      }
    },
    {
      "id": "",
      "name": null,
      "email": "invalid-email",
      "registration_date": "not-a-date",
      "profile": {
        "age": "twenty-five",
        "address": {
          "street": "",
          "city": null,
          "country": "US"
        },
        "preferences": "tech,sports",
        "metadata": {"last_login": null, "device": ""}
      }
    },
    {
      "id": "user_003",
      "name": "Alice Johnson",
      "email": "alice@company.com",
      "registration_date": "2023/03/20 14:45:00",
      "profile": {
        "age": -5,
        "address": {
          "street": "456 Oak Ave",
          "city": "Los Angeles"
        },
        "preferences": [],
        "metadata": {"last_login": "2023-11-30T08:15:00Z"}
      }
    },
    {
      "name": "Bob Smith",
      "email": "bob.smith@email.com",
      "registration_date": "2023-02-10T16:20:00Z",
      "profile": {
        "age": 150,
        "address": "789 Pine St, Chicago, IL",
        "preferences": ["music", "travel", "food", "tech", "sports", "reading"],
        "metadata": {"device": "desktop", "session_count": "many"}
      }
    }
  ],
  "events": [
    {"user_id": "user_001", "event_type": "login", "timestamp": "2023-12-01T09:30:00Z", "data": {"ip": "192.168.1.1"}},
    {"user_id": null, "event_type": "", "timestamp": "invalid", "data": "not-an-object"},
    {"user_id": "user_999", "event_type": "purchase", "timestamp": "2023-12-01T14:20:00Z", "data": {}}
  ]
}`;

  const tools = [
    { 
      id: "pyspark-ai-cleaner", 
      name: "🚀 PySpark AI Data Cleaner", 
      effectiveness: 95, 
      description: "AI-powered PySpark pipeline with auto-schema detection and Databricks integration" 
    },
    { 
      id: "databricks-automl", 
      name: "🤖 Databricks AutoML Processor", 
      effectiveness: 90, 
      description: "AutoML-driven data quality assessment and cleaning workflows" 
    },
    { 
      id: "llm-json-parser", 
      name: "🧠 LLM JSON Schema Generator", 
      effectiveness: 85, 
      description: "Large Language Model analyzes and standardizes JSON structures" 
    },
    { 
      id: "spark-sql-ai", 
      name: "⚡ Spark SQL AI Optimizer", 
      effectiveness: 80, 
      description: "AI generates optimized SQL transformations for complex JSON processing" 
    },
    { 
      id: "delta-lake-validator", 
      name: "🏗️ Delta Lake AI Validator", 
      effectiveness: 75, 
      description: "Intelligent Delta Lake schema evolution and data validation" 
    }
  ];

  const battleMonster = () => {
    if (!selectedTool) return;
    
    setIsBattling(true);
    setAiWorkflow([]);
    
    // Simulate AI processing workflow
    const workflow: string[] = [];
    setTimeout(() => {
      workflow.push("🔍 Scanning JSON structure for schema inconsistencies...");
      setAiWorkflow([...workflow]);
    }, 300);
    setTimeout(() => {
      workflow.push("🧠 AI analyzing nested object patterns and data types...");
      setAiWorkflow([...workflow]);
    }, 600);
    setTimeout(() => {
      workflow.push("⚡ Initializing PySpark cluster and Databricks connection...");
      setAiWorkflow([...workflow]);
    }, 1200);
    setTimeout(() => {
      workflow.push("🛠️ Executing AI-generated data transformation pipeline...");
      setAiWorkflow([...workflow]);
    }, 1800);
    
    // Final results after 3 seconds
    setTimeout(() => {
      const tool = tools.find(t => t.id === selectedTool);
      const effectiveness = tool?.effectiveness || 0;
      
      let result = "";
      let cleaned = "";
      let points = 0;
      let finalWorkflow = [...workflow];

      switch (selectedTool) {
        case "pyspark-ai-cleaner":
          result = "🏆 CRITICAL SUCCESS! PySpark AI Cleaner executed flawless ETL pipeline to Databricks!";
          cleaned = `# PySpark AI-Cleaned Dataset - Ready for Databricks
from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *

# AI-Generated Clean Schema
clean_schema = StructType([
    StructField("user_id", StringType(), False),
    StructField("name", StringType(), False),
    StructField("email", StringType(), False),
    StructField("registration_date", TimestampType(), False),
    StructField("age", IntegerType(), True),
    StructField("address_street", StringType(), True),
    StructField("address_city", StringType(), True),
    StructField("address_country", StringType(), True),
    StructField("preferences", ArrayType(StringType()), True),
    StructField("last_login", TimestampType(), True),
    StructField("device", StringType(), True)
])

# AI-Processed Clean Data
cleaned_users = [
    Row("user_001", "John Doe", "john.doe@email.com", "2023-01-15T10:30:00Z", 28, "123 Main St", "New York", "USA", ["tech", "sports"], "2023-12-01T00:00:00Z", "mobile"),
    Row("user_002", "Unknown User", "user002@placeholder.com", "2023-01-01T00:00:00Z", 25, "Unknown", "Unknown", "US", ["tech", "sports"], None, "unknown"),
    Row("user_003", "Alice Johnson", "alice@company.com", "2023-03-20T14:45:00Z", 30, "456 Oak Ave", "Los Angeles", "USA", [], "2023-11-30T08:15:00Z", "unknown"),
    Row("user_004", "Bob Smith", "bob.smith@email.com", "2023-02-10T16:20:00Z", 35, "789 Pine St", "Chicago", "USA", ["music", "travel", "food"], None, "desktop")
]

# Delta Lake Table Creation
df_clean = spark.createDataFrame(cleaned_users, clean_schema)
df_clean.write.format("delta").mode("overwrite").saveAsTable("bronze.users_cleaned")

print("✅ Data successfully loaded to Databricks Delta Lake!")`;
          finalWorkflow.push("🎯 AI detected and fixed 15+ JSON schema violations");
          finalWorkflow.push("📊 PySpark pipeline auto-scaled to process nested JSON efficiently");
          finalWorkflow.push("🏗️ Delta Lake table created with optimized partitioning strategy");
          finalWorkflow.push("🔄 Automated data quality checks passed with 100% success rate");
          points = 120;
          break;
        
        case "databricks-automl":
          result = "⚡ EXCELLENT! Databricks AutoML optimized the entire data processing workflow!";
          cleaned = `# Databricks AutoML Optimized Processing Pipeline
# Auto-generated by Databricks AI

%python
import mlflow
from databricks import automl

# AI-Optimized Data Quality Assessment
quality_summary = automl.classify(
    dataset=spark.table("raw_json_data"),
    target_col="data_quality_score",
    timeout_minutes=10
)

# AutoML-Generated Cleaning Functions
def ai_clean_json_records(df):
    # AI learned optimal cleaning strategies
    return (df
        .withColumn("user_id", 
            when(col("user_id").isNull() | (col("user_id") == ""), 
                 concat(lit("user_"), monotonically_increasing_id()))
            .otherwise(col("user_id")))
        .withColumn("email", 
            when(regexp_extract(col("email"), r"^[^@]+@[^@]+\.[^@]+$", 0) == "", 
                 concat(col("user_id"), lit("@placeholder.com")))
            .otherwise(col("email")))
        .withColumn("age", 
            when((col("profile.age") < 0) | (col("profile.age") > 120), 30)
            .otherwise(col("profile.age")))
    )

# Apply AutoML optimizations
cleaned_df = ai_clean_json_records(raw_df)
cleaned_df.write.format("delta").option("mergeSchema", "true").saveAsTable("silver.users_automl_cleaned")

print("🤖 AutoML pipeline completed with 95% accuracy!")`;
          finalWorkflow.push("🤖 AutoML analyzed 500+ data quality patterns automatically");
          finalWorkflow.push("📈 Machine learning models optimized cleaning strategies");
          finalWorkflow.push("🎯 Automated feature engineering for downstream analytics");
          finalWorkflow.push("📊 MLflow tracking enabled for pipeline monitoring");
          points = 100;
          break;
        
        case "llm-json-parser":
          result = "🧠 SMART APPROACH! LLM analyzed JSON semantics and generated robust schemas!";
          cleaned = `# LLM-Generated JSON Schema and Transformation
{
  "ai_analysis": {
    "schema_issues_detected": [
      "Missing required fields (user_id in record 4)",
      "Inconsistent data types (age as string vs integer)", 
      "Invalid email formats (missing @ symbol)",
      "Nested structure inconsistencies (address as string vs object)",
      "Date format variations (ISO vs custom formats)"
    ],
    "llm_recommendations": [
      "Standardize all dates to ISO 8601 format",
      "Implement email validation with regex patterns",
      "Convert string addresses to structured objects",
      "Add data quality scores for each record",
      "Create fallback values for missing required fields"
    ]
  },
  "cleaned_schema": {
    "type": "object",
    "properties": {
      "user_id": {"type": "string", "pattern": "^user_[0-9]+$"},
      "name": {"type": "string", "minLength": 1},
      "email": {"type": "string", "format": "email"},
      "registration_date": {"type": "string", "format": "date-time"},
      "profile": {
        "type": "object",
        "properties": {
          "age": {"type": "integer", "minimum": 0, "maximum": 120},
          "address": {
            "type": "object",
            "properties": {
              "street": {"type": "string"},
              "city": {"type": "string"},
              "country": {"type": "string", "enum": ["USA", "CA", "UK"]}
            }
          },
          "preferences": {"type": "array", "items": {"type": "string"}},
          "metadata": {"type": "object"}
        }
      }
    },
    "required": ["user_id", "name", "email", "registration_date"]
  },
  "data_quality_score": 0.95
}`;
          finalWorkflow.push("🧠 LLM analyzed semantic meaning of 50+ JSON fields");
          finalWorkflow.push("📋 Generated comprehensive validation schema with business rules");
          finalWorkflow.push("🏷️ Applied intelligent data type inference and standardization");
          finalWorkflow.push("📝 Created human-readable data quality documentation");
          points = 85;
          break;
        
        case "spark-sql-ai":
          result = "⚡ OPTIMIZED! Spark SQL AI generated high-performance transformation queries!";
          cleaned = `-- AI-Generated Spark SQL for JSON Cleaning and Optimization
-- Optimized for Databricks runtime with 3x performance improvement

WITH cleaned_users AS (
  SELECT 
    -- AI-optimized ID generation with collision detection
    CASE 
      WHEN users.id IS NULL OR users.id = '' 
      THEN CONCAT('user_', ROW_NUMBER() OVER (ORDER BY registration_date))
      ELSE users.id 
    END AS user_id,
    
    -- Smart name cleaning with ML-based validation
    CASE 
      WHEN users.name IS NULL THEN 'Unknown User'
      WHEN LENGTH(TRIM(users.name)) = 0 THEN 'Anonymous'
      ELSE INITCAP(TRIM(users.name))
    END AS name,
    
    -- Advanced email validation and correction
    CASE 
      WHEN users.email RLIKE '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' 
      THEN LOWER(users.email)
      ELSE CONCAT(REGEXP_REPLACE(LOWER(users.name), '[^a-z0-9]', ''), '@placeholder.com')
    END AS email,
    
    -- Intelligent date parsing with multiple format support
    CASE 
      WHEN users.registration_date RLIKE '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$'
      THEN TO_TIMESTAMP(users.registration_date, 'yyyy-MM-dd\\'T\\'HH:mm:ss\\'Z\\'')
      WHEN users.registration_date RLIKE '^[0-9]{4}/[0-9]{2}/[0-9]{2}'
      THEN TO_TIMESTAMP(users.registration_date, 'yyyy/MM/dd HH:mm:ss')
      ELSE CURRENT_TIMESTAMP()
    END AS registration_date,
    
    -- AI-powered nested JSON flattening and cleaning
    CASE 
      WHEN users.profile.age RLIKE '^[0-9]+$' AND CAST(users.profile.age AS INT) BETWEEN 0 AND 120
      THEN CAST(users.profile.age AS INT)
      ELSE 30  -- AI-determined optimal default age
    END AS age,
    
    -- Smart address parsing with geospatial validation
    COALESCE(users.profile.address.street, 'Unknown Address') AS address_street,
    COALESCE(users.profile.address.city, 'Unknown City') AS address_city,
    CASE 
      WHEN users.profile.address.country IN ('US', 'USA', 'United States') THEN 'USA'
      WHEN users.profile.address.country = 'CA' THEN 'Canada'
      ELSE 'Unknown'
    END AS address_country,
    
    -- Array processing with AI-based preference standardization
    CASE 
      WHEN users.profile.preferences IS NULL THEN ARRAY()
      WHEN typeof(users.profile.preferences) = 'string' 
      THEN SPLIT(users.profile.preferences, ',')
      ELSE users.profile.preferences
    END AS preferences
    
  FROM JSON_TABLE(json_data, '$.users[*]' 
    COLUMNS (
      id STRING PATH '$.id',
      name STRING PATH '$.name',
      email STRING PATH '$.email',
      registration_date STRING PATH '$.registration_date',
      NESTED PATH '$.profile' COLUMNS (
        age STRING PATH '$.age',
        NESTED PATH '$.address' COLUMNS (
          street STRING PATH '$.street',
          city STRING PATH '$.city',
          country STRING PATH '$.country'
        ),
        preferences STRING PATH '$.preferences'
      )
    )
  ) AS users
)

-- Create optimized Delta Lake table with AI-recommended partitioning
CREATE OR REPLACE TABLE gold.users_spark_ai_cleaned
USING DELTA
PARTITIONED BY (address_country)
TBLPROPERTIES ('delta.autoOptimize.optimizeWrite' = 'true')
AS SELECT * FROM cleaned_users;

-- AI-generated performance statistics
ANALYZE TABLE gold.users_spark_ai_cleaned COMPUTE STATISTICS FOR ALL COLUMNS;`;
          finalWorkflow.push("⚡ AI optimized SQL execution plan reducing processing time by 70%");
          finalWorkflow.push("🎯 Generated complex regex patterns for data validation");
          finalWorkflow.push("📊 Applied intelligent partitioning strategy for Delta Lake");
          finalWorkflow.push("🚀 Enabled auto-optimization for continuous performance improvement");
          points = 95;
          break;
        
        default:
          result = "🏗️ SOLID EXECUTION! Delta Lake AI Validator ensured schema consistency and data integrity!";
          cleaned = `# Delta Lake AI Validation and Schema Evolution
import delta
from delta.tables import DeltaTable
from pyspark.sql.functions import *

# AI-powered schema evolution with backwards compatibility
def ai_evolve_schema(target_table, new_data_df):
    """
    AI automatically evolves Delta Lake schema while maintaining data quality
    """
    
    if DeltaTable.isDeltaTable(spark, target_table):
        delta_table = DeltaTable.forPath(spark, target_table)
        
        # AI compares schemas and suggests evolution strategy
        current_schema = delta_table.toDF().schema
        new_schema = new_data_df.schema
        
        # Smart merge with conflict resolution
        delta_table.alias("target").merge(
            new_data_df.alias("source"),
            "target.user_id = source.user_id"
        ).whenMatchedUpdate(set={
            "name": "source.name",
            "email": "source.email", 
            "last_updated": "current_timestamp()"
        }).whenNotMatchedInsert(values={
            "user_id": "source.user_id",
            "name": "source.name",
            "email": "source.email",
            "data_quality_score": "0.95",
            "created_at": "current_timestamp()",
            "last_updated": "current_timestamp()"
        }).execute()
    else:
        # Create new Delta table with AI-optimized settings
        new_data_df.write.format("delta") \
            .option("mergeSchema", "true") \
            .option("autoOptimize.optimizeWrite", "true") \
            .partitionBy("registration_year") \
            .saveAsTable(target_table)

# AI Data Quality Monitoring
class AIDataQualityMonitor:
    def __init__(self, table_path):
        self.table = DeltaTable.forPath(spark, table_path)
        
    def run_ai_quality_checks(self):
        df = self.table.toDF()
        
        quality_metrics = {
            "completeness": df.count() / df.select("*").count(),
            "email_validity": df.filter(col("email").rlike("@")).count() / df.count(),
            "age_reasonableness": df.filter((col("age") >= 0) & (col("age") <= 120)).count() / df.count(),
            "duplicate_rate": 1 - (df.dropDuplicates(["user_id"]).count() / df.count())
        }
        
        return quality_metrics

# Execute AI validation pipeline
monitor = AIDataQualityMonitor("delta_lake_path/users")
quality_results = monitor.run_ai_quality_checks()
print(f"✅ AI Quality Score: {sum(quality_results.values()) / len(quality_results):.2%}")`;
          finalWorkflow.push("🏗️ AI automatically evolved Delta Lake schema with zero downtime");
          finalWorkflow.push("📊 Implemented intelligent data versioning and rollback capabilities");
          finalWorkflow.push("🔍 Continuous AI monitoring for data drift and quality degradation");
          finalWorkflow.push("⚙️ Auto-compaction and optimization based on usage patterns");
          points = 80;
      }

      finalWorkflow.push("🎉 JSON ETL pipeline completed and loaded to Databricks!");
      setAiWorkflow(finalWorkflow);
      setBattleResult(result);
      setCleanedDataset(cleaned);
      setHasWon(effectiveness > 70);
      onScoreUpdate(points);
      setIsBattling(false);
    }, 3000);
  };

  const resetBattle = () => {
    setSelectedTool("");
    setBattleResult("");
    setHasWon(false);
    setCleanedDataset("");
    setAiWorkflow([]);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-red-900/20 border-red-500">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="text-red-400" />
            🐉 JSON Data Monster Emerges!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-200 mb-4">
            **Your Mission:** Choose the right AI-powered tool to clean the corrupted JSON dataset and automate the PySpark ETL pipeline to Databricks!
          </p>
          <div className="bg-gray-900/60 p-4 rounded-lg border border-gray-600 overflow-auto max-h-96">
            <pre className="text-green-300 text-sm font-mono whitespace-pre-wrap">
              {corruptedJsonDataset}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-900/20 border-blue-500">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="text-yellow-400" />
            Choose Your PySpark AI Weapon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedTool} onValueChange={setSelectedTool}>
            <SelectTrigger className="bg-black/50 border-gray-500 text-white hover:bg-black/70">
              <SelectValue placeholder="Select an AI tool for JSON processing and Databricks automation..." />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-600">
              {tools.map((tool) => (
                <SelectItem key={tool.id} value={tool.id} className="text-white hover:bg-gray-800">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between w-full">
                      {tool.name}
                      <Badge variant="outline" className="ml-2 border-green-400 text-green-400">
                        {tool.effectiveness}% effective
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{tool.description}</p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            onClick={battleMonster} 
            disabled={!selectedTool || isBattling}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold border-0"
            size="lg"
          >
            {isBattling ? (
              <>
                <Cog className="animate-spin mr-2" size={20} />
                ⚔️ AI Processing JSON...
              </>
            ) : (
              <>
                <Sparkles className="mr-2" size={20} />
                ⚔️ Execute PySpark AI Pipeline!
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* AI Workflow Display */}
      {aiWorkflow.length > 0 && (
        <Card className="bg-green-900/20 border-green-500">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="text-green-400" />
              🤖 PySpark AI Pipeline in Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {aiWorkflow.map((step, index) => (
                <div key={index} className="flex items-center gap-2 text-green-200 animate-fade-in">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  {step}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show cleaned dataset */}
      {cleanedDataset && (
        <Card className="bg-green-900/20 border-green-500">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="text-green-400" />
              ✨ AI-Generated PySpark Code & Clean Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900/60 p-4 rounded-lg border border-gray-600 overflow-auto max-h-96">
              <pre className="text-green-300 text-sm font-mono whitespace-pre-wrap">
                {cleanedDataset}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {battleResult && (
        <BattleResult 
          result={battleResult} 
          hasWon={hasWon} 
          onReset={resetBattle}
        />
      )}

      {hasWon && (
        <Alert className="bg-green-900/20 border-green-500">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-200">
            ✅ Victory! You've learned how AI automates complex JSON ETL pipelines and PySpark processing for modern data platforms like Databricks!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default JsonBattleMode;
