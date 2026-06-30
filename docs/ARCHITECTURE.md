# 🏗️ FE_CCS Architecture

**Frontend Architecture for Peluk Bumi Environmental Monitoring System**

---

## 📐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    User Interface Layer                          │
│  (Web Browser, Mobile Browser, Desktop App)                     │
└────────────────────┬────────────────────────────────────────────┘
                     │ HTTP/HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                  React 19 Application                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Pages & Components                                       │  │
│  │ - Landing Page, Dashboard, Forms                         │  │
│  │ - Planning, Implementation, Monitoring                   │  │
│  │ - Evaluation, Verification, Settings                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ State Management                                         │  │
│  │ - React Context API                                      │  │
│  │ - Custom Hooks                                           │  │
│  │ - Local Storage                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Services & Utilities                                     │  │
│  │ - API Client (Axios)                                     │  │
│  │ - Authentication Service                                 │  │
│  │ - Data Formatting & Validation                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ UI Components & Styling                                  │  │
│  │ - Shadcn/ui Components                                   │  │
│  │ - Tailwind CSS                                           │  │
│  │ - Responsive Design                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────────┘
                     │ REST API
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                  BE_CCS (Backend)                                │
│              (Laravel Application)                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
FE_CCS/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── logo/
│   │   ├── icon-green.png
│   │   └── icon-peach.png
│   └── data/
│       └── partners.json
├── src/
│   ├── app/
│   │   ├── config/
│   │   │   ├── blockchainConfig.js
│   │   │   └── navigationConfig.js
│   │   └── routes/
│   │       ├── AppRoutes.jsx
│   │       └── ProtectedRoute.jsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── services/
│   │   ├── planning/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── implementation/
│   │   ├── monitoring/
│   │   ├── evaluation/
│   │   ├── verification/
│   │   ├── reporting/
│   │   ├── blockchain/
│   │   │   └── services/
│   │   │       └── blockchainService.js
│   │   ├── landing/
│   │   │   └── components/
│   │   ├── admin/
│   │   └── demo/
│   ├── layouts/
│   │   ├── DashboardLayout.jsx
│   │   ├── common/
│   │   └── partials/
│   ├── pages/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── planning/
│   │   ├── implementation/
│   │   ├── monitoring/
│   │   ├── evaluation/
│   │   ├── verification/
│   │   ├── reporting/
│   │   ├── settings/
│   │   ├── admin/
│   │   └── public/
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── common/
│   │   │   └── layout/
│   │   ├── hooks/
│   │   ├── utils/
│   │   │   ├── factories/
│   │   │   ├── guards/
│   │   │   └── utils.js
│   │   └── styles/
│   ├── App.jsx
│   └── main.jsx
├── docs/
│   ├── ARCHITECTURE.md
│   ├── SETUP.md
│   ├── FOLDER_STRUCTURE.md
│   ├── COMPONENTS.md
│   └── README.md
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 🔄 Request Flow

### 1. Authentication Flow
```
User Login
    ↓
LoginPage Component
    ↓
AuthService.login()
    ↓
API Call to BE_CCS /api/auth/login
    ↓
Receive JWT Token
    ↓
Store Token (localStorage)
    ↓
Update Auth Context
    ↓
Redirect to Dashboard
```

### 2. Data Fetching Flow
```
Component Mount
    ↓
useEffect Hook
    ↓
Call API Service
    ↓
API Request to BE_CCS
    ↓
Receive Data
    ↓
Update State
    ↓
Re-render Component
```

### 3. Form Submission Flow
```
User Submits Form
    ↓
Form Validation
    ↓
API Service Call
    ↓
POST/PUT to BE_CCS
    ↓
Receive Response
    ↓
Update Local State
    ↓
Show Success/Error Message
    ↓
Redirect or Refresh Data
```

---

## 📦 Core Modules

### 1. Authentication Module
**Location:** `src/features/auth/`

**Components:**
- `LoginPage.jsx` - Login form
- `RegisterPage.jsx` - Registration form
- `ProtectedRoute.jsx` - Route protection

**Services:**
- `authService.js` - Authentication logic

**State:**
- Auth context with user info and token

---

### 2. Planning Module (Perencanaan)
**Location:** `src/features/planning/`

**Components:**
- `PlanningForm.jsx` - Create/edit form
- `PlanningTable.jsx` - List view
- `PlanningStats.jsx` - Statistics

**Services:**
- `planningService.js` - API calls
- `planningUtils.js` - Data formatting

**Hooks:**
- `usePlanning.js` - Custom hook for planning data

---

### 3. Implementation Module (Implementasi)
**Location:** `src/features/implementation/`

**Components:**
- `ImplementasiForm.jsx` - Create/edit form
- Implementation tracking components

---

### 4. Monitoring Module
**Location:** `src/features/monitoring/`

**Components:**
- `MonitoringForm.jsx` - Data entry form
- `MonitoringTable.jsx` - Data display
- `MonitoringStats.jsx` - Statistics

**Services:**
- `monitoringService.js` - API calls

---

### 5. Evaluation Module (Evaluasi)
**Location:** `src/features/evaluation/`

**Components:**
- Evaluation forms and displays

---

### 6. Verification Module
**Location:** `src/features/verification/`

**Components:**
- `VerificationDashboardPage.jsx` - Verification interface

---

### 7. Blockchain Module
**Location:** `src/features/blockchain/`

**Services:**
- `blockchainService.js` - Blockchain integration

**Functions:**
- Verify document on blockchain
- Get transaction status
- Display verification results

---

### 8. Dashboard Module
**Location:** `src/pages/dashboard/`

**Components:**
- `AdminDashboardPage.jsx` - Admin dashboard
- `UserDashboardPage.jsx` - User dashboard

**Features:**
- Real-time statistics
- Project overview
- Quick actions

---

## 🎨 UI Components

### Shadcn/ui Components Used
- Button
- Card
- Input
- Label
- Checkbox
- Sheet (Mobile menu)
- Navigation components

### Custom Components
- `DashboardLayout.jsx` - Main layout
- `PageTitle.jsx` - Page header
- `ContextActions.jsx` - Context menu
- `FieldHeader.jsx` - Form field header

---

## 🔌 API Integration

### API Client Setup
**File:** `src/shared/utils/apiClient.js`

**Configuration:**
- Base URL: `http://localhost:8000/api`
- Default headers
- Token management
- Error handling

### API Services
```javascript
// Planning Service
planningService.getAll()
planningService.getById(id)
planningService.create(data)
planningService.update(id, data)
planningService.delete(id)

// Implementation Service
implementasiService.getAll()
implementasiService.create(data)
// ... similar methods

// Monitoring Service
monitoringService.getAll()
monitoringService.create(data)
// ... similar methods

// Blockchain Service
blockchainService.verify(hash)
blockchainService.getStatus(transactionHash)
```

---

## 🔐 Security Features

### Authentication
- JWT token-based authentication
- Token stored in localStorage
- Automatic token refresh
- Logout functionality

### Authorization
- Protected routes
- Role-based access control
- Permission checking
- Secure API calls

### Data Protection
- HTTPS communication
- Input validation
- XSS prevention
- CSRF protection

---

## 📊 State Management

### Context API
```javascript
// Auth Context
- user
- token
- isAuthenticated
- login()
- logout()
- updateUser()

// App Context
- theme
- language
- notifications
```

### Local Storage
- User preferences
- Cached data
- Session information

### Component State
- Form data
- UI state
- Loading states
- Error messages

---

## 🎯 Routing Structure

### Public Routes
```
/                    - Landing page
/about               - About page
/terms               - Terms and conditions
/policy              - Privacy policy
/license             - License
```

### Authentication Routes
```
/auth/login          - Login page
/auth/register       - Registration page
```

### Protected Routes
```
/dashboard           - User dashboard
/planning            - Planning module
/implementation      - Implementation module
/monitoring          - Monitoring module
/evaluation          - Evaluation module
/verification        - Verification module
/reporting           - Reports
/settings            - User settings
/admin               - Admin panel
```

---

## 🎨 Styling Architecture

### Tailwind CSS
- Utility-first CSS framework
- Responsive design
- Dark mode support
- Custom configuration

### Component Styling
- Inline Tailwind classes
- CSS modules (optional)
- Styled components (optional)

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl, 2xl
- Flexible layouts
- Touch-friendly UI

---

## 🚀 Performance Optimization

### Code Splitting
- Route-based code splitting
- Lazy loading components
- Dynamic imports

### Caching
- API response caching
- Local storage caching
- Browser caching

### Optimization Techniques
- Image optimization
- Minification
- Tree shaking
- Lazy loading

---

## 🔍 Development Tools

### Vite
- Fast development server
- Hot module replacement
- Optimized build

### ESLint
- Code quality
- Style consistency
- Error detection

### Prettier
- Code formatting
- Consistent style

---

## 📱 Responsive Design

### Breakpoints
```
Mobile:    < 640px
Tablet:    640px - 1024px
Desktop:   > 1024px
```

### Mobile Features
- Touch-friendly buttons
- Mobile menu (Sheet component)
- Responsive forms
- Optimized layouts

---

## 🔗 Integration with BE_CCS

### API Endpoints Used
```
GET    /api/auth/user           - Get current user
POST   /api/auth/login          - User login
POST   /api/auth/logout         - User logout

GET    /api/dashboard           - Dashboard data
GET    /api/perencanaan         - Planning list
POST   /api/perencanaan         - Create planning
GET    /api/implementasi        - Implementation list
GET    /api/monitoring          - Monitoring data
GET    /api/evaluasi            - Evaluation data
GET    /api/blockchain/verify   - Verify blockchain
```

---

## 📚 Related Documentation

- [SETUP.md](./SETUP.md) - Development setup
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) - Folder structure
- [COMPONENTS.md](./COMPONENTS.md) - Component documentation
- [README.md](./README.md) - Overview

---

## 🛠️ Development Workflow

### Setup
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

---

**Last Updated:** May 19, 2026  
**Version:** 1.0.0

