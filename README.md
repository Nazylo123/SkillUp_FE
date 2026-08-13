# 💻 SkillUp Frontend — Enterprise Learning Management Portal

[![Angular](https://img.shields.io/badge/Angular-18.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SCSS](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
[![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)](https://rxjs.dev/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Docker](https://img.shields.io/badge/Docker-Nginx-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

## 📌 Introduction

**SkillUp Frontend** is a modern, responsive single-page web application (SPA) built with **Angular 18** and modular **SCSS**. It provides an intuitive, high-performance user interface for students, lecturers, managers, and system administrators.

The application communicates seamlessly with the **SkillUp .NET 8 / NestJS Backend APIs**, serving full-featured learning management workflows, interactive quiz environments, course video playback, and real-time training analytics.

---

## 🚀 Key Portal Features & User Roles

### 🧑‍🎓 1. Student Portal
- **Course Catalog & Search:** Filter by categories, level, ratings, and learning path.
- **Interactive Video Player:** Smooth video streaming, sub-lesson navigation, and material downloads.
- **Quiz Engine:** Timed multiple-choice quizzes with instant feedback and score history.
- **My Learning Progress:** Track completed modules, view earned certificates, and resume learning.
- **AI Tutor Assistant:** Built-in AI chat modal for course questions and automated summaries.

### 👨‍🏫 2. Lecturer Portal
- **Course Management:** Create, edit, and organize courses, chapters, and sub-lessons.
- **Resource Upload:** Cloudinary video upload & Azure document attachments.
- **Student Performance:** Track student completion rates and review quiz performance.

### 👔 3. HR Manager Portal
- **Team Progress Monitoring:** Dashboard for tracking employee training hours and completion rates.
- **Course Assignment:** Assign specific learning paths or courses to departments or individual employees.

### 🛡️ 4. System Admin Panel
- **User & Role Administration:** Create accounts, assign RBAC permissions (Admin, Manager, Lecturer, Student).
- **Audit Logs:** Monitor user activity and system interactions.
- **System Settings:** Dynamic configuration of AI providers (Gemini, OpenRouter, Ollama).

---

## 🎨 UI & UX Design System

- **Modern Styling System:** Clean design using modular SCSS (`_ui-kit.scss`, `_form.scss`, `_sidebar.scss`).
- **Responsive Layout:** Optimized for Mobile, Tablet, and Desktop screens.
- **Glassmorphism & Micro-animations:** Polished cards, badges, smooth transitions, and loading skeletons.
- **Google OAuth 2.0:** Integrated single-click sign in.

---

## 🛠️ Tech Stack & Dependencies

- **Framework:** Angular 18 (Standalone Components / RxJS)
- **Language:** TypeScript 5+
- **Styling:** SCSS, Bootstrap Icons / UIkit utilities
- **State & HTTP:** Angular HttpClient, RxJS Observables, LocalStorage Token Storage
- **Deployment:** Docker Multi-stage build with Nginx web server

---

## ⚡ Local Setup & Execution Guide

### 1️⃣ Prerequisites
- [Node.js 18+](https://nodejs.org/)
- [Angular CLI](https://angular.dev/tools/cli): `npm install -g @angular/cli`

### 2️⃣ Clone & Install Dependencies
```bash
git clone https://github.com/YourUsername/SkillUp_FE.git
cd SkillUp_FE

npm install
```

### 3️⃣ Environment Configuration
Create `src/environments/environment.ts` from `src/environments/environment.example.ts`:
```typescript
export const environment = {
  production: false,
  baseUrl: {
    SKILL_UP: 'http://localhost:3000/api' // Point to your backend API URL
  },
  googleClientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
};
```

### 4️⃣ Development Server
Run the local Angular development server:
```bash
npm start
# or
ng serve
```
Navigate to `http://localhost:4200/`. The app will automatically reload if you change any source files.

---

## 🐳 Docker Deployment

To build and run the frontend using Docker & Nginx:

```bash
# Build Docker image
docker build -t skillup-frontend .

# Run container on port 80
docker run -d -p 80:80 --name skillup-fe skillup-frontend
```

---

## 📄 License & Contact

Distributed under the MIT License. Developed for enterprise training showcase.