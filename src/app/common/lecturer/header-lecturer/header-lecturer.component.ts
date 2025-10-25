import { Component } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ToggleService } from '../../header/toggle.service';

@Component({
    selector: 'app-header-lecturer',
    imports: [RouterLink, NgClass, MatMenuModule, MatIconModule, MatButtonModule, DatePipe],
    templateUrl: './header-lecturer.component.html',
    styleUrls: ['./header-lecturer.component.scss']
})
export class HeaderLecturerComponent {

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