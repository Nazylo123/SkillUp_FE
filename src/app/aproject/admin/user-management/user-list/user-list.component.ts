import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserAdmin, PaginatedResponse } from '../../../../models/user.models';
import { ApiUserServices } from '../../../../services/user.service';

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
export class AdminUserList implements OnInit, AfterViewInit {
    constructor(private router: Router, private apiUserService: ApiUserServices) {}

    displayedColumns: string[] = [
        'id',
        'name',
        'email',
        'role',
        'status',
        'joinedDate',
        'action',
    ];

    data = new MatTableDataSource<UserAdmin>([]);
    searchTerm = '';
    
    // Pagination properties
    totalItems = 0;
    currentPage = 1;
    pageSize = 10;
    isLoading = false;

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers(page: number = 1, pageSize: number = 10, searchTerm?: string) {
        this.isLoading = true;
        this.apiUserService.getUserAdminList(page, pageSize, searchTerm).subscribe(
            (res: PaginatedResponse<UserAdmin>) => {
                console.log('res', res);
                this.data = new MatTableDataSource<UserAdmin>(res.items);
                this.totalItems = res.total;
                this.currentPage = res.page;
                this.pageSize = res.pageSize;
                
                // Update paginator after data is loaded
                if (this.paginator) {
                    this.paginator.length = this.totalItems;
                    this.paginator.pageSize = this.pageSize;
                    this.paginator.pageIndex = this.currentPage - 1; // MatPaginator is 0-based
                }
                
                this.isLoading = false;
            }, 
            error => {
                console.error('Error fetching user info:', error);
                this.isLoading = false;
            }
        );
    }

    ngAfterViewInit() {
        if (this.paginator) {
            this.paginator.pageSize = this.pageSize;
            this.paginator.length = this.totalItems;
            
            // Handle paginator events
            this.paginator.page.subscribe(event => {
                this.currentPage = event.pageIndex + 1; // MatPaginator is 0-based
                this.pageSize = event.pageSize;
                this.loadUsers(this.currentPage, this.pageSize, this.searchTerm);
            });
        }
        
        // Remove local filtering since we're doing server-side filtering
        this.data.filterPredicate = () => true;
    }

    goDetail(element: UserAdmin) {
        this.router.navigate([`/admin/users/${element.userId}`])
    }

    search() {
        this.currentPage = 1;
        if (this.paginator) {
            this.paginator.pageIndex = 0;
        }
        this.loadUsers(this.currentPage, this.pageSize, this.searchTerm);
    }


    onPaginatorChange(event: PageEvent) {
        this.currentPage = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.loadUsers(this.currentPage, this.pageSize, this.searchTerm);
    }
}