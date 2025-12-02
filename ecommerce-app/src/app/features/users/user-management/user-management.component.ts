import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, User } from 'src/app/core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-manage-users',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class ManageUsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  searchText = '';
  selectedUser: User | null = null;

  // ✅ store selected user's orders
  userOrders: any[] = [];

  private destroy$ = new Subject<void>();
  private userApi = 'http://localhost:3000/users';
  private ordersApi = 'http://localhost:3000/orders';

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ✅ Load all users
  loadUsers(): void {
    this.loading = true;

    this.http
      .get<User[]>(this.userApi)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.users = res.map(u => ({
            ...u,
            isBlocked: u['isBlocked'] ?? false
          }));
          this.filteredUsers = [...this.users];
          this.loading = false;
        },
        error: () => {
          this.toastr.error('Failed to load users', 'Error');
          this.loading = false;
        }
      });
  }

  // ✅ Search users
  filterUsers(): void {
    const term = this.searchText.toLowerCase().trim();

    if (!term) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(
      u =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
    );
  }

  // ✅ Block / Unblock user
  toggleBlock(user: User): void {
    if (!user?.id) return;

    const newStatus = !user['isBlocked'];

    this.http
      .patch(`${this.userApi}/${user.id}`, { isBlocked: newStatus })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          user['isBlocked'] = newStatus;
          this.toastr.success(
            `User ${newStatus ? 'Blocked' : 'Unblocked'} successfully!`,
            'Status Updated'
          );
        },
        error: () =>
          this.toastr.error('Failed to update user status', 'Error')
      });
  }

  // ✅ VIEW USER + LOAD THEIR ORDERS
  viewUser(user: User): void {
    this.selectedUser = user;
    this.userOrders = [];

    this.http
      .get<any[]>(this.ordersApi)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orders) => {

          // ✅ SAFE FILTER (string vs number issue handled)
          this.userOrders = orders.filter(
            order => String(order.userId) === String(user.id)
          );
        },
        error: () => {
          this.toastr.error('Failed to load user orders', 'Error');
        }
      });
  }

  // ✅ Close modal
  closeModal(): void {
    this.selectedUser = null;
    this.userOrders = [];
  }
}
