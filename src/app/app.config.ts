import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from '../environments/environment';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './services/auth.interceptor';
import { AuthService } from './common/context/auth.service';
import { TokenService } from './common/context/token.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes), provideClientHydration(withEventReplay()),
        provideAnimationsAsync(),
        provideHttpClient(),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideAppInitializer(() => {
          const authService = inject(AuthService);
          const tokenService = inject(TokenService);
          authService.initializeAuth();
          tokenService.setupAutoRefresh();
        })
    ]
};

const BASE_URLS: any = environment.baseUrl;

export const API_URLS = {
  
  //API Auth
  LOGIN: BASE_URLS.SKILL_UP + "/Auth/login",
  LOGOUT: BASE_URLS.SKILL_UP + "/Auth/logout-all",
  REFRESH_TOKEN: BASE_URLS.SKILL_UP + "/Auth/refresh-token",
  REVOKE_TOKEN: BASE_URLS.SKILL_UP + "/Auth/revoke-token",
  USER_INFO: BASE_URLS.SKILL_UP + "/Users/me",

  //Api User
  GET_USERS_ADMIN_LIST: BASE_URLS.SKILL_UP + "/Users",
  GET_USER_BY_ID: BASE_URLS.SKILL_UP + "/User/get-by-id",
  CREATE_USER: BASE_URLS.SKILL_UP + "/User/create",
  UPDATE_USER: BASE_URLS.SKILL_UP + "/User/update",
  DELETE_USER: BASE_URLS.SKILL_UP + "/User/delete",

  //API Course
  GET_COURSES: BASE_URLS.SKILL_UP + "/Course/get-all",
  GET_COURSE_BY_ID: BASE_URLS.SKILL_UP + "/Course/get-by-id",
  CREATE_COURSE: BASE_URLS.SKILL_UP + "/Course/create",
  UPDATE_COURSE: BASE_URLS.SKILL_UP + "/Course/update",
  DELETE_COURSE: BASE_URLS.SKILL_UP + "/Course/delete",
  
  //API Quiz
  GET_QUIZZES: BASE_URLS.SKILL_UP + "/Quiz/get-all",
  GET_QUIZ_BY_ID: BASE_URLS.SKILL_UP + "/Quiz/get-by-id",
  CREATE_QUIZ: BASE_URLS.SKILL_UP + "/Quiz/create",
  UPDATE_QUIZ: BASE_URLS.SKILL_UP + "/Quiz/update",
  DELETE_QUIZ: BASE_URLS.SKILL_UP + "/Quiz/delete",
}
