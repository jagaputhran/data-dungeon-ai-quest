
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Globe, Plus, Trash2, TestTube } from "lucide-react";
import { useState } from "react";

interface HttpConfigProps {
  nodeId: string;
  config: any;
  onConfigUpdate: (config: any) => void;
}

const HttpConfig = ({ nodeId, config, onConfigUpdate }: HttpConfigProps) => {
  const [method, setMethod] = useState(config?.method || 'GET');
  const [url, setUrl] = useState(config?.url || '');
  const [headers, setHeaders] = useState(config?.headers || [{ key: '', value: '' }]);
  const [body, setBody] = useState(config?.body || '');
  const [timeout, setTimeout] = useState(config?.timeout || 30000);
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const popularApis = [
    { name: "JSONPlaceholder Posts", url: "https://jsonplaceholder.typicode.com/posts" },
    { name: "JSONPlaceholder Users", url: "https://jsonplaceholder.typicode.com/users" },
    { name: "REST Countries", url: "https://restcountries.com/v3.1/all" },
    { name: "CoinGecko Crypto", url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1" },
    { name: "News API (Demo)", url: "https://newsapi.org/v2/top-headlines?country=us&apiKey=DEMO_KEY" },
    { name: "Cat Facts", url: "https://catfact.ninja/facts" },
    { name: "Random User", url: "https://randomuser.me/api/?results=5" },
    { name: "Public IP", url: "https://api.ipify.org?format=json" }
  ];

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const testRequest = async () => {
    if (!url) return;
    
    setIsLoading(true);
    try {
      const headersObj = headers.reduce((acc, header) => {
        if (header.key && header.value) {
          acc[header.key] = header.value;
        }
        return acc;
      }, {} as Record<string, string>);

      const response = await fetch(url, {
        method,
        headers: headersObj,
        body: method !== 'GET' && method !== 'HEAD' ? body : undefined,
        signal: AbortSignal.timeout(timeout)
      });

      const data = await response.json();
      setTestResult({
        success: true,
        status: response.status,
        statusText: response.statusText,
        data: Array.isArray(data) ? data.slice(0, 3) : data, // Show first 3 items if array
        headers: Object.fromEntries(response.headers.entries())
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      });
    }
    setIsLoading(false);
  };

  const handleSave = () => {
    const httpConfig = {
      method,
      url,
      headers: headers.filter(h => h.key && h.value).reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {}),
      body: method !== 'GET' && method !== 'HEAD' ? body : undefined,
      timeout,
      testResult
    };
    onConfigUpdate(httpConfig);
  };

  return (
    <Card className="bg-gray-900/50 border-gray-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Globe size={20} />
          HTTP Request Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick API Selection */}
        <div>
          <h4 className="text-white font-medium mb-2">Quick Start - Popular APIs</h4>
          <div className="grid grid-cols-1 gap-1">
            {popularApis.map((api, index) => (
              <Button
                key={index}
                variant="ghost"
                className="justify-start text-xs h-8 text-gray-300 hover:text-white hover:bg-purple-600/20"
                onClick={() => setUrl(api.url)}
              >
                <Globe size={12} className="mr-2" />
                {api.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Method and URL */}
        <div className="grid grid-cols-4 gap-2">
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="col-span-3">
            <Input
              placeholder="https://api.example.com/data"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        {/* Headers */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-white font-medium">Headers</h4>
            <Button size="sm" onClick={addHeader} className="bg-purple-600 hover:bg-purple-700">
              <Plus size={14} className="mr-1" />
              Add Header
            </Button>
          </div>
          
          {headers.map((header, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 mb-2">
              <div className="col-span-5">
                <Input
                  placeholder="Header name"
                  value={header.key}
                  onChange={(e) => updateHeader(index, 'key', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white text-sm"
                />
              </div>
              <div className="col-span-6">
                <Input
                  placeholder="Header value"
                  value={header.value}
                  onChange={(e) => updateHeader(index, 'value', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white text-sm"
                />
              </div>
              <div className="col-span-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeHeader(index)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Request Body */}
        {method !== 'GET' && method !== 'HEAD' && (
          <div>
            <h4 className="text-white font-medium mb-2">Request Body (JSON)</h4>
            <Textarea
              placeholder='{"key": "value"}'
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white text-sm font-mono"
              rows={4}
            />
          </div>
        )}

        {/* Timeout */}
        <div>
          <h4 className="text-white font-medium mb-2">Timeout (ms)</h4>
          <Input
            type="number"
            value={timeout}
            onChange={(e) => setTimeout(Number(e.target.value))}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        {/* Test Button */}
        <div className="flex gap-2">
          <Button
            onClick={testRequest}
            disabled={!url || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <TestTube size={16} className="mr-2" />
            {isLoading ? 'Testing...' : 'Test Request'}
          </Button>
          
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            Save Configuration
          </Button>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="bg-gray-800/30 p-3 rounded border border-gray-600">
            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
              Test Results
              <Badge variant={testResult.success ? "default" : "destructive"}>
                {testResult.success ? 'Success' : 'Error'}
              </Badge>
            </h4>
            
            {testResult.success ? (
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400 ml-2">{testResult.status} {testResult.statusText}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Response Data:</span>
                  <pre className="text-cyan-400 text-xs mt-1 bg-gray-900/50 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-red-400 text-sm">
                <div>Error: {testResult.error}</div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HttpConfig;
