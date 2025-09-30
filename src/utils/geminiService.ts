import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY not found in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface AIQuizData {
  title: string;
  questions: QuizQuestion[];
  difficulty: 'easy' | 'medium' | 'hard';
}

// Generate image search terms for lesson topics
export const generateImageSearchTerms = async (topic: string): Promise<string> => {
  try {
    const prompt = `Tạo từ khóa tìm kiếm ảnh cho chủ đề "${topic}" trong giảng dạy. 
    Chỉ trả về 2-3 từ khóa ngắn gọn bằng tiếng Anh, phù hợp để tìm ảnh minh họa giáo dục.
    Ví dụ: "education students classroom" hoặc "science laboratory experiment"`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating image search terms:', error);
    // Fallback search terms
    return 'education learning students';
  }
};

// Get random image from Unsplash
export const getRandomImage = async (searchTerms?: string): Promise<string> => {
  try {
    const terms = searchTerms || 'education learning';
    const response = await fetch(
      `https://source.unsplash.com/800x400/?${encodeURIComponent(terms)}&${Date.now()}`
    );
    return response.url;
  } catch (error) {
    console.error('Error fetching image:', error);
    // Fallback to default education image
    return 'https://source.unsplash.com/800x400/?education';
  }
};

// Generate AI quiz questions
export const generateAIQuiz = async (
  difficulty: 'easy' | 'medium' | 'hard'
): Promise<AIQuizData> => {
  try {
    const difficultyDescriptions = {
      easy: 'cơ bản, dễ hiểu, phù hợp người mới bắt đầu',
      medium: 'trung bình, cần suy nghĩ và phân tích',
      hard: 'khó, cần kiến thức sâu và tư duy logic cao'
    };

    // Always focus on Ho Chi Minh theme
    const topicPrompt = 'về tư tưởng, cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh';
    
    const prompt = `Tạo một bộ 5 câu hỏi trắc nghiệm ${topicPrompt} với độ khó ${difficultyDescriptions[difficulty]}.

Nội dung câu hỏi phải bao gồm:
- Cuộc đời và sự nghiệp của Hồ Chí Minh
- Tư tưởng Hồ Chí Minh về độc lập dân tộc, chủ nghĩa xã hội
- Phong cách lãnh đạo và nhân cách đạo đức của Bác Hồ
- Vai trò của Hồ Chí Minh trong lịch sử Việt Nam
- Di sản tư tưởng và tác phẩm của Người

Trả về kết quả theo định dạng JSON chính xác sau:
{
  "title": "Tên bộ câu hỏi về Hồ Chí Minh",
  "questions": [
    {
      "question": "Câu hỏi về Hồ Chí Minh",
      "options": ["A. Đáp án 1", "B. Đáp án 2", "C. Đáp án 3", "D. Đáp án 4"],
      "correct": 0,
      "explanation": "Giải thích chi tiết tại sao đáp án này đúng"
    }
  ]
}

Yêu cầu:
- 5 câu hỏi đa dạng và thú vị về Hồ Chí Minh
- 4 đáp án cho mỗi câu (A, B, C, D)
- Chỉ số correct từ 0-3 (0=A, 1=B, 2=C, 3=D)
- Giải thích chi tiết và dễ hiểu về lịch sử, tư tưởng Hồ Chí Minh
- Nội dung phù hợp với độ khó ${difficulty}`;

    console.log('Starting AI quiz generation with difficulty:', difficulty);
    const result = await model.generateContent(prompt);
    console.log('AI response received');
    const response = result.response;
    const text = response.text().trim();
    console.log('AI response text:', text.substring(0, 500) + '...'); // Log first 500 chars
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No valid JSON found in response');
      throw new Error('No valid JSON found in response');
    }
    
    console.log('JSON match found:', jsonMatch[0].substring(0, 200) + '...');
    const quizData = JSON.parse(jsonMatch[0]) as AIQuizData;
    quizData.difficulty = difficulty;
    
    // Validate the quiz data
    if (!quizData.questions || quizData.questions.length !== 5) {
      throw new Error('Invalid quiz data structure');
    }
    
    return quizData;
  } catch (error) {
    console.error('Error generating AI quiz:', error);
    
    // Fallback quiz data about Ho Chi Minh
    return {
      title: `Tư tưởng Hồ Chí Minh - Độ khó ${difficulty === 'easy' ? 'Dễ' : difficulty === 'medium' ? 'Trung bình' : 'Khó'}`,
      difficulty,
      questions: [
        {
          question: 'Chủ tịch Hồ Chí Minh sinh năm nào?',
          options: [
            'A. 1890',
            'B. 1889',
            'C. 1891',
            'D. 1892'
          ],
          correct: 0,
          explanation: 'Chủ tịch Hồ Chí Minh sinh ngày 19/5/1890 tại làng Sen, xã Kim Liên, huyện Nam Đàn, tỉnh Nghệ An.'
        },
        {
          question: 'Tên thật của Chủ tịch Hồ Chí Minh là gì?',
          options: [
            'A. Nguyễn Tất Thành',
            'B. Nguyễn Ái Quốc',
            'C. Nguyễn Sinh Cung',
            'D. Lý Thùy'
          ],
          correct: 2,
          explanation: 'Tên khai sinh của Chủ tịch Hồ Chí Minh là Nguyễn Sinh Cung. Sau này Người đổi tên thành Nguyễn Tất Thành.'
        },
        {
          question: 'Tác phẩm nào sau đây của Hồ Chí Minh viết về đạo đức cách mạng?',
          options: [
            'A. Đường Kách Mệnh',
            'B. Tự Thức',
            'C. Sửa Đổi Lối Làm Việc',
            'D. Nhật Ký Trong Tù'
          ],
          correct: 2,
          explanation: 'Tác phẩm "Sửa Đổi Lối Làm Việc" của Hồ Chí Minh tập trung vào việc xây dựng đạo đức cách mạng và phong cách làm việc của cán bộ, đảng viên.'
        },
        {
          question: 'Hồ Chí Minh thành lập Đảng Cộng sản Việt Nam vào năm nào?',
          options: [
            'A. 1929',
            'B. 1930',
            'C. 1931',
            'D. 1932'
          ],
          correct: 1,
          explanation: 'Ngày 3/2/1930, tại Hồng Kông, Nguyễn Ái Quốc (Hồ Chí Minh) chủ trì Hội nghị thống nhất các tổ chức cộng sản ở Việt Nam và thành lập Đảng Cộng sản Việt Nam.'
        },
        {
          question: 'Theo Hồ Chí Minh, điều quan trọng nhất trong cách mạng là gì?',
          options: [
            'A. Vũ khí hiện đại',
            'B. Con người cách mạng',
            'C. Kinh tế phát triển',
            'D. Quân đội hùng mạnh'
          ],
          correct: 1,
          explanation: 'Theo tư tưởng Hồ Chí Minh, con người là yếu tố quyết định thắng lợi của cách mạng. Người luôn đặt việc giáo dục, đào tạo con người cách mạng lên hàng đầu.'
        }
      ]
    };
  }
};

// Generate image using AI description to search terms
export const generateImage = async (description: string): Promise<string> => {
  try {
    // First, generate search terms from the description
    const searchTerms = await generateImageSearchTerms(description);
    
    // Then get an image using those search terms
    return await getRandomImage(searchTerms);
  } catch (error) {
    console.error('Error generating image:', error);
    // Fallback to a default education image
    return 'https://source.unsplash.com/800x400/?vietnam,culture,education';
  }
};

// Chat with AI assistant
export const chatWithAI = async (message: string, context?: string): Promise<string> => {
  try {
    const contextPrompt = context 
      ? `Bối cảnh: ${context}\n\nCâu hỏi của người dùng: ${message}`
      : message;
    
    const prompt = `Bạn là một trợ lý AI thông minh và hữu ích. Hãy trả lời câu hỏi sau một cách chi tiết và dễ hiểu:

${contextPrompt}

Hãy trả lời bằng tiếng Việt, thân thiện và cung cấp thông tin chính xác.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error chatting with AI:', error);
    return 'Xin lỗi, tôi không thể trả lời câu hỏi của bạn lúc này. Vui lòng thử lại sau.';
  }
};
