
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import BattleMode from "@/components/BattleMode";
import Scoreboard from "@/components/Scoreboard";
import LearningResources from "@/components/LearningResources";
import { Sword, Brain, Database } from "lucide-react";

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
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-4">
            <Sword className="text-yellow-400" size={48} />
            Data Dungeon: Clean or Corrupt?
            <Database className="text-cyan-400" size={48} />
          </h1>
          <p className="text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            Fight data chaos in the realm of automation! In this AI-powered game, you battle corrupted datasets using intelligent tools like schema generators, anomaly detectors, and GPT cleaners. Each win teaches you a key lesson in modern data engineering.
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
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="battle" className="text-lg">
                  🎮 Battle Mode
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
