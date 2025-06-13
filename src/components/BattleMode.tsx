
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, CheckCircle, Brain, Cog, Sparkles } from "lucide-react";
import DatasetDisplay from "./DatasetDisplay";
import BattleResult from "./BattleResult";

interface BattleModeProps {
  onScoreUpdate: (points: number) => void;
}

const BattleMode = ({ onScoreUpdate }: BattleModeProps) => {
  const [selectedTool, setSelectedTool] = useState("");
  const [battleResult, setBattleResult] = useState("");
  const [isBattling, setIsBattling] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [cleanedDataset, setCleanedDataset] = useState("");
  const [aiWorkflow, setAiWorkflow] = useState<string[]>([]);

  const corruptedDataset = `name,age,salary,join_date,department,email
Alice Smith,,52000,2023/01/12,Engineering,alice@company
Bob Johnson,27,NA,2023-02-15,hr,bob@comp.com
Charlie Brown,29,57000,2023-15-01,Marketing,CHARLIE@COMPANY.COM
,34,60000,2023-03-05,Sales,invalid-email
David Wilson,32,abc,2023/03/10,engineering,david.wilson@company.com
Emma Davis,twenty-five,45000,01/04/2023,Finance,emma@
Frank Miller,45,NULL,2023/04/20,Engineering,frank..miller@company.com
Grace Lee,null,75000,2023-05-30,HR,grace@company.org
Henry Brown,-5,80000,invalid-date,Marketing,henry@company.com
Iris Johnson,150,90000,2023/07/10,Unknown Dept,iris@company.com`;

  const tools = [
    { id: "llm-schema", name: "🧠 LLM Schema Generator", effectiveness: 85, description: "AI analyzes patterns and generates schemas" },
    { id: "gpt-cleaner", name: "🧹 GPT-4 Cleaner", effectiveness: 95, description: "Advanced language model fixes complex data issues" },
    { id: "anomaly-detector", name: "🔍 Anomaly Detector", effectiveness: 75, description: "ML algorithms identify unusual patterns" },
    { id: "regex-warrior", name: "🧬 Regex Warrior", effectiveness: 60, description: "Pattern matching for structured fixes" },
    { id: "column-combiner", name: "🤖 Column Combiner", effectiveness: 70, description: "AI merges and standardizes columns" }
  ];

  const battleMonster = () => {
    if (!selectedTool) return;
    
    setIsBattling(true);
    setAiWorkflow([]);
    
    // Simulate AI processing workflow
    const workflow: string[] = [];
    setTimeout(() => {
      workflow.push("🔍 Scanning dataset for anomalies...");
      setAiWorkflow([...workflow]);
    }, 300);
    setTimeout(() => {
      workflow.push("🧠 AI analyzing data patterns...");
      setAiWorkflow([...workflow]);
    }, 600);
    setTimeout(() => {
      workflow.push("⚡ Applying ML transformations...");
      setAiWorkflow([...workflow]);
    }, 1200);
    setTimeout(() => {
      workflow.push("🛠️ Executing data cleaning pipeline...");
      setAiWorkflow([...workflow]);
    }, 1800);
    
    // Final results after 2.5 seconds
    setTimeout(() => {
      const tool = tools.find(t => t.id === selectedTool);
      const effectiveness = tool?.effectiveness || 0;
      
      let result = "";
      let cleaned = "";
      let points = 0;
      let finalWorkflow = [...workflow];

      switch (selectedTool) {
        case "gpt-cleaner":
          result = "🏆 CRITICAL HIT! GPT-4 Cleaner successfully identified and fixed all data issues using contextual AI!";
          cleaned = `name,age,salary,join_date,department,email
Alice Smith,28,52000,2023-01-12,Engineering,alice@company.com
Bob Johnson,27,55000,2023-02-15,HR,bob@company.com
Charlie Brown,29,57000,2023-01-15,Marketing,charlie@company.com
John Doe,34,60000,2023-03-05,Sales,john.doe@company.com
David Wilson,32,58000,2023-03-10,Engineering,david.wilson@company.com
Emma Davis,25,45000,2023-04-01,Finance,emma@company.com
Frank Miller,45,62000,2023-04-20,Engineering,frank.miller@company.com
Grace Lee,30,75000,2023-05-30,HR,grace@company.com
Henry Brown,35,80000,2023-06-15,Marketing,henry@company.com
Iris Johnson,28,90000,2023-07-10,Sales,iris@company.com`;
          finalWorkflow.push("✅ GPT-4 inferred missing values using contextual understanding");
          finalWorkflow.push("🎯 Fixed date formats, email validation, and department standardization");
          finalWorkflow.push("🧠 Used natural language processing to correct text-based data");
          points = 100;
          break;
        
        case "llm-schema":
          result = "⚡ EFFECTIVE STRIKE! LLM Schema Generator created robust validation rules and standardized formats!";
          cleaned = `name,age,salary,join_date,department,email
Alice Smith,MISSING_AGE,52000,2023-01-12,Engineering,alice@company.com
Bob Johnson,27,INVALID_SALARY,2023-02-15,HR,bob@company.com
Charlie Brown,29,57000,INVALID_DATE,Marketing,INVALID_EMAIL
MISSING_NAME,34,60000,2023-03-05,Sales,INVALID_EMAIL
David Wilson,32,INVALID_SALARY,2023-03-10,Engineering,david.wilson@company.com
Emma Davis,INVALID_AGE,45000,2023-04-01,Finance,INVALID_EMAIL
Frank Miller,45,NULL,2023-04-20,Engineering,INVALID_EMAIL
Grace Lee,NULL,75000,2023-05-30,HR,grace@company.com
Henry Brown,INVALID_AGE,80000,INVALID_DATE,Marketing,henry@company.com
Iris Johnson,AGE_OUTLIER,90000,2023-07-10,UNKNOWN_DEPT,iris@company.com`;
          finalWorkflow.push("📋 Generated comprehensive data schema with validation rules");
          finalWorkflow.push("🏷️ Standardized NULL values and flagged constraint violations");
          finalWorkflow.push("📊 Applied data type validation and business rule checks");
          points = 80;
          break;
        
        case "anomaly-detector":
          result = "🎯 GOOD HIT! Anomaly Detector used statistical ML to flag suspicious patterns!";
          cleaned = `name,age,salary,join_date,department,email
Alice Smith,[ANOMALY:MISSING_AGE],52000,2023-01-12,Engineering,alice@company.com
Bob Johnson,27,[ANOMALY:NA_SALARY],2023-02-15,HR,bob@company.com
Charlie Brown,29,57000,[ANOMALY:INVALID_DATE_FORMAT],Marketing,[ANOMALY:UPPERCASE_EMAIL]
[ANOMALY:MISSING_NAME],34,60000,2023-03-05,Sales,[ANOMALY:INVALID_EMAIL_FORMAT]
David Wilson,32,[ANOMALY:TEXT_IN_NUMERIC],2023-03-10,Engineering,david.wilson@company.com
Emma Davis,[ANOMALY:TEXT_AGE],45000,2023-04-01,Finance,[ANOMALY:INCOMPLETE_EMAIL]
Frank Miller,45,[ANOMALY:NULL_VALUE],2023-04-20,Engineering,[ANOMALY:DOUBLE_DOT_EMAIL]
Grace Lee,[ANOMALY:NULL_VALUE],75000,2023-05-30,HR,grace@company.com
Henry Brown,[ANOMALY:NEGATIVE_AGE],80000,[ANOMALY:INVALID_DATE],Marketing,henry@company.com
Iris Johnson,[ANOMALY:AGE_OUTLIER],90000,2023-07-10,[ANOMALY:UNKNOWN_DEPARTMENT],iris@company.com`;
          finalWorkflow.push("🚨 ML models detected 15+ data anomalies using statistical analysis");
          finalWorkflow.push("📊 Applied z-score and isolation forest algorithms");
          finalWorkflow.push("🔍 Flagged outliers, format inconsistencies, and missing values");
          points = 60;
          break;
        
        case "regex-warrior":
          result = "💥 PARTIAL SUCCESS! Regex Warrior applied pattern matching with limited scope!";
          cleaned = `name,age,salary,join_date,department,email
Alice Smith,,52000,2023-01-12,Engineering,alice@company.com
Bob Johnson,27,NA,2023-02-15,HR,bob@company.com
Charlie Brown,29,57000,2023-01-15,Marketing,charlie@company.com
,34,60000,2023-03-05,Sales,invalid-email
David Wilson,32,abc,2023-03-10,Engineering,david.wilson@company.com
Emma Davis,twenty-five,45000,2023-04-01,Finance,emma@company.com
Frank Miller,45,NULL,2023-04-20,Engineering,frank.miller@company.com
Grace Lee,null,75000,2023-05-30,HR,grace@company.com
Henry Brown,-5,80000,invalid-date,Marketing,henry@company.com
Iris Johnson,150,90000,2023-07-10,Unknown Dept,iris@company.com`;
          finalWorkflow.push("🔧 Applied regex pattern: /\\d{4}[-/]\\d{2}[-/]\\d{2}/ for date standardization");
          finalWorkflow.push("📧 Used pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/ for email validation");
          finalWorkflow.push("🏢 Applied pattern: /^[A-Z][a-z]+$/ for department name standardization");
          finalWorkflow.push("⚠️ Limited success - regex cannot handle semantic data issues");
          points = 30;
          break;
        
        default:
          result = "🤖 COMBO ATTACK! Column Combiner merged and standardized related fields using AI!";
          cleaned = `full_profile,contact_info,employment_details
Alice Smith_AGE_MISSING_DEPT_Engineering,alice@company.com_VERIFIED,52000_2023-01-12_VALID
Bob Johnson_27_DEPT_HR,bob@company.com_VERIFIED,SALARY_NA_2023-02-15_PARTIAL
Charlie Brown_29_DEPT_Marketing,charlie@company.com_CASE_ISSUE,57000_DATE_INVALID_FLAGGED
MISSING_NAME_34_DEPT_Sales,INVALID_EMAIL_FLAGGED,60000_2023-03-05_VALID
David Wilson_32_DEPT_Engineering,david.wilson@company.com_VERIFIED,SALARY_TEXT_2023-03-10_FLAGGED
Emma Davis_AGE_TEXT_DEPT_Finance,emma@company.com_INCOMPLETE,45000_2023-04-01_VALID
Frank Miller_45_DEPT_Engineering,frank.miller@company.com_DOUBLE_DOT,NULL_SALARY_2023-04-20_PARTIAL
Grace Lee_NULL_AGE_DEPT_HR,grace@company.com_VERIFIED,75000_2023-05-30_VALID
Henry Brown_NEGATIVE_AGE_DEPT_Marketing,henry@company.com_VERIFIED,80000_DATE_INVALID_FLAGGED
Iris Johnson_AGE_OUTLIER_DEPT_UNKNOWN,iris@company.com_VERIFIED,90000_2023-07-10_PARTIAL`;
          finalWorkflow.push("🔗 AI combined personal info (name + age + department) into full_profile");
          finalWorkflow.push("📧 Merged email with validation status into contact_info");
          finalWorkflow.push("💼 Combined salary + date + validation into employment_details");
          finalWorkflow.push("🛡️ Added comprehensive data quality flags for each field");
          points = 50;
      }

      finalWorkflow.push("🎉 Data cleaning workflow completed!");
      setAiWorkflow(finalWorkflow);
      setBattleResult(result);
      setCleanedDataset(cleaned);
      setHasWon(effectiveness > 70);
      onScoreUpdate(points);
      setIsBattling(false);
    }, 2500);
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
            🐉 Data Monster Appears!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-200 mb-4">
            **Your Mission:** Choose the right AI-powered tool to fix the corrupted dataset below and defeat the monster!
          </p>
          <DatasetDisplay data={corruptedDataset} title="Corrupted Dataset" />
        </CardContent>
      </Card>

      <Card className="bg-blue-900/20 border-blue-500">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="text-yellow-400" />
            Choose Your AI Weapon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedTool} onValueChange={setSelectedTool}>
            <SelectTrigger className="bg-black/50 border-gray-500 text-white hover:bg-black/70">
              <SelectValue placeholder="Select an AI tool to battle the corruption..." />
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
                ⚔️ AI Battling...
              </>
            ) : (
              <>
                <Sparkles className="mr-2" size={20} />
                ⚔️ Attack the Data Monster!
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
              🤖 AI Workflow in Progress
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
              ✨ AI-Cleaned Dataset
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DatasetDisplay data={cleanedDataset} title="After AI Processing" />
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
            ✅ Victory! You've learned how AI automates complex data workflows that traditionally required manual intervention!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default BattleMode;
