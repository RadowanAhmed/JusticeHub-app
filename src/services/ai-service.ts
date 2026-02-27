// apps/mobile/src/services/ai-service.ts
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@/lib/supabase';

export interface AIConfig {
  provider: 'openai' | 'azure' | 'anthropic';
  apiKey: string;
  baseURL?: string;
}

export interface LegalAdviceRequest {
  question: string;
  jurisdiction?: string;
  context?: string;
}

export interface LegalAdviceResponse {
  answer: string;
  confidence: number;
  relevantArticles?: string[];
  suggestions?: string[];
  disclaimer: string;
}

export interface DocumentAnalysisRequest {
  fileUri: string;
  fileName: string;
  fileType: string;
}

export interface DocumentAnalysisResponse {
  summary: string;
  risks: string[];
  strengths: string[];
  recommendations: string[];
  keyClauses: Array<{
    clause: string;
    riskLevel: 'low' | 'medium' | 'high';
    suggestion: string;
  }>;
}

class AIService {
  private config: AIConfig;
  private supabase = supabase;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async getLegalAdvice(request: LegalAdviceRequest): Promise<LegalAdviceResponse> {
    try {
      // أولاً: البحث في قاعدة البيانات المحلية
      const similarCases = await this.searchSimilarCases(request.question);
      
      // بناء برومبت متخصص
      const prompt = this.buildLegalPrompt(request, similarCases);
      
      // استدعاء OpenAI API
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'You are a legal expert specializing in Saudi Arabian law. Provide accurate, helpful legal advice. Always include relevant article numbers when possible. Add disclaimer that this is not official legal advice.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return this.parseLegalResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error getting legal advice:', error);
      throw error;
    }
  }

  async analyzeDocument(request: DocumentAnalysisRequest): Promise<DocumentAnalysisResponse> {
    try {
      // قراءة الملف
      const base64Data = await FileSystem.readAsStringAsync(request.fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // استخدام Azure Document Intelligence أو OpenAI Vision
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'system',
              content: 'You are a legal document analyst. Analyze the provided legal document and provide: 1. Summary 2. List of risks 3. List of strengths 4. Recommendations 5. Key clauses with risk assessment'
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyze this legal document:'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${request.fileType};base64,${base64Data}`
                  }
                }
              ]
            }
          ],
          max_tokens: 2000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return this.parseDocumentAnalysis(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing document:', error);
      throw error;
    }
  }

  async draftDocument(template: string, data: Record<string, any>): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: `You are a legal document drafter. Generate a professional legal document based on the template and provided data. Format the document properly with appropriate sections and legal terminology.`
            },
            {
              role: 'user',
              content: `Template: ${template}\n\nData: ${JSON.stringify(data, null, 2)}`
            }
          ],
          temperature: 0.2,
          max_tokens: 2000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error drafting document:', error);
      throw error;
    }
  }

  private async searchSimilarCases(query: string) {
    const { data, error } = await this.supabase
      .from('cases')
      .select('title, description, category')
      .textSearch('description', query)
      .limit(5);

    if (error) {
      console.error('Error searching similar cases:', error);
      return [];
    }

    return data;
  }

  private buildLegalPrompt(request: LegalAdviceRequest, similarCases: any[]): string {
    let prompt = `Legal Question: ${request.question}\n\n`;
    
    if (request.jurisdiction) {
      prompt += `Jurisdiction: ${request.jurisdiction}\n`;
    }
    
    if (request.context) {
      prompt += `Context: ${request.context}\n`;
    }
    
    if (similarCases.length > 0) {
      prompt += '\nSimilar cases from our database:\n';
      similarCases.forEach((c, i) => {
        prompt += `${i + 1}. ${c.title}: ${c.description.substring(0, 200)}...\n`;
      });
    }
    
    prompt += '\nPlease provide legal advice including:';
    prompt += '\n1. Direct answer to the question';
    prompt += '\n2. Relevant legal articles/laws';
    prompt += '\n3. Practical steps to take';
    prompt += '\n4. Recommendations';
    prompt += '\n5. Important warnings';
    
    return prompt;
  }

  private parseLegalResponse(response: string): LegalAdviceResponse {
    // تحليل الاستجابة لاستخراج المعلومات
    const disclaimerIndex = response.indexOf('Disclaimer:');
    const disclaimer = disclaimerIndex !== -1 
      ? response.substring(disclaimerIndex)
      : 'This is AI-generated legal advice and should not be considered official legal counsel.';
    
    const answer = disclaimerIndex !== -1 
      ? response.substring(0, disclaimerIndex)
      : response;

    // استخراج المواد القانونية (نمط: المادة X)
    const articleRegex = /المادة\s+(\d+)|Article\s+(\d+)/gi;
    const articles = [];
    let match;
    
    while ((match = articleRegex.exec(response)) !== null) {
      articles.push(match[1] || match[2]);
    }

    return {
      answer,
      confidence: 0.85, // يمكن حسابها بناءً على الثقة في الاستجابة
      relevantArticles: articles,
      suggestions: this.extractSuggestions(response),
      disclaimer,
    };
  }

  private parseDocumentAnalysis(response: string): DocumentAnalysisResponse {
    // تحليل استجابة تحليل المستند
    // هذا نموذج مبسط - في التطبيق الفعلي تحتاج لمعالجة أكثر تعقيداً
    const sections = response.split('\n\n');
    
    return {
      summary: this.extractSection(sections, 'Summary') || '',
      risks: this.extractList(sections, 'Risks'),
      strengths: this.extractList(sections, 'Strengths'),
      recommendations: this.extractList(sections, 'Recommendations'),
      keyClauses: this.extractKeyClauses(response),
    };
  }

  private extractSection(sections: string[], sectionName: string): string {
    const section = sections.find(s => s.startsWith(sectionName));
    return section ? section.replace(`${sectionName}:`, '').trim() : '';
  }

  private extractList(sections: string[], listName: string): string[] {
    const section = sections.find(s => s.startsWith(listName));
    if (!section) return [];
    
    const lines = section.split('\n').slice(1);
    return lines.map(line => line.replace(/^[•\-\d\.]+\s*/, '').trim()).filter(line => line);
  }

  private extractKeyClauses(response: string) {
    // استخراج البنود الرئيسية
    const clauseRegex = /(?:Clause|بند)[^:]*:[^•\n]*/gi;
    const matches = response.match(clauseRegex) || [];
    
    return matches.map(clause => ({
      clause: clause.trim(),
      riskLevel: this.assessRiskLevel(clause),
      suggestion: this.generateSuggestion(clause),
    }));
  }

  private assessRiskLevel(clause: string): 'low' | 'medium' | 'high' {
    const highRiskWords = ['penalty', 'termination', 'liability', 'indemnity', 'exclusive'];
    const mediumRiskWords = ['obligation', 'warranty', 'confidentiality', 'renewal'];
    
    const lowerClause = clause.toLowerCase();
    
    if (highRiskWords.some(word => lowerClause.includes(word))) {
      return 'high';
    } else if (mediumRiskWords.some(word => lowerClause.includes(word))) {
      return 'medium';
    }
    
    return 'low';
  }

  private generateSuggestion(clause: string): string {
    // توليد اقتراحات بناءً على نوع البند
    if (clause.toLowerCase().includes('liability')) {
      return 'Consider limiting liability to direct damages only';
    } else if (clause.toLowerCase().includes('termination')) {
      return 'Add notice period and cure period before termination';
    } else if (clause.toLowerCase().includes('confidentiality')) {
      return 'Define confidential information clearly and specify exceptions';
    }
    
    return 'Review with legal counsel';
  }

  private extractSuggestions(response: string): string[] {
    const suggestionRegex = /(?:Suggestion|Recommendation)[^:]*:[^•\n]*/gi;
    const matches = response.match(suggestionRegex) || [];
    return matches.map(s => s.replace(/^(?:Suggestion|Recommendation)[^:]*:\s*/, '').trim());
  }
}

// إنشاء نسخة مفردة من الخدمة
let aiServiceInstance: AIService | null = null;

export const getAIService = (): AIService => {
  if (!aiServiceInstance) {
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    aiServiceInstance = new AIService({
      provider: 'openai',
      apiKey,
    });
  }
  
  return aiServiceInstance;
};

export default AIService;