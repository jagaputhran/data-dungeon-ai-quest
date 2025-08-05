
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import BattleMode from "@/components/BattleMode";
import JsonBattleMode from "@/components/JsonBattleMode";
import Scoreboard from "@/components/Scoreboard";
import LearningResources from "@/components/LearningResources";
import EtlGameMode from "@/components/EtlGameMode";
import AiOpsArena from "@/components/AiOpsArena";
import WorkflowBuilder from "@/components/WorkflowBuilder";
import { Sword, Brain, Database, FileJson, Workflow, Zap, GitBranch } from "lucide-react";

const Index = () => {
  const [totalScore, setTotalScore] = useState(0);
  const [battlesWon, setBattlesWon] = useState(0);

  const updateScore = (points: number) => {
    setTotalScore(prev => prev + points);
    setBattlesWon(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-4 animate-fade-in">
            <Zap className="text-yellow-400 animate-bounce" size={48} />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              Agent JAGA: Train, Think, Act — The Agentic AI Way
            </span>
            <Workflow className="text-cyan-400 animate-bounce animation-delay-75" size={48} />
          </h1>
          <p className="text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            Master the complete data engineering ecosystem! Battle corrupted datasets, orchestrate ETL pipelines, deploy AI operations, and build intelligent workflows. Each challenge teaches you cutting-edge automation skills with real-world scenarios.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Brain className="mr-2" size={20} />
              AI-Powered Learning
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 text-white border-white">
              Score: {totalScore} XP
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 text-white border-white">
              Battles Won: {battlesWon}
            </Badge>
          </div>
        </div>

        {/* Game Interface */}
        <Card className="bg-black/20 backdrop-blur-sm border-gray-600">
          <CardContent className="p-6">
            <Tabs defaultValue="battle" className="w-full">
              <TabsList className="grid w-full grid-cols-7 mb-6">
                <TabsTrigger value="battle" className="text-lg">
                  🎮 CSV Battle
                </TabsTrigger>
                <TabsTrigger value="json-battle" className="text-lg">
                  <FileJson className="mr-1" size={16} />
                  JSON Battle
                </TabsTrigger>
                <TabsTrigger value="etl-game" className="text-lg">
                  <Workflow className="mr-1" size={16} />
                  ETL Ops
                </TabsTrigger>
                <TabsTrigger value="aiops" className="text-lg">
                  <Zap className="mr-1" size={16} />
                  AI Ops
                </TabsTrigger>
                <TabsTrigger value="workflow" className="text-lg">
                  <GitBranch className="mr-1" size={16} />
                  Workflow
                </TabsTrigger>
                <TabsTrigger value="scoreboard" className="text-lg">
                  🏆 Scoreboard
                </TabsTrigger>
                <TabsTrigger value="learn" className="text-lg">
                  📚 Learn Automation
                </TabsTrigger>
              </TabsList>

              <TabsContent value="battle">
                <BattleMode onScoreUpdate={updateScore} />
              </TabsContent>

              <TabsContent value="json-battle">
                <JsonBattleMode onScoreUpdate={updateScore} />
              </TabsContent>

              <TabsContent value="etl-game">
                <EtlGameMode onScoreUpdate={updateScore} />
              </TabsContent>

              <TabsContent value="aiops">
                <AiOpsArena onScoreUpdate={updateScore} />
              </TabsContent>

              <TabsContent value="workflow">
                <WorkflowBuilder onScoreUpdate={updateScore} />
              </TabsContent>

              <TabsContent value="scoreboard">
                <Scoreboard totalScore={totalScore} battlesWon={battlesWon} />
              </TabsContent>

              <TabsContent value="learn">
                <LearningResources />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
