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
    displayedColumns: string[] = [
        'id',
        'name',
        'email',
        'role',
        'status',
        'joinedDate',
        'action',
    ];

    data = new MatTableDataSource<any>(fakeUsers);
    searchTerm = '';

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngAfterViewInit() {
        this.data.paginator = this.paginator;

        this.data.filterPredicate = (data, filter) =>
            data.name.toLowerCase().includes(filter);
    }

    search() {
        this.data.filter = this.searchTerm.trim().toLowerCase();
        if (this.data.paginator) {
            this.data.paginator.firstPage();
        }
    }
}

const fakeUsers = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Student',
        status: 'active',
        joinedDate: '2025-01-15',
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'Lecturer',
        status: 'inactive',
        joinedDate: '2025-02-20',
    },
    {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike.j@example.com',
        role: 'Admin',
        status: 'active',
        joinedDate: '2025-03-10',
    },
    {
        id: 4,
        name: 'Sarah Williams',
        email: 'sarah.w@example.com',
        role: 'Manager',
        status: 'active',
        joinedDate: '2025-03-15',
    },
    {
        id: 5,
        name: 'Alex Brown',
        email: 'alex.b@example.com',
        role: 'Student',
        status: 'inactive',
        joinedDate: '2025-04-01',
    },
    {
        id: 6,
        name: 'Emily Davis',
        email: 'emily.d@example.com',
        role: 'Student',
        status: 'active',
        joinedDate: '2025-04-15',
    },
    {
        id: 7,
        name: 'Chris Wilson',
        email: 'chris.w@example.com',
        role: 'Lecturer',
        status: 'active',
        joinedDate: '2025-05-01',
    },
    {
        id: 8,
        name: 'Lisa Anderson',
        email: 'lisa.a@example.com',
        role: 'Student',
        status: 'active',
        joinedDate: '2025-05-10',
    },
    {
        id: 9,
        name: 'David Taylor',
        email: 'david.t@example.com',
        role: 'Student',
        status: 'inactive',
        joinedDate: '2025-06-01',
    },
    {
        id: 10,
        name: 'Emma Miller',
        email: 'emma.m@example.com',
        role: 'Lecturer',
        status: 'active',
        joinedDate: '2025-06-15',
    },
    {
        id: 11,
        name: 'James Wilson',
        email: 'james.w@example.com',
        role: 'Student',
        status: 'active',
        joinedDate: '2025-07-01',
    },
    {
        id: 12,
        name: 'Olivia Moore',
        email: 'olivia.m@example.com',
        role: 'Student',
        status: 'active',
        joinedDate: '2025-07-15',
    },
];
