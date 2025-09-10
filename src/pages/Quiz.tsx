
import { useEffect, useMemo, useRef, useState } from 'react'
import { QUESTIONS } from '../data/quizQuestions'
import { saveScore } from '../firebase'

const QUESTION_TIME = 20 // seconds
const TOTAL_TIME = 5 * 60 // 5 minutes

type Mode = 'classic' | 'ai'

export default function Quiz(){
  const [mode, setMode] = useState<Mode>('classic')
  const [name, setName] = useState('')
  const [started, setStarted] = useState(false)
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [qTime, setQTime] = useState(QUESTION_TIME)
  const [totalTime, setTotalTime] = useState(TOTAL_TIME)
  const [finished, setFinished] = useState(false)

  const intervalRef = useRef<number | null>(null)

  const start = () => {
    if (!name.trim()) { alert('Nhập tên trước khi bắt đầu'); return }
    setStarted(true)
    setIdx(0)
    setAnswers([])
    setQTime(QUESTION_TIME)
    setTotalTime(TOTAL_TIME)
  }

  useEffect(()=>{
    if (!started || finished) return
    intervalRef.current = window.setInterval(()=>{
      setQTime(t => t-1)
      setTotalTime(t => t-1)
    }, 1000)
    return ()=> { if (intervalRef.current) window.clearInterval(intervalRef.current) }
  }, [started, finished])

  useEffect(()=>{
    if (!started || finished) return
    if (qTime <= 0){
      nextQuestion()
    }
  }, [qTime])

  useEffect(()=>{
    if (!started || finished) return
    if (totalTime <= 0){
      submit()
    }
  }, [totalTime])

  const current = useMemo(()=> QUESTIONS[idx], [idx])
  const score = answers.reduce((acc, ai, i) => acc + (QUESTIONS[i]?.answerIndex === ai ? 1 : 0), 0)

  const choose = (i:number) => {
    if (finished) return
    const next = [...answers]; next[idx] = i; setAnswers(next)
  }

  const nextQuestion = () => {
    if (idx < QUESTIONS.length - 1){
      setIdx(idx + 1)
      setQTime(QUESTION_TIME)
    }else{
      submit()
    }
  }

  async function submit(){
    setFinished(true)
    if (intervalRef.current) window.clearInterval(intervalRef.current)
    await saveScore({ name, score, timeSec: TOTAL_TIME - totalTime, mode })
  }

  if (!started) return (
    <section className="hero">
      <div className="container">
        <h1 className="h1">Kiểm Tra Kiến Thức</h1>
        <p className="subtle">Bài kiểm tra gồm 10 câu · <span className="kbd">20s/câu</span> · <span className="kbd">5 phút</span> tổng.</p>
        <div className="card" style={{maxWidth:680}}>
          <div style={{display:'flex', gap:10, flexWrap:'wrap', alignItems:'center'}}>
            <button onClick={()=> setMode('classic')} className="btn" style={{opacity: mode==='classic'?1:.6}}>Quiz Thường</button>
            <button onClick={()=> setMode('ai')} className="btn ghost" style={{opacity: mode==='ai'?1:.6}}>AI Quiz</button>
          </div>
          <div style={{height:12}}/>
          <input value={name} onChange={e=> setName(e.target.value)} placeholder="Nhập tên của bạn" style={{
            width:'100%', padding:'12px 14px', borderRadius:12, border:'1px solid var(--line)', background:'rgba(10,10,12,.04)', color:'var(--text)'
          }}/>
          <div style={{height:12}}/>
          <button className="btn" onClick={start}>Bắt đầu</button>
        </div>
      </div>
    </section>
  )

  if (finished) return (
    <section className="hero">
      <div className="container">
        <h1 className="h1">Kết quả</h1>
        <div className="card" style={{maxWidth:760}}>
          <div style={{display:'flex', gap:20, flexWrap:'wrap'}}>
            <div><b>Người làm:</b> {name}</div>
            <div><b>Điểm:</b> {score}/10</div>
            <div><b>Thời gian:</b> {formatTime(TOTAL_TIME - totalTime)}</div>
            <div><b>Chế độ:</b> {mode === 'classic' ? 'Quiz Thường' : 'AI Quiz'}</div>
          </div>
        </div>

        <div className="section">
          <h2>Giải thích chi tiết</h2>
          <div className="grid cards">
            {QUESTIONS.map((q, i)=>(
              <div key={q.id} className="card span-6">
                <div style={{fontWeight:700}}>{i+1}. {q.question}</div>
                <div style={{color:'var(--muted)', fontSize:14, margin:'6px 0 10px'}}>{q.options.map((opt,oi)=>(
                  <span key={oi} style={{marginRight:10}}>
                    {oi === q.answerIndex ? <b>✓ {opt}</b> : opt}
                    {answers[i] === oi && oi !== q.answerIndex ? ' (bạn chọn)' : ''}
                  </span>
                ))}</div>
                <div>{q.explain}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )

  return (
    <section className="hero">
      <div className="container">
        <div style={{display:'flex', gap:10, alignItems:'center', marginBottom:10}}>
          <div className="progress" style={{flex:1}}><span style={{ width: `${((idx)/QUESTIONS.length)*100}%` }} /></div>
          <div className="kbd">{idx+1}/{QUESTIONS.length}</div>
          <div className="kbd">⏱ {qTime}s</div>
          <div className="kbd">⌛ {formatTime(totalTime)}</div>
        </div>
        <div className="card" style={{maxWidth:820}}>
          <div style={{fontSize:22, fontWeight:800, marginBottom:12}}>{idx+1}. {current.question}</div>
          <div style={{display:'grid', gap:10}}>
            {current.options.map((opt, i)=> {
              const chosen = answers[idx]
              const isCorrect = chosen !== undefined && i === current.answerIndex
              const isWrong = chosen !== undefined && i === chosen && i !== current.answerIndex
              return (
                <button key={i} onClick={()=> choose(i)} disabled={chosen !== undefined}
                  style={{
                    textAlign:'left', padding:'12px 14px', borderRadius:14, cursor:'pointer',
                    border:'1px solid var(--line)',
                    background: isCorrect ? 'linear-gradient(90deg, rgba(34,197,94,.22), rgba(34,197,94,.08))'
                              : isWrong   ? 'linear-gradient(90deg, rgba(244,63,94,.22), rgba(244,63,94,.08))'
                              : 'rgba(10,10,12,.04)',
                    color:'inherit'
                  }}>
                  {opt}
                </button>
              )
            })}
          </div>
          <div style={{height:12}}/>
          <div style={{display:'flex', gap:10}}>
            <button className="btn ghost" onClick={()=> nextQuestion()}>Câu tiếp theo →</button>
            <button className="btn" onClick={submit}>Nộp bài</button>
          </div>
        </div>
      </div>
    </section>
  )
}

function formatTime(s:number){
  const m = Math.floor(s/60).toString()
  const sec = Math.floor(s%60).toString().padStart(2,'0')
  return `${m}:${sec}`
}
