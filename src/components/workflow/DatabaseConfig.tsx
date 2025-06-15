
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { WorkflowNode } from "@/components/WorkflowBuilder";
import { Database, TestTube, Save } from "lucide-react";
import { useState } from "react";

interface DatabaseConfigProps {
  node: WorkflowNode;
  onUpdate: (nodeId: string, updates: Partial<WorkflowNode>) => void;
}

const DatabaseConfig = ({ node, onUpdate }: DatabaseConfigProps) => {
  const [config, setConfig] = useState({
    connectionType: node.config?.connectionType || 'postgresql',
    host: node.config?.host || 'localhost',
    port: node.config?.port || '5432',
    database: node.config?.database || 'workflow_db',
    table: node.config?.table || 'processed_data',
    username: node.config?.username || '',
    password: node.config?.password || '',
    operation: node.config?.operation || 'insert',
    createTable: node.config?.createTable !== false,
    batchSize: node.config?.batchSize || 1000,
    customQuery: node.config?.customQuery || '',
    ...node.config
  });

  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onUpdate(node.id, { config: newConfig });
  };

  const testConnection = () => {
    console.log('Testing database connection:', {
      type: config.connectionType,
      host: config.host,
      database: config.database,
      table: config.table
    });
  };

  return (
    <Card className="bg-gray-800/50 border-gray-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Database size={20} />
          Database Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-gray-300">Database Type</Label>
          <Select value={config.connectionType} onValueChange={(value) => handleConfigChange('connectionType', value)}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="postgresql">PostgreSQL</SelectItem>
              <SelectItem value="mysql">MySQL</SelectItem>
              <SelectItem value="sqlite">SQLite</SelectItem>
              <SelectItem value="mongodb">MongoDB</SelectItem>
              <SelectItem value="snowflake">Snowflake</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Host</Label>
            <Input
              value={config.host}
              onChange={(e) => handleConfigChange('host', e.target.value)}
              placeholder="localhost"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Port</Label>
            <Input
              value={config.port}
              onChange={(e) => handleConfigChange('port', e.target.value)}
              placeholder="5432"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        <div>
          <Label className="text-gray-300">Database Name</Label>
          <Input
            value={config.database}
            onChange={(e) => handleConfigChange('database', e.target.value)}
            placeholder="workflow_db"
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div>
          <Label className="text-gray-300">Table Name</Label>
          <Input
            value={config.table}
            onChange={(e) => handleConfigChange('table', e.target.value)}
            placeholder="processed_data"
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Username</Label>
            <Input
              value={config.username}
              onChange={(e) => handleConfigChange('username', e.target.value)}
              placeholder="username"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Password</Label>
            <Input
              type="password"
              value={config.password}
              onChange={(e) => handleConfigChange('password', e.target.value)}
              placeholder="password"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        <div>
          <Label className="text-gray-300">Operation</Label>
          <Select value={config.operation} onValueChange={(value) => handleConfigChange('operation', value)}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="insert">Insert</SelectItem>
              <SelectItem value="upsert">Upsert</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="replace">Replace</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-gray-300">Auto-create table if not exists</Label>
          <Switch
            checked={config.createTable}
            onCheckedChange={(checked) => handleConfigChange('createTable', checked)}
          />
        </div>

        <div>
          <Label className="text-gray-300">Batch Size</Label>
          <Input
            type="number"
            value={config.batchSize}
            onChange={(e) => handleConfigChange('batchSize', parseInt(e.target.value) || 1000)}
            className="bg-gray-700 border-gray-600 text-white"
            min="1"
            max="10000"
          />
        </div>

        <div>
          <Label className="text-gray-300">Custom Query (Optional)</Label>
          <Textarea
            value={config.customQuery}
            onChange={(e) => handleConfigChange('customQuery', e.target.value)}
            placeholder="INSERT INTO table_name (col1, col2) VALUES ($1, $2)"
            className="bg-gray-700 border-gray-600 text-white font-mono text-xs"
            rows={3}
          />
        </div>

        <div className="pt-4 border-t border-gray-600">
          <Button
            onClick={testConnection}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <TestTube size={16} className="mr-2" />
            Test Connection
          </Button>
        </div>

        <div className="bg-green-900/20 p-3 rounded-lg border border-green-500/30">
          <p className="text-green-300 text-xs">
            💾 For demo purposes, data will be logged to console. Connect to real database for production use.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseConfig;
