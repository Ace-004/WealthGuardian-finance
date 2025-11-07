# 💰 Wealth Guardian

A modern, full-stack personal finance management application built with the MERN stack. Track your income, expenses, budgets, and gain insights into your financial health with beautiful data visualizations.

![Wealth Guardian](https://img.shields.io/badge/version-1.0.0-emerald.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

### 🎯 Core Functionality

- **Transaction Management**: Add, view, and delete income/expense transactions
- **Budget Tracking**: Set monthly budgets for different categories and monitor spending
- **Real-time Updates**: Budgets automatically update when transactions are added or deleted
- **Analytics Dashboard**: Visualize spending patterns with interactive charts
- **Category-wise Insights**: Track expenses across multiple categories

### 🎨 User Experience

- **Modern Dark UI**: Beautiful gradient design with emerald accents
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations**: Professional loading states and transitions
- **Real-time Notifications**: Toast notifications for user actions
- **Secure Authentication**: JWT-based authentication with password encryption

### 📊 Analytics & Insights

- **Expense Breakdown**: Pie charts showing category-wise spending
- **Income vs Expenses**: Compare monthly income and expenses
- **Financial Trends**: Line charts showing spending trends over time
- **Budget Status**: Visual indicators for budget health (on track, warning, exceeded)
- **Unbudgeted Expenses**: Track spending in categories without budgets

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern UI library with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization library
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **React Icons** - Icon library

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **express-validator** - Input validation

## 📁 Project Structure

```
WealthGuardian/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── budgetController.js   # Budget management
│   │   ├── transactionController.js # Transaction operations
│   │   └── analyticsController.js   # Analytics data
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── errorHandler.js      # Error handling middleware
│   ├── models/
│   │   ├── user.js              # User schema
│   │   ├── budget.js            # Budget schema
│   │   └── transactions.js      # Transaction schema
│   ├── routes/
│   │   ├── authRouter.js        # Auth routes
│   │   ├── budgetRouter.js      # Budget routes
│   │   └── transactionRouter.js # Transaction routes
│   ├── utils/
│   │   └── generateToken.js     # JWT token generation
│   ├── server.js                # Express server setup
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── wealth-guardian-logo1.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   ├── budgets/
│   │   │   │   ├── BudgetForm.jsx
│   │   │   │   └── BudgetList.jsx
│   │   │   ├── charts/
│   │   │   │   ├── CategoryPieChart.jsx
│   │   │   │   ├── IncomeExpenseChart.jsx
│   │   │   │   └── TrendLineChart.jsx
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   └── transactions/
│   │   │       ├── TransactionForm.jsx
│   │   │       └── TransactionList.jsx
│   │   ├── constants/
│   │   │   ├── categories.js    # Transaction categories
│   │   │   ├── colors.js        # Color schemes
│   │   │   └── icons.js         # Icon mappings
│   │   ├── context/
│   │   │   └── authContext.jsx  # Authentication context
│   │   ├── pages/
│   │   │   ├── Analytics.jsx    # Analytics dashboard
│   │   │   ├── Budgets.jsx      # Budget management
│   │   │   ├── Dashboard.jsx    # Main dashboard
│   │   │   ├── Landing.jsx      # Landing page
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── NotFound.jsx     # 404 page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   └── Transactions.jsx # Transactions page
│   │   ├── services/
│   │   │   ├── api.js           # Axios configuration
│   │   │   ├── authService.js   # Auth API calls
│   │   │   ├── budgetService.js # Budget API calls
│   │   │   ├── transactionService.js # Transaction API calls
│   │   │   └── analyticsService.js   # Analytics API calls
│   │   ├── utils/
│   │   │   ├── formatCurrency.js
│   │   │   ├── formatDate.js
│   │   │   ├── notifications.js
│   │   │   └── validators.js
│   │   ├── App.jsx              # Main app component
│   │   ├── index.css            # Global styles
│   │   └── main.jsx             # App entry point
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/wealth-guardian.git
   cd wealth-guardian
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   ```

3. **Create environment variables**

   Create a `.env` file in the `backend` directory:

   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Frontend Setup**

   ```bash
   cd ../frontend
   npm install
   ```

5. **Start the application**

   Terminal 1 (Backend):

   ```bash
   cd backend
   npm start
   ```

   Terminal 2 (Frontend):

   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 🎯 Usage

### 1. Register/Login

- Create a new account or login with existing credentials
- Secure JWT-based authentication

### 2. Add Transactions

- Navigate to the Transactions page
- Click "Add Transaction"
- Fill in transaction details (type, category, amount, description, date)
- Submit to save

### 3. Set Budgets

- Go to the Budgets page
- Click "Create Budget"
- Select a category and set a monthly limit
- Your budget will automatically track expenses in that category

### 4. View Analytics

- Check the Dashboard for an overview of your finances
- Visit the Analytics page for detailed insights
- View category-wise spending, trends, and comparisons

## 🔑 Key Features Explained

### Dynamic Budget Updates

When you add or delete an expense transaction:

- The system automatically recalculates all related budget statuses
- Budget progress bars update in real-time
- Monthly totals are refreshed instantly
- Visual indicators show budget health (on track/warning/exceeded)

### Unbudgeted Expenses

- Tracks expenses in categories without budgets
- Helps identify spending areas that need budget allocation
- Provides a "Set Budget" button for quick budget creation

### Transaction Categories

Supported categories:

- **Expenses**: Food, Transport, Shopping, Housing, Entertainment, Bills, Other
- **Income**: Salary, Freelance, Investment, Other

## 🎨 UI/UX Features

- **Dark Theme**: Modern gradient background from slate-900 to slate-800
- **Consistent Color Scheme**:
  - Primary: Emerald (success, positive actions)
  - Warning: Amber (approaching limits)
  - Danger: Rose (exceeded limits, deletions)
- **Interactive Elements**:
  - Hover effects on cards and buttons
  - Smooth transitions and animations
  - Professional loading states
- **Responsive Design**: Mobile-first approach with breakpoints for all devices

## 📊 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Transactions

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/summary` - Get transaction summary
- `GET /api/transactions/by-category` - Get category breakdown

### Budgets

- `GET /api/budgets` - Get all budgets with stats
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget
- `GET /api/budgets/status` - Get budget status
- `GET /api/budgets/monthly-spending` - Get monthly spending

### Analytics

- `GET /api/analytics/category-expenses` - Category-wise expenses
- `GET /api/analytics/income-expense-comparison` - Income vs expenses
- `GET /api/analytics/financial-trends` - Financial trends
- `GET /api/analytics/top-transactions` - Top transactions

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: Middleware-based route protection
- **Input Validation**: Server-side validation with express-validator
- **Error Handling**: Centralized error handling middleware
- **CORS Configuration**: Controlled cross-origin requests

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Build for Production

### Frontend

```bash
cd frontend
npm run build
```

### Backend

```bash
cd backend
npm run build
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Icons by [React Icons](https://react-icons.github.io/react-icons/)
- Charts by [Recharts](https://recharts.org/)
- UI inspiration from modern fintech applications

## 📞 Support

For support, email your.email@example.com or create an issue in the repository.

---

Made with ❤️ and ☕
