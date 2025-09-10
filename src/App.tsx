
import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Lesson from './pages/Lesson'
import Quiz from './pages/Quiz'
import Leaderboard from './pages/Leaderboard'
import AIChat from './pages/AIChat'
import FloatingChat from './components/FloatingChat'

export default function App(){
  return (
    <div>
      <nav className="nav">
        <div className="container nav-inner">
          <div className="brand">
            <span className="dot" />
            <span>HCM202 · Chương III</span>
          </div>
          <div className="nav-links">
            <NavLink to="/" end className={({isActive})=> isActive?'active':''}>Giới thiệu</NavLink>
            <NavLink to="/lesson" className={({isActive})=> isActive?'active':''}>Giới thiệu Bài học</NavLink>
            <NavLink to="/quiz" className={({isActive})=> isActive?'active':''}>Kiểm Tra Kiến Thức</NavLink>
            <NavLink to="/leaderboard" className={({isActive})=> isActive?'active':''}>Bảng Xếp Hạng</NavLink>
            <NavLink to="/ai" className={({isActive})=> isActive?'active':''}>Hỏi Đáp AI</NavLink>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/ai" element={<AIChat />} />
      </Routes>

      <FloatingChat />
      <footer className="footer">
        <div className="container">© {new Date().getFullYear()} HCM202</div>
      </footer>
    </div>
  )
}
