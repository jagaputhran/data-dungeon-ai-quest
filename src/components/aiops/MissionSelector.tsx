
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AiOpsMission } from "@/data/aiOpsMissions";
import { Check, Lock, Zap } from "lucide-react";

interface MissionSelectorProps {
  missions: AiOpsMission[];
  currentMission: number;
  completedMissions: number[];
  onMissionSelect: (missionIndex: number) => void;
}

const MissionSelector = ({ 
  missions, 
  currentMission, 
  completedMissions, 
  onMissionSelect 
}: MissionSelectorProps) => {
  
  const isMissionUnlocked = (index: number) => {
    return index === 0 || completedMissions.includes(index - 1);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-orange-500';
      case 'Expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-3">
      {missions.map((mission, index) => {
        const isCompleted = completedMissions.includes(index);
        const isUnlocked = isMissionUnlocked(index);
        const isCurrent = currentMission === index;
        
        return (
          <Button
            key={mission.id}
            variant={isCurrent ? "default" : "outline"}
            className={`w-full p-4 h-auto text-left justify-start ${
              !isUnlocked ? 'opacity-50 cursor-not-allowed' : ''
            } ${isCurrent ? 'ring-2 ring-cyan-400' : ''}`}
            onClick={() => isUnlocked && onMissionSelect(index)}
            disabled={!isUnlocked}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{mission.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">
                      Level {index + 1}: {mission.name}
                    </span>
                    {isCompleted && (
                      <Check size={16} className="text-green-400" />
                    )}
                    {!isUnlocked && (
                      <Lock size={16} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getDifficultyColor(mission.difficulty)} text-white border-0`}
                    >
                      {mission.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Zap size={12} className="mr-1" />
                      {mission.baseScore} XP
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
};

export default MissionSelector;
