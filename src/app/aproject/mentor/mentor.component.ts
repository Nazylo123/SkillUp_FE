import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Event, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ToggleService } from '../../context/toggle.service';
import { FooterComponent } from '../../common/footer/footer.component';
import { MentorSidebarComponent } from './mentor-sidebar/mentor-sidebar.component';
import { HeaderManagerComponent } from '../../common/manager/header-manager/header-manager.component';

@Component({
    selector: 'app-mentor',
    imports: [RouterOutlet, CommonModule, FooterComponent, MentorSidebarComponent, HeaderManagerComponent],
    templateUrl: './mentor.component.html',
    styleUrl: './mentor.component.scss'
})
export class MentorComponent {
    private previousUrl: string | null = null;
    protected readonly title = signal('Skill Up - Mentor');
    isToggled = false;

    constructor(
        public router: Router,
        private toggleService: ToggleService,
        private viewportScroller: ViewportScroller,
    ) {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                const currentUrl = event.urlAfterRedirects;
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
