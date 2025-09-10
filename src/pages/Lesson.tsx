
import Progress from '../components/Progress'
import { quotes, timeline, videos } from '../data/lesson'

export default function Lesson(){
  return (
    <>
      <div className="container" style={{paddingTop:24}}>
        <Progress />
      </div>
      <section className="hero">
        <div className="container">
          <h1 className="h1">Nhà nước của dân, do dân, vì dân</h1>
          <p className="subtle">Chương III — I. Tư tưởng Hồ Chí Minh về độc lập dân tộc · I.1 Vấn đề độc lập dân tộc.</p>
          <div style={{marginTop:18, display:'grid', gap:16}}>
            <div className="card">
              <p>
                Khung nội dung để bạn bổ sung theo giáo trình (tr. 73–80): độc lập gắn liền hạnh phúc và tự do của nhân dân;
                độc lập phải đi vào đời sống; độc lập gắn CNXH.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <h2>Video bài học</h2>
        <div className="grid cards">
          {videos.map((v,i)=>(
            <div key={i} className="card span-4">
              <div style={{border:'1px dashed var(--line)', borderRadius:12, padding:10, height:120, display:'grid', placeItems:'center', color:'var(--muted)'}}>
                ▶ {v.title} <span style={{fontSize:12, opacity:.7}}>· {v.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section container">
        <h2>Dòng thời gian</h2>
        <div className="grid cards">
          <div className="card span-12" style={{display:'flex', gap:10, overflowX:'auto', paddingBottom:14}}>
            {timeline.map((t,i)=>(
              <div key={i} style={{flex:'0 0 auto', border:'1px solid var(--line)', borderRadius:12, padding:'12px 14px', minWidth:160}}>
                <div style={{fontSize:12, color:'var(--muted)'}}>{t.year}</div>
                <div style={{fontWeight:700}}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <h2>Trích dẫn nổi bật</h2>
        <div className="grid cards">
          {quotes.map((q,i)=>(
            <div key={i} className="card span-6">
              <blockquote>
                <p>“{q.text}”</p>
                <footer>— {q.source}</footer>
              </blockquote>
            </div>
          ))}
        </div>
      </section>

      <section className="section container">
        <h2>Câu hỏi CQ3</h2>
        <div className="grid cards">
          <div className="card span-12">
            <div style={{borderLeft:'4px solid var(--gold)', paddingLeft:12}}>
              <strong>Đề:</strong> Trong tư tưởng Hồ Chí Minh, cách mạng giải phóng dân tộc không rập khuôn kinh nghiệm quốc tế mà có những sáng tạo độc đáo, phù hợp với điều kiện Việt Nam. Vậy theo bạn, tính sáng tạo ấy thể hiện ở đâu và gợi mở gì cho thanh niên hôm nay khi tìm con đường lập thân, lập nghiệp trong bối cảnh toàn cầu hóa?
            </div>
            <div style={{height:10}}/>
            <div style={{borderLeft:'4px solid var(--gold-deep)', paddingLeft:12}}>
              <strong>Gợi ý triển khai:</strong>
              <ul>
                <li>Tự lực · chủ động thời cơ; không chờ “chính quốc”.</li>
                <li>Đại đoàn kết toàn dân; ưu tiên mâu thuẫn dân tộc.</li>
                <li>Kết hợp chính trị–vũ trang–ngoại giao; linh hoạt “dĩ bất biến, ứng vạn biến”.</li>
                <li>Kết hợp sức mạnh dân tộc với sức mạnh thời đại; hội nhập thông minh.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
