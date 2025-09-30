import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import type { QuizResult } from '../types';
import './Leaderboard.css';

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // Lấy tất cả kết quả từ Firestore
      const q = query(collection(db, 'quizResults'));
      const querySnapshot = await getDocs(q);
      
      const results: QuizResult[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        results.push({
          id: doc.id,
          username: data.username,
          score: data.score,
          totalQuestions: data.totalQuestions,
          timeTaken: data.timeTaken,
          quizDuration: data.quizDuration,
          timestamp: data.timestamp.toDate()
        });
      });

      // Sắp xếp theo điểm số giảm dần, nếu điểm bằng nhau thì ưu tiên thời gian ngắn hơn
      const sortedResults = results.sort((a, b) => {
        if (a.score !== b.score) {
          return b.score - a.score; // Điểm cao hơn đứng trước
        }
        return a.timeTaken - b.timeTaken; // Thời gian ngắn hơn đứng trước
      });

      // Chỉ lấy top 10
      setLeaderboard(sortedResults.slice(0, 10));
    } catch (err) {
      console.error('Lỗi khi tải bảng xếp hạng:', err);
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
          <button className="retry-button" onClick={fetchLeaderboard}>
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
        <button className="refresh-button" onClick={fetchLeaderboard}>
          🔄 Làm Mới
        </button>
      </div>

      {leaderboard.length === 0 ? (
        <div className="empty-leaderboard">
          <h3>Chưa có kết quả nào</h3>
          <p>Hãy là người đầu tiên hoàn thành bài kiểm tra!</p>
        </div>
      ) : (
        <div className="leaderboard-content">
          {/* Top 3 Podium */}
          <div className="podium">
            {leaderboard.slice(0, 3).map((result, index) => (
              <div key={result.id} className={`podium-item ${getRankClass(index + 1)}`}>
                <div className="podium-rank">{getRankIcon(index + 1)}</div>
                <div className="podium-user">
                  <h3>{result.username}</h3>
                  <div className="podium-score">
                    {result.score}/{result.totalQuestions}
                  </div>
                  <div className="podium-percentage">
                    {getPercentage(result.score, result.totalQuestions)}%
                  </div>
                  <div className="podium-time">
                    ⏱️ {formatTime(result.timeTaken)}
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
                {leaderboard.map((result, index) => (
                  <tr key={result.id} className={getRankClass(index + 1)}>
                    <td className="rank-cell">
                      <span className="rank-display">
                        {getRankIcon(index + 1)}
                      </span>
                    </td>
                    <td className="name-cell">
                      <strong>{result.username}</strong>
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
                      ⏱️ {formatTime(result.timeTaken)}
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
              <span>{leaderboard.length}</span>
            </div>
            <div className="stat-item">
              <h4>Điểm trung bình</h4>
              <span>
                {leaderboard.length > 0 
                  ? Math.round(leaderboard.reduce((sum, result) => sum + result.score, 0) / leaderboard.length * 10) / 10
                  : 0
                } điểm
              </span>
            </div>
            <div className="stat-item">
              <h4>Thời gian trung bình</h4>
              <span>
                {leaderboard.length > 0 
                  ? formatTime(Math.round(leaderboard.reduce((sum, result) => sum + result.timeTaken, 0) / leaderboard.length))
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
