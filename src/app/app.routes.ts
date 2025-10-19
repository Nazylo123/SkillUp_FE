import { Routes } from '@angular/router';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { EcommerceComponent } from './dashboard/ecommerce/ecommerce.component';
import { AnalyticsComponent } from './dashboard/analytics/analytics.component';
import { ProjectManagementComponent } from './dashboard/project-management/project-management.component';
import { LmsCoursesComponent } from './dashboard/lms-courses/lms-courses.component';
import { CryptoComponent } from './dashboard/crypto/crypto.component';
import { HelpDeskComponent } from './dashboard/help-desk/help-desk.component';
import { SaasAppComponent } from './dashboard/saas-app/saas-app.component';
import { ChatComponent } from './apps/chat/chat.component';
import { EmailComponent } from './apps/email/email.component';
import { EmailInboxComponent } from './apps/email/email-inbox/email-inbox.component';
import { ReadEmailComponent } from './apps/email/read-email/read-email.component';
import { ComposeEmailComponent } from './apps/email/compose-email/compose-email.component';
import { FileManagerComponent } from './apps/file-manager/file-manager.component';
import { MyDriveComponent } from './apps/file-manager/my-drive/my-drive.component';
import { FmAssetsComponent } from './apps/file-manager/fm-assets/fm-assets.component';
import { FmProjectsComponent } from './apps/file-manager/fm-projects/fm-projects.component';
import { FmPersonalComponent } from './apps/file-manager/fm-personal/fm-personal.component';
import { FmTemplatesComponent } from './apps/file-manager/fm-templates/fm-templates.component';
import { FmDocumentsComponent } from './apps/file-manager/fm-documents/fm-documents.component';
import { FmMediaComponent } from './apps/file-manager/fm-media/fm-media.component';
import { FmRecentFilesComponent } from './apps/file-manager/fm-recent-files/fm-recent-files.component';
import { ToDoListComponent } from './apps/to-do-list/to-do-list.component';
import { TaskDetailsComponent } from './apps/to-do-list/task-details/task-details.component';
import { CalendarComponent } from './apps/calendar/calendar.component';
import { ContactsComponent } from './apps/contacts/contacts.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { MembersGridComponent } from './contact-list/members-grid/members-grid.component';
import { MembersGrid2Component } from './contact-list/members-grid2/members-grid2.component';
import { MembersListComponent } from './contact-list/members-list/members-list.component';
import { MemberProfileComponent } from './contact-list/member-profile/member-profile.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceDetailsComponent } from './invoice/invoice-details/invoice-details.component';
import { ProjectsComponent } from './projects/projects.component';
import { PProjectsComponent } from './projects/p-projects/p-projects.component';
import { PClientsComponent } from './projects/p-clients/p-clients.component';
import { PTeamComponent } from './projects/p-team/p-team.component';
import { PKanbanBoardComponent } from './projects/p-kanban-board/p-kanban-board.component';
import { PTasksComponent } from './projects/p-tasks/p-tasks.component';
import { PUsersComponent } from './projects/p-users/p-users.component';
import { ProjectCreateComponent } from './projects/project-create/project-create.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseDetailsComponent } from './courses/course-details/course-details.component';
import { LessonPreviewComponent } from './courses/lesson-preview/lesson-preview.component';
import { ProductsComponent } from './pages/ecommerce-page/products/products.component';
import { ProductDetailsComponent } from './pages/ecommerce-page/product-details/product-details.component';
import { CreateProductComponent } from './pages/ecommerce-page/create-product/create-product.component';
import { ProductsOrdersComponent } from './pages/ecommerce-page/products-orders/products-orders.component';
import { ProductsOrderDetailsComponent } from './pages/ecommerce-page/products-order-details/products-order-details.component';
import { ProductsCustomersComponent } from './pages/ecommerce-page/products-customers/products-customers.component';
import { ProductsCartComponent } from './pages/ecommerce-page/products-cart/products-cart.component';
import { ProductsCheckoutComponent } from './pages/ecommerce-page/products-checkout/products-checkout.component';
import { ProductSellersComponent } from './pages/ecommerce-page/product-sellers/product-sellers.component';
import { AnalyticsPageComponent } from './pages/analytics-page/analytics-page.component';
import { AnalyticsCustomersComponent } from './pages/analytics-page/analytics-customers/analytics-customers.component';
import { AnalyticsReportsComponent } from './pages/analytics-page/analytics-reports/analytics-reports.component';
import { EcommercePageComponent } from './pages/ecommerce-page/ecommerce-page.component';
import { IconsComponent } from './pages/icons/icons.component';
import { FlaticonComponent } from './pages/icons/flaticon/flaticon.component';
import { RemixiconComponent } from './pages/icons/remixicon/remixicon.component';
import { MaterialSymbolsComponent } from './pages/icons/material-symbols/material-symbols.component';
import { MaterialIconsComponent } from './pages/icons/material-icons/material-icons.component';
import { TablesComponent } from './tables/tables.component';
import { BasicTableComponent } from './tables/basic-table/basic-table.component';
import { DataTableComponent } from './tables/data-table/data-table.component';
import { FormsComponent } from './forms/forms.component';
import { BasicFormComponent } from './forms/basic-form/basic-form.component';
import { WizardFormComponent } from './forms/wizard-form/wizard-form.component';
import { AdvancedFormComponent } from './forms/advanced-form/advanced-form.component';
import { EditorsComponent } from './forms/editors/editors.component';
import { FileUploaderComponent } from './forms/file-uploader/file-uploader.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { SigninSignupComponent } from './authentication/signin-signup/signin-signup.component';
import { LogoutComponent } from './authentication/logout/logout.component';
import { ConfirmMailComponent } from './authentication/confirm-mail/confirm-mail.component';
import { LockScreenComponent } from './authentication/lock-screen/lock-screen.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { FaqComponent } from './pages/faq/faq.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { TestimonialsComponent } from './pages/testimonials/testimonials.component';
import { SearchComponent } from './pages/search/search.component';
import { BlankPageComponent } from './pages/blank-page/blank-page.component';
import { ComingSoonComponent } from './pages/coming-soon/coming-soon.component';
import { InternalErrorComponent } from './common/internal-error/internal-error.component';
import { MapsComponent } from './pages/maps/maps.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AccountComponent } from './pages/account/account.component';
import { SecurityComponent } from './pages/security/security.component';
import { ConnectionsComponent } from './pages/connections/connections.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './pages/terms-conditions/terms-conditions.component';
import { ChartsComponent } from './charts/charts.component';
import { ApexchartsComponent } from './charts/apexcharts/apexcharts.component';
import { ChartjsComponent } from './charts/chartjs/chartjs.component';
import { UiKitComponent } from './ui-kit/ui-kit.component';
import { AlertsComponent } from './ui-kit/alerts/alerts.component';
import { AutocompleteComponent } from './ui-kit/autocomplete/autocomplete.component';
import { AvatarsComponent } from './ui-kit/avatars/avatars.component';
import { AccordionComponent } from './ui-kit/accordion/accordion.component';
import { BadgesComponent } from './ui-kit/badges/badges.component';
import { BreadcrumbComponent } from './ui-kit/breadcrumb/breadcrumb.component';
import { ButtonToggleComponent } from './ui-kit/button-toggle/button-toggle.component';
import { ButtonsComponent } from './ui-kit/buttons/buttons.component';
import { CardsComponent } from './ui-kit/cards/cards.component';
import { CarouselsComponent } from './ui-kit/carousels/carousels.component';
import { CheckboxComponent } from './ui-kit/checkbox/checkbox.component';
import { ChipsComponent } from './ui-kit/chips/chips.component';
import { DatepickerComponent } from './ui-kit/datepicker/datepicker.component';
import { DialogComponent } from './ui-kit/dialog/dialog.component';
import { DividerComponent } from './ui-kit/divider/divider.component';
import { DragDropComponent } from './ui-kit/drag-drop/drag-drop.component';
import { ExpansionComponent } from './ui-kit/expansion/expansion.component';
import { FormFieldComponent } from './ui-kit/form-field/form-field.component';
import { GridComponent } from './ui-kit/grid/grid.component';
import { ImagesComponent } from './ui-kit/images/images.component';
import { InputComponent } from './ui-kit/input/input.component';
import { ListComponent } from './ui-kit/list/list.component';
import { ListboxComponent } from './ui-kit/listbox/listbox.component';
import { MenusComponent } from './ui-kit/menus/menus.component';
import { PaginationComponent } from './ui-kit/pagination/pagination.component';
import { ProgressBarComponent } from './ui-kit/progress-bar/progress-bar.component';
import { RadioComponent } from './ui-kit/radio/radio.component';
import { SelectComponent } from './ui-kit/select/select.component';
import { SidenavComponent } from './ui-kit/sidenav/sidenav.component';
import { SlideToggleComponent } from './ui-kit/slide-toggle/slide-toggle.component';
import { SliderComponent } from './ui-kit/slider/slider.component';
import { SpacingComponent } from './ui-kit/spacing/spacing.component';
import { SnackbarComponent } from './ui-kit/snackbar/snackbar.component';
import { StepperComponent } from './ui-kit/stepper/stepper.component';
import { TableComponent } from './ui-kit/table/table.component';
import { TabsComponent } from './ui-kit/tabs/tabs.component';
import { ToolbarComponent } from './ui-kit/toolbar/toolbar.component';
import { TooltipComponent } from './ui-kit/tooltip/tooltip.component';
import { TreeComponent } from './ui-kit/tree/tree.component';
import { TypographyComponent } from './ui-kit/typography/typography.component';
import { VideosComponent } from './ui-kit/videos/videos.component';
import { Admin } from './aproject/admin/admin.component';
import { AdminDashboard } from './aproject/admin/admin-dashboard/admin-dashboard.component';
import { AdminUserManagement } from './aproject/admin/user-management/user-management.component';
import { AdminUserList } from './aproject/admin/user-management/user-list/user-list.component';
import { AdminCourseManagement } from './aproject/admin/course-management/course-management.component';
import { AdminCourseList } from './aproject/admin/course-management/course-list/course-list.component';
import { Lecturer } from './aproject/lecturer/lecturer.component';
import { LecturerCourseManagement } from './aproject/lecturer/course-management/course-management.component';
import { LecturerCourseList } from './aproject/lecturer/course-management/course-list/course-list.component';
import { Manager } from './aproject/manager/manager.component';
import { ManagerDashboard } from './aproject/manager/manager-dashboard/manager-dashboard.component';
import { ManagerUserManagement } from './aproject/manager/manager-user/manager-user.component';
import { ManagerUserList } from './aproject/manager/manager-user/user-list/user-list.component';
import { ManagerCourseManagement } from './aproject/manager/manager-course/manager-course.component';
import { ManagerCourseList } from './aproject/manager/manager-course/course-list/course-list.component';
import { ManagerUserDetail } from './aproject/manager/manager-user/user-detail/user-detail.component';
import { AdminUserDetail } from './aproject/admin/user-management/user-detail/user-detail.component';
import { LecturerCourseDetail } from './aproject/lecturer/course-management/course-detail-lesson-list/course-detail.component';
import { LecturerLesson } from './aproject/lecturer/course-management/lesson-detail/lesson.component';
import { Home } from './aproject/user/home/home.component';
import { User } from './aproject/user/user.component';
import { MyCoursesComponent } from './aproject/user/my-courses/my-courses.component';
import { RoadMap } from './aproject/user/roadmap/roadmap.component';
import { CourseDetail } from './aproject/user/course-detail/course-detail.component';

export const routes: Routes = [
    //project
    {
        path: '', component: User,
        children: [
            {path: '', component: Home},
            {path: 'my-courses', component: MyCoursesComponent},
            {path: 'course-detail/:id', component: CourseDetail},
            {path: 'roadmap', component: RoadMap}
        ]
    },
    {
        path:'admin', 
        component: Admin,
        children: [
            {path: '', component: AdminDashboard},
            {path: 'users', component: AdminUserManagement, 
                children:[
                    {path: '', component: AdminUserList},
                    {path: ':id', component: AdminUserDetail}
                ]
            },
            {path: 'courses', component: AdminCourseManagement,
                children: [
                    {path: '', component: AdminCourseList}
                ]
            }
        ]
    },
    {
        path: 'manager',
        component: Manager,
        children: [
            {path: '', component: ManagerDashboard},
            {path: 'users', component: ManagerUserManagement,
                children: [
                    {path: '', component: ManagerUserList},
                    {path: ':id', component: ManagerUserDetail},
                ]
            },
            {path: 'courses', component: ManagerCourseManagement,
                children: [
                    {path: '', component: ManagerCourseList}
                ]
            }

        ]
    },
    {
        path: 'lecturer',
        component: Lecturer,
        children: [
            {path: '', component: LecturerCourseList},
            {path: 'courses', component: LecturerCourseManagement,
                children: [
                    {path: '', component:LecturerCourseList},
                    {path: ':id', component:LecturerCourseDetail},
                    {path: 'lesson/:id', component: LecturerLesson}
                ]
            }
        ]
    },

    //endProject
    {path: 'ecommerce', component: EcommerceComponent},
    {path: 'analytics', component: AnalyticsComponent},
    {path: 'project-management', component: ProjectManagementComponent},
    {path: 'lms-courses', component: LmsCoursesComponent},
    {path: 'crypto', component: CryptoComponent},
    {path: 'help-desk', component: HelpDeskComponent},
    {path: 'saas-app', component: SaasAppComponent},
    {path: 'chat', component: ChatComponent},
    {
        path: 'email',
        component: EmailComponent,
        children: [
            {path: '', component: EmailInboxComponent},
            {path: 'read', component: ReadEmailComponent},
            {path: 'compose', component: ComposeEmailComponent}
        ]
    },
    {
        path: 'file-manager',
        component: FileManagerComponent,
        children: [
            {path: '', component: MyDriveComponent},
            {path: 'assets', component: FmAssetsComponent},
            {path: 'projects', component: FmProjectsComponent},
            {path: 'personal', component: FmPersonalComponent},
            {path: 'templates', component: FmTemplatesComponent},
            {path: 'documents', component: FmDocumentsComponent},
            {path: 'media', component: FmMediaComponent},
            {path: 'recent-files', component: FmRecentFilesComponent}
        ]
    },
    {path: 'to-do-list', component: ToDoListComponent},
    {path: 'task-details', component: TaskDetailsComponent},
    {path: 'calendar', component: CalendarComponent},
    {path: 'contacts', component: ContactsComponent},
    {
        path: 'contacts-list',
        component: ContactListComponent,
        children: [
            {path: '', component: MembersGridComponent},
            {path: 'members-grid-2', component: MembersGrid2Component},
            {path: 'members-list', component: MembersListComponent},
            {path: 'member-profile', component: MemberProfileComponent}
        ]
    },
    {path: 'invoice', component: InvoiceComponent},
    {path: 'invoice-details', component: InvoiceDetailsComponent},
    {
        path: 'projects',
        component: ProjectsComponent,
        children: [
            {path: '', component: PProjectsComponent},
            {path: 'clients', component: PClientsComponent},
            {path: 'team', component: PTeamComponent},
            {path: 'kanban-board', component: PKanbanBoardComponent},
            {path: 'tasks', component: PTasksComponent},
            {path: 'users', component: PUsersComponent},
            {path: 'project-create', component: ProjectCreateComponent}
        ]
    },
    {path: 'courses', component: CoursesComponent},
    {path: 'course-details', component: CourseDetailsComponent},
    {path: 'lesson-preview', component: LessonPreviewComponent},
    {
        path: 'analytics-page',
        component: AnalyticsPageComponent,
        children: [
            {path: '', component: AnalyticsCustomersComponent},
            {path: 'reports', component: AnalyticsReportsComponent}
        ]
    },
    {
        path: 'ecommerce-page',
        component: EcommercePageComponent,
        children: [
            {path: '', component: ProductsComponent},
            {path: 'product-details', component: ProductDetailsComponent},
            {path: 'create', component: CreateProductComponent},
            {path: 'orders', component: ProductsOrdersComponent},
            {path: 'order-details', component: ProductsOrderDetailsComponent},
            {path: 'customers', component: ProductsCustomersComponent},
            {path: 'cart', component: ProductsCartComponent},
            {path: 'checkout', component: ProductsCheckoutComponent},
            {path: 'sellers', component: ProductSellersComponent}
        ]
    },
    {
        path: 'icons',
        component: IconsComponent,
        children: [
            {path: '', component: FlaticonComponent},
            {path: 'remixicon', component: RemixiconComponent},
            {path: 'material-symbols', component: MaterialSymbolsComponent},
            {path: 'material', component: MaterialIconsComponent}
        ]
    },
    {
        path: 'ui-kit',
        component: UiKitComponent,
        children: [
            {path: '', component: AlertsComponent},
            {path: 'autocomplete', component: AutocompleteComponent},
            {path: 'avatars', component: AvatarsComponent},
            {path: 'accordion', component: AccordionComponent},
            {path: 'badges', component: BadgesComponent},
            {path: 'breadcrumb', component: BreadcrumbComponent},
            {path: 'button-toggle', component: ButtonToggleComponent},
            {path: 'buttons', component: ButtonsComponent},
            {path: 'cards', component: CardsComponent},
            {path: 'carousels', component: CarouselsComponent},
            {path: 'checkbox', component: CheckboxComponent},
            {path: 'chips', component: ChipsComponent},
            {path: 'datepicker', component: DatepickerComponent},
            {path: 'dialog', component: DialogComponent},
            {path: 'divider', component: DividerComponent},
            {path: 'drag-drop', component: DragDropComponent},
            {path: 'expansion', component: ExpansionComponent},
            {path: 'form-field', component: FormFieldComponent},
            {path: 'grid', component: GridComponent},
            {path: 'images', component: ImagesComponent},
            {path: 'input', component: InputComponent},
            {path: 'list', component: ListComponent},
            {path: 'listbox', component: ListboxComponent},
            {path: 'menus', component: MenusComponent},
            {path: 'pagination', component: PaginationComponent},
            {path: 'progress-bar', component: ProgressBarComponent},
            {path: 'radio', component: RadioComponent},
            {path: 'select', component: SelectComponent},
            {path: 'sidenav', component: SidenavComponent},
            {path: 'slide-toggle', component: SlideToggleComponent},
            {path: 'slider', component: SliderComponent},
            {path: 'spacing', component: SpacingComponent},
            {path: 'snackbar', component: SnackbarComponent},
            {path: 'stepper', component: StepperComponent},
            {path: 'table', component: TableComponent},
            {path: 'tabs', component: TabsComponent},
            {path: 'toolbar', component: ToolbarComponent},
            {path: 'tooltip', component: TooltipComponent},
            {path: 'tree', component: TreeComponent},
            {path: 'typography', component: TypographyComponent},
            {path: 'videos', component: VideosComponent}
        ]
    },
    {
        path: 'tables',
        component: TablesComponent,
        children: [
            {path: '', component: BasicTableComponent},
            {path: 'data', component: DataTableComponent}
        ]
    },
    {
        path: 'charts',
        component: ChartsComponent,
        children: [
            {path: '', component: ApexchartsComponent},
            {path: 'chartjs', component: ChartjsComponent}
        ]
    },
    {
        path: 'forms',
        component: FormsComponent,
        children: [
            {path: '', component: BasicFormComponent},
            {path: 'wizard', component: WizardFormComponent},
            {path: 'advanced', component: AdvancedFormComponent},
            {path: 'editors', component: EditorsComponent},
            {path: 'file-uploader', component: FileUploaderComponent}
        ]
    },
    {
        path: 'authentication',
        component: AuthenticationComponent,
        children: [
            {path: '', component: LoginComponent},
            {path: 'register', component: RegisterComponent},
            {path: 'forgot-password', component: ForgotPasswordComponent},
            {path: 'reset-password', component: ResetPasswordComponent},
            {path: 'signin-signup', component: SigninSignupComponent},
            {path: 'logout', component: LogoutComponent},
            {path: 'confirm-mail', component: ConfirmMailComponent},
            {path: 'lock-screen', component: LockScreenComponent}
        ]
    },
    {path: 'pricing', component: PricingComponent},
    {path: 'timeline', component: TimelineComponent},
    {path: 'faq', component: FaqComponent},
    {path: 'gallery', component: GalleryComponent},
    {path: 'testimonials', component: TestimonialsComponent},
    {path: 'search', component: SearchComponent},
    {path: 'coming-soon', component: ComingSoonComponent},
    {path: 'blank-page', component: BlankPageComponent},
    {path: 'error-500', component: InternalErrorComponent},
    {path: 'maps', component: MapsComponent},
    {path: 'notifications', component: NotificationsComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'account', component: AccountComponent},
    {path: 'security', component: SecurityComponent},
    {path: 'connections', component: ConnectionsComponent},
    {path: 'privacy-policy', component: PrivacyPolicyComponent},
    {path: 'terms-conditions', component: TermsConditionsComponent},
    // Here add new pages component

    {path: '**', component: NotFoundComponent} // This line will remain down from the whole pages component list
];