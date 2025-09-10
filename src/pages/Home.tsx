
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <header className="hero">
      <div className="container">
        <h1 className="h1">Tư tưởng Hồ Chí Minh · Chương III<br/><span className="gold">Độc lập Dân tộc</span></h1>
        <p className="subtle">
          Giữ cấu trúc như dự án HCM202 (Lesson · Quiz · Leaderboard · Hỏi đáp AI),
        </p>
        <div className="hero-actions">
          <Link className="btn" to="/lesson">Giới thiệu Bài học</Link>
          <Link className="btn ghost" to="/quiz">Kiểm Tra</Link>
          <Link className="btn" to="/leaderboard">Bảng Xếp Hạng</Link>
          <Link className="btn ghost" to="/ai">Hỏi Đáp AI</Link>
        </div>
      </div>
    </header>
  )
}
