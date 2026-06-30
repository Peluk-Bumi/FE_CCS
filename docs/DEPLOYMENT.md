# 🚀 FE_CCS Deployment Guide - Peluk Bumi EMS

## 📋 Overview

Deployment guide untuk frontend Peluk Bumi Environmental Monitoring System (EMS) ke production environment dengan React 19, Vite, dan modern web technologies.

## 🏗️ Production Architecture

```
┌─────────────────┐     HTTPS        ┌──────────────────────┐
│   Users        │ ◄────────────► │  CDN/Static Host    │
│   Browsers      │                │  (Netlify/Vercel)   │
│   Mobile        │                │  :443               │
└─────────────────┘                └──────────┬───────────┘
                                            │
                                            ▼
┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│  API Backend        │    │  Blockchain Service  │    │  Polygon Network     │
│  :8000              │    │  :4000              │    │  Smart Contract      │
└──────────────────────┘    └──────────────────────┘    └──────────────────────┘
```

## 🔧 Deployment Options

### 1. Netlify (Recommended)
### 2. Vercel
### 3. Static Hosting
### 4. Docker Container

## 🚀 Option 1: Netlify Deployment

### Prerequisites
- Netlify account
- Git repository (GitHub, GitLab, Bitbucket)
- Domain (optional)

### Build Configuration

#### netlify.toml
```toml
[build]
  base = "FE_CCS/"
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[redirects]]
  from = "/api/*"
  to = "https://api.pelukbumi.org/api/:splat"
  status = 200
  force = true

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://rpc-amoy.polygon.technology; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.pelukbumi.org https://rpc-amoy.polygon.technology;"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Deployment Steps

#### 1. Prepare Repository
```bash
# Ensure build script exists
npm run build

# Test production build locally
npm run preview
```

#### 2. Connect to Netlify
1. Login to Netlify dashboard
2. Click "New site from Git"
3. Choose your Git provider
4. Select repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

#### 3. Environment Variables
Set these in Netlify dashboard:
```
VITE_API_BASE_URL=https://api.pelukbumi.org
VITE_POLYGON_AMOY_RPC_URL=https://polygon-rpc.com
VITE_CONTRACT_ADDRESS=0x...
VITE_APP_NAME=Peluk Bumi CCS
VITE_ENABLE_ANALYTICS=true
```

#### 4. Deploy
```bash
# Push to trigger deployment
git add .
git commit -m "Deploy to production"
git push origin main
```

## 🚀 Option 2: Vercel Deployment

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://api.pelukbumi.org/api/$1",
      "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Deployment Steps

#### 1. Install Vercel CLI
```bash
npm i -g vercel
```

#### 2. Login and Deploy
```bash
# Login to Vercel
vercel login

# Deploy from project root
vercel --prod

# Configure project settings when prompted
- Project name: fe-ccs
- Directory: ./
- Output directory: dist
- Development command: npm run dev
- Build command: npm run build
- Install command: npm install
```

#### 3. Environment Variables
```bash
# Set environment variables
vercel env add VITE_API_BASE_URL
vercel env add VITE_POLYGON_AMOY_RPC_URL
vercel env add VITE_CONTRACT_ADDRESS
vercel env add VITE_APP_NAME
vercel env add VITE_ENABLE_ANALYTICS
```

## 🚀 Option 3: Static Hosting (Nginx)

### Build for Production
```bash
# Build optimized version
npm run build

# Analyze bundle size
npm run build -- --analyze
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name pelukbumi.org www.pelukbumi.org;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name pelukbumi.org www.pelukbumi.org;

    root /var/www/pelukbumi.org/dist;
    index index.html;

    # SSL Configuration
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://polygon-rpc.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.pelukbumi.org https://polygon-rpc.com;" always;

    # Static Files
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # JS and CSS files
    location ~* \.(js|css)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Images and fonts
    location ~* \.(jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass https://api.pelukbumi.org;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🚀 Option 4: Docker Deployment

### Dockerfile
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY FE_CCS/ ./

# Install dependencies
RUN npm ci --only=production

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  fe-ccs:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  # Optional: Run with backend
  be-ccs:
    image: php:8.2-fpm
    volumes:
      - ./BE_CCS:/var/www/html
    environment:
      - APP_ENV=production
    restart: unless-stopped
```

### Docker Deployment
```bash
# Build and run
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔧 Build Optimization

### Vite Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@mui/material', '@mui/icons-material'],
          charts: ['chart.js', 'react-chartjs-2'],
          blockchain: ['ethers'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  server: {
    host: true,
    port: 5173,
  },
});
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "build:analyze": "vite build --mode analyze",
    "build:staging": "vite build --mode staging",
    "build:production": "vite build --mode production",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext js,jsx --fix",
    "type-check": "tsc --noEmit"
  }
}
```

## 🔒 Security Configuration

### Environment Variables
```env
# Production
VITE_API_BASE_URL=https://api.pelukbumi.org
VITE_POLYGON_AMOY_RPC_URL=https://polygon-rpc.com
VITE_CONTRACT_ADDRESS=0x...
VITE_APP_NAME=Peluk Bumi CCS
VITE_ENABLE_ANALYTICS=true

# Security
VITE_ENABLE_CSP=true
VITE_BLOCKCHAIN_NETWORK=mainnet
```

### Content Security Policy
```javascript
// src/security/csp.js
export const CSP_POLICY = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "https://polygon-rpc.com"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "https:"],
  'font-src': ["'self'"],
  'connect-src': ["'self'", "https://api.pelukbumi.org", "https://polygon-rpc.com"],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
};
```

## 📊 Performance Optimization

### Bundle Analysis
```bash
# Analyze bundle size
npm run build:analyze

# Check bundlephobia
npx bundlephobia dist/assets/index-*.js
```

### Service Worker
```javascript
// public/sw.js
const CACHE_NAME = 'ccs-app-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
```

### Progressive Web App
```json
// public/manifest.json
{
  "name": "3TREESIFY CCS",
  "short_name": "CCS",
  "description": "Carbon Capture and Storage Management Platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#517640",
  "theme_color": "#517640",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 📈 Monitoring & Analytics

### Google Analytics
```jsx
// src/components/Analytics.jsx
import { useEffect } from 'react';
import ReactGA from 'react-ga';

const Analytics = () => {
  useEffect(() => {
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      ReactGA.initialize('GA_MEASUREMENT_ID');
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }, []);

  return null;
};

export default Analytics;
```

### Error Tracking
```jsx
// src/components/ErrorBoundary.jsx
import React from 'react';
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});

class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo } } });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h1>Something went wrong.</h1>
          <p>We've been notified about this issue.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    - name: Install dependencies
      run: npm ci
    - name: Run tests
      run: npm test
    - name: Run linting
      run: npm run lint
    - name: Type check
      run: npm run type-check

  deploy-netlify:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    - name: Install dependencies
      run: npm ci
    - name: Build
      run: npm run build
    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      with:
        args: deploy --prod --dir=dist
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Check for memory issues
node --max-old-space-size=4096 node_modules/.bin/vite build
```

#### Deployment Issues
```bash
# Check build output
ls -la dist/

# Test locally
npm run preview

# Check network requests
curl -I https://your-domain.com
```

#### Performance Issues
```bash
# Check bundle size
npm run build:analyze

# Lighthouse audit
npx lighthouse https://your-domain.com --output html --output-path ./lighthouse-report.html
```

## 📚 Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/build.html#deployment)
- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Web.dev Best Practices](https://web.dev/)
- [MDN Web Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
