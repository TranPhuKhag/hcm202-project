import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import type { QuizResult } from '../types';
import './Leaderboard.css';

interface AIQuizResult {
  id: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timestamp: Date;
  quizTitle: string;
  playerName: string;
}

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'normal' | 'ai'>('normal');
  const [normalLeaderboard, setNormalLeaderboard] = useState<QuizResult[]>([]);
  const [aiLeaderboard, setAILeaderboard] = useState<AIQuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch normal quiz results
      const normalQuery = query(collection(db, 'quizResults'));
      const normalSnapshot = await getDocs(normalQuery);
      
      const normalResults: QuizResult[] = [];
      normalSnapshot.forEach((doc) => {
        const data = doc.data();
        normalResults.push({
          id: doc.id,
          username: data.username,
          score: data.score,
          totalQuestions: data.totalQuestions,
          timeTaken: data.timeTaken,
          quizDuration: data.quizDuration,
          timestamp: data.timestamp.toDate(),
          quizType: data.quizType || 'standard',
          difficulty: data.difficulty
        });
      });

      // Sort normal results
      const sortedNormal = normalResults.sort((a, b) => {
        if (a.score !== b.score) {
          return b.score - a.score;
        }
        return a.timeTaken - b.timeTaken;
      });

      // Fetch AI quiz results
      const aiQuery = query(collection(db, 'aiQuizResults'));
      const aiSnapshot = await getDocs(aiQuery);
      
      const aiResults: AIQuizResult[] = [];
      aiSnapshot.forEach((doc) => {
        const data = doc.data();
        aiResults.push({
          id: doc.id,
          playerName: data.username || data.playerName, // Support both field names
          score: data.score,
          totalQuestions: data.totalQuestions,
          timeSpent: data.timeTaken || data.timeSpent, // Support both field names
          difficulty: data.difficulty,
          quizTitle: data.quizTitle || `AI Quiz - ${data.difficulty}`,
          timestamp: data.timestamp.toDate()
        });
      });

      // Sort AI results by score, then by time
      const sortedAI = aiResults.sort((a, b) => {
        if (a.score !== b.score) {
          return b.score - a.score;
        }
        return a.timeSpent - b.timeSpent;
      });

      setNormalLeaderboard(sortedNormal.slice(0, 10));
      setAILeaderboard(sortedAI.slice(0, 10));
    } catch (err) {
      console.error('Error loading leaderboards:', err);
      setError('Không thể tải bảng xếp hạng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPercentage = (score: number, total: number) => {
    return Math.round((score / total) * 100);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankClass = (rank: number) => {
    switch (rank) {
      case 1: return 'rank-gold';
      case 2: return 'rank-silver';
      case 3: return 'rank-bronze';
      default: return 'rank-normal';
    }
  };

  const getCurrentLeaderboard = () => {
    return activeTab === 'normal' ? normalLeaderboard : aiLeaderboard;
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="loading">
          <h2>Đang tải bảng xếp hạng...</h2>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-container">
        <div className="error">
          <h2>Có lỗi xảy ra</h2>
          <p>{error}</p>
          <button className="retry-button" onClick={fetchLeaderboards}>
            Thử Lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>🏆 Bảng Xếp Hạng</h1>
        <p className="leaderboard-description">
          Top 10 học viên xuất sắc nhất trong các bài kiểm tra
        </p>
        <div className="controls-container">
          <div className="tab-navigation">
            <button
              className={`tab-button ${activeTab === 'normal' ? 'active' : ''}`}
              onClick={() => setActiveTab('normal')}
            >
              Quiz Thường
            </button>
            <button
              className={`tab-button ${activeTab === 'ai' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai')}
            >
              AI Quiz
            </button>
          </div>

          <button className="refresh-button" onClick={fetchLeaderboards}>
            🔄 Làm Mới
          </button>
        </div>
      </div>

      {getCurrentLeaderboard().length === 0 ? (
        <div className="empty-leaderboard">
          <h3>Chưa có kết quả nào</h3>
          <p>Hãy là người đầu tiên hoàn thành bài kiểm tra!</p>
        </div>
      ) : (
        <div className="leaderboard-content">
          {/* Top 3 Podium */}
          <div className="podium">
            {getCurrentLeaderboard().slice(0, 3).map((result: QuizResult | AIQuizResult, index: number) => (
              <div key={result.id} className={`podium-item ${getRankClass(index + 1)}`}>
                <div className="podium-rank">{getRankIcon(index + 1)}</div>
                <div className="podium-user">
                  <h3>{'username' in result ? result.username : result.playerName}</h3>
                  <div className="podium-score">
                    {result.score}/{result.totalQuestions}
                  </div>
                  <div className="podium-percentage">
                    {getPercentage(result.score, result.totalQuestions)}%
                  </div>
                  <div className="podium-time">
                    ⏱️ {activeTab === 'normal' && 'timeTaken' in result 
                         ? formatTime(result.timeTaken) 
                         : activeTab === 'ai' && 'timeSpent' in result 
                         ? formatTime(result.timeSpent)
                         : 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Full Leaderboard Table */}
          <div className="leaderboard-table">
            <table>
              <thead>
                <tr>
                  <th>Hạng</th>
                  <th>Tên</th>
                  <th>Điểm</th>
                  <th>Tỷ lệ</th>
                  <th>Thời gian</th>
                  <th>Ngày làm bài</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentLeaderboard().map((result: QuizResult | AIQuizResult, index: number) => (
                  <tr key={result.id} className={getRankClass(index + 1)}>
                    <td className="rank-cell">
                      <span className="rank-display">
                        {getRankIcon(index + 1)}
                      </span>
                    </td>
                    <td className="name-cell">
                      <strong>{'username' in result ? result.username : result.playerName}</strong>
                    </td>
                    <td className="score-cell">
                      <span className="score-display">
                        {result.score}/{result.totalQuestions}
                      </span>
                    </td>
                    <td className="percentage-cell">
                      <div className="percentage-bar">
                        <div 
                          className="percentage-fill"
                          style={{ width: `${getPercentage(result.score, result.totalQuestions)}%` }}
                        ></div>
                        <span className="percentage-text">
                          {getPercentage(result.score, result.totalQuestions)}%
                        </span>
                      </div>
                    </td>
                    <td className="time-cell">
                      ⏱️ {activeTab === 'normal' && 'timeTaken' in result 
                           ? formatTime(result.timeTaken) 
                           : activeTab === 'ai' && 'timeSpent' in result 
                           ? formatTime(result.timeSpent)
                           : 'N/A'}
                    </td>
                    <td className="date-cell">
                      {formatDate(result.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="leaderboard-stats">
            <div className="stat-item">
              <h4>Tổng số bài làm</h4>
              <span>{getCurrentLeaderboard().length}</span>
            </div>
            <div className="stat-item">
              <h4>Điểm trung bình</h4>
              <span>
                {getCurrentLeaderboard().length > 0 
                  ? Math.round(getCurrentLeaderboard().reduce((sum: number, result: QuizResult | AIQuizResult) => sum + result.score, 0) / getCurrentLeaderboard().length * 10) / 10
                  : 0
                } điểm
              </span>
            </div>
            <div className="stat-item">
              <h4>Thời gian trung bình</h4>
              <span>
                {activeTab === 'normal' && getCurrentLeaderboard().length > 0
                  ? formatTime(Math.round((getCurrentLeaderboard() as QuizResult[]).reduce((sum: number, result: QuizResult) => sum + result.timeTaken, 0) / getCurrentLeaderboard().length))
                  : '0:00'
                }
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
