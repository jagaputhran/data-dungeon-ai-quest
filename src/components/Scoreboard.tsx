
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Brain, Target, Zap } from "lucide-react";

interface ScoreboardProps {
  totalScore: number;
  battlesWon: number;
}

const Scoreboard = ({ totalScore, battlesWon }: ScoreboardProps) => {
  const level = Math.floor(totalScore / 100) + 1;
  const progressToNextLevel = (totalScore % 100);

  const achievements = [
    { name: "First Strike", description: "Win your first battle", unlocked: battlesWon >= 1, icon: "⚔️" },
    { name: "Data Warrior", description: "Win 3 battles", unlocked: battlesWon >= 3, icon: "🛡️" },
    { name: "AI Master", description: "Reach 500 XP", unlocked: totalScore >= 500, icon: "🧠" },
    { name: "Corruption Slayer", description: "Win 10 battles", unlocked: battlesWon >= 10, icon: "🏆" }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="text-purple-400" />
            Knowledge Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{totalScore}</div>
              <div className="text-gray-300">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{battlesWon}</div>
              <div className="text-gray-300">Battles Won</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{level}</div>
              <div className="text-gray-300">AI Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{achievements.filter(a => a.unlocked).length}</div>
              <div className="text-gray-300">Achievements</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-white">
              <span>Progress to Level {level + 1}</span>
              <span>{progressToNextLevel}/100 XP</span>
            </div>
            <Progress value={progressToNextLevel} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-yellow-900/20 border-yellow-500">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="text-yellow-400" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  achievement.unlocked 
                    ? 'bg-green-900/30 border border-green-600' 
                    : 'bg-gray-900/30 border border-gray-600'
                }`}
              >
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <h4 className={`font-semibold ${achievement.unlocked ? 'text-green-400' : 'text-gray-400'}`}>
                    {achievement.name}
                  </h4>
                  <p className="text-gray-300 text-sm">{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <Badge className="bg-green-600">Unlocked!</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-900/20 border-blue-500">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="text-blue-400" />
            Learning Objectives Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Zap className={battlesWon >= 1 ? 'text-green-400' : 'text-gray-500'} size={20} />
              <span className={battlesWon >= 1 ? 'text-green-400' : 'text-gray-400'}>
                Understand AI-powered data cleaning
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className={battlesWon >= 3 ? 'text-green-400' : 'text-gray-500'} size={20} />
              <span className={battlesWon >= 3 ? 'text-green-400' : 'text-gray-400'}>
                Compare different AI tool effectiveness
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className={totalScore >= 300 ? 'text-green-400' : 'text-gray-500'} size={20} />
              <span className={totalScore >= 300 ? 'text-green-400' : 'text-gray-400'}>
                Recognize automation opportunities in data pipelines
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scoreboard;
