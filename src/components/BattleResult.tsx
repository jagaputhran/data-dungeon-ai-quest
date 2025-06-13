
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, RefreshCw } from "lucide-react";

interface BattleResultProps {
  result: string;
  hasWon: boolean;
  onReset: () => void;
}

const BattleResult = ({ result, hasWon, onReset }: BattleResultProps) => {
  return (
    <Card className={`${hasWon ? 'bg-green-900/20 border-green-500' : 'bg-yellow-900/20 border-yellow-500'}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className={hasWon ? 'text-yellow-400' : 'text-gray-400'} />
          Battle Result
          {hasWon && <Badge className="bg-green-600 text-white border-0">Victory!</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-200 text-lg font-semibold">{result}</p>
        
        <div className="bg-black/40 p-4 rounded-lg border border-gray-600">
          <h4 className="text-white font-semibold mb-2">🎓 What You Learned:</h4>
          <ul className="text-gray-300 space-y-1">
            <li>• AI tools can automatically detect and fix data quality issues</li>
            <li>• Different AI approaches work better for different types of corruption</li>
            <li>• GPT-4 excels at understanding context and fixing complex data patterns</li>
            <li>• Schema generators help establish data structure and validation rules</li>
            <li>• Modern data engineering leverages ML for automated quality assurance</li>
          </ul>
        </div>

        <Button 
          onClick={onReset}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold border-0"
          size="lg"
        >
          <RefreshCw size={16} className="mr-2" />
          Fight Another Data Monster
        </Button>
      </CardContent>
    </Card>
  );
};

export default BattleResult;
