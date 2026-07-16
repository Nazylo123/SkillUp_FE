import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
    //project
    {
        path: 'authentication/login',
        loadComponent: () => import('./common/authentication/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'authentication/forgot-password',
        loadComponent: () => import('./common/authentication/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
    },
    {path: 'login', redirectTo: 'authentication/login', pathMatch: 'full'},
    {
        path: '',
        loadComponent: () => import('./aproject/user/user.component').then(m => m.User),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Employee'] },
        children: [
            {
                path: '',
                loadComponent: () => import('./aproject/user/home/home.component').then(m => m.Home)
            },
            {
                path: 'profile',
                loadComponent: () => import('./common/profile/profile.component').then(m => m.ProfileComponent)
            },
            {
                path: 'my-courses',
                loadComponent: () => import('./aproject/user/my-courses/my-courses.component').then(m => m.MyCoursesComponent)
            },
            {
                path: 'security',
                loadComponent: () => import('./common/security/security.component').then(m => m.SecurityComponent)
            },
            {
                path: 'course-detail/:id',
                loadComponent: () => import('./aproject/user/course-detail/course-detail.component').then(m => m.CourseDetailComponent)
            },
            {
                path: 'course/learn/:id',
                loadComponent: () => import('./aproject/user/course-learn/course-learn.component').then(m => m.CourseLearnComponent)
            },
            {
                path: 'quiz/:id',
                loadComponent: () => import('./aproject/user/quiz/quiz.component').then(m => m.QuizComponent)
            },
            {
                path: 'roadmap',
                loadComponent: () => import('./aproject/user/roadmap/roadmap-list/roadmap-list.component').then(m => m.RoadmapListComponent)
            },
            {
                path: 'roadmap/:id',
                loadComponent: () => import('./aproject/user/roadmap/roadmap-detail/roadmap.component').then(m => m.RoadMap)
            },
            {
                path: 'learning-paths',
                loadComponent: () => import('./aproject/user/learning-path/learning-path-list/learning-path-list.component').then(m => m.LearningPathListComponent)
            },
            {
                path: 'learning-path/:id',
                loadComponent: () => import('./aproject/user/learning-path/learning-path-detail/learning-path-detail.component').then(m => m.LearningPathDetail)
            },
            {
                path: 'chat',
                loadComponent: () => import('./aproject/user/chat/chat.component').then(m => m.ChatComponent)
            },
        ]
    },
    {
        path:'admin', 
        loadComponent: () => import('./aproject/admin/admin.component').then(m => m.Admin),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Admin'] },
        children: [
            {
                path: '',
                loadComponent: () => import('./aproject/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboard)
            },
            {
                path: 'profile',
                loadComponent: () => import('./common/profile/profile.component').then(m => m.ProfileComponent)
            },
            {
                path: 'security',
                loadComponent: () => import('./common/security/security.component').then(m => m.SecurityComponent)
            },
            {
                path: 'users',
                loadComponent: () => import('./aproject/admin/user-management/user-management.component').then(m => m.AdminUserManagement), 
                children:[
                    {
                        path: '',
                        loadComponent: () => import('./aproject/admin/user-management/user-list/user-list.component').then(m => m.AdminUserList)
                    },
                    {
                        path: ':id',
                        loadComponent: () => import('./aproject/admin/user-management/user-detail/user-detail.component').then(m => m.AdminUserDetail)
                    }
                ]
            },
            {
                path: 'courses',
                loadComponent: () => import('./aproject/admin/course-management/course-management.component').then(m => m.AdminCourseManagement),
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./aproject/admin/course-management/course-list/course-list.component').then(m => m.AdminCourseList)
                    }
                ]
            },
            {
                path: 'knowledge-base',
                loadComponent: () => import('./aproject/manager/manager-rag-upload/manager-rag-upload.component').then(m => m.ManagerRagUploadComponent)
            },
            {
                path: 'settings',
                loadComponent: () => import('./aproject/admin/settings/settings').then(m => m.SettingsComponent)
            },
            {
                path: 'audit-log',
                loadComponent: () => import('./aproject/admin/audit-log/audit-log.component').then(m => m.AuditLogComponent)
            }
        ]
    },
    {
        path: 'manager',
        loadComponent: () => import('./aproject/manager/manager.component').then(m => m.Manager),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Manager'] },
        children: [
            {
                path: '',
                loadComponent: () => import('./aproject/manager/manager-dashboard/manager-dashboard.component').then(m => m.ManagerDashboard)
            },
            {
                path: 'profile',
                loadComponent: () => import('./common/profile/profile.component').then(m => m.ProfileComponent)
            },
            {
                path: 'security',
                loadComponent: () => import('./common/security/security.component').then(m => m.SecurityComponent)
            },
            {
                path: 'chat',
                loadComponent: () => import('./aproject/manager/manager-chat/manager-chat.component').then(m => m.ManagerChatComponent)
            },
            {
                path: 'users',
                loadComponent: () => import('./aproject/manager/manager-user/manager-user.component').then(m => m.ManagerUserManagement),
                children: [
                    {
                        path: 'employee',
                        loadComponent: () => import('./aproject/manager/manager-user/manager-employee/manager-employee.component').then(m => m.ManagerEmployee)
                    },
                    {
                        path: 'lecturer',
                        loadComponent: () => import('./aproject/manager/manager-user/manager-lecturer/manager-lecturer.component').then(m => m.ManagerLecturer)
                    },
                    {
                        path: 'mentor',
                        loadComponent: () => import('./aproject/manager/manager-user/manager-mentor/manager-mentor.component').then(m => m.ManagerMentorComponent)
                    },
                    {
                        path: ':id',
                        loadComponent: () => import('./aproject/manager/manager-user/user-detail/user-detail.component').then(m => m.ManagerUserDetail)
                    },
                ]
            },
            {
                path: 'courses',
                loadComponent: () => import('./aproject/manager/manager-course/manager-course.component').then(m => m.ManagerCourseManagement),
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./aproject/manager/manager-course/course-list/course-list.component').then(m => m.ManagerCourseList)
                    },
                    {
                        path: ':id',
                        loadComponent: () => import('./aproject/manager/manager-course/course-detail/course-detail.component').then(m => m.ManagerCourseDetail)
                    }
                ]
            },
            {
                path: 'roadmaps',
                loadComponent: () => import('./aproject/manager/manager-roadmap/manager-roadmap/manager-roadmap.component').then(m => m.ManagerRoadmapComponent)
            },
            {
                path: 'roadmaps/create',
                loadComponent: () => import('./aproject/manager/manager-roadmap/roadmap-form/roadmap-form.component').then(m => m.RoadmapFormComponent)
            },
            {
                path: 'roadmaps/edit/:id',
                loadComponent: () => import('./aproject/manager/manager-roadmap/roadmap-form/roadmap-form.component').then(m => m.RoadmapFormComponent)
            },
            {
                path: 'roadmaps/detail/:id',
                loadComponent: () => import('./aproject/manager/manager-roadmap/roadmap-detail/roadmap-detail.component').then(m => m.RoadmapDetailComponent)
            },
            {
                path: 'learning-paths',
                loadComponent: () => import('./aproject/manager/manager-learning-path/manager-learning-path/manager-learning-path.component').then(m => m.ManagerLearningPathComponent)
            },
            {
                path: 'learning-paths/create',
                loadComponent: () => import('./aproject/manager/manager-learning-path/learning-path-form/learning-path-form.component').then(m => m.LearningPathFormComponent)
            },
            {
                path: 'learning-paths/edit/:id',
                loadComponent: () => import('./aproject/manager/manager-learning-path/learning-path-form/learning-path-form.component').then(m => m.LearningPathFormComponent)
            },
            {
                path: 'learning-paths/detail/:id',
                loadComponent: () => import('./aproject/manager/manager-learning-path/learning-path-detail/learning-path-detail.component').then(m => m.LearningPathDetailComponent)
            },
            {
                path: 'report-user',
                loadComponent: () => import('./aproject/manager/manager-report-user/manager-report-user.component').then(m => m.ManagerReportUserComponent)
            },
            {
                path: 'knowledge-base',
                loadComponent: () => import('./aproject/manager/manager-rag-upload/manager-rag-upload.component').then(m => m.ManagerRagUploadComponent)
            },
            {
                path: 'course-type',
                loadComponent: () => import('./aproject/manager/manager-setting/manager-course-type/manager-course-type.component').then(m => m.ManagerCourseTypeComponent)
            },
            {
                path: 'user-level',
                loadComponent: () => import('./aproject/manager/manager-setting/manager-user-level/manager-user-level.component').then(m => m.ManagerUserLevelComponent)
            },
            {
                path: 'course-performance',
                loadComponent: () => import('./aproject/manager/manager-course-performance/manager-course-performance.component').then(m => m.ManagerCoursePerformanceComponent)
            },
            {
                path: 'materials',
                loadComponent: () => import('./aproject/manager/manager-materials/manager-materials.component').then(m => m.ManagerMaterialsComponent)
            },
        ]
    },
    {
        path: 'lecturer',
        loadComponent: () => import('./aproject/lecturer/lecturer.component').then(m => m.Lecturer),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Lecturer'] },
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./aproject/lecturer/lecturer-dashboard/lecturer-dashboard.component').then(m => m.LecturerDashboardComponent)
            },
            {
                path: '',
                loadComponent: () => import('./aproject/lecturer/course-management/course-list/course-list.component').then(m => m.LecturerCourseList)
            },
            {
                path: 'profile',
                loadComponent: () => import('./common/profile/profile.component').then(m => m.ProfileComponent)
            },
            {
                path: 'security',
                loadComponent: () => import('./common/security/security.component').then(m => m.SecurityComponent)
            },
            {
                path: 'courses',
                loadComponent: () => import('./aproject/lecturer/course-management/course-management.component').then(m => m.LecturerCourseManagement),
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./aproject/lecturer/course-management/course-list/course-list.component').then(m => m.LecturerCourseList)
                    },
                    {
                        path: ':id',
                        loadComponent: () => import('./aproject/lecturer/course-management/course-detail-lesson-list/course-detail.component').then(m => m.LecturerCourseDetail)
                    },
                    {
                        path: ':id/quiz',
                        loadComponent: () => import('./aproject/lecturer/course-management/quiz-creator/quiz-creator.component').then(m => m.QuizCreatorComponent)
                    },
                ]
            },
            {
                path: 'quizzes',
                loadComponent: () => import('./aproject/lecturer/course-management/quiz-list/quiz-list.component').then(m => m.QuizListComponent)
            },
        ]
    },
    {
        path: 'mentor',
        loadComponent: () => import('./aproject/mentor/mentor.component').then(m => m.MentorComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Mentor'] },
        children: [
            {path: '', redirectTo: 'chat', pathMatch: 'full'},
            {
                path: 'chat',
                loadComponent: () => import('./aproject/user/chat/chat.component').then(m => m.ChatComponent)
            },
            {
                path: 'profile',
                loadComponent: () => import('./common/profile/profile.component').then(m => m.ProfileComponent)
            },
            {
                path: 'security',
                loadComponent: () => import('./common/security/security.component').then(m => m.SecurityComponent)
            },
            {
                path: 'materials',
                loadComponent: () => import('./aproject/mentor/mentor-materials/mentor-materials.component').then(m => m.MentorMaterialsComponent)
            },
        ]
    },
    //endProject

    {
        path: '**',
        loadComponent: () => import('./common/not-found/not-found.component').then(m => m.NotFoundComponent)
    }
];