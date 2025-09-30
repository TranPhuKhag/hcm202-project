# 🇻🇳 Tư Tưởng Hồ Chí Minh - Nhà Nước Của Dân, Do Dân, Vì Dân

Ứng dụng web giáo dục về tư tưởng Hồ Chí Minh với các tính năng học tập tương tác, bao gồm bài học, quiz, bảng xếp hạng và trợ lý AI.

## 🚀 Tính Năng

### 📚 Trang Giới Thiệu Bài Học
- Hiển thị nội dung bài học về tư tưởng Hồ Chí Minh
- Bao gồm tiêu đề, tóm tắt và hình ảnh minh họa
- Nội dung được trình bày một cách sinh động và dễ hiểu

### 📝 Trang Kiểm Tra
- Bài kiểm tra trắc nghiệm với 10 câu hỏi
- Giới hạn thời gian cho mỗi câu hỏi (20 giây) và toàn bộ bài kiểm tra (5 phút)
- Tự động chuyển câu khi hết thời gian
- Tính điểm và hiển thị kết quả chi tiết
- Lưu kết quả vào Firebase Firestore

### 🏆 Bảng Xếp Hạng
- Hiển thị top 10 học viên xuất sắc nhất
- Sắp xếp theo điểm số và thời gian hoàn thành
- Giao diện podium cho top 3
- Thống kê tổng quan

### 🤖 Trợ Lý AI
- Chatbot AI tích hợp Google Gemini API
- Chỉ trả lời câu hỏi liên quan đến bài học
- Giao diện trò chuyện thân thiện
- Câu hỏi gợi ý để hướng dẫn học viên
- **Nút chat nổi**: Truy cập nhanh AI từ mọi trang

## ⚙️ Cài Đặt và Chạy

### 1. Clone repository
\`\`\`bash
git clone <repository-url>
cd HCM202
\`\`\`

### 2. Cài đặt dependencies
\`\`\`bash
yarn install
\`\`\`

### 3. Cấu hình Environment Variables
\`\`\`bash
# Copy file .env.example thành .env
cp .env.example .env
\`\`\`

**⚠️ QUAN TRỌNG:** Chỉnh sửa file `.env` và thêm các keys thật:

#### 🤖 Google Gemini API Key
\`\`\`env
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
\`\`\`

**Cách lấy Google Gemini API Key:**
1. Truy cập [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Đăng nhập với tài khoản Google
3. Tạo API key mới
4. Copy và paste vào file `.env`

#### 🔥 Firebase Configuration
\`\`\`env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
\`\`\`

**Cách lấy Firebase Configuration:**
1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Chọn dự án hoặc tạo dự án mới
3. Vào **Project Settings** (⚙️) > **General**
4. Cuộn xuống phần **Your apps**
5. Nếu chưa có app, click **Add app** và chọn **Web** (</>)
6. Copy các giá trị config và paste vào file `.env`

**Cấu hình Firestore Database:**
1. Trong Firebase Console, vào **Firestore Database**
2. Click **Create database**
3. Chọn **Start in test mode** (cho development)
4. Chọn location gần nhất

**Cấu hình Storage:**
1. Trong Firebase Console, vào **Storage**
2. Click **Get started**
3. Chọn **Start in test mode** (cho development)

### 4. Chạy development server
\`\`\`bash
yarn dev
\`\`\`

Ứng dụng sẽ chạy tại: http://localhost:5173

## 🔧 Scripts

- `yarn dev` - Chạy development server
- `yarn build` - Build production
- `yarn preview` - Preview production build
- `yarn lint` - Chạy ESLint

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 18, TypeScript, Vite
- **Routing**: React Router v7
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **AI**: Google Gemini API
- **Styling**: CSS3 với Flexbox và Grid
- **Build Tool**: Vite
- **Package Manager**: Yarn

## 📋 Yêu cầu hệ thống

- Node.js 18+ 
- Yarn 1.22+
- Trình duyệt hiện đại (Chrome, Firefox, Safari, Edge)

## 🚀 Cài đặt và chạy dự án

### 1. Clone repository

```bash
git clone <repository-url>
cd HCM202
```

### 2. Cài đặt dependencies

```bash
yarn install
```

### 3. Cấu hình Firebase

1. Tạo project mới trên [Firebase Console](https://console.firebase.google.com/)
2. Tạo Firestore Database
3. Tạo Storage bucket
4. Lấy cấu hình Firebase và cập nhật file `src/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain", 
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### 4. Cấu hình Google Gemini API (cho tính năng chatbot)

1. Đăng ký tài khoản tại [Google AI Studio](https://aistudio.google.com/)
2. Tạo API key tại [Google AI Studio - API Keys](https://aistudio.google.com/app/apikey)
3. Nhập API key trong ứng dụng khi sử dụng chatbot hoặc nút chat nổi

### 5. Chạy development server

```bash
yarn dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

### 6. Build cho production

```bash
yarn build
```

### 7. Preview production build

```bash
yarn preview
```

## 📁 Cấu trúc project

```
src/
├── components/          # Các component tái sử dụng
│   ├── Navigation.tsx   # Thanh điều hướng
│   ├── Navigation.css
│   ├── FloatingChat.tsx # Nút chat nổi
│   └── FloatingChat.css
├── pages/              # Các trang chính
│   ├── LessonIntroduction.tsx  # Trang giới thiệu bài học
│   ├── Quiz.tsx               # Trang kiểm tra
│   ├── Leaderboard.tsx        # Bảng xếp hạng
│   ├── AIChatbot.tsx          # Trợ lý AI
│   └── *.css                  # CSS files
├── data/               # Dữ liệu tĩnh
│   ├── lessonData.ts   # Nội dung bài học
│   └── quizQuestions.ts # Câu hỏi kiểm tra
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
├── firebase.ts         # Cấu hình Firebase
├── App.tsx            # Component chính
├── App.css            # Styles chính
└── main.tsx           # Entry point
```

## 🎨 Giao diện

- **Thiết kế responsive**: Hoạt động tốt trên desktop, tablet và mobile
- **Màu sắc chủ đạo**: Đỏ (#d32f2f) thể hiện tinh thần dân tộc
- **Typography**: Font system hiện đại, dễ đọc
- **Animation**: Các hiệu ứng mượt mà, tăng trải nghiệm người dùng
- **Floating Chat**: Nút chat AI nổi ở góc phải màn hình để truy cập nhanh

## 🔧 Tính năng nâng cao

### Firebase Integration
- **Firestore**: Lưu trữ kết quả bài kiểm tra
- **Realtime**: Bảng xếp hạng cập nhật realtime
- **Security**: Rules bảo mật dữ liệu

### AI Chatbot
- **Context-aware**: Chỉ trả lời trong phạm vi bài học
- **Vietnamese support**: Hỗ trợ tiếng Việt hoàn toàn
- **Smart prompting**: Prompt được tối ưu cho chủ đề cụ thể
- **Floating access**: Nút chat nổi cho truy cập nhanh từ mọi trang
- **Responsive chat window**: Giao diện chat thích ứng với mọi màn hình

### Quiz System
- **Timer-based**: Hệ thống đếm ngược thời gian
- **Auto-progression**: Tự động chuyển câu
- **Detailed feedback**: Giải thích chi tiết đáp án

## 🚨 Lưu ý quan trọng

1. **Firebase Configuration**: Bắt buộc phải cấu hình Firebase để sử dụng đầy đủ tính năng
2. **Google Gemini API**: Cần API key hợp lệ để sử dụng chatbot và nút chat nổi
3. **Images**: Thay thế ảnh placeholder bằng ảnh thật trong thư mục `public/images/`
4. **Security**: Đảm bảo cấu hình Firebase Rules phù hợp cho production
5. **Responsive**: Layout đã được tối ưu cho mọi kích thước màn hình

## 🐛 Troubleshooting

### Lỗi Firebase
```bash
# Kiểm tra cấu hình Firebase
console.log(firebase.apps.length)
```

### Lỗi API
```bash
# Kiểm tra API key Google Gemini
# Đảm bảo API key có quyền truy cập Gemini API
# Kiểm tra quota và billing trong Google Cloud Console
```

### Lỗi Build
```bash
# Clear cache và reinstall
rm -rf node_modules yarn.lock
yarn install
```

## 📈 Phát triển tiếp

- [ ] Thêm chế độ dark mode
- [ ] Tích hợp Google Analytics
- [ ] Thêm tính năng chia sẻ kết quả
- [ ] Hỗ trợ đa ngôn ngữ
- [ ] PWA support

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

## 📄 License

Dự án này được phát hành dưới giấy phép MIT.

## 🔐 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key cho chatbot | ✅ | `AIzaSyC...` |
| `VITE_FIREBASE_API_KEY` | Firebase API key | ✅ | `AIzaSyB...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | ✅ | `project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | ✅ | `my-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | ✅ | `project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | ✅ | `123456789` |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | ✅ | `1:123:web:abc` |

### 📝 File cấu hình:
- **`.env`**: Development environment (có thể commit)
- **`.env.local`**: Local override (không commit, ưu tiên cao nhất)
- **`.env.example`**: Template hướng dẫn

---

*Được tạo với ❤️ để giáo dục về tư tưởng Hồ Chí Minh*

