
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function FloatingChat(){
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={()=> setOpen(v=>!v)}
        title="Hỏi đáp AI"
        style={{
          position:'fixed', right:18, bottom:18, zIndex:50,
          padding:'14px 16px', borderRadius:999, border:'1px solid rgba(10,10,12,.10)',
          background:'linear-gradient(90deg, var(--gold), var(--gold-soft))', color:'#0b0b0c', fontWeight:800,
          boxShadow:'0 10px 24px rgba(212,175,55,.25)', cursor:'pointer'
        }}>
        💬
      </button>
      {open && (
        <div style={{
          position:'fixed', right:18, bottom:76, width: 360, maxWidth:'calc(100vw - 36px)',
          border:'1px solid var(--line)', borderRadius:18, background:'linear-gradient(180deg, rgba(255,255,255,.96), rgba(255,255,255,.86))',
          padding:16, backdropFilter:'blur(10px)', zIndex:50
        }}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10}}>
            <strong>Trợ lý AI (demo)</strong>
            <button onClick={()=> setOpen(false)} className="btn" style={{padding:'8px 10px', fontSize:12}}>Đóng</button>
          </div>
          <div style={{color:'var(--muted)', fontSize:14}}>
            Mở trang <Link to="/ai">Hỏi Đáp AI</Link> để trò chuyện toàn màn hình.
          </div>
        </div>
      )}
    </>
  )
}
