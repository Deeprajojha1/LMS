# LMS Project

Full-stack Learning Management System (LMS) built with:

- Frontend: React + Vite
- Backend: Node.js + Express + MongoDB

## Project Structure

- `Frontend/` -> UI, routing, pages, components
- `Backend/` -> APIs, controllers, auth, DB models

## Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB URI

## Setup

### Backend

1. Open terminal:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file in `Backend/`:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Run server:
   ```bash
   npm run dev
   ```

Backend base URL: `http://localhost:3000`

### Frontend

1. Open second terminal:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start frontend:
   ```bash
   npm run dev
   ```

Frontend base URL: `http://localhost:5173`

## Frontend Flow (Page-by-Page)

### 1) Auth + Session bootstrap

- App starts from `Frontend/src/App.jsx`.
- These hooks run on load:
  - `useGetCurrentUser()`
  - `useGetCreatorCourse()`
  - `useGetPublishedCourses()`
- Routes are protected based on `userData` and role.

### 2) Public / Common Routes

- `/` -> Home page
- `/login` -> Login
- `/signUp` -> Signup
- `/forgetPassword` -> OTP + reset flow

### 3) User Protected Routes

- `/profile` -> user profile
- `/edit_profile` -> edit profile
- `/explore_courses` -> explore courses
- `/all-courses` -> all published courses + filters + search query support (`?q=...`)
- `/view-courses/:courseId` -> course details, reviews, CTA buttons
- `/watch-course/:courseId` -> lecture watching page
- `/search-with-ai` -> AI search page (voice + backend search API)

### 4) Educator Protected Routes

- `/dashboard`
- `/courses`
- `/create-course`
- `/edit-course/:id`
- `/create-lecture/:courseId`
- `/edit-lecture/:courseId/:lectureId`

### 5) AI Search Frontend Flow

- User types query (or mic input fills the input).
- Search runs only on Search button click (or Enter).
- Frontend calls backend search API:
  - `GET /api/courses/search?q=<query>`
- Suggestions are shown as course cards.
- Clicking a suggestion navigates to:
  - `/view-courses/:courseId`

### 6) Reviews Frontend Flow

- In `view-courses`:
  - User can submit rating + comment.
  - If course has no lecture video, review submit is blocked.
  - User can delete only own review (soft delete on backend).
- Home page review section fetches latest reviews and avoids duplicate users.

## Backend Flow (Controller + Route Level)

All backend routes are mounted in `Backend/server.js`:

- `/api/users`
- `/api/auth`
- `/api/courses`

### A) User/Auth Flow

Routes:

- `POST /api/users/signUp`
- `POST /api/users/login`
- `POST /api/users/logout`
- `GET /api/users/me` (auth required)
- `PUT /api/users/profile` (auth required)
- `POST /api/auth/google`
- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/reset-password`

Flow:

1. Signup/Login creates JWT token.
2. Token is stored in cookie.
3. Protected APIs use `isAuth` middleware and read `req.userId`.

### B) Course Flow

Routes:

- `POST /api/courses/create` (auth)
- `GET /api/courses/getpublished`
- `GET /api/courses/getcreatercourses` (auth)
- `POST /api/courses/edit/:id` (auth)
- `DELETE /api/courses/delete/:id` (auth)
- `GET /api/courses/getcourse/:id` (auth)

Flow:

1. Educator creates/edits course.
2. Published courses are shown in user pages.
3. Course cards include rating/review stats from review collection.

### C) Lecture Flow

Routes:

- `POST /api/courses/createlecture/:courseId` (auth)
- `GET /api/courses/getcourselecture/:id` (auth)
- `POST /api/courses/editlecture/:lectureId` (auth)
- `DELETE /api/courses/removeteature/:lectureId` (auth)

Flow:

1. Educator adds lecture to a course.
2. Lecture updates include video and preview status.
3. Watch page consumes lecture list.

### D) Review Flow

Routes:

- `GET /api/courses/:courseId/reviews`
- `POST /api/courses/:courseId/reviews` (auth)
- `DELETE /api/courses/:courseId/reviews/:reviewId` (auth)
- `GET /api/courses/reviews/latest`

Flow:

1. User submits/updates a review (rating 1-5 + comment).
2. Review submit allowed only if course has at least one lecture video.
3. Delete review is soft delete:
   - marks review as deleted in DB
   - hides from APIs
4. Latest reviews API returns public review cards for home page.

### E) AI Search Flow

Routes:

- `GET /api/courses/search?q=...`
- `POST /api/courses/search` (body: `input`)

Flow:

1. Receive user query.
2. Try direct Mongo search on published courses.
3. If no direct result, AI keyword analysis is used (Gemini) and searched again.
4. Return matching courses in same API response shape.

## API Summary (Quick List)

- Users:
  - `POST /api/users/signUp`
  - `POST /api/users/login`
  - `POST /api/users/logout`
  - `GET /api/users/me`
  - `PUT /api/users/profile`
- Auth support:
  - `POST /api/auth/google`
  - `POST /api/auth/send-otp`
  - `POST /api/auth/verify-otp`
  - `POST /api/auth/reset-password`
- Courses:
  - `POST /api/courses/create`
  - `GET /api/courses/getpublished`
  - `GET /api/courses/getcreatercourses`
  - `POST /api/courses/edit/:id`
  - `DELETE /api/courses/delete/:id`
  - `GET /api/courses/getcourse/:id`
- Lectures:
  - `POST /api/courses/createlecture/:courseId`
  - `GET /api/courses/getcourselecture/:id`
  - `POST /api/courses/editlecture/:lectureId`
  - `DELETE /api/courses/removeteature/:lectureId`
- Reviews:
  - `GET /api/courses/:courseId/reviews`
  - `POST /api/courses/:courseId/reviews`
  - `DELETE /api/courses/:courseId/reviews/:reviewId`
  - `GET /api/courses/reviews/latest`
- Search:
  - `GET /api/courses/search?q=keyword`
  - `POST /api/courses/search`

## Notes

- Restart backend whenever route/controller changes are made.
- Voice features need browser microphone permission.
- AI features need valid `GEMINI_API_KEY`.
- Keep both frontend and backend running for full flow.
