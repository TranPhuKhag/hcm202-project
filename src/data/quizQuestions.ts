
export type Question = {
  id: number
  question: string
  options: string[]
  answerIndex: number
  explain: string
}

export const QUESTIONS: Question[] = [
  { id:1, question:'Theo HCM, mục tiêu tối hậu của độc lập dân tộc là gì?', options:['Chủ quyền lãnh thổ','Hạnh phúc và tự do của nhân dân','Tăng trưởng kinh tế','Uy tín quốc tế'], answerIndex:1, explain:'Độc lập gắn với hạnh phúc, tự do của nhân dân.'},
  { id:2, question:'Luận điểm “đem sức ta mà tự giải phóng cho ta” nhấn mạnh điều gì?', options:['Trông cậy quốc tế','Tự lực, tự cường','Ưu tiên ngoại giao','Vũ trang là chủ yếu'], answerIndex:1, explain:'Tự lực là động lực bên trong của CM GPMN.'},
  { id:3, question:'Trong giai đoạn GPMN, mâu thuẫn nào đặt lên hàng đầu?', options:['Giai cấp','Dân tộc','Tôn giáo','Vùng miền'], answerIndex:1, explain:'Ưu tiên mâu thuẫn dân tộc để đại đoàn kết.'},
  { id:4, question:'Cách mạng thuộc địa có thể thắng trước chính quốc thể hiện tính gì?', options:['Rập khuôn','Phụ thuộc','Sáng tạo, chủ động','Bảo thủ'], answerIndex:2, explain:'Không rập khuôn trình tự Âu châu.'},
  { id:5, question:'Kết hợp sức mạnh dân tộc và sức mạnh thời đại nghĩa là?', options:['Chỉ dựa vào nội lực','Chỉ dựa vào quốc tế','Kết hợp nội lực với đoàn kết quốc tế','Tách biệt hoàn toàn'], answerIndex:2, explain:'HCM đề cao đoàn kết quốc tế đúng đắn.'},
  { id:6, question:'“Dĩ bất biến, ứng vạn biến” gợi cách tiếp cận nào?', options:['Cứng nhắc','Linh hoạt theo nguyên tắc','Tuỳ hứng','Phó mặc'], answerIndex:1, explain:'Giữ nguyên tắc, linh hoạt phương thức.'},
  { id:7, question:'Nhà nước “của dân, do dân, vì dân” thể hiện trọng tâm gì?', options:['Quyền lực thuộc thiểu số','Phục vụ nhân dân','Bộ máy quan liêu','Lợi ích cục bộ'], answerIndex:1, explain:'Bản chất dân chủ phục vụ nhân dân.'},
  { id:8, question:'Hình thức đấu tranh trong CM GPMN theo HCM?', options:['Chỉ vũ trang','Chỉ chính trị','Kết hợp chính trị–vũ trang–ngoại giao','Chỉ ngoại giao'], answerIndex:2, explain:'Linh hoạt tổng hợp các mặt trận.'},
  { id:9, question:'“Không có gì quý hơn độc lập, tự do” khẳng định điều gì?', options:['Độc lập là mục tiêu tối thượng','Phát triển là mục tiêu','Hội nhập là mục tiêu','Khoa học là mục tiêu'], answerIndex:0, explain:'Tuyên ngôn nguyên tắc thời kháng chiến.'},
  { id:10, question:'Gợi mở cho thanh niên thời toàn cầu hoá theo HCM?', options:['Rập khuôn trend','Chọn đường Việt Nam, tự lực + hợp tác','Tránh công nghệ','Đứng ngoài toàn cầu hoá'], answerIndex:1, explain:'Không rập khuôn, tự lực và hội nhập thông minh.'}
]
