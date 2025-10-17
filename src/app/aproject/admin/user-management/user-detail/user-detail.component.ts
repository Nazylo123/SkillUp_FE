import { Component } from '@angular/core';
import { MatCard, MatCardHeader, MatCardContent } from "@angular/material/card";


@Component({
    selector: 'app-admin-user-detail',
    imports: [MatCard, MatCardHeader,  MatCardContent],
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss'],
})
export class AdminUserDetail {}

