
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, CheckCircle } from "lucide-react";
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

  const corruptedDataset = `name,age,salary,join_date
Alice,,52000,2023/01/12
Bob,27,NA,2023-02-15
Charlie,29,57000,2023-15-01
,34,60000,2023-03-05
David,32,abc,2023/03/10`;

  const tools = [
    { id: "llm-schema", name: "🧠 LLM Schema Generator", effectiveness: 85 },
    { id: "gpt-cleaner", name: "🧹 GPT-4 Cleaner", effectiveness: 95 },
    { id: "anomaly-detector", name: "🔍 Anomaly Detector", effectiveness: 75 },
    { id: "regex-warrior", name: "🧬 Regex Warrior", effectiveness: 60 },
    { id: "column-combiner", name: "🤖 Column Combiner", effectiveness: 70 }
  ];

  const battleMonster = () => {
    if (!selectedTool) return;
    
    setIsBattling(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const tool = tools.find(t => t.id === selectedTool);
      const effectiveness = tool?.effectiveness || 0;
      
      let result = "";
      let cleanedData = "";
      let points = 0;

      switch (selectedTool) {
        case "gpt-cleaner":
          result = "🏆 CRITICAL HIT! GPT-4 Cleaner successfully identified and fixed all data issues!";
          cleanedData = `name,age,salary,join_date
Alice,25,52000,2023-01-12
Bob,27,55000,2023-02-15
Charlie,29,57000,2023-01-15
John,34,60000,2023-03-05
David,32,58000,2023-03-10`;
          points = 100;
          break;
        
        case "llm-schema":
          result = "⚡ EFFECTIVE STRIKE! LLM Schema Generator created a robust schema and fixed most issues!";
          cleanedData = `name,age,salary,join_date
Alice,NULL,52000,2023-01-12
Bob,27,NULL,2023-02-15
Charlie,29,57000,2023-01-15
NULL,34,60000,2023-03-05
David,32,NULL,2023-03-10`;
          points = 80;
          break;
        
        case "anomaly-detector":
          result = "🎯 GOOD HIT! Anomaly Detector found suspicious patterns but needs human review!";
          cleanedData = `name,age,salary,join_date
Alice,[FLAGGED],52000,2023-01-12
Bob,27,[FLAGGED],2023-02-15
Charlie,29,57000,[FLAGGED]
[FLAGGED],34,60000,2023-03-05
David,32,[FLAGGED],2023-03-10`;
          points = 60;
          break;
        
        default:
          result = "💥 MINOR DAMAGE! This tool helped but wasn't optimal for this data corruption type!";
          cleanedData = corruptedDataset;
          points = 30;
      }

      setBattleResult(result);
      setHasWon(effectiveness > 70);
      onScoreUpdate(points);
      setIsBattling(false);
    }, 2000);
  };

  const resetBattle = () => {
    setSelectedTool("");
    setBattleResult("");
    setHasWon(false);
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
            <SelectTrigger className="bg-black/30 border-gray-600 text-white">
              <SelectValue placeholder="Select an AI tool to battle the corruption..." />
            </SelectTrigger>
            <SelectContent>
              {tools.map((tool) => (
                <SelectItem key={tool.id} value={tool.id}>
                  <div className="flex items-center justify-between w-full">
                    {tool.name}
                    <Badge variant="outline" className="ml-2">
                      {tool.effectiveness}% effective
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            onClick={battleMonster} 
            disabled={!selectedTool || isBattling}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="lg"
          >
            {isBattling ? "⚔️ Battling..." : "⚔️ Attack the Data Monster!"}
          </Button>
        </CardContent>
      </Card>

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
            ✅ Victory! You've learned how AI tools can automate complex data cleaning tasks that would take hours manually!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default BattleMode;
