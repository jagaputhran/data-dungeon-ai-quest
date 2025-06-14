
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, BookOpen, Database, Zap, Star, Award, Medal } from "lucide-react";

interface ScoreboardProps {
  totalScore: number;
  battlesWon: number;
}

const Scoreboard = ({ totalScore, battlesWon }: ScoreboardProps) => {
  const level = Math.floor(totalScore / 100) + 1;
  const progressToNextLevel = (totalScore % 100);

  const achievements = [
    { name: "First Strike", description: "Win your first battle", unlocked: battlesWon >= 1, icon: "⚔️", color: "from-red-500 to-orange-500" },
    { name: "Data Warrior", description: "Win 3 battles", unlocked: battlesWon >= 3, icon: "🛡️", color: "from-blue-500 to-cyan-500" },
    { name: "AI Master", description: "Reach 500 XP", unlocked: totalScore >= 500, icon: "🧠", color: "from-purple-500 to-pink-500" },
    { name: "Corruption Slayer", description: "Win 10 battles", unlocked: battlesWon >= 10, icon: "🏆", color: "from-yellow-500 to-amber-500" }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Card with Better Contrast */}
      <Card className="relative overflow-hidden bg-gray-900/95 border-2 border-cyan-400/60 shadow-2xl">
        <CardHeader className="relative">
          <CardTitle className="text-white flex items-center gap-3 text-2xl">
            <div className="p-2 bg-cyan-500/20 rounded-lg backdrop-blur-sm border border-cyan-400/30">
              <BookOpen className="text-cyan-300" size={32} />
            </div>
            Knowledge Command Center
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center group cursor-pointer transform transition-all duration-300 hover:scale-105">
              <div className="bg-gray-800/80 rounded-xl p-6 border-2 border-cyan-400/40 backdrop-blur-sm hover:border-cyan-400/60 transition-all">
                <div className="text-4xl font-bold text-cyan-300">
                  {totalScore}
                </div>
                <div className="text-gray-200 flex items-center justify-center gap-1 mt-2">
                  <Zap size={16} className="text-cyan-400" />
                  Total XP
                </div>
              </div>
            </div>
            <div className="text-center group cursor-pointer transform transition-all duration-300 hover:scale-105">
              <div className="bg-gray-800/80 rounded-xl p-6 border-2 border-green-400/40 backdrop-blur-sm hover:border-green-400/60 transition-all">
                <div className="text-4xl font-bold text-green-300">
                  {battlesWon}
                </div>
                <div className="text-gray-200 flex items-center justify-center gap-1 mt-2">
                  <Trophy size={16} className="text-green-400" />
                  Battles Won
                </div>
              </div>
            </div>
            <div className="text-center group cursor-pointer transform transition-all duration-300 hover:scale-105">
              <div className="bg-gray-800/80 rounded-xl p-6 border-2 border-yellow-400/40 backdrop-blur-sm hover:border-yellow-400/60 transition-all">
                <div className="text-4xl font-bold text-yellow-300">
                  {level}
                </div>
                <div className="text-gray-200 flex items-center justify-center gap-1 mt-2">
                  <Star size={16} className="text-yellow-400" />
                  AI Level
                </div>
              </div>
            </div>
            <div className="text-center group cursor-pointer transform transition-all duration-300 hover:scale-105">
              <div className="bg-gray-800/80 rounded-xl p-6 border-2 border-purple-400/40 backdrop-blur-sm hover:border-purple-400/60 transition-all">
                <div className="text-4xl font-bold text-purple-300">
                  {achievements.filter(a => a.unlocked).length}
                </div>
                <div className="text-gray-200 flex items-center justify-center gap-1 mt-2">
                  <Award size={16} className="text-purple-400" />
                  Achievements
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-white">
              <span className="flex items-center gap-2">
                <Database className="text-cyan-400" size={20} />
                Progress to Level {level + 1}
              </span>
              <span className="font-mono bg-gray-800/80 px-3 py-1 rounded text-cyan-300 border border-cyan-400/30">
                {progressToNextLevel}/100 XP
              </span>
            </div>
            <div className="relative">
              <Progress value={progressToNextLevel} className="h-4 bg-gray-800/80" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Achievements Card */}
      <Card className="relative overflow-hidden bg-gray-900/95 border-2 border-yellow-400/60 shadow-2xl">
        <CardHeader className="relative">
          <CardTitle className="text-white flex items-center gap-3 text-2xl">
            <div className="p-2 bg-yellow-500/20 rounded-lg backdrop-blur-sm border border-yellow-400/30">
              <Trophy className="text-yellow-300" size={32} />
            </div>
            Achievement Gallery
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid gap-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className={`relative overflow-hidden rounded-xl p-4 border-2 transition-all duration-500 transform hover:scale-[1.02] ${
                  achievement.unlocked 
                    ? 'bg-gray-800/80 border-green-400/60 shadow-lg' 
                    : 'bg-gray-800/60 border-gray-600/60'
                }`}
              >
                {achievement.unlocked && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10 animate-pulse"></div>
                )}
                <div className="relative flex items-center gap-4">
                  <div className={`text-4xl transform transition-all duration-300 ${achievement.unlocked ? 'animate-bounce' : 'grayscale opacity-60'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold text-lg ${achievement.unlocked ? 'text-green-300' : 'text-gray-400'}`}>
                      {achievement.name}
                    </h4>
                    <p className={`text-sm ${achievement.unlocked ? 'text-gray-200' : 'text-gray-500'}`}>{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600/80 text-white border border-green-400/30 shadow-lg">
                        <Medal size={16} className="mr-1" />
                        Unlocked!
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Learning Objectives */}
      <Card className="relative overflow-hidden bg-gray-900/95 border-2 border-blue-400/60 shadow-2xl">
        <CardHeader className="relative">
          <CardTitle className="text-white flex items-center gap-3 text-2xl">
            <div className="p-2 bg-blue-500/20 rounded-lg backdrop-blur-sm border border-blue-400/30">
              <Database className="text-blue-300" size={32} />
            </div>
            Learning Milestones
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-4">
            <div className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
              battlesWon >= 1 ? 'bg-gray-800/80 border-green-400/60' : 'bg-gray-800/60 border-gray-600/60'
            }`}>
              <div className={`p-2 rounded-lg border ${battlesWon >= 1 ? 'bg-green-500/20 border-green-400/30' : 'bg-gray-700/40 border-gray-600/30'}`}>
                <Zap className={battlesWon >= 1 ? 'text-green-300' : 'text-gray-500'} size={24} />
              </div>
              <span className={`text-lg ${battlesWon >= 1 ? 'text-green-200' : 'text-gray-400'}`}>
                Understand AI-powered data cleaning
              </span>
              {battlesWon >= 1 && <Badge className="ml-auto bg-green-600/80 text-white border border-green-400/30">✓ Complete</Badge>}
            </div>
            <div className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
              battlesWon >= 3 ? 'bg-gray-800/80 border-green-400/60' : 'bg-gray-800/60 border-gray-600/60'
            }`}>
              <div className={`p-2 rounded-lg border ${battlesWon >= 3 ? 'bg-green-500/20 border-green-400/30' : 'bg-gray-700/40 border-gray-600/30'}`}>
                <Zap className={battlesWon >= 3 ? 'text-green-300' : 'text-gray-500'} size={24} />
              </div>
              <span className={`text-lg ${battlesWon >= 3 ? 'text-green-200' : 'text-gray-400'}`}>
                Compare different AI tool effectiveness
              </span>
              {battlesWon >= 3 && <Badge className="ml-auto bg-green-600/80 text-white border border-green-400/30">✓ Complete</Badge>}
            </div>
            <div className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
              totalScore >= 300 ? 'bg-gray-800/80 border-green-400/60' : 'bg-gray-800/60 border-gray-600/60'
            }`}>
              <div className={`p-2 rounded-lg border ${totalScore >= 300 ? 'bg-green-500/20 border-green-400/30' : 'bg-gray-700/40 border-gray-600/30'}`}>
                <Zap className={totalScore >= 300 ? 'text-green-300' : 'text-gray-500'} size={24} />
              </div>
              <span className={`text-lg ${totalScore >= 300 ? 'text-green-200' : 'text-gray-400'}`}>
                Recognize automation opportunities in data pipelines
              </span>
              {totalScore >= 300 && <Badge className="ml-auto bg-green-600/80 text-white border border-green-400/30">✓ Complete</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scoreboard;
