
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database } from "lucide-react";

interface DatasetDisplayProps {
  data: string;
  title: string;
}

const DatasetDisplay = ({ data, title }: DatasetDisplayProps) => {
  const parseCSV = (csvData: string) => {
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => 
      line.split(',').map(cell => cell.trim())
    );
    return { headers, rows };
  };

  const { headers, rows } = parseCSV(data);

  return (
    <Card className="bg-black/40 border-gray-600">
      <CardHeader>
        <CardTitle className="text-gray-200 flex items-center gap-2">
          <Database size={20} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-black/60 rounded-lg border border-gray-700 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-600 hover:bg-gray-800/50">
                {headers.map((header, index) => (
                  <TableHead key={index} className="text-green-400 font-mono font-semibold border-r border-gray-600 last:border-r-0">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="border-gray-600 hover:bg-gray-800/30">
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="text-green-300 font-mono text-sm border-r border-gray-600 last:border-r-0">
                      {cell || <span className="text-red-400 italic">empty</span>}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatasetDisplay;
