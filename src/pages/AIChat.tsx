import { FormEvent, useState } from 'react';

type Role = 'user' | 'assistant';
type Msg = { role: Role; content: string };
type ChatReply = { reply?: string };

export default function AIChat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', content: 'Xin chào! Tôi là trợ lý AI về Tư tưởng Hồ Chí Minh.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async (e?: FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setLoading(true);
    setInput('');

    const nextMsgs: Msg[] = [...msgs, { role: 'user', content: text }];
    setMsgs(nextMsgs);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMsgs })
      });

      // Parse về unknown rồi thu hẹp kiểu (không dùng any)
      let data: unknown;
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      const maybe = data as Partial<ChatReply>;
      const reply =
        typeof maybe.reply === 'string'
          ? maybe.reply
          : 'Xin lỗi, hiện demo chưa gọi được LLM.';

      setMsgs(m => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setMsgs(m => [
        ...m,
        { role: 'assistant', content: 'Lỗi kết nối serverless. Vui lòng thử lại.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'Nhà nước “của dân, do dân, vì dân” nghĩa là gì?',
    'Vì sao nói độc lập gắn với hạnh phúc của dân?',
    '“Đem sức ta mà tự giải phóng cho ta” gợi ý gì cho giới trẻ?',
    'Cách vận dụng “dĩ bất biến, ứng vạn biến” vào khởi nghiệp?'
  ];

  return (
    <section className="hero">
      <div className="container">
        <h1 className="h1">Hỏi Đáp AI</h1>

        <div className="card" style={{ maxWidth: 900 }}>
          <div style={{ display: 'grid', gap: 12, minHeight: 320 }}>
            {msgs.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'end' : 'start',
                  justifySelf: m.role === 'user' ? 'end' : 'start',
                  maxWidth: '82%',
                  background:
                    m.role === 'user'
                      ? 'linear-gradient(90deg, var(--gold), var(--gold-soft))'
                      : 'rgba(10,10,12,.04)',
                  color: m.role === 'user' ? '#0b0b0c' : 'inherit',
                  padding: '12px 14px',
                  borderRadius: 14,
                  border: '1px solid var(--line)'
                }}
              >
                {m.content}
              </div>
            ))}
            {loading && <div style={{ color: 'var(--muted)' }}>Đang trả lời…</div>}
          </div>

          <div style={{ height: 12 }} />

          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
            {suggestions.map((s, i) => (
              <button
                key={i}
                className="btn ghost"
                onClick={() => setInput(s)}
                style={{ whiteSpace: 'nowrap' }}
              >
                {s}
              </button>
            ))}
          </div>

          <form onSubmit={send} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Đặt câu hỏi về Chương III..."
              style={{
                flex: 1,
                padding: '12px 14px',
                borderRadius: 14,
                border: '1px solid var(--line)',
                background: 'rgba(10,10,12,.04)',
                color: 'var(--text)'
              }}
            />
            <button className="btn" type="submit" disabled={loading}>
              Gửi
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
