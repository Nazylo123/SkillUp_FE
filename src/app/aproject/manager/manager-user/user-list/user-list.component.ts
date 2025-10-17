import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIcon } from "@angular/material/icon";

@Component({
    selector: 'app-manager-user-list',
    imports: [MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatProgressBarModule, MatCheckboxModule, CommonModule, MatIcon],
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class ManagerUserList {
    constructor(private router: Router) {}

    displayedColumns: string[] = ['user', 'progress', 'email', 'role', 'courses', 'status', 'action'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    goDetail(element: any) {
        this.router.navigate([`/manager/users/${element.id}`])
    }

}

export interface PeriodicElement {
    id: number;
    email: string;
    role: string;
    user: any;
    action: string;
    gender: string;
    courses: number;
    progress: number;
    status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    id: 1,
    user: {
      userName: 'Lucile Young',
      userImage: 'img/user/user8.jpg',
      userDesignation: '@lyoung4a',
    },
    email: 'lyoung4a@tagus.com',
    role: 'Junior',
    gender: 'Male',
    courses: 165,
    progress: 86,
    status: 'active',
    action: 'ri-more-fill'
  },
  {
    id: 2,
    user: {
      userName: 'Jordan Stevenson',
      userImage: 'img/user/user9.jpg',
      userDesignation: '@jstevenson5c',
    },
    email: 'jstevenson5c@tagus.com',
    role: 'Intern',
    gender: 'Female',
    courses: 54,
    progress: 20,
    status: 'inactive',
    action: 'ri-more-fill'
  },
  {
    id: 3,
    user: {
      userName: 'Francis Frank',
      userImage: 'img/user/user10.jpg',
      userDesignation: '@ffrank7e',
    },
    email: 'ffrank7e@tagus.com',
    role: 'Senior',
    gender: 'Male',
    courses: 99,
    progress: 55,
    status: 'active',
    action: 'ri-more-fill'
  },
  {
    id: 4,
    user: {
      userName: 'Phoebe Patterson',
      userImage: 'img/user/user11.jpg',
      userDesignation: '@ppatterson2g',
    },
    email: 'ppatterson2g@tagus.com',
    role: 'Fresher',
    gender: 'Male',
    courses: 27,
    progress: 76,
    status: 'inactive',
    action: 'ri-more-fill'
  },
  {
    id: 5,
    user: {
      userName: 'James Andy',
      userImage: 'img/user/user1.jpg',
      userDesignation: '@andyjm32',
    },
    email: 'andyjm32@tagus.com',
    role: 'Middle',
    courses: 222,
    gender: 'Female',
    progress: 87,
    status: 'active',
    action: 'ri-more-fill'
  },
  {
    id: 6,
    user: {
      userName: 'Sarah Taylor',
      userImage: 'img/user/user2.jpg',
      userDesignation: '@taylors32',
    },
    email: 'taylors32@tagus.com',
    role: 'Senior',
    courses: 54,
    progress: 99,
    gender: 'Male',
    status: 'active',
    action: 'ri-more-fill'
  },
  {
    id: 7,
    user: {
      userName: 'David Warner',
      userImage: 'img/user/user3.jpg',
      userDesignation: '@davidwabc2',
    },
    email: 'davidwabc2@tagus.com',
    role: 'Intern',
    courses: 165,
    gender: 'Male',
    progress: 34,
    status: 'inactive',
    action: 'ri-more-fill'
  },
  {
    id: 8,
    user: {
      userName: 'Steven Smith',
      userImage: 'img/user/user4.jpg',
      userDesignation: '@ssmith542',
    },
    email: 'ssmith542@tagus.com',
    role: 'Leader',
    gender: 'Custom',
    progress: 79,
    courses: 200,
    status: 'active',
    action: 'ri-more-fill'
  },
  {
    id: 9,
    user: {
      userName: 'Francis Frank',
      userImage: 'img/user/user10.jpg',
      userDesignation: '@ffrank7e',
    },
    email: 'ffrank7e@tagus.com',
    role: 'Fresher',
    gender: 'Male',
    courses: 99,
    progress: 55,
    status: 'inactive',
    action: 'ri-more-fill'
  },
  {
    id: 10,
    user: {
      userName: 'Phoebe Patterson',
      userImage: 'img/user/user11.jpg',
      userDesignation: '@ppatterson2g',
    },
    email: 'ppatterson2g@tagus.com',
    role: 'Middle',
    gender: 'Male',
    courses: 27,
    progress: 76,
    status: 'active',
    action: 'ri-more-fill'
  },
  {
    id: 11,
    user: {
      userName: 'James Andy',
      userImage: 'img/user/user1.jpg',
      userDesignation: '@andyjm32',
    },
    email: 'andyjm32@tagus.com',
    role: 'Junior',
    courses: 222,
    gender: 'Female',
    progress: 87,
    status: 'active',
    action: 'ri-more-fill'
  },
  {
    id: 12,
    user: {
      userName: 'Sarah Taylor',
      userImage: 'img/user/user2.jpg',
      userDesignation: '@taylors32',
    },
    email: 'taylors32@tagus.com',
    role: 'Fresher',
    courses: 54,
    progress: 99,
    gender: 'Male',
    status: 'inactive',
    action: 'ri-more-fill'
  },
  {
    id: 13,
    user: {
      userName: 'Lucile Young',
      userImage: 'img/user/user8.jpg',
      userDesignation: '@lyoung4a',
    },
    email: 'lyoung4a@tagus.com',
    role: 'Senior',
    gender: 'Male',
    courses: 165,
    progress: 86,
    status: 'active',
    action: 'ri-more-fill'
  },
  {
    id: 14,
    user: {
      userName: 'Jordan Stevenson',
      userImage: 'img/user/user9.jpg',
      userDesignation: '@jstevenson5c',
    },
    email: 'jstevenson5c@tagus.com',
    role: 'Intern',
    gender: 'Female',
    courses: 54,
    progress: 20,
    status: 'inactive',
    action: 'ri-more-fill'
  },
  {
    id: 15,
    user: {
      userName: 'Francis Frank',
      userImage: 'img/user/user10.jpg',
      userDesignation: '@ffrank7e',
    },
    email: 'ffrank7e@tagus.com',
    role: 'Leader',
    gender: 'Male',
    courses: 99,
    progress: 55,
    status: 'active',
    action: 'ri-more-fill'
  }
];
