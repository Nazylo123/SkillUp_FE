import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserAdmin } from '../../../../models/user.models';

@Component({
    selector: 'app-admin-user-list',
    imports: [
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatMenuModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        CommonModule
    ],
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
})
export class AdminUserList implements AfterViewInit {
    constructor(private router: Router) {}

    displayedColumns: string[] = [
        'id',
        'name',
        'email',
        'role',
        'status',
        'joinedDate',
        'action',
    ];

    data = new MatTableDataSource<UserAdmin>(fakeUsers);
    searchTerm = '';

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngAfterViewInit() {
        this.data.paginator = this.paginator;

        this.data.filterPredicate = (data, filter) =>
            data.fullName.toLowerCase().includes(filter);
    }

    goDetail(element: UserAdmin) {
        this.router.navigate([`/admin/users/${element.userId}`])
    }

    search() {
        this.data.filter = this.searchTerm.trim().toLowerCase();
        if (this.data.paginator) {
            this.data.paginator.firstPage();
        }
    }
}

const fakeUsers: UserAdmin[] = [
    {
        userId: 1,
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        roles: ['User'],
        active: true,
        createdAt: '2025-01-15',
    },
    {
        userId: 2,
        fullName: 'Jane Smith',
        email: 'jane.smith@example.com',
        roles: ['Lecturer'],
        active: false,
        createdAt: '2025-02-20',
    },
    {
        userId: 3,
        fullName: 'Mike Johnson',
        email: 'john.doe@example.com',
        roles: ['Admin'],
        active: true,
        createdAt: '2025-03-10',
    },
    {
        userId: 4,
        fullName: 'Sarah Williams',
        email: 'sarah.w@example.com',
        roles: ['Manager'],
        active: true,
        createdAt: '2025-03-15',
    },
    {
        userId: 5,
        fullName: 'Alex Brown',
        email: 'mike.j@example.com',
        roles: ['Admin'],
        active: true,
        createdAt: '2025-03-10',
    },
    {
        userId: 6,
        fullName: 'Alex Brown',
        email: 'alex.b@example.com',
        roles: ['User'],
        active: false,
        createdAt: '2025-04-01',
    },
    {
        userId: 7,
        fullName: 'Chris Wilson',
        email: 'chris.w@example.com',
        roles: ['Lecturer'],
        active: true,
        createdAt: '2025-05-01',
    },
    {
        userId: 8,
        fullName: 'Lisa Anderson',
        email: 'lisa.a@example.com',
        roles: ['User'],
        active: true,
        createdAt: '2025-05-10',
    },
    {
        userId: 9,
        fullName: 'David Taylor',
        email: 'david.t@example.com',
        roles: ['User'],
        active: false,
        createdAt: '2025-06-01',
    },
    {
        userId: 10,
        fullName: 'Emma Miller',
        email: 'emma.m@example.com',
        roles: ['Lecturer'],
        active: true,
        createdAt: '2025-06-15',
    },
    {
        userId: 11,
        fullName: 'James Wilson',
        email: 'james.w@example.com',
        roles: ['User'],
        active: true,
        createdAt: '2025-07-01',
    },
    {
        userId: 12,
        fullName: 'Olivia Moore',
        email: 'olivia.m@example.com',
        roles: ['User'],
        active: true,
        createdAt: '2025-07-15',
    },
];
