
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle, Play, RefreshCw, BarChart3 } from "lucide-react";

interface ExecutionResult {
  success: boolean;
  logs: string[];
  score: number;
  nodesProcessed: number;
}

interface ExecutionPanelProps {
  result: ExecutionResult;
  onRetry: () => void;
}

const ExecutionPanel = ({ result, onRetry }: ExecutionPanelProps) => {
  return (
    <Card className="bg-gray-800/50 border-gray-600">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center gap-2">
            {result.success ? (
              <CheckCircle className="text-green-400" size={20} />
            ) : (
              <XCircle className="text-red-400" size={20} />
            )}
            Execution Results
          </CardTitle>
          <div className="flex items-center gap-3">
            <Badge variant={result.success ? "default" : "destructive"}>
              {result.success ? "Success" : "Failed"}
            </Badge>
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="border-purple-500 text-purple-400 hover:bg-purple-600/20"
            >
              <RefreshCw size={14} className="mr-1" />
              Retry
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Execution Logs */}
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Play size={16} />
              Execution Logs
            </h4>
            <ScrollArea className="h-64 w-full rounded-md border border-gray-600 bg-gray-900/50 p-4">
              <div className="space-y-1">
                {result.logs.map((log, index) => (
                  <div key={index} className="text-sm font-mono">
                    {log.startsWith('✅') && (
                      <span className="text-green-400">{log}</span>
                    )}
                    {log.startsWith('❌') && (
                      <span className="text-red-400">{log}</span>
                    )}
                    {log.startsWith('🚀') && (
                      <span className="text-blue-400">{log}</span>
                    )}
                    {log.startsWith('⚠️') && (
                      <span className="text-yellow-400">{log}</span>
                    )}
                    {log.startsWith('🎉') && (
                      <span className="text-purple-400">{log}</span>
                    )}
                    {log.startsWith('💡') && (
                      <span className="text-cyan-400">{log}</span>
                    )}
                    {!log.match(/^[✅❌🚀⚠️🎉💡🔍📊]/) && (
                      <span className="text-gray-300">{log}</span>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Statistics */}
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <BarChart3 size={16} />
              Statistics
            </h4>
            <div className="space-y-4">
              <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                <div className="text-gray-400 text-sm">Nodes Processed</div>
                <div className="text-2xl font-bold text-white">{result.nodesProcessed}</div>
              </div>
              
              <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                <div className="text-gray-400 text-sm">Score Earned</div>
                <div className="text-2xl font-bold text-purple-400">{result.score} XP</div>
              </div>
              
              <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                <div className="text-gray-400 text-sm">Status</div>
                <div className={`text-lg font-semibold ${
                  result.success ? 'text-green-400' : 'text-red-400'
                }`}>
                  {result.success ? 'Completed' : 'Failed'}
                </div>
              </div>

              {!result.success && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 p-3 rounded-lg">
                  <div className="text-yellow-400 text-sm font-semibold mb-1">
                    💡 Next Steps
                  </div>
                  <div className="text-gray-300 text-xs">
                    • Check node configurations
                    • Use AI Assistant for debugging
                    • Review error logs above
                    • Test individual nodes first
                  </div>
                </div>
              )}

              {result.success && (
                <div className="bg-green-900/20 border border-green-500/30 p-3 rounded-lg">
                  <div className="text-green-400 text-sm font-semibold mb-1">
                    🎉 Well Done!
                  </div>
                  <div className="text-gray-300 text-xs">
                    Your workflow executed successfully. Ready for the next challenge?
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExecutionPanel;
