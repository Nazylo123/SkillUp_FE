import { Component } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ToggleService } from '../../context/toggle.service';

@Component({
    selector: 'app-header-manager',
    imports: [RouterLink, NgClass, MatMenuModule, MatIconModule, MatButtonModule, DatePipe],
    templateUrl: './header-manager.component.html',
    styleUrls: ['./header-manager.component.scss']
})
export class HeaderManagerComponent {

    isToggled = false;
    
    constructor(
        private toggleService: ToggleService,
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        this.currentDate = new Date();
    }

    currentDate: Date;

    toggle() {
        this.toggleService.toggle();
    }

}