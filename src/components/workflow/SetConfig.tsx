
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { WorkflowNode } from "@/components/WorkflowBuilder";
import { Settings, Plus, Trash2, Code } from "lucide-react";
import { useState } from "react";

interface SetConfigProps {
  node: WorkflowNode;
  onUpdate: (nodeId: string, updates: Partial<WorkflowNode>) => void;
}

const SetConfig = ({ node, onUpdate }: SetConfigProps) => {
  const [config, setConfig] = useState({
    mappings: node.config?.mappings || {
      'product_name': 'name',
      'owner_email': 'owner.email',
      'price_category': 'price > 100 ? "expensive" : "affordable"',
      'is_available': 'status === "active" && quantity > 0'
    },
    customCode: node.config?.customCode || '',
    ...node.config
  });

  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onUpdate(node.id, { config: newConfig });
  };

  const addMapping = () => {
    const mappings = { ...config.mappings };
    mappings[`new_field_${Object.keys(mappings).length + 1}`] = 'source_field';
    handleConfigChange('mappings', mappings);
  };

  const updateMapping = (oldKey: string, newKey: string, value: string) => {
    const mappings = { ...config.mappings };
    delete mappings[oldKey];
    mappings[newKey] = value;
    handleConfigChange('mappings', mappings);
  };

  const deleteMapping = (key: string) => {
    const mappings = { ...config.mappings };
    delete mappings[key];
    handleConfigChange('mappings', mappings);
  };

  return (
    <Card className="bg-gray-800/50 border-gray-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings size={20} />
          Set/Transform Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-3">
            <Label className="text-gray-300">Field Mappings</Label>
            <Button
              onClick={addMapping}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              <Plus size={14} className="mr-1" />
              Add Field
            </Button>
          </div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {Object.entries(config.mappings).map(([targetField, sourceExpression], index) => (
              <div key={index} className="grid grid-cols-5 gap-2 items-center p-2 bg-gray-700/50 rounded">
                <Input
                  value={targetField}
                  onChange={(e) => updateMapping(targetField, e.target.value, sourceExpression as string)}
                  placeholder="Target field"
                  className="col-span-2 bg-gray-700 border-gray-600 text-white text-xs"
                />
                <span className="text-gray-400 text-center">=</span>
                <Input
                  value={sourceExpression as string}
                  onChange={(e) => updateMapping(targetField, targetField, e.target.value)}
                  placeholder="Source or expression"
                  className="col-span-1 bg-gray-700 border-gray-600 text-white text-xs"
                />
                <Button
                  onClick={() => deleteMapping(targetField)}
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-gray-300">Custom JavaScript Code (Optional)</Label>
          <Textarea
            value={config.customCode}
            onChange={(e) => handleConfigChange('customCode', e.target.value)}
            placeholder="// Custom transformation logic
return data.map(item => ({
  ...item,
  custom_field: item.price * 1.1
}));"
            className="bg-gray-700 border-gray-600 text-white font-mono text-xs"
            rows={4}
          />
        </div>

        <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-500/30">
          <h4 className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
            <Code size={16} />
            Available Fields
          </h4>
          <div className="text-xs text-gray-300 space-y-1">
            <p><code>name</code> - Product name</p>
            <p><code>category</code> - Product category</p>
            <p><code>price</code> - Product price</p>
            <p><code>quantity</code> - Stock quantity</p>
            <p><code>status</code> - Product status</p>
            <p><code>owner.name</code> - Owner name</p>
            <p><code>owner.email</code> - Owner email</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SetConfig;
