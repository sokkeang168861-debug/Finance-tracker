

- Add financial transactions
- View all transactions
- Update transactions
- Delete transactions
- RESTful API
- TypeScript support
- Database integration
- Environment variable configuration

---

## 🛠️ Technologies Used

### Backend
- Node.js
- Express.js
- TypeScript
- MySQL / PostgreSQL (depending on your configuration)
- dotenv
- cors

### Frontend
- Vue.js / React (update according to your frontend)

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/your-username/finance-tracker.git
cd finance-tracker
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=finance_tracker
DB_PORT=3306
```

---

## ▶️ Run Development Server

```bash
npm run dev
```

Expected output:

```bash
Server running on port 5000
Database connected successfully
```

---

## 🏗️ Build Project

Compile TypeScript:

```bash
npm run build
```

Generated files will be stored in:

```text
dist/
```

Run production build:

```bash
npm start
```

```bash
npm run dev      # Start development server
npm run build    # Compile TypeScript
npm start        # Run production server
```

