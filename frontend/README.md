# 🧠 CodeRecall

> **A smart DSA revision platform that helps you remember what you solved — and tells you what to revise next.**

CodeRecall is a DSA revision platform designed for developers who solve coding problems but often forget them after a few weeks.

Instead of repeatedly searching for random LeetCode problems, CodeRecall lets you build your own question collection, practice from it, track your solving history, and identify questions that need revision.

---

## 🚀 Why CodeRecall?

Solving a problem once doesn't mean you remember the approach.

CodeRecall focuses on the **revision cycle**:

**Solve → Track → Review → Revise → Repeat**

The platform helps you maintain a personalized coding-question library and makes revision more structured.

---

## ✨ Features

### 📌 Question Management

* Add coding questions using their **LeetCode URL**
* Store question name and details
* Organize questions by:

  * Topic
  * Difficulty
* Maintain a personal question collection

### 🎲 Practice Mode

* Generate random questions from your collection
* Manually select questions when needed
* Filter practice sessions based on:

  * Number of questions
  * Topic
  * Difficulty

### 📝 Attempt Tracking

CodeRecall records your solving attempts so you can keep track of your practice history.

Users can identify questions that were:

* Solved successfully
* Difficult to solve
* Worth revisiting

### 🔄 Revision System

The platform uses solving history to help determine when a question should be revised.

Instead of asking:

> "What should I solve today?"

CodeRecall helps answer:

> **"What should I revise today?"**

### 📊 Personalized Dashboard

Users can view their coding-practice information and revision-related data from their dashboard.

### 🔐 Authentication

* User registration/login
* JWT-based authentication
* User-specific question data
* Protected API routes

### 👤 User Profiles

Each user gets a personalized profile and their own question/revision history.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML
* CSS
* Vite

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication

### Database

* MongoDB
* Mongoose

### Development Tools

* Git
* GitHub
* VS Code
* Postman

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │                     │
                    │  Dashboard          │
                    │  Practice           │
                    │  Questions          │
                    │  Profile            │
                    └──────────┬──────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │                     │
                    │ Authentication      │
                    │ Question APIs       │
                    │ Revision APIs       │
                    │ Attempt Tracking    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    │                     │
                    │ Users               │
                    │ Questions           │
                    │ Attempts/History    │
                    └─────────────────────┘
```

---

## 📂 Project Structure

```text
CodeRecall/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── ...
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

> Project structure may vary depending on the current implementation.

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/CodeRecall.git
```

```bash
cd CodeRecall
```

---

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

or:

```bash
node server.js
```

---

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 🔐 Environment Variables

Never commit your `.env` file to GitHub.

Example:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/CodeRecall
JWT_SECRET=your_secret_key
```

Make sure `.env` is included in `.gitignore`.

---

## 🔄 How CodeRecall Works

### Step 1 — Add Problems

The user adds coding problems to their personal collection using a LeetCode URL and relevant information.

### Step 2 — Practice

The user can start a practice session and select questions based on their preferred criteria.

```text
Topic → Difficulty → Number of Questions
```

### Step 3 — Solve

The user attempts the selected problems.

### Step 4 — Record

The result of the attempt is recorded.

### Step 5 — Revision

Based on the user's solving history, CodeRecall identifies problems that should be revisited.

```text
Previous Attempt
       ↓
Solving History
       ↓
Revision Calculation
       ↓
Today's Revision
```

---

## 🎯 Main Goal

CodeRecall is not designed to replace platforms like LeetCode.

Instead, it works **alongside them**.

LeetCode provides the problems.

CodeRecall helps you **remember the problems you already solved**.

---

## 🔮 Future Improvements

Potential future features include:

* 📈 Advanced DSA analytics
* 🧠 Improved spaced-repetition algorithm
* 🔥 Daily revision streaks
* 📊 Topic-wise performance analytics
* ⏱️ Timed coding sessions
* 📅 Custom revision schedules
* 🏆 Gamification and achievements
* 🤖 AI-based problem recommendations
* 📚 Company-wise question collections
* 📱 Mobile-friendly/PWA experience

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/your-feature
```

3. Make your changes
4. Commit your changes

```bash
git commit -m "Add your feature"
```

5. Push the branch

```bash
git push origin feature/your-feature
```

6. Open a Pull Request

---

## 📄 License

This project is currently intended for educational and portfolio purposes.

---

## 👨‍💻 Author

**Garvit Bajaj**

Computer Science Engineering — AI & ML

GitHub: [GARVIT-BAJAJ-08](https://github.com/GARVIT-BAJAJ-08)

---

## ⭐ Support

If you find CodeRecall useful, consider giving the repository a ⭐ on GitHub.

---

### 💡 CodeRecall

**Don't just solve problems. Remember them.**
