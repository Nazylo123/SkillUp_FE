import { environment } from '../../environments/environment';

const BASE_URLS: any = environment.baseUrl;

const BASE_POINTS = {
  AUTH: BASE_URLS.SKILL_UP + "/Auth",
  USER: BASE_URLS.SKILL_UP + "/User",
  COURSE: BASE_URLS.SKILL_UP + "/Course",
  QUIZ: BASE_URLS.SKILL_UP + "/Quiz",
}

export const API_URLS = {
  
  //API Auth
  LOGIN: BASE_POINTS.AUTH + "/login",
  LOGOUT: BASE_POINTS.AUTH + "/logout-all",
  REFRESH_TOKEN: BASE_POINTS.AUTH + "/refresh-token",
  REVOKE_TOKEN: BASE_POINTS.AUTH + "/revoke-token",
  USER_INFO: BASE_POINTS.USER + "/me",

  //Api User
  GET_USERS_ADMIN_LIST: BASE_POINTS.USER + "/Users",
  GET_USER_BY_ID: BASE_POINTS.USER + "/get-by-id",
  CREATE_USER: BASE_POINTS.USER + "/create",
  UPDATE_USER: BASE_POINTS.USER + "/update",
  DELETE_USER: BASE_POINTS.USER + "/delete",

  //API Course
  GET_COURSES: BASE_POINTS.COURSE + "/get-all",
  GET_COURSE_BY_ID: BASE_POINTS.COURSE + "/get-by-id",
  CREATE_COURSE: BASE_POINTS.COURSE + "/create",
  UPDATE_COURSE: BASE_POINTS.COURSE + "/update",
  DELETE_COURSE: BASE_POINTS.COURSE + "/delete",
  
  //API Quiz
  GET_QUIZZES: BASE_POINTS.QUIZ + "/get-all",
  GET_QUIZ_BY_ID: BASE_POINTS.QUIZ + "/get-by-id",
  CREATE_QUIZ: BASE_POINTS.QUIZ + "/create",
  UPDATE_QUIZ: BASE_POINTS.QUIZ + "/update",
  DELETE_QUIZ: BASE_POINTS.QUIZ + "/delete",
}