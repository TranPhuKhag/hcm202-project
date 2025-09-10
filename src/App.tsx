import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import FloatingChat from './components/FloatingChat';
import LessonIntroduction from './pages/LessonIntroduction';
import Quiz from './pages/Quiz';
import Leaderboard from './pages/Leaderboard';
import AIChatbot from './pages/AIChatbot';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isQuizPage = location.pathname === '/quiz';
  
  return (
    <div className="App">
      <Navigation />
      <main className={isQuizPage ? "main-content full-width" : "main-content"}>
        <Routes>
          <Route path="/" element={<LessonIntroduction />} />
          <Route path="/lesson" element={<LessonIntroduction />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/chatbot" element={<AIChatbot />} />
        </Routes>
      </main>
      <FloatingChat />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
