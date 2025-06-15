
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { WorkflowNode } from "@/components/WorkflowBuilder";
import { Filter, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'date';
}

interface FilterConfigProps {
  node: WorkflowNode;
  onUpdate: (nodeId: string, updates: Partial<WorkflowNode>) => void;
}

const FilterConfig = ({ node, onUpdate }: FilterConfigProps) => {
  const [conditions, setConditions] = useState<FilterCondition[]>(
    node.config?.conditions || [
      { id: '1', field: 'status', operator: 'equals', value: 'active', type: 'string' }
    ]
  );
  const [logic, setLogic] = useState(node.config?.logic || 'AND');
  const [customExpression, setCustomExpression] = useState(node.config?.customExpression || '');

  const operators = {
    string: [
      { value: 'equals', label: 'Equals' },
      { value: 'not_equals', label: 'Not Equals' },
      { value: 'contains', label: 'Contains' },
      { value: 'not_contains', label: 'Does Not Contain' },
      { value: 'starts_with', label: 'Starts With' },
      { value: 'ends_with', label: 'Ends With' },
      { value: 'is_empty', label: 'Is Empty' },
      { value: 'is_not_empty', label: 'Is Not Empty' }
    ],
    number: [
      { value: 'equals', label: 'Equals' },
      { value: 'not_equals', label: 'Not Equals' },
      { value: 'greater_than', label: 'Greater Than' },
      { value: 'less_than', label: 'Less Than' },
      { value: 'greater_equal', label: 'Greater or Equal' },
      { value: 'less_equal', label: 'Less or Equal' },
      { value: 'between', label: 'Between' }
    ],
    boolean: [
      { value: 'is_true', label: 'Is True' },
      { value: 'is_false', label: 'Is False' }
    ],
    date: [
      { value: 'equals', label: 'Equals' },
      { value: 'after', label: 'After' },
      { value: 'before', label: 'Before' },
      { value: 'between', label: 'Between' },
      { value: 'last_days', label: 'Last N Days' }
    ]
  };

  const addCondition = () => {
    const newCondition: FilterCondition = {
      id: Date.now().toString(),
      field: '',
      operator: 'equals',
      value: '',
      type: 'string'
    };
    setConditions([...conditions, newCondition]);
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const updateCondition = (id: string, updates: Partial<FilterCondition>) => {
    setConditions(conditions.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ));
  };

  const handleSave = () => {
    const filterConfig = {
      conditions,
      logic,
      customExpression,
      generatedExpression: generateExpression()
    };
    onUpdate(node.id, { config: filterConfig });
  };

  const generateExpression = () => {
    if (customExpression) return customExpression;
    
    const conditionExpressions = conditions.map(condition => {
      const { field, operator, value, type } = condition;
      
      switch (operator) {
        case 'equals':
          return type === 'string' ? `$json.${field} === '${value}'` : `$json.${field} === ${value}`;
        case 'not_equals':
          return type === 'string' ? `$json.${field} !== '${value}'` : `$json.${field} !== ${value}`;
        case 'contains':
          return `$json.${field} && $json.${field}.toLowerCase().includes('${value.toLowerCase()}')`;
        case 'greater_than':
          return `$json.${field} > ${value}`;
        case 'less_than':
          return `$json.${field} < ${value}`;
        case 'is_empty':
          return `!$json.${field} || $json.${field} === ''`;
        case 'is_not_empty':
          return `$json.${field} && $json.${field} !== ''`;
        case 'is_true':
          return `$json.${field} === true`;
        case 'is_false':
          return `$json.${field} === false`;
        default:
          return `$json.${field} === '${value}'`;
      }
    });

    const joinOperator = logic === 'AND' ? ' && ' : ' || ';
    return conditionExpressions.join(joinOperator);
  };

  return (
    <Card className="bg-gray-800/50 border-gray-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Filter size={20} />
          Filter Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visual Conditions */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-white font-medium">Filter Conditions</h4>
            <Button size="sm" onClick={addCondition} className="bg-purple-600 hover:bg-purple-700">
              <Plus size={14} className="mr-1" />
              Add Condition
            </Button>
          </div>
          
          {conditions.map((condition, index) => (
            <div key={condition.id} className="space-y-2 p-3 bg-gray-800/50 rounded-lg border border-gray-600 mb-2">
              {index > 0 && (
                <div className="flex justify-center">
                  <Badge variant="outline" className="text-xs">
                    {logic}
                  </Badge>
                </div>
              )}
              
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-3">
                  <Input
                    placeholder="Field name"
                    value={condition.field}
                    onChange={(e) => updateCondition(condition.id, { field: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white text-xs"
                  />
                </div>
                
                <div className="col-span-2">
                  <Select
                    value={condition.type}
                    onValueChange={(value) => updateCondition(condition.id, { type: value as any })}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-3">
                  <Select
                    value={condition.operator}
                    onValueChange={(value) => updateCondition(condition.id, { operator: value })}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {operators[condition.type].map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-3">
                  <Input
                    placeholder="Value"
                    value={condition.value}
                    onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white text-xs"
                  />
                </div>
                
                <div className="col-span-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeCondition(condition.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {conditions.length > 1 && (
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant={logic === 'AND' ? 'default' : 'outline'}
                onClick={() => setLogic('AND')}
                className="text-xs"
              >
                AND (All conditions must match)
              </Button>
              <Button
                size="sm"
                variant={logic === 'OR' ? 'default' : 'outline'}
                onClick={() => setLogic('OR')}
                className="text-xs"
              >
                OR (Any condition can match)
              </Button>
            </div>
          )}
        </div>

        {/* Custom Expression */}
        <div>
          <h4 className="text-white font-medium mb-2">Custom JavaScript Expression</h4>
          <Textarea
            placeholder="e.g., $json.price > 100 && $json.category === 'Electronics'"
            value={customExpression}
            onChange={(e) => setCustomExpression(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white text-xs font-mono"
            rows={3}
          />
          <p className="text-gray-400 text-xs mt-1">
            Use $json.fieldName to access data fields. Leave empty to use visual conditions above.
          </p>
        </div>

        {/* Preview */}
        <div className="bg-gray-800/30 p-3 rounded border border-gray-600">
          <h4 className="text-white font-medium mb-2">Generated Expression Preview</h4>
          <code className="text-cyan-400 text-xs break-all">
            {generateExpression() || 'Configure conditions above to see the generated expression'}
          </code>
        </div>

        <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700">
          Save Filter Configuration
        </Button>
      </CardContent>
    </Card>
  );
};

export default FilterConfig;
