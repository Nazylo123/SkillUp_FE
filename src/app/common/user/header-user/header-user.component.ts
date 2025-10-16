import { Component } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { ToggleService } from '../../header/toggle.service';

@Component({
    selector: 'app-header-user',
    imports: [RouterLink, NgClass, MatMenuModule, MatIconModule, MatButtonModule, DatePipe],
    templateUrl: './header-user.component.html',
    styleUrls: ['./header-user.component.scss']
})
export class HeaderAdminComponent {

    isToggled = false;
    
    constructor(
        private toggleService: ToggleService,
        public themeService: CustomizerSettingsService
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        this.currentDate = new Date();
    }

    currentDate: Date;

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggle() {
        this.toggleService.toggle();
    }

    toggleSidebarTheme() {
        this.themeService.toggleSidebarTheme();
    }

    toggleHideSidebarTheme() {
        this.themeService.toggleHideSidebarTheme();
    }

    toggleCardBorderTheme() {
        this.themeService.toggleCardBorderTheme();
    }

    toggleHeaderTheme() {
        this.themeService.toggleHeaderTheme();
    }

    toggleCardBorderRadiusTheme() {
        this.themeService.toggleCardBorderRadiusTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

}