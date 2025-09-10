
import { useEffect, useState } from 'react'
export default function Progress(){
  const [p, setP] = useState(0)
  useEffect(()=>{
    const onScroll = () => {
      const doc = document.documentElement
      const total = doc.scrollHeight - doc.clientHeight
      const cur = total > 0 ? (doc.scrollTop / total) * 100 : 0
      setP(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive:true })
    return ()=> window.removeEventListener('scroll', onScroll)
  },[])
  return <div className="progress"><span style={{ width: `${p}%` }} /></div>
}
