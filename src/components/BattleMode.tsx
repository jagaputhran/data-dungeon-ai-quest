
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

  const corruptedDataset = `name,age,salary,join_date
Alice,,52000,2023/01/12
Bob,27,NA,2023-02-15
Charlie,29,57000,2023-15-01
,34,60000,2023-03-05
David,32,abc,2023/03/10`;

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
    setTimeout(() => workflow.push("🔍 Scanning dataset for anomalies..."), 300);
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
          result = "🏆 CRITICAL HIT! GPT-4 Cleaner successfully identified and fixed all data issues!";
          cleaned = `name,age,salary,join_date
Alice,25,52000,2023-01-12
Bob,27,55000,2023-02-15
Charlie,29,57000,2023-01-15
John Doe,34,60000,2023-03-05
David,32,58000,2023-03-10`;
          finalWorkflow.push("✅ GPT-4 inferred missing values using contextual understanding");
          finalWorkflow.push("🎯 Fixed date formats and salary inconsistencies");
          points = 100;
          break;
        
        case "llm-schema":
          result = "⚡ EFFECTIVE STRIKE! LLM Schema Generator created robust validation rules!";
          cleaned = `name,age,salary,join_date
Alice,NULL,52000,2023-01-12
Bob,27,NULL,2023-02-15
Charlie,29,57000,2023-01-15
MISSING_NAME,34,60000,2023-03-05
David,32,INVALID_SALARY,2023-03-10`;
          finalWorkflow.push("📋 Generated data schema with validation rules");
          finalWorkflow.push("🏷️ Standardized NULL values and flagged issues");
          points = 80;
          break;
        
        case "anomaly-detector":
          result = "🎯 GOOD HIT! Anomaly Detector flagged suspicious patterns for review!";
          cleaned = `name,age,salary,join_date
Alice,[ANOMALY:MISSING_AGE],52000,2023-01-12
Bob,27,[ANOMALY:NA_SALARY],2023-02-15
Charlie,29,57000,[ANOMALY:INVALID_DATE]
[ANOMALY:MISSING_NAME],34,60000,2023-03-05
David,32,[ANOMALY:TEXT_IN_SALARY],2023-03-10`;
          finalWorkflow.push("🚨 ML models detected 5 data anomalies");
          finalWorkflow.push("📊 Statistical analysis flagged outliers");
          points = 60;
          break;
        
        case "regex-warrior":
          result = "💥 MINOR DAMAGE! Regex patterns fixed some formatting issues!";
          cleaned = `name,age,salary,join_date
Alice,,52000,2023-01-12
Bob,27,NA,2023-02-15
Charlie,29,57000,2023-01-15
,34,60000,2023-03-05
David,32,abc,2023-03-10`;
          finalWorkflow.push("🔧 Applied regex patterns for date standardization");
          finalWorkflow.push("⚠️ Limited success - complex issues require AI");
          points = 30;
          break;
        
        default:
          result = "🤖 COMBO ATTACK! Column Combiner merged related fields!";
          cleaned = `name,age,salary,join_date
Alice_MERGED,,52000,2023-01-12
Bob_MERGED,27,NA_FIXED,2023-02-15
Charlie_MERGED,29,57000,2023-01-15
UNKNOWN_MERGED,34,60000,2023-03-05
David_MERGED,32,abc_FLAGGED,2023-03-10`;
          finalWorkflow.push("🔗 AI combined name fields with status indicators");
          finalWorkflow.push("🛡️ Added data quality flags");
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
