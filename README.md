# We Are With U (WWU)

Production-ready emotional wellness healthcare platform with a React Native mobile app and Node.js backend.

## Step-by-Step Build Order (Implemented)

1. Complete folder structure
2. Frontend setup
3. Backend setup
4. MongoDB configuration
5. Authentication module
6. Navigation setup
7. Dashboard implementation
8. Mood check-in module
9. AI sentiment analysis integration
10. Healing module
11. Journal module
12. Notifications
13. Emergency support
14. Profile module
15. Admin APIs
16. Testing
17. Deployment
18. Final run commands

## Project Structure

```
wwu-mobile/
  app/
    (auth)/
    (tabs)/
    _layout.tsx
    index.tsx
  src/
    api/
    components/
    constants/
    features/
    hooks/
    services/
    store/
    theme/
    types/
  eas.json
  .env.example

backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    types/
    utils/
    validators/
    app.ts
    server.ts
  tests/
  .env.example
  render.yaml
```

## Features Implemented

- Auth: signup, login, logout, forgot password, refresh token, protected routes, bcrypt hashing, JWT middleware.
- Onboarding: multi-step animated onboarding flow.
- Dashboard: greeting, motivational quote, mood summary, recommendations.
- Emotional check-in: dynamic sliders + free text, AI sentiment analysis, mood history.
- AI NLP: OpenAI integration with strict JSON output and safe fallback classifier.
- Healing module: breathing animation, calming audio player, timed sessions foundation.
- Journal: create, search, list, delete with AI insights.
- Notifications: Expo notification permission + daily reminder scheduling.
- Emergency support: direct call actions for support contacts.
- Profile: user summary, dark mode, logout.
- Admin APIs: analytics, mood trends, engagement metrics.
- Security: helmet, rate limit, xss-clean, hpp, mongo-sanitize, validation middleware, centralized errors.
- Testing: backend validator test + mobile feature test.

## All Dependencies

### Mobile
- expo, react-native, react
- expo-router, @react-navigation/native, @react-navigation/bottom-tabs
- zustand, axios, react-hook-form, zod, @hookform/resolvers
- styled-components
- react-native-reanimated, react-native-gesture-handler, react-native-screens, react-native-safe-area-context
- expo-notifications, expo-secure-store, expo-av
- jest, jest-expo, @testing-library/react-native

### Backend
- express, mongoose, dotenv, cors, helmet, compression, morgan
- express-rate-limit, cookie-parser, hpp, express-mongo-sanitize, xss-clean
- bcryptjs, jsonwebtoken, zod
- openai
- typescript, ts-node-dev, jest, ts-jest, supertest

## Environment Variables

### Mobile (`wwu-mobile/.env`)

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

### Backend (`backend/.env`)

```
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wwu
JWT_ACCESS_SECRET=replace-with-strong-access-secret
JWT_REFRESH_SECRET=replace-with-strong-refresh-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
OPENAI_API_KEY=sk-xxxx
OPENAI_MODEL=gpt-4.1-mini
MOBILE_ORIGIN=*
```

## Terminal Commands (Complete)

### 1) Install dependencies

```
cd backend
npm install

cd ../wwu-mobile
npm install
```

### 2) Run backend

```
cd backend
npm run dev
```

### 3) Run mobile app

```
cd wwu-mobile
npx expo start
```

### 4) Run tests

```
cd backend
npm test

cd ../wwu-mobile
npm test -- --runInBand
```

### 5) Production backend build

```
cd backend
npm run build
npm start
```

## Deployment Instructions

### Expo EAS (Android/iOS)

```
cd wwu-mobile
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile production
eas build --platform ios --profile production
```

### Render Backend

1. Connect repository to Render.
2. Use `backend/render.yaml` for infrastructure-as-code setup.
3. Set env vars from `.env.example`.
4. Deploy web service.

### Railway Backend

1. Create new Node service from repo.
2. Set root directory to `backend`.
3. Build command: `npm ci && npm run build`
4. Start command: `npm run start`
5. Add environment variables.

### MongoDB Atlas

1. Create cluster and database user.
2. Allow network access from deployment platform.
3. Copy connection string into `MONGODB_URI`.

## API Overview

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`
- `POST /api/mood/checkin`
- `GET /api/mood/history`
- `POST /api/journals`
- `GET /api/journals?search=`
- `PATCH /api/journals/:id`
- `DELETE /api/journals/:id`
- `GET /api/healing/sessions`
- `POST /api/healing/sessions`
- `GET /api/notifications/preferences`
- `POST /api/notifications/preferences`
- `GET /api/emergency/contacts`
- `POST /api/emergency/contacts`
- `GET /api/profile`
- `PATCH /api/profile`
- `GET /api/admin/analytics` (admin only)

## Troubleshooting

- If Expo app cannot hit backend from physical device, set `EXPO_PUBLIC_API_BASE_URL` to your machine LAN IP.
- If MongoDB fails to connect, verify IP allow-list and credentials.
- If OpenAI is not configured, backend falls back to deterministic sentiment classifier.
- If Android build fails with cache issues, run `npx expo start -c`.

## Production Optimization Tips

1. Add Redis caching for analytics and dashboard endpoints.
2. Move file/audio assets to a CDN and stream securely.
3. Use structured logging and distributed tracing for backend observability.
4. Enforce stricter CORS and origin allow-list in production.
5. Rotate JWT secrets with managed secret stores (Azure Key Vault or equivalent).
6. Add DB-level TTL/archive strategy for old AI analysis records.
7. Add integration tests for full auth + mood + journal journeys.
