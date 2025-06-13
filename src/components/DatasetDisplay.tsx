
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

interface DatasetDisplayProps {
  data: string;
  title: string;
}

const DatasetDisplay = ({ data, title }: DatasetDisplayProps) => {
  return (
    <Card className="bg-black/40 border-gray-600">
      <CardHeader>
        <CardTitle className="text-gray-200 flex items-center gap-2">
          <Database size={20} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="bg-black/60 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto border border-gray-700">
          {data}
        </pre>
      </CardContent>
    </Card>
  );
};

export default DatasetDisplay;
