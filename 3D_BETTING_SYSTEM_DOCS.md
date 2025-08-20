# 3D Betting System Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Components](#components)
5. [Routes](#routes)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Postman Data Structure](#postman-data-structure)
9. [UI/UX Design](#uiux-design)
10. [Break Groups System](#break-groups-system)
11. [Permutation System](#permutation-system)
12. [Installation & Setup](#installation--setup)
13. [Usage Guide](#usage-guide)
14. [Technical Specifications](#technical-specifications)
15. [Troubleshooting](#troubleshooting)

## 🎯 Overview

The 3D Betting System is a comprehensive digital lottery platform that allows users to bet on 3-digit numbers (000-999). The system features advanced number selection, permutation generation, break group categorization, and real-time betting confirmation.

### Key Capabilities:
- **3-Digit Number Selection**: Choose numbers from 000 to 999
- **Permutation Generation**: Automatically generate all possible arrangements of selected numbers
- **Break Group Categorization**: Numbers grouped by digit sum (0-27)
- **Quick Selection Options**: Predefined number patterns for easy selection
- **Real-time Betting**: Live bet confirmation and wallet integration
- **Responsive Design**: Mobile and desktop optimized interface

## ✨ Features

### 🎲 Core Betting Features
- **Number Selection**: Input 3-digit numbers manually or use quick selection
- **Amount Setting**: Set betting amount per number
- **Permutation Betting**: Automatic generation of all possible number arrangements
- **Break Group Betting**: Bet on numbers grouped by digit sum
- **Real-time Validation**: Input validation and error handling
- **Bet Confirmation**: Review and confirm bets before submission

### 🎨 UI/UX Features
- **Responsive Design**: Works on mobile and desktop devices
- **Modern Interface**: Clean, intuitive design with Tailwind CSS
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Visual feedback during API calls
- **Error Handling**: Graceful error display and recovery

### 🔧 Technical Features
- **React Hooks**: Modern React patterns with useState, useEffect, useContext
- **Local Storage**: Temporary bet data persistence
- **Context API**: Global state management
- **React Router**: Client-side routing
- **Toast Notifications**: User feedback system

## 🏗️ Architecture

### Component Structure
```
src/
├── pages/
│   ├── ThreeDPage.jsx          # Main betting interface
│   └── ThreeDConfirmPage.jsx   # Bet confirmation page
├── components/
│   ├── ThreeDChooseOption.jsx  # Quick selection modal
│   └── desktop/
│       ├── GameTabsLg.jsx      # Game category tabs
│       └── SidebarLg.jsx       # Navigation sidebar
└── routes/
    └── index.jsx               # Route definitions
```

### Data Flow
1. **User Input** → ThreeDPage.jsx
2. **State Management** → React Hooks + Context
3. **Quick Selection** → ThreeDChooseOption.jsx
4. **Bet Confirmation** → ThreeDConfirmPage.jsx
5. **API Submission** → Mock API endpoints
6. **Navigation** → React Router

## 🧩 Components

### ThreeDPage.jsx
**Purpose**: Main betting interface for 3D number selection

**Key Features**:
- 3-digit number input validation
- Amount and permutation amount setting
- Selected numbers display with individual removal
- Permutation generation (all possible arrangements)
- Quick selection integration
- Responsive design with fixed action buttons

**State Variables**:
```javascript
const [selectedDigits, setSelectedDigits] = useState([]);
const [digitInput, setDigitInput] = useState('');
const [amount, setAmount] = useState('');
const [permutationAmount, setPermutationAmount] = useState('');
const [currentTime, setCurrentTime] = useState(new Date());
const [closingTime, setClosingTime] = useState('02:30:00 PM');
const [showQuickSelect, setShowQuickSelect] = useState(false);
```

**Key Functions**:
- `chooseNumber()`: Validates and adds 3-digit numbers
- `addPermutation()`: Generates all permutations of selected numbers
- `removeSpecificDigit()`: Removes individual numbers
- `goToConfirm()`: Navigates to confirmation page

### ThreeDConfirmPage.jsx
**Purpose**: Bet review and confirmation interface

**Key Features**:
- Detailed bet review with numbers, amounts, and totals
- Inline editing of bet amounts
- Individual bet deletion
- Total calculation display
- API submission with error handling
- Post-submission navigation

**State Variables**:
```javascript
const [total, setTotal] = useState(0);
const [betData, setBetData] = useState([]);
const [isValid, setIsValid] = useState(false);
const [loading, setLoading] = useState(false);
const [editingIndex, setEditingIndex] = useState(null);
const [editAmount, setEditAmount] = useState('');
```

### ThreeDChooseOption.jsx
**Purpose**: Quick selection modal for predefined number patterns

**Key Features**:
- Break groups (0-27 based on digit sum)
- Single/Double number patterns
- Front/Back number patterns
- Power numbers
- First 20 numbers
- Modal overlay with close functionality

**Break Groups**:
- **Break 0**: 000 (sum = 0)
- **Break 1**: 001, 010, 100 (sum = 1)
- **Break 2**: 002, 011, 020, 101, 110, 200 (sum = 2)
- **...up to Break 27**: 999 (sum = 27)

## 🛣️ Routes

### Route Configuration
```javascript
// src/routes/index.jsx
{
  path: '/3d',
  element: <ThreeDPage />
},
{
  path: '/3d/confirm',
  element: <ThreeDConfirmPage />
}
```

### Navigation Integration
- **GameTabsLg.jsx**: 3D tab in game categories
- **SidebarLg.jsx**: 3D link in sidebar navigation
- **BottomMenu.jsx**: Mobile navigation (if needed)

## 📊 State Management

### Context Usage
- **LanguageContext**: Multi-language support
- **AuthContext**: User authentication and wallet
- **GeneralContext**: General app state
- **GameContext**: Game-related data

### Local Storage
```javascript
// Bet data persistence
localStorage.setItem('threed_bets', JSON.stringify(betData));
localStorage.getItem('threed_bets');
localStorage.removeItem('threed_bets');
```

### State Patterns
- **Form State**: Controlled inputs with validation
- **UI State**: Modal visibility, loading states
- **Data State**: Selected numbers, bet amounts
- **Navigation State**: Route parameters and history

## 🔌 API Integration

### Backend Integration Details

The frontend communicates with the following Laravel backend components:

#### **ThreeDController** (`App\Http\Controllers\Api\ThreeDController`)
- Handles all 3D betting API endpoints
- Validates request data and user authentication
- Delegates core betting logic to `ThreeDPlayService`

#### **ThreeDPlayService** (`App\Services\ThreeDPlayService`)
- Core business logic for 3D betting
- Handles bet validation, limits checking, and database operations
- Manages wallet transactions and slip generation

#### **Key Backend Features:**
- **Draw Session Management**: Automatically determines current open draw session from database
- **Limit Checking**: Enforces overall and personal betting limits
- **Closed Digit Validation**: Prevents betting on closed 3D digits
- **Slip Generation**: Creates unique slip numbers for bet tracking
- **Wallet Integration**: Handles balance deductions and transactions
- **Break Group Calculation**: Automatically calculates break groups for each bet

### API Endpoints
```javascript
// Bet submission
POST https://www.delightmyanmar99.pro/api/threed-bet
{
  "totalAmount": 700,
  "amounts": [
    {
      "num": "354",
      "amount": 100
    }
  ]
}

// User profile update
GET https://www.delightmyanmar99.pro/api/user/profile
```

**Note**: Draw session is automatically determined from the current open session in the database, so no need to send `drawSession` in the request body.

### Error Handling
- **Network Errors**: Try-catch blocks with user feedback
- **Validation Errors**: Input validation with toast notifications
- **API Errors**: Response status checking and error display
- **Backend Errors**: Specific error messages from Laravel backend

## 📡 Postman Data Structure

### Collection Overview
The 3D Betting System API collection includes all endpoints for betting operations, user management, and data retrieval.

### Environment Variables
```json
{
  "base_url": "https://www.delightmyanmar99.pro/api",
  "api_version": "v1",
  "auth_token": "{{auth_token}}",
  "user_id": "{{user_id}}"
}
```

### 1. Authentication Endpoints

#### 1.1 Guest Account Creation
**POST** `{{base_url}}/auth/guest-register`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

**Request Body:**
```json
{
  "device_id": "{{$guid}}",
  "platform": "web",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Guest account created successfully",
  "data": {
    "user": {
      "id": "guest_12345",
      "username": "guest_abc123",
      "password": "temp_pass_xyz",
      "wallet_balance": 1000.00,
      "created_at": "2024-12-20T10:30:00Z",
      "account_type": "guest"
    },
    "auth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "refresh_token_here"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Invalid request data",
  "errors": {
    "device_id": ["Device ID is required"]
  }
}
```

#### 1.2 User Login
**POST** `{{base_url}}/auth/login`

**Request Body:**
```json
{
  "username": "guest_abc123",
  "password": "temp_pass_xyz",
  "device_id": "{{$guid}}"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "guest_12345",
      "username": "guest_abc123",
      "wallet_balance": 1000.00,
      "last_login": "2024-12-20T10:30:00Z"
    },
    "auth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "refresh_token_here"
  }
}
```

### 2. 3D Betting Endpoints

#### 2.1 Submit 3D Bet
**POST** `{{base_url}}/threed-bet`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {{auth_token}}",
  "Accept": "application/json"
}
```

**Request Body:**
```json
{
  "totalAmount": 700,
  "amounts": [
    {
      "num": "354",
      "amount": 100
    },
    {
      "num": "453",
      "amount": 100
    },
    {
      "num": "435",
      "amount": 100
    },
    {
      "num": "159",
      "amount": 100
    },
    {
      "num": "201",
      "amount": 100
    },
    {
      "num": "987",
      "amount": 100
    },
    {
      "num": "589",
      "amount": 100
    }
  ]
}
```

**Response (Success - 201):**
```json
{
  "status": "Request was successful.",
  "message": "ထီအောင်မြင်စွာ ထိုးပြီးပါပြီ။",
  "data": null
}
```

**Response (Error - 400):**
```json
{
  "status": "Request failed.",
  "message": "လက်ကျန်ငွေ မလုံလောက်ပါ။",
  "data": null
}
```

#### 2.2 Get Bet History
**GET** `{{base_url}}/threed-bet/history?page=1&limit=10&status=all`

**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}",
  "Accept": "application/json"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "bets": [
      {
        "id": "bet_12345",
        "total_amount": 700,
        "status": "won",
        "win_amount": 1400,
        "created_at": "2024-12-20T10:30:00Z",
        "draw_time": "2024-12-20T14:30:00Z",
        "result": "354",
        "bet_details": [
          {
            "num": "354",
            "amount": 100,
            "result": "won"
          },
          {
            "num": "453",
            "amount": 100,
            "result": "lost"
          },
          {
            "num": "435",
            "amount": 100,
            "result": "lost"
          }
        ]
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_records": 50,
      "per_page": 10
    }
  }
}
```

#### 2.3 Get Bet Details
**GET** `{{base_url}}/threed-bet/{{bet_id}}`

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": "bet_12345",
    "user_id": "guest_12345",
    "total_amount": 700,
    "status": "pending",
    "created_at": "2024-12-20T10:30:00Z",
    "draw_time": "2024-12-20T14:30:00Z",
    "bets": [
      {
        "id": "bet_detail_1",
        "num": "354",
        "amount": 100
      },
      {
        "id": "bet_detail_2",
        "num": "453",
        "amount": 100
      },
      {
        "id": "bet_detail_3",
        "num": "435",
        "amount": 100
      },
      {
        "id": "bet_detail_4",
        "num": "543",
        "amount": 100
      },
      {
        "id": "bet_detail_5",
        "num": "534",
        "amount": 100
      },
      {
        "id": "bet_detail_6",
        "num": "355",
        "amount": 100
      },
      {
        "id": "bet_detail_7",
        "num": "454",
        "amount": 100
      }
    ]
  }
}
```

### 3. User Management Endpoints

#### 3.1 Get User Profile
**GET** `{{base_url}}/user/profile`

**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}",
  "Accept": "application/json"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "guest_12345",
      "username": "guest_abc123",
      "wallet_balance": 750.00,
      "total_bets": 25,
      "total_wins": 8,
      "total_losses": 17,
      "win_rate": 32.0,
      "created_at": "2024-12-15T10:30:00Z",
      "last_login": "2024-12-20T10:30:00Z",
      "account_type": "guest"
    }
  }
}
```

#### 3.2 Update User Profile
**PUT** `{{base_url}}/user/profile`

**Request Body:**
```json
{
  "username": "new_username",
  "email": "user@example.com",
  "phone": "+1234567890"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "guest_12345",
      "username": "new_username",
      "email": "user@example.com",
      "phone": "+1234567890",
      "updated_at": "2024-12-20T10:30:00Z"
    }
  }
}
```

### 4. Game Data Endpoints

#### 4.1 Get Break Groups
**GET** `{{base_url}}/threed/break-groups`

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "break_groups": [
      {
        "break_number": 0,
        "name": "Break 0",
        "numbers": ["000"],
        "count": 1
      },
      {
        "break_number": 1,
        "name": "Break 1",
        "numbers": ["001", "010", "100"],
        "count": 3
      },
      {
        "break_number": 2,
        "name": "Break 2",
        "numbers": ["002", "011", "020", "101", "110", "200"],
        "count": 6
      }
    ]
  }
}
```

#### 4.2 Get Quick Selection Patterns
**GET** `{{base_url}}/threed/quick-patterns`

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "patterns": [
      {
        "id": "single_double",
        "name": "Single/Double Numbers",
        "description": "Numbers with single and double digits",
        "numbers": ["111", "222", "333", "444", "555"]
      },
      {
        "id": "front_back",
        "name": "Front/Back Numbers",
        "description": "Front and back number patterns",
        "numbers": ["123", "321", "456", "654", "789", "987"]
      },
      {
        "id": "power_numbers",
        "name": "Power Numbers",
        "description": "Special power number combinations",
        "numbers": ["000", "111", "222", "333", "444", "555", "666", "777", "888", "999"]
      }
    ]
  }
}
```

### 5. System Endpoints

#### 5.1 Get System Status
**GET** `{{base_url}}/system/status`

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "system_status": "operational",
    "current_time": "2024-12-20T10:30:00Z",
    "next_draw_time": "2024-12-20T14:30:00Z",
    "draw_interval": "4 hours",
    "maintenance_mode": false,
    "version": "1.0.0"
  }
}
```

#### 5.2 Get Draw Results
**GET** `{{base_url}}/system/draw-results?date=2024-12-20`

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "draw_date": "2024-12-20",
    "results": [
      {
        "draw_time": "2024-12-20T14:30:00Z",
        "result": "123",
        "break_group": 6,
        "status": "completed"
      },
      {
        "draw_time": "2024-12-20T10:30:00Z",
        "result": "456",
        "break_group": 15,
        "status": "completed"
      }
    ]
  }
}
```

### 6. Postman Collection Structure

#### Collection Variables
```json
{
  "collection": {
    "info": {
      "name": "3D Betting System API",
      "description": "Complete API collection for 3D betting system",
      "version": "1.0.0"
    },
    "variable": [
      {
        "key": "base_url",
        "value": "http://localhost:3000",
        "type": "string"
      },
      {
        "key": "auth_token",
        "value": "",
        "type": "string"
      },
      {
        "key": "user_id",
        "value": "",
        "type": "string"
      }
    ]
  }
}
```

#### Folder Structure
```
3D Betting System API/
├── Authentication/
│   ├── Guest Register
│   ├── Login
│   └── Logout
├── 3D Betting/
│   ├── Submit Bet
│   ├── Get Bet History
│   └── Get Bet Details
├── User Management/
│   ├── Get Profile
│   └── Update Profile
├── Game Data/
│   ├── Get Break Groups
│   └── Get Quick Patterns
└── System/
    ├── Get Status
    └── Get Draw Results
```

### 7. Testing Scenarios

#### 7.1 Happy Path Testing
1. **Guest Registration** → **Login** → **Submit Bet** → **Check History**
2. **Get Break Groups** → **Submit Break Group Bet** → **Verify Bet Details**
3. **Quick Pattern Selection** → **Submit Multiple Bets** → **Check Wallet Balance**

#### 7.2 Error Testing
1. **Invalid 3-digit numbers** (e.g., "12", "1234")
2. **Insufficient wallet balance**
3. **Invalid authentication token**
4. **Missing required fields**
5. **Invalid bet amounts** (negative or zero)

#### 7.3 Edge Cases
1. **Maximum bet limits**
2. **Concurrent bet submissions**
3. **System maintenance mode**
4. **Draw time restrictions**
5. **Network timeout scenarios**

### 8. Response Status Codes

| Status Code | Description | Usage |
|-------------|-------------|-------|
| 200 | OK | Successful GET requests |
| 201 | Created | Successful POST requests |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation errors |
| 500 | Internal Server Error | Server-side errors |

### 9. Data Validation Rules

#### 9.1 3D Number Validation
```javascript
// Valid 3-digit numbers: 000-999
const validNumberPattern = /^[0-9]{3}$/;

// Validation rules
- Must be exactly 3 digits
- Only numeric characters allowed
- Range: 000 to 999
```

#### 9.2 Bet Amount Validation
```javascript
// Amount validation rules
- Must be positive number
- Minimum: 1
- Maximum: 10000
- Decimal places: 2 maximum
```

#### 9.3 Authentication Validation
```javascript
// Token validation
- Must be valid JWT format
- Must not be expired
- Must be associated with valid user
```

## 🎨 UI/UX Design

### Design System
- **Color Scheme**: Dark theme with yellow/orange accents
- **Typography**: Modern fonts with proper hierarchy
- **Spacing**: Consistent padding and margins
- **Animations**: Smooth transitions and hover effects

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Desktop Enhancement**: Enhanced features for larger screens
- **Touch Friendly**: Large touch targets and gestures
- **Accessibility**: Proper contrast and keyboard navigation

### Component Styling
```css
/* Primary Button */
bg-[#12486b] hover:bg-[#0d3a5a]

/* Success Button */
bg-green-500 hover:bg-green-600

/* Danger Button */
border-red-500 text-red-500

/* Card Background */
bg-gradient-to-r from-slate-800/50 to-slate-900/50
```

## 🎯 Break Groups System

### Concept
Break groups categorize 3-digit numbers based on the sum of their digits.

### Calculation
```javascript
// Example: 123
1 + 2 + 3 = 6 → Break 6

// Example: 999
9 + 9 + 9 = 27 → Break 27
```

### Group Distribution
- **Break 0**: 1 number (000)
- **Break 1**: 3 numbers (001, 010, 100)
- **Break 2**: 6 numbers (002, 011, 020, 101, 110, 200)
- **Break 3**: 10 numbers
- **...**
- **Break 27**: 1 number (999)

### Implementation
```javascript
const generateBreakGroups = () => {
  const groups = [];
  for (let sum = 0; sum <= 27; sum++) {
    const numbers = [];
    for (let i = 0; i <= 999; i++) {
      const num = i.toString().padStart(3, '0');
      const digitSum = num.split('').reduce((a, b) => a + parseInt(b), 0);
      if (digitSum === sum) {
        numbers.push(num);
      }
    }
    groups.push({ name: `Break ${sum}`, numbers });
  }
  return groups;
};
```

## 🔄 Permutation System

### Concept
Generates all possible arrangements of selected 3-digit numbers.

### Example
**Input**: 123
**Output**: 123, 132, 231, 213, 321, 312 (6 permutations)

### Implementation
```javascript
const generatePermutations = (num) => {
  const digits = num.split('');
  const permutations = [];
  
  for (let i = 0; i < digits.length; i++) {
    for (let j = 0; j < digits.length; j++) {
      for (let k = 0; k < digits.length; k++) {
        if (i !== j && i !== k && j !== k) {
          permutations.push(digits[i] + digits[j] + digits[k]);
        }
      }
    }
  }
  return [...new Set(permutations)];
};
```

### Bet Calculation
```javascript
// Total Amount = (Number of digits × Amount per digit) + 
//                (Number of permutation digits × Permutation amount per digit)

const totalAmount = (selectedDigits.length * amount) + 
                   (permutationDigits.length * permutationAmount);
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- React 18+
- React Router v6

### Installation Steps
```bash
# Clone the repository
git clone <repository-url>
cd F5J3_new_client

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup
```bash
# Create .env file
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=3D Betting System
```

## 📖 Usage Guide

### For Users

#### 1. Accessing 3D Betting
- Navigate to home page
- Click "3D" tab in game categories
- Or use sidebar navigation "3D" link

#### 2. Selecting Numbers
- **Manual Input**: Type 3-digit number and click "ရွေးမည်"
- **Quick Selection**: Click "အမြန်ရွေးရန်" for predefined patterns
- **Break Groups**: Select numbers by digit sum (0-27)

#### 3. Setting Amounts
- **Regular Amount**: Amount per selected number
- **Permutation Amount**: Amount per permutation number

#### 4. Using Permutation
- Click "ပတ်လည်ထိုးမည်" to generate all arrangements
- Example: 123 → 123, 132, 231, 213, 321, 312

#### 5. Confirming Bets
- Review selected numbers and amounts
- Edit individual amounts if needed
- Click "ထိုးမည်" to submit

### For Developers

#### 1. Adding New Quick Selection Options
```javascript
// In ThreeDChooseOption.jsx
const newPattern = {
  name: 'Custom Pattern',
  numbers: ['111', '222', '333']
};
```

#### 2. Modifying Break Group Logic
```javascript
// Custom break group calculation
const customBreakGroups = (minSum, maxSum) => {
  // Implementation
};
```

#### 3. Extending Permutation System
```javascript
// Custom permutation logic
const customPermutations = (number, pattern) => {
  // Implementation
};
```

## 🔧 Technical Specifications

### Performance
- **Bundle Size**: Optimized with Vite
- **Loading Time**: < 2 seconds on 3G
- **Memory Usage**: Efficient state management
- **Rendering**: React 18 concurrent features

### Browser Support
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Mobile Support
- **iOS**: 12+
- **Android**: 8+
- **Responsive**: All screen sizes

### Security
- **Input Validation**: Client-side validation
- **XSS Prevention**: React built-in protection
- **CSRF Protection**: API token validation
- **Data Sanitization**: Input cleaning

## 🐛 Troubleshooting

### Common Issues

#### 1. "Rendered fewer hooks than expected"
**Cause**: Conditional hook calls
**Solution**: Ensure all hooks are called unconditionally

#### 2. "Cannot set properties of undefined"
**Cause**: Context not properly initialized
**Solution**: Add null checks for context values

#### 3. "JSON.parse: Unexpected token"
**Cause**: Non-JSON API response
**Solution**: Check Content-Type header before parsing

#### 4. Navigation Issues
**Cause**: Route not defined
**Solution**: Verify route configuration in index.jsx

### Debug Mode
```javascript
// Enable debug logging
const DEBUG = true;

if (DEBUG) {
  console.log('Selected Digits:', selectedDigits);
  console.log('Bet Data:', betData);
}
```

### Performance Monitoring
```javascript
// Monitor component re-renders
const renderCount = useRef(0);
renderCount.current += 1;
console.log('Component rendered:', renderCount.current, 'times');
```

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Initial 3D betting system implementation
- ✅ Complete permutation system
- ✅ Break groups (0-27)
- ✅ Quick selection options
- ✅ Responsive design
- ✅ Bet confirmation flow
- ✅ Error handling and validation

### Planned Features
- 🔄 Real-time result updates
- 🔄 Advanced statistics
- 🔄 Bet history
- 🔄 Multi-language support expansion
- 🔄 Offline capability

## 🤝 Contributing

### Development Guidelines
1. Follow React best practices
2. Use TypeScript for new components
3. Write unit tests for critical functions
4. Maintain consistent code style
5. Update documentation for changes

### Code Review Process
1. Create feature branch
2. Implement changes
3. Write/update tests
4. Update documentation
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For technical support or questions:
- **Email**: support@example.com
- **Documentation**: [Link to docs]
- **Issues**: [GitHub Issues]

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Author**: Development Team
