
import { useEffect, useMemo, useState } from 'react'
import Podium from '../components/Podium'
import { fetchTop, type ScoreDoc, FIREBASE_ENABLED } from '../firebase'

type Row = ScoreDoc & { id?: string }

function fallbackData(): Row[] {
  return [
    { name:'Tin', score:10, timeSec:132, mode:'classic', createdAt: new Date() },
    { name:'An', score:6, timeSec:62, mode:'classic', createdAt: new Date() },
    { name:'TAT', score:4, timeSec:26, mode:'classic', createdAt: new Date() },
  ] as Row[]
}

export default function Leaderboard(){
  const [rows, setRows] = useState<Row[]>([])

  useEffect(()=>{
    (async()=>{
      const res = await fetchTop(10)
      if (res.ok && res.data.length) setRows(res.data as any)
      else setRows(fallbackData())
    })()
  },[])

  const top3 = rows.slice(0,3)
  const stats = useMemo(()=>{
    if (!rows.length) return { total:0, avgScore:0, avgTime:0 }
    const total = rows.length
    const avgScore = Math.round(rows.reduce((a,r)=> a+r.score, 0) / total)
    const avgTime = Math.round(rows.reduce((a,r)=> a+r.timeSec, 0) / total)
    return { total, avgScore, avgTime }
  }, [rows])

  return (
    <section className="hero">
      <div className="container">
        <h1 className="h1">Bảng Xếp Hạng</h1>
        {!FIREBASE_ENABLED && (
          <div className="card" style={{border:'1px dashed var(--line)'}}>
            <b>Demo:</b> Firebase chưa cấu hình. Đang hiển thị dữ liệu tạm. Cập nhật <span className="kbd">.env</span> để bật realtime.
          </div>
        )}
        <div className="section">
          <h2>Top 3</h2>
          <div className="grid cards">
            <div className="card span-12"><Podium top={top3 as any} /></div>
          </div>
        </div>

        <div className="section">
          <h2>Top 10</h2>
          <div className="card">
            <table className="table">
              <thead><tr><th>Hạng</th><th>Tên</th><th>Điểm</th><th>Thời gian</th><th>Chế độ</th></tr></thead>
              <tbody>
                {rows.map((r,i)=> (
                  <tr key={r.id || i}>
                    <td>#{i+1}</td>
                    <td>{r.name}</td>
                    <td>{r.score}/10</td>
                    <td>{formatTime(r.timeSec)}</td>
                    <td>{r.mode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section">
          <h2>Thống kê</h2>
          <div className="grid cards">
            <div className="card span-4"><b>Tổng số bài làm</b><div style={{fontSize:28, fontWeight:800}}>{stats.total}</div></div>
            <div className="card span-4"><b>Điểm trung bình</b><div style={{fontSize:28, fontWeight:800}}>{stats.avgScore} điểm</div></div>
            <div className="card span-4"><b>Thời gian trung bình</b><div style={{fontSize:28, fontWeight:800}}>{formatTime(stats.avgTime)}</div></div>
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
