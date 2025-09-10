// Service để tương tác với Google Gemini API
export interface AIQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AIQuizSet {
  id: string;
  title: string;
  questions: AIQuizQuestion[];
  timeLimit: number; // seconds
  createdAt: Date;
}

class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!this.apiKey) {
      console.error('❌ VITE_GEMINI_API_KEY không được cấu hình');
    }
  }

  // Tạo prompt để tìm ảnh liên quan
  async generateImageSearchTerms(): Promise<string[]> {
    const prompt = `
    Tạo 5 từ khóa tìm kiếm ảnh bằng tiếng Anh liên quan đến chủ đề "Tư tưởng Hồ Chí Minh về nhà nước của dân, do dân, vì dân".
    
    Yêu cầu:
    - Mỗi từ khóa 2-4 từ
    - Phù hợp để tìm ảnh lịch sử, chân dung, biểu tượng
    - Tách biệt bằng dấu |
    
    Ví dụ: Ho Chi Minh portrait|Vietnam flag|Vietnamese people|government building|democracy symbol
    
    Chỉ trả về danh sách từ khóa, không giải thích thêm:`;

    try {
      const response = await fetch(`${this.baseUrl}/gemini-2.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 100,
          }
        })
      });

      const data = await response.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      return result.split('|').map((term: string) => term.trim()).filter((term: string) => term.length > 0);
    } catch (error) {
      console.error('Lỗi khi tạo từ khóa tìm ảnh:', error);
      return [
        'Ho Chi Minh portrait',
        'Vietnam flag',
        'Vietnamese people',
        'government building',
        'democracy symbol'
      ];
    }
  }

  // Tạo bộ câu hỏi AI Quiz
  async generateAIQuiz(difficulty: 'easy' | 'medium' | 'hard' = 'medium', questionCount: number = 5): Promise<AIQuizSet> {
    const difficultyMap = {
      easy: 'dễ, phù hợp với học sinh phổ thông',
      medium: 'trung bình, phù hợp với sinh viên đại học', 
      hard: 'khó, phù hợp với nghiên cứu sinh và chuyên gia'
    };

    const prompt = `
    Tạo ${questionCount} câu hỏi trắc nghiệm về tư tưởng Hồ Chí Minh "Nhà nước của dân, do dân, vì dân".
    
    Độ khó: ${difficultyMap[difficulty]}
    
    YÊU CẦU:
    - Mỗi câu hỏi có 4 đáp án A, B, C, D
    - Có 1 đáp án đúng duy nhất
    - Kèm giải thích chi tiết cho đáp án đúng
    - Câu hỏi đa dạng: khái niệm, ý nghĩa, ứng dụng, so sánh
    
    Định dạng JSON chính xác:
    {
      "questions": [
        {
          "question": "Câu hỏi đầy đủ?",
          "options": ["A. Đáp án A", "B. Đáp án B", "C. Đáp án C", "D. Đáp án D"],
          "correctAnswer": 0,
          "explanation": "Giải thích chi tiết tại sao đáp án A đúng và các đáp án khác sai..."
        }
      ]
    }
    
    Chỉ trả về JSON, không giải thích thêm:`;

    try {
      const response = await fetch(`${this.baseUrl}/gemini-2.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        })
      });

      const data = await response.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Làm sạch JSON response
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Không thể parse JSON từ response');
      }

      const parsedData = JSON.parse(jsonMatch[0]);
      
      const quizSet: AIQuizSet = {
        id: `ai_quiz_${Date.now()}`,
        title: `Thử thách AI - ${difficulty.toUpperCase()}`,
        questions: parsedData.questions.map((q: any, index: number) => ({
          id: `ai_q_${Date.now()}_${index}`,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty
        })),
        timeLimit: questionCount * (difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 60),
        createdAt: new Date()
      };

      return quizSet;

    } catch (error) {
      console.error('Lỗi khi tạo AI Quiz:', error);
      
      // Fallback quiz nếu API lỗi
      return {
        id: `fallback_quiz_${Date.now()}`,
        title: `Thử thách AI - ${difficulty.toUpperCase()}`,
        questions: [
          {
            id: 'fallback_1',
            question: '"Của dân" trong tư tưởng Hồ Chí Minh có nghĩa là gì?',
            options: [
              'A. Nhà nước thuộc về nhân dân',
              'B. Nhà nước do vua chúa cai trị', 
              'C. Nhà nước thuộc về tư bản',
              'D. Nhà nước do quân đội quản lý'
            ],
            correctAnswer: 0,
            explanation: 'Đáp án A đúng vì "của dân" có nghĩa là nhà nước thuộc về nhân dân, nhân dân là chủ nhân thực sự của đất nước.',
            difficulty
          }
        ],
        timeLimit: 60,
        createdAt: new Date()
      };
    }
  }

  // Lấy ảnh từ Unsplash API (free)
  async getRandomImage(): Promise<string> {
    const searchTerms = await this.generateImageSearchTerms();
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    
    try {
      // Sử dụng Unsplash Source API (không cần API key)
      const imageUrl = `https://source.unsplash.com/800x400/?${encodeURIComponent(randomTerm)}`;
      return imageUrl;
    } catch (error) {
      console.error('Lỗi khi lấy ảnh:', error);
      // Fallback placeholder
      return 'https://via.placeholder.com/800x400/d32f2f/white?text=Tư+tưởng+Hồ+Chí+Minh';
    }
  }
}

export const geminiService = new GeminiService();
