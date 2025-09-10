
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse){
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { messages } = req.body || {}
  const key = process.env.GEMINI_API_KEY

  if (!key){
    const user = (messages || []).filter((m:any)=> m.role==='user').slice(-1)[0]?.content || ''
    return res.status(200).json({
      reply: '⚠️ DEMO MODE: Chưa cấu hình GEMINI_API_KEY. Tóm tắt câu hỏi: ' + (user?.slice(0,160) || '')
    })
  }

  try{
    const prompt = [
      { role:'user', parts:[{ text: `
Bạn là trợ lý học tập giới hạn phạm vi: Chương III – Tư tưởng HCM (I.1 độc lập dân tộc, I.2 cách mạng giải phóng dân tộc).
Chỉ trả lời trong phạm vi bài học; nếu câu hỏi lệch chủ đề hãy lịch sự từ chối và hướng người học quay lại nội dung chương.
Trả lời gọn, rõ, có thể dùng gạch đầu dòng.
`}]},
      ...((messages || []).map((m:any)=> ({ role: m.role, parts: [{ text: m.content }]})))
    ]

    const resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key='+key, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ contents: prompt })
    })
    const json = await resp.json()
    const reply = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Xin lỗi, tôi chưa có câu trả lời.'
    return res.status(200).json({ reply })
  }catch(e:any){
    return res.status(500).json({ error: e?.message || 'Server error' })
  }
}
