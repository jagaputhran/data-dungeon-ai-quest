
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
      {/* Main Stats Card with Animated Background */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-indigo-900/40 border-2 border-purple-500/50 shadow-2xl">
        <CardHeader className="relative">
          <CardTitle className="text-white flex items-center gap-3 text-2xl">
            <div className="p-2 bg-purple-500/20 rounded-lg backdrop-blur-sm">
              <BookOpen className="text-purple-400" size={32} />
            </div>
            Knowledge Command Center
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center group cursor-pointer transform transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-6 border border-cyan-500/30 backdrop-blur-sm">
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {totalScore}
                </div>
                <div className="text-gray-300 flex items-center justify-center gap-1 mt-2">
                  <Zap size={16} className="text-cyan-400" />
                  Total XP
                </div>
              </div>
            </div>
            <div className="text-center group cursor-pointer transform transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30 backdrop-blur-sm">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {battlesWon}
                </div>
                <div className="text-gray-300 flex items-center justify-center gap-1 mt-2">
                  <Trophy size={16} className="text-green-400" />
                  Battles Won
                </div>
              </div>
            </div>
            <div className="text-center group cursor-pointer transform transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30 backdrop-blur-sm">
                <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  {level}
                </div>
                <div className="text-gray-300 flex items-center justify-center gap-1 mt-2">
                  <Star size={16} className="text-yellow-400" />
                  AI Level
                </div>
              </div>
            </div>
            <div className="text-center group cursor-pointer transform transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30 backdrop-blur-sm">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {achievements.filter(a => a.unlocked).length}
                </div>
                <div className="text-gray-300 flex items-center justify-center gap-1 mt-2">
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
                <Database className="text-blue-400" size={20} />
                Progress to Level {level + 1}
              </span>
              <span className="font-mono bg-black/30 px-2 py-1 rounded text-cyan-400">
                {progressToNextLevel}/100 XP
              </span>
            </div>
            <div className="relative">
              <Progress value={progressToNextLevel} className="h-4 bg-black/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Achievements Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-900/30 via-orange-900/30 to-amber-900/30 border-2 border-yellow-500/50 shadow-2xl">
        <CardHeader className="relative">
          <CardTitle className="text-white flex items-center gap-3 text-2xl">
            <div className="p-2 bg-yellow-500/20 rounded-lg backdrop-blur-sm">
              <Trophy className="text-yellow-400" size={32} />
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
                    ? `bg-gradient-to-r ${achievement.color}/20 border-green-500/50 shadow-lg` 
                    : 'bg-gray-900/40 border-gray-600/50'
                }`}
              >
                {achievement.unlocked && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                )}
                <div className="relative flex items-center gap-4">
                  <div className={`text-4xl transform transition-all duration-300 ${achievement.unlocked ? 'animate-bounce' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold text-lg ${achievement.unlocked ? 'text-green-400' : 'text-gray-400'}`}>
                      {achievement.name}
                    </h4>
                    <p className="text-gray-300 text-sm">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg">
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
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-900/30 via-indigo-900/30 to-purple-900/30 border-2 border-blue-500/50 shadow-2xl">
        <CardHeader className="relative">
          <CardTitle className="text-white flex items-center gap-3 text-2xl">
            <div className="p-2 bg-blue-500/20 rounded-lg backdrop-blur-sm">
              <Database className="text-blue-400" size={32} />
            </div>
            Learning Milestones
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-4">
            <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
              battlesWon >= 1 ? 'bg-green-900/30 border-green-500/50' : 'bg-gray-900/30 border-gray-600/50'
            }`}>
              <div className={`p-2 rounded-lg ${battlesWon >= 1 ? 'bg-green-500/20' : 'bg-gray-700/20'}`}>
                <Zap className={battlesWon >= 1 ? 'text-green-400' : 'text-gray-500'} size={24} />
              </div>
              <span className={`text-lg ${battlesWon >= 1 ? 'text-green-400' : 'text-gray-400'}`}>
                Understand AI-powered data cleaning
              </span>
              {battlesWon >= 1 && <Badge className="ml-auto bg-green-600">✓ Complete</Badge>}
            </div>
            <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
              battlesWon >= 3 ? 'bg-green-900/30 border-green-500/50' : 'bg-gray-900/30 border-gray-600/50'
            }`}>
              <div className={`p-2 rounded-lg ${battlesWon >= 3 ? 'bg-green-500/20' : 'bg-gray-700/20'}`}>
                <Zap className={battlesWon >= 3 ? 'text-green-400' : 'text-gray-500'} size={24} />
              </div>
              <span className={`text-lg ${battlesWon >= 3 ? 'text-green-400' : 'text-gray-400'}`}>
                Compare different AI tool effectiveness
              </span>
              {battlesWon >= 3 && <Badge className="ml-auto bg-green-600">✓ Complete</Badge>}
            </div>
            <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
              totalScore >= 300 ? 'bg-green-900/30 border-green-500/50' : 'bg-gray-900/30 border-gray-600/50'
            }`}>
              <div className={`p-2 rounded-lg ${totalScore >= 300 ? 'bg-green-500/20' : 'bg-gray-700/20'}`}>
                <Zap className={totalScore >= 300 ? 'text-green-400' : 'text-gray-500'} size={24} />
              </div>
              <span className={`text-lg ${totalScore >= 300 ? 'text-green-400' : 'text-gray-400'}`}>
                Recognize automation opportunities in data pipelines
              </span>
              {totalScore >= 300 && <Badge className="ml-auto bg-green-600">✓ Complete</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scoreboard;
