import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Event, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderLecturerComponent } from '../../common/lecturer/header-lecturer/header-lecturer.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { CustomizerSettingsComponent } from '../../customizer-settings/customizer-settings.component';
import { SidebarLecturerComponent } from '../../common/lecturer/sidebar-lecturer/sidebar-lecturer.component';
import { ToggleService } from '../../common/header/toggle.service';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';


@Component({
    selector: 'app-lecturer',
    imports: [RouterOutlet, CommonModule, HeaderLecturerComponent, FooterComponent, CustomizerSettingsComponent, SidebarLecturerComponent],
    templateUrl: './lecturer.component.html',
    styleUrl: './lecturer.component.scss'
})
export class Lecturer {

    private previousUrl: string | null = null;

    protected readonly title = signal('BTS Management System');

    isToggled = false;

    constructor(
        public router: Router,
        private toggleService: ToggleService,
        private viewportScroller: ViewportScroller,
        public themeService: CustomizerSettingsService
    ) {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                const currentUrl = event.urlAfterRedirects;
                // Scroll to top ONLY if navigating to a different route (not on refresh)
                if (this.previousUrl && this.previousUrl !== currentUrl) {
                    this.viewportScroller.scrollToPosition([0, 0]);
                }
                this.previousUrl = currentUrl;
            }
        });
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

}