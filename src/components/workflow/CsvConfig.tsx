import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { WorkflowNode } from "@/components/WorkflowBuilder";
import { sampleCsvData } from "@/services/sampleDataService";
import { FileText, Download, Settings, Eye } from "lucide-react";
import { useState } from "react";

interface CsvConfigProps {
  node: WorkflowNode;
  onUpdate: (nodeId: string, updates: Partial<WorkflowNode>) => void;
}

const CsvConfig = ({ node, onUpdate }: CsvConfigProps) => {
  const [config, setConfig] = useState({
    fileName: node.config?.fileName || 'sample-data.csv',
    delimiter: node.config?.delimiter || ',',
    hasHeader: node.config?.hasHeader !== false,
    encoding: node.config?.encoding || 'utf-8',
    skipRows: node.config?.skipRows || 0,
    maxRows: node.config?.maxRows || '',
    ...node.config
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onUpdate(node.id, { config: newConfig });
  };

  const previewSampleData = () => {
    // Apply configuration settings to sample data
    let data = [...sampleCsvData];
    
    // Apply skip rows
    if (config.skipRows > 0) {
      data = data.slice(config.skipRows);
    }
    
    // Apply max rows limit
    if (config.maxRows && parseInt(config.maxRows) > 0) {
      data = data.slice(0, parseInt(config.maxRows));
    }
    
    // Limit to first 5 rows for preview
    const previewRows = data.slice(0, 5);
    
    setPreviewData(previewRows);
    setShowPreview(true);
    
    console.log('CSV Preview:', {
      fileName: config.fileName,
      settings: config,
      totalRows: sampleCsvData.length,
      previewRows: previewRows.length,
      data: previewRows
    });
  };

  return (
    <Card className="bg-gray-800/50 border-gray-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText size={20} />
          CSV Reader Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-gray-300">File Source</Label>
          <Input
            value={config.fileName}
            onChange={(e) => handleConfigChange('fileName', e.target.value)}
            placeholder="Enter CSV file name or path"
            className="bg-gray-700 border-gray-600 text-white"
          />
          <p className="text-xs text-gray-400 mt-1">
            Using built-in sample data: sample-data.csv
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Delimiter</Label>
            <Select value={config.delimiter} onValueChange={(value) => handleConfigChange('delimiter', value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=",">Comma (,)</SelectItem>
                <SelectItem value=";">Semicolon (;)</SelectItem>
                <SelectItem value="\t">Tab</SelectItem>
                <SelectItem value="|">Pipe (|)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-300">Encoding</Label>
            <Select value={config.encoding} onValueChange={(value) => handleConfigChange('encoding', value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utf-8">UTF-8</SelectItem>
                <SelectItem value="utf-16">UTF-16</SelectItem>
                <SelectItem value="ascii">ASCII</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-gray-300">File has header row</Label>
          <Switch
            checked={config.hasHeader}
            onCheckedChange={(checked) => handleConfigChange('hasHeader', checked)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Skip Rows</Label>
            <Input
              type="number"
              value={config.skipRows}
              onChange={(e) => handleConfigChange('skipRows', parseInt(e.target.value) || 0)}
              className="bg-gray-700 border-gray-600 text-white"
              min="0"
            />
          </div>

          <div>
            <Label className="text-gray-300">Max Rows (optional)</Label>
            <Input
              type="number"
              value={config.maxRows}
              onChange={(e) => handleConfigChange('maxRows', e.target.value)}
              placeholder="All rows"
              className="bg-gray-700 border-gray-600 text-white"
              min="1"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-600">
          <Button
            onClick={previewSampleData}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Eye size={16} className="mr-2" />
            Preview Sample Data
          </Button>
        </div>

        {/* Sample Data Preview */}
        {showPreview && previewData.length > 0 && (
          <div className="bg-gray-900/80 p-4 rounded-xl border border-gray-700 mt-4 shadow-sm w-full max-w-full">
            <div className="flex items-center gap-2 mb-3">
              <Download size={16} />
              <h4 className="text-white font-medium text-base">
                Sample Data Preview
                <span className="text-xs text-gray-400 ml-2">({previewData.length} of {sampleCsvData.length} rows)</span>
              </h4>
            </div>
            {/* Constrained and scrollable table container */}
            <div className="w-full max-w-full overflow-x-auto">
              <div className="rounded-lg border border-gray-700 overflow-x-auto overflow-y-auto"
                   style={{maxHeight: 320, minWidth: 350}}>
                <table className="min-w-[350px] w-full table-auto text-xs md:text-sm bg-transparent">
                  <thead className="bg-gray-800 sticky top-0 z-10">
                    <tr>
                      {config.hasHeader && Object.keys(previewData[0] || {}).map((key) => (
                        <th
                          key={key}
                          className="text-left text-cyan-200 px-3 py-2 font-semibold border-b border-gray-700 whitespace-nowrap"
                          style={{ wordBreak: "break-word" }}
                        >
                          {key.replace('_', ' ').toUpperCase()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-800 ${index % 2 === 0 ? "bg-gray-800/50" : "bg-gray-800/80"} hover:bg-gray-700/70 transition`}
                      >
                        {Object.values(row).map((value: any, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="text-gray-200 px-3 py-2 align-top whitespace-nowrap max-w-[160px] overflow-hidden text-ellipsis"
                            title={typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            style={{ wordBreak: "break-word" }}
                          >
                            {typeof value === 'object' ? (
                              <span className="text-amber-300">{JSON.stringify(value)}</span>
                            ) : (
                              String(value)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Button
              onClick={() => setShowPreview(false)}
              variant="ghost"
              size="sm"
              className="mt-3 text-gray-400 hover:text-white w-full"
            >
              Hide Preview
            </Button>
          </div>
        )}

        <div className="bg-cyan-900/20 p-3 rounded-lg border border-cyan-500/30">
          <p className="text-cyan-300 text-xs">
            📊 Sample data includes: Products, Categories, Pricing, Inventory, Owner info
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CsvConfig;
