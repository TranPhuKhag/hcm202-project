import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { quizQuestions } from '../data/quizQuestions';
import { generateAIQuiz } from '../utils/geminiService';
import type { QuizResult } from '../types';
import './Quiz.css';

const STANDARD_QUESTION_TIME = 30; // 30 giây cho câu hỏi chuẩn
const AI_QUESTION_TIME = 60; // 60 giây cho câu hỏi AI
const STANDARD_TOTAL_TIME = 300; // 5 phút cho quiz chuẩn
const AI_TOTAL_TIME = 420; // 7 phút cho AI quiz (5 câu x 60s + buffer)

type QuizMode = 'standard' | 'ai';
type Difficulty = 'easy' | 'medium' | 'hard';

interface Question {
  id?: string;
  question: string;
  options: string[];
  correctAnswer?: number;
  correct?: number;
  explanation?: string;
}

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const [quizMode, setQuizMode] = useState<QuizMode>('standard');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(STANDARD_QUESTION_TIME);
  const [totalTimeLeft, setTotalTimeLeft] = useState(STANDARD_TOTAL_TIME);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [username, setUsername] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);

  // Get question time limit based on quiz mode
  const getQuestionTimeLimit = () => {
    return quizMode === 'ai' ? AI_QUESTION_TIME : STANDARD_QUESTION_TIME;
  };

  // Get total quiz time based on quiz mode
  const getTotalQuizTime = () => {
    return quizMode === 'ai' ? AI_TOTAL_TIME : STANDARD_TOTAL_TIME;
  };

  // Timer cho câu hỏi hiện tại
  useEffect(() => {
    if (!isStarted || isQuizFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return getQuestionTimeLimit();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, isStarted, isQuizFinished]);

  // Timer cho tổng thời gian làm bài
  useEffect(() => {
    if (!isStarted || isQuizFinished) return;

    const timer = setInterval(() => {
      setTotalTimeLeft((prev) => {
        if (prev <= 1) {
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isQuizFinished]);

  // Initialize questions based on mode
  useEffect(() => {
    if (!isStarted) {
      if (quizMode === 'standard') {
        setCurrentQuestions(quizQuestions.map(q => ({
          ...q,
          correctAnswer: q.correctAnswer
        })));
      } else if (quizMode === 'ai') {
        // Chỉ reset nếu chưa có câu hỏi AI
        setCurrentQuestions([]);
      }
      setTimeLeft(getQuestionTimeLimit());
      setTotalTimeLeft(getTotalQuizTime());
    }
  }, [quizMode, isStarted]);

  const generateAIQuizData = async () => {
    try {
      setAIError(null);
      console.log('Generating AI quiz with difficulty:', difficulty); // Debug log
      const data = await generateAIQuiz(difficulty);
      // console.log('AI quiz data received:', data); // Debug log
      // Kiểm tra dữ liệu hợp lệ
      if (!data || !Array.isArray(data.questions) || data.questions.length === 0) {
        setAIError('Không nhận được câu hỏi AI hợp lệ. Vui lòng thử lại.');
        setCurrentQuestions([]);
        return null;
      }
      // Kiểm tra từng câu hỏi
      const aiQuestions = data.questions
        .filter(q => q && q.question && Array.isArray(q.options) && q.options.length === 4 && typeof q.correct === 'number')
        .map(q => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correct,
          explanation: q.explanation
        }));
      if (aiQuestions.length === 0) {
        setAIError('Không có câu hỏi AI hợp lệ. Vui lòng thử lại.');
        setCurrentQuestions([]);
        return null;
      }
      setCurrentQuestions(aiQuestions);
      // console.log('Generated AI questions:', aiQuestions); // Debug log
      return aiQuestions; // Return the questions instead of just true
    } catch (error) {
      console.error('Error generating AI quiz:', error);
      setAIError('Có lỗi xảy ra khi tạo câu hỏi AI. Vui lòng thử lại.');
      setCurrentQuestions([]); // Reset questions on error
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const startQuiz = async () => {
    if (username.trim() === '') {
      alert('Vui lòng nhập tên của bạn để bắt đầu!');
      return;
    }

    let questionsToUse = currentQuestions;

    if (quizMode === 'ai') {
      setIsGenerating(true); // Set loading state
      const aiQuestions = await generateAIQuizData();
      if (!aiQuestions || aiQuestions.length === 0) {
        return; // Error occurred in generation
      }
      questionsToUse = aiQuestions; // Use the returned questions directly
    }

    // Set initial time based on quiz mode
    setTimeLeft(getQuestionTimeLimit());
    setTotalTimeLeft(getTotalQuizTime());
    setIsStarted(true);
    setStartTime(Date.now());
    console.log('Quiz started with questions:', questionsToUse.length);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(getQuestionTimeLimit());
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setIsQuizFinished(true);
    
    // Tính điểm
    let correctAnswers = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === currentQuestions[index]?.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = correctAnswers;
    setScore(finalScore);
    
    // Tính thời gian thực tế làm bài
    const actualTimeTaken = Math.round((Date.now() - startTime) / 1000);
    
    // Lưu kết quả vào Firestore
    try {
      const baseQuizResult = {
        username: username.trim(),
        score: finalScore,
        totalQuestions: currentQuestions.length,
        timeTaken: actualTimeTaken,
        quizDuration: getTotalQuizTime(),
        timestamp: new Date(),
        quizType: quizMode === 'ai' ? `ai-${difficulty}` : 'standard'
      };

      // Only include difficulty field if it exists (for AI quizzes)
      const quizResult: Omit<QuizResult, 'id'> = quizMode === 'ai' 
        ? { ...baseQuizResult, difficulty }
        : baseQuizResult;
      
      // Lưu vào collection phù hợp
      const collectionName = quizMode === 'ai' ? 'aiQuizResults' : 'quizResults';
      await addDoc(collection(db, collectionName), quizResult);
      setShowResult(true);
    } catch (error) {
      console.error('Lỗi khi lưu kết quả:', error);
      alert('Có lỗi xảy ra khi lưu kết quả. Vui lòng thử lại sau.');
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setTimeLeft(getQuestionTimeLimit());
    setTotalTimeLeft(getTotalQuizTime());
    setIsQuizFinished(false);
    setIsStarted(false);
    setScore(0);
    setUsername('');
    setShowResult(false);
    setStartTime(0);
    setQuizMode('standard');
    setDifficulty('medium');
    setCurrentQuestions([]);
    setIsGenerating(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Màn hình loading khi tạo AI quiz
  if (isGenerating) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div className="loading-animation">
            <h1>🤖 Đang tạo câu hỏi AI</h1>
            <p className="quiz-description">
              Vui lòng đợi trong giây lát, AI đang tạo {5} câu hỏi về tư tưởng Hồ Chí Minh với mức độ {difficulty === 'easy' ? 'Dễ' : difficulty === 'medium' ? 'Trung bình' : 'Khó'}...
            </p>
            <div className="spinner"></div>
            <p>Đang xử lý...</p>
          </div>
        </div>
      </div>
    );
  }

  // Màn hình bắt đầu
  if (!isStarted) {
    const questionCount = quizMode === 'ai' ? (currentQuestions.length || 5) : quizQuestions.length;
    
    return (
      <div className="quiz-container">
        <div className="quiz-card quiz-start">
          <h1>Kiểm Tra Kiến Thức</h1>
          <p className="quiz-description">
            {quizMode === 'ai' 
              ? `Thử thách bản thân với ${questionCount} câu hỏi được tạo bởi AI về tư tưởng Hồ Chí Minh.`
              : `Bài kiểm tra gồm ${questionCount} câu hỏi trắc nghiệm về tư tưởng Hồ Chí Minh.`}
          </p>
          
          {/* Quiz Mode Selection */}
          <div className="quiz-mode-selection">
            <h3>Chế độ kiểm tra</h3>
            <div className="mode-options">
              <label className="mode-option">
                <input
                  type="radio"
                  name="quizMode"
                  value="standard"
                  checked={quizMode === 'standard'}
                  onChange={() => setQuizMode('standard')}
                />
                <span>📚 Quiz Thường</span>
              </label>
              <label className="mode-option">
                <input
                  type="radio"
                  name="quizMode"
                  value="ai"
                  checked={quizMode === 'ai'}
                  onChange={() => setQuizMode('ai')}
                />
                <span>🤖 AI Quiz</span>
              </label>
            </div>
          </div>

          {/* Difficulty Selection for AI mode */}
          {quizMode === 'ai' && (
            <div className="difficulty-selection">
              <h3>Độ khó</h3>
              <div className="difficulty-options">
                <label className="difficulty-option">
                  <input
                    type="radio"
                    name="difficulty"
                    value="easy"
                    checked={difficulty === 'easy'}
                    onChange={() => setDifficulty('easy')}
                  />
                  <span>🟢 Dễ</span>
                </label>
                <label className="difficulty-option">
                  <input
                    type="radio"
                    name="difficulty"
                    value="medium"
                    checked={difficulty === 'medium'}
                    onChange={() => setDifficulty('medium')}
                  />
                  <span>🟡 Trung bình</span>
                </label>
                <label className="difficulty-option">
                  <input
                    type="radio"
                    name="difficulty"
                    value="hard"
                    checked={difficulty === 'hard'}
                    onChange={() => setDifficulty('hard')}
                  />
                  <span>🔴 Khó</span>
                </label>
              </div>
            </div>
          )}
          
          <div className="username-input">
            <input
              type="text"
              placeholder="Nhập tên của bạn để bắt đầu"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={50}
            />
          </div>
          <button 
            className="start-button" 
            onClick={startQuiz}
            disabled={username.trim() === '' || isGenerating}
          >
            {isGenerating ? '🤖 Đang tạo...' : 'Bắt Đầu'}
          </button>
        </div>
      </div>
    );
  }

  // Màn hình kết quả
  if (isQuizFinished && showResult) {
    const percentage = currentQuestions.length > 0 ? Math.round((score / currentQuestions.length) * 100) : 0;
    
    return (
      <div className="quiz-container">
        <div className="quiz-card quiz-result">
          <h1>Kết Quả Kiểm Tra</h1>
          <div className="result-summary">
            <h2>Chúc mừng {username}!</h2>
            <div className="score-display">
              <svg className="score-circle" width="150" height="150" viewBox="0 0 150 150">
                <circle className="score-circle-bg" cx="75" cy="75" r="65"></circle>
                <circle 
                  className="score-circle-fg" 
                  cx="75" 
                  cy="75" 
                  r="65" 
                  strokeDasharray="408" 
                  strokeDashoffset={408 - (408 * percentage) / 100}
                ></circle>
              </svg>
              <div className="score-text">
                <span className="score-number">{score}</span>
                <span className="score-total">/{currentQuestions.length}</span>
              </div>
            </div>
            <p className="result-message">
              {percentage >= 80 ? 'Xuất sắc! Bạn đã nắm vững kiến thức!' :
               percentage >= 60 ? 'Tốt! Bạn đã hiểu khá tốt bài học.' :
               percentage >= 40 ? 'Khá! Bạn cần ôn tập thêm một chút.' :
               'Hãy ôn tập lại bài học và thử lần nữa nhé!'}
            </p>
          </div>
          
          <div className="answer-review">
            <h3>Chi tiết câu trả lời:</h3>
            {currentQuestions.map((question, index) => (
              <div key={question.id || index} className="answer-item">
                <p className="question-text">
                  <strong>Câu {index + 1}:</strong> {question.question}
                </p>
                <div className="answer-options">
                  {question.options.map((option, optionIndex) => (
                    <div 
                      key={optionIndex} 
                      className={`option ${
                        optionIndex === question.correctAnswer ? 'correct' : ''
                      } ${
                        optionIndex === selectedAnswers[index] && optionIndex !== question.correctAnswer ? 'incorrect' : ''
                      }`}
                    >
                      {optionIndex === question.correctAnswer && '✓ '}
                      {optionIndex === selectedAnswers[index] && optionIndex !== question.correctAnswer && '✗ '}
                      {option}
                    </div>
                  ))}
                </div>
                {question.explanation && (
                  <p className="explanation">💡 {question.explanation}</p>
                )}
              </div>
            ))}
          </div>
          
          <div className="result-actions">
            <button className="retry-button" onClick={resetQuiz}>
              Làm Lại
            </button>
            <button className="leaderboard-button" onClick={() => navigate('/leaderboard')}>
              Xem Bảng Xếp Hạng
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Màn hình làm bài
  const question = currentQuestions[currentQuestion];
  
  if (!question) {
    if (aiError) {
      return (
        <div className="quiz-container">
          <div className="quiz-card quiz-error">
            <h2>Lỗi AI Quiz</h2>
            <p>{aiError}</p>
            <button className="retry-button" onClick={() => { setAIError(null); setIsStarted(false); }}>Thử lại</button>
          </div>
        </div>
      );
    }
    return (
      <div className="quiz-container">
        <div className="quiz-card loading-animation">
          <div className="spinner"></div>
          <p>Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <div className="quiz-progress">
            <span>Câu {currentQuestion + 1}/{currentQuestions.length}</span>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((currentQuestion + 1) / currentQuestions.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="quiz-timers">
            <div className="question-timer">
              <span>⏳ {timeLeft}s</span>
            </div>
            <div className="total-timer">
              <span>⏱️ {formatTime(totalTimeLeft)}</span>
            </div>
          </div>
        </div>

        <div className="question-container">
          <h2 className="question-text">{question.question}</h2>
          <div className="options-container">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${selectedAnswers[currentQuestion] === index ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(index)}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>

          <div className="question-actions">
            <button 
              className="next-button"
              onClick={handleNextQuestion}
              disabled={selectedAnswers[currentQuestion] === undefined}
            >
              {currentQuestion === currentQuestions.length - 1 ? 'Hoàn Thành' : 'Câu Tiếp Theo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
