# 📡 FE_CCS API Integration Documentation - Peluk Bumi EMS

## 📋 Overview

Documentation for frontend API integration with BE_CCS backend services. Includes authentication, API services, and data flow patterns.

## 🔐 Authentication

### Auth Service
```jsx
// src/shared/services/authService.js
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = this.getUserFromToken();
  }

  async login(email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      this.token = token;
      this.user = user;
      
      return { success: true, user, token };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  }

  async logout() {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${this.token}` }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.token = null;
      this.user = null;
    }
  }

  getUserFromToken() {
    if (!this.token) return null;
    
    try {
      return jwtDecode(this.token);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }

  isAuthenticated() {
    if (!this.token) return false;
    
    try {
      const decoded = jwtDecode(this.token);
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  getAuthHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }
}

export default new AuthService();
```

### Auth Context
```jsx
// src/app/context/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '@/shared/services/authService';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: authService.user,
    token: authService.token,
    loading: false,
    error: null,
  });

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    const result = await authService.login(email, password);
    
    if (result.success) {
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: result.user, token: result.token } 
      });
    } else {
      dispatch({ type: 'LOGIN_FAILURE', payload: result.error });
    }
    
    return result;
  };

  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    await authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## 📋 API Services

### Base API Service
```jsx
// src/shared/services/apiService.js
import axios from 'axios';
import authService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = authService.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor untuk autentikasi
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor untuk penanganan kesalahan
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Tangani akses tidak sah
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🔐 Endpoint Autentikasi

### Login
```javascript
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "User Name",
      "email": "user@example.com",
      "role": "admin" | "user"
    },
    "token": "jwt_token_string",
    "refreshToken": "refresh_token_string"
  }
}

Error Response (401):
{
  "success": false,
  "error": "Kredensial tidak valid"
}
```

### Register
```javascript
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}

Response (201):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "User Name",
      "email": "user@example.com",
      "role": "user"
    },
    "token": "jwt_token_string"
  }
}
```

### Refresh Token
```javascript
POST /api/auth/refresh
Authorization: Bearer <refresh_token>

Response (200):
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

## 👤 Endpoint Manajemen Pengguna

### Dapatkan Profil Pengguna Saat Ini
```javascript
GET /api/users/profile
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "User Name",
    "email": "user@example.com",
    "role": "admin" | "user",
    "avatar": "avatar_url",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

### Perbarui Profil
```javascript
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "name": "Updated Name",
  "avatar": "file_object" // Opsional
}

Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Updated Name",
    "email": "user@example.com",
    "avatar": "new_avatar_url"
  }
}
```

### Ubah Kata Sandi
```javascript
PUT /api/users/password
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}

Response (200):
{
  "success": true,
  "message": "Kata sandi berhasil diperbarui"
}
```

## 📋 Endpoint Manajemen Proyek

### Perencanaan
```javascript
GET /api/planning
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "companyName": "Company Name",
      "projectTitle": "Project Title",
      "location": {
        "latitude": -6.200000,
        "longitude": 106.816666
      },
      "plantedSpecies": ["Mangrove", "Eucalyptus"],
      "targetTrees": 1000,
      "status": "planned" | "in_progress" | "completed",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

```javascript
POST /api/planning
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "companyName": "Company Name",
  "projectTitle": "Project Title",
  "location": {
    "latitude": -6.200000,
    "longitude": 106.816666
  },
  "plantedSpecies": ["Mangrove", "Eucalyptus"],
  "targetTrees": 1000,
  "projectDescription": "Project description"
}

Response (201):
{
  "success": true,
  "data": {
    "id": "new_uuid",
    "message": "Perencanaan berhasil dibuat"
  }
}
```

### Implementasi
```javascript
GET /api/implementation/:planningId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "planningId": "planning_uuid",
    "implementationDate": "2025-01-15T00:00:00Z",
    "actualTreesPlanted": 950,
    "documentation": ["file_url_1", "file_url_2"],
    "status": "in_progress" | "completed"
  }
}
```

```javascript
POST /api/implementation
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "planningId": "planning_uuid",
  "implementationDate": "2025-01-15T00:00:00Z",
  "actualTreesPlanted": 950,
  "documentation": ["file_object"],
  "notes": "Implementation notes"
}

Response (201):
{
  "success": true,
  "data": {
    "id": "new_uuid",
    "message": "Implementasi berhasil dicatat"
  }
}
```

### Monitoring
```javascript
GET /api/monitoring/:implementationId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "implementationId": "implementation_uuid",
    "monitoringDate": "2025-02-15T00:00:00Z",
    "survivalRate": 85.5,
    "averageHeight": "65.2 cm",
    "healthStatus": "good" | "fair" | "poor",
    "monitoringItems": [
      {
        "id": "item_uuid",
        "tagNumber": "TREE001",
        "height": "65.2 cm",
        "diameter": "1.8 cm",
        "healthCondition": "good",
        "notes": "Healthy growth observed",
        "photos": ["photo_url_1", "photo_url_2"]
      }
    ]
  }
}
```

```javascript
POST /api/monitoring
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "implementationId": "implementation_uuid",
  "monitoringDate": "2025-02-15T00:00:00Z",
  "monitoringItems": [
    {
      "tagNumber": "TREE001",
      "height": "65.2 cm",
      "diameter": "1.8 cm",
      "healthCondition": "good",
      "notes": "Healthy growth observed",
      "photos": ["file_object"]
    }
  ]
}

Response (201):
{
  "success": true,
  "data": {
    "id": "new_uuid",
    "survivalRate": 85.5,
    "message": "Data monitoring berhasil dicatat"
  }
}
```

### Evaluasi
```javascript
GET /api/evaluation/:monitoringId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "monitoringId": "monitoring_uuid",
    "evaluationScore": 85.5,
    "recommendations": [
      "Lanjutkan jadwal monitoring saat ini",
      "Pertimbangkan aplikasi pupuk tambahan"
    ],
    "narrative": "Laporan evaluasi komprehensif...",
    "generatedAt": "2025-03-15T00:00:00Z"
  }
}
```

```javascript
POST /api/evaluation
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "monitoringId": "monitoring_uuid",
  "evaluationNotes": "Manual evaluation notes"
}

Response (201):
{
  "success": true,
  "data": {
    "id": "new_uuid",
    "evaluationScore": 85.5,
    "message": "Evaluasi berhasil diselesaikan"
  }
}
```

## 📊 Endpoint Pelaporan

### Dapatkan Laporan
```javascript
GET /api/reports
Authorization: Bearer <token>
Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- status: string (filter opsional)
- dateFrom: string (filter opsional)
- dateTo: string (filter opsional)

Response (200):
{
  "success": true,
  "data": {
    "reports": [
      {
        "id": "uuid",
        "type": "planning" | "implementation" | "monitoring" | "evaluation",
        "title": "Report Title",
        "generatedAt": "2025-01-01T00:00:00Z",
        "downloadUrl": "download_link"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Buat Laporan PDF
```javascript
POST /api/reports/pdf
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "reportType": "planning" | "implementation" | "monitoring" | "evaluation",
  "dataId": "uuid",
  "options": {
    "includePhotos": true,
    "includeCharts": true
  }
}

Response (200):
{
  "success": true,
  "data": {
    "downloadUrl": "pdf_download_link",
    "expiresAt": "2025-01-01T01:00:00Z"
  }
}
```

## 🔍 Endpoint Verifikasi

### Verifikasi Kode QR
```javascript
GET /api/verification/:qrCode
Public endpoint (tidak memerlukan autentikasi)

Response (200):
{
  "success": true,
  "data": {
    "projectTitle": "Project Title",
    "companyName": "Company Name",
    "location": {
      "latitude": -6.200000,
      "longitude": 106.816666
    },
    "status": "verified" | "pending" | "invalid",
    "verificationDate": "2025-01-01T00:00:00Z",
    "blockchainTxHash": "0x123...",
    "documents": ["document_url_1", "document_url_2"]
  }
}

Error Response (404):
{
  "success": false,
  "error": "Kode QR tidak ditemukan atau tidak valid"
}
```

## 📁 Endpoint Upload File

### Upload Files
```javascript
POST /api/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Request Body:
- file: File object
- type: string ("planning_document" | "implementation_photo" | "monitoring_photo")
- relatedId: string (uuid dari entitas terkait)

Response (201):
{
  "success": true,
  "data": {
    "fileId": "uuid",
    "fileName": "document.pdf",
    "fileUrl": "https://cdn.example.com/files/uuid/document.pdf",
    "fileSize": 1024000,
    "mimeType": "application/pdf"
  }
}
```

### Hapus File
```javascript
DELETE /api/upload/:fileId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "File berhasil dihapus"
}
```

## ⛓ Endpoint Blockchain

### Dapatkan Riwayat Transaksi
```javascript
GET /api/blockchain/transactions
Authorization: Bearer <token>
Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)

Response (200):
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "txHash": "0x123...",
        "type": "planning" | "implementation" | "monitoring" | "evaluation",
        "status": "confirmed" | "pending" | "failed",
        "timestamp": "2025-01-01T00:00:00Z",
        "blockNumber": 12345,
        "gasUsed": "21000"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 50
    }
  }
}
```

### Verifikasi Transaksi
```javascript
GET /api/blockchain/verify/:txHash
Public endpoint (tidak memerlukan autentikasi)

Response (200):
{
  "success": true,
  "data": {
    "txHash": "0x123...",
    "status": "confirmed",
    "blockNumber": 12345,
    "timestamp": "2025-01-01T00:00:00Z",
    "confirmations": 15,
    "data": {
      "projectId": "uuid",
      "action": "planning_created",
      "details": "Transaction details"
    }
  }
}
```

## 🛠️ Contoh Lapisan Layanan

### Layanan Perencanaan
```javascript
// features/planning/services/planningService.js
import api from '@/shared/services/api';

export const fetchPlanningData = async () => {
  try {
    const response = await api.get('/planning');
    return response.data;
  } catch (error) {
    throw new Error(`Gagal mengambil data perencanaan: ${error.message}`);
  }
};

export const submitPlanning = async (planningData) => {
  try {
    const response = await api.post('/planning', planningData);
    return response.data;
  } catch (error) {
    throw new Error(`Gagal mengirim perencanaan: ${error.message}`);
  }
};

export const updatePlanningStatus = async (id, status) => {
  try {
    const response = await api.put(`/planning/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(`Gagal memperbarui status perencanaan: ${error.message}`);
  }
};
```

### Layanan Evaluasi
```javascript
// features/evaluation/services/evaluationService.js
import api from '@/shared/services/api';

export const fetchEvaluationData = async (monitoringId) => {
  try {
    const response = await api.get(`/evaluation/${monitoringId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Gagal mengambil data evaluasi: ${error.message}`);
  }
};

export const generateEvaluation = async (evaluationData) => {
  try {
    const response = await api.post('/evaluation', evaluationData);
    return response.data;
  } catch (error) {
    throw new Error(`Gagal membuat evaluasi: ${error.message}`);
  }
};
```

## 🚨 Penanganan Kesalahan

### Format Respons Kesalahan Standar
```javascript
{
  "success": false,
  "error": "Pesan kesalahan",
  "code": "ERROR_CODE", // Opsional
  "details": {} // Detail kesalahan tambahan opsional
}
```

### Kode Kesalahan Umum
- `UNAUTHORIZED` (401): Token tidak valid atau kedaluwarsa
- `FORBIDDEN` (403): Izin tidak mencukupi
- `NOT_FOUND` (404): Sumber daya tidak ditemukan
- `VALIDATION_ERROR` (400): Data input tidak valid
- `SERVER_ERROR` (500): Kesalahan server internal
- `RATE_LIMIT_EXCEEDED` (429): Terlalu banyak request

### Penanganan Kesalahan di Komponen
```javascript
const Component = () => {
  const [error, setError] = useState(null);

  const handleSubmit = async (data) => {
    try {
      await service.submitData(data);
      toast.success('Data berhasil dikirim');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          {error}
        </div>
      )}
      {/* Konten form */}
    </div>
  );
};
```

## 🔄 Strategi Caching

### Caching Local Storage
```javascript
// shared/utils/cache.js
export const cacheData = (key, data, ttl = 3600000) => {
  const item = {
    data,
    timestamp: Date.now(),
    ttl
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getCachedData = (key) => {
  const item = localStorage.getItem(key);
  if (!item) return null;
  
  const parsed = JSON.parse(item);
  if (Date.now() - parsed.timestamp > parsed.ttl) {
    localStorage.removeItem(key);
    return null;
  }
  
  return parsed.data;
};
```

## 📈 Pembatasan Laju

API mengimplementasikan pembatasan laju untuk mencegah penyalahgunaan:

- **Pengguna Terotentikasi**: 100 request per menit
- **Endpoint Publik**: 50 request per menit
- **Upload File**: 10 upload per menit

Header pembatasan laju disertakan dalam respons:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

*Dokumentasi API ini mencerminkan kondisi FE_CCS saat ini per Mei 2025*
