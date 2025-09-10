
type Entry = { name: string; score: number; timeSec: number }

export default function Podium({top}: {top: Entry[]}){
  const [gold, silver, bronze] = [top[0], top[1], top[2]]
  const col = (e: Entry | undefined, cls: string, height: number) => (
    <div className={"col "+cls} style={{height}}>
      <div style={{fontSize:24, fontWeight:800}}>{e ? e.name : '—'}</div>
      <div style={{opacity:.9}}>{e ? `${e.score}/10 · ${formatTime(e.timeSec)}` : 'Chưa có'}</div>
    </div>
  )
  return (
    <div className="podium">
      {col(silver, 'silver', 140)}
      {col(gold, 'gold', 180)}
      {col(bronze, 'bronze', 120)}
    </div>
  )
}

function formatTime(s:number){
  const m = Math.floor(s/60).toString().padStart(1,'0')
  const sec = Math.floor(s%60).toString().padStart(2,'0')
  return `${m}:${sec}`
}
