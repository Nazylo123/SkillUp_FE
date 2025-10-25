import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent } from "@angular/material/card";
import { Router } from '@angular/router';
import { ApiAuthServices } from '../../../services/auth.service';

@Component({
    selector: 'app-home',
    imports: [MatCard, MatCardContent, MatButtonModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class Home {
    constructor(private router: Router, private api: ApiAuthServices) {}

    ngOnInit() {
        this.login();
    }

    detailCourse(course: any) {
        this.router.navigate([`/course-detail/${course.id}`])
    }

    login() {
        console.log("run")
        this.api.login({
            email:"Employee@skillup.com", password:"Employee123!"
        }).subscribe((result:any)=> {
            console.log(result)
        },err => {})
    }

}

