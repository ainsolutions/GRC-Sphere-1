'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Brain, Sparkles, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIAnalysisProps {
  type: 'risk' | 'compliance' | 'governance' | 'incident' | 'asset';
  title: string;
  description: string;
  onAnalysisComplete?: (result: string) => void;
}

export function AIAnalysis({ type, title, description, onAnalysisComplete }: AIAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [inputData, setInputData] = useState<string>('');
  const [model, setModel] = useState<string>('gpt-4');
  const { toast } = useToast();

  const getEndpoint = () => {
    switch (type) {
      case 'risk':
        return '/api/ai/risk-analysis';
      case 'compliance':
        return '/api/ai/compliance-analysis';
      case 'governance':
        return '/api/ai/governance-recommendations';
      case 'incident':
        return '/api/ai/incident-response';
      case 'asset':
        return '/api/ai/asset-classification';
      default:
        return '/api/ai/test';
    }
  };

  const handleAnalysis = async () => {
    if (!inputData.trim()) {
      toast({
        title: "Input Required",
        description: "Please provide data for analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult('');

    try {
      let requestData;
      
      if (type === 'risk' || type === 'compliance' || type === 'governance') {
        try {
          requestData = JSON.parse(inputData);
        } catch {
          requestData = { data: inputData };
        }
      } else {
        requestData = { prompt: inputData, model, maxTokens: 1000, temperature: 0.7 };
      }

      const response = await fetch(getEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Analysis failed');
      }

      const analysisText = result.analysis || result.recommendations || result.text || result.message;
      setAnalysisResult(analysisText);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(analysisText);
      }

      toast({
        title: "Analysis Complete",
        description: "AI analysis has been completed successfully.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An error occurred during analysis.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'risk':
        return 'Enter risk assessment data (JSON format or plain text)...';
      case 'compliance':
        return 'Enter compliance data (JSON format or plain text)...';
      case 'governance':
        return 'Enter governance data (JSON format or plain text)...';
      case 'incident':
        return 'Describe the incident details...';
      case 'asset':
        return 'Enter asset information...';
      default:
        return 'Enter your prompt...';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="input-data">Input Data</Label>
          <Textarea
            id="input-data"
            placeholder={getPlaceholder()}
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            rows={6}
            className="resize-none"
          />
        </div>

        {type === 'incident' || type === 'asset' ? (
          <div className="space-y-2">
            <Label htmlFor="model">AI Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <Button
          onClick={handleAnalysis}
          disabled={isAnalyzing || !inputData.trim()}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Analyze with AI
            </>
          )}
        </Button>

        {analysisResult && (
          <div className="space-y-2">
            <Label>Analysis Result</Label>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
              <pre className="whitespace-pre-wrap text-sm">{analysisResult}</pre>
            </div>
          </div>
        )}

        {!process.env.NEXT_PUBLIC_OPENAI_API_KEY && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800 dark:text-yellow-200">
              OpenAI API key not configured. Please set OPENAI_API_KEY in your environment variables.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}




