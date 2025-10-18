import { Component } from '@angular/core';
import { MatCard, MatCardContent } from "@angular/material/card";

@Component({
    selector: 'app-home',
    imports: [MatCard, MatCardContent],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class Home {}

