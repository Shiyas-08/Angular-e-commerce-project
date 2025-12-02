import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = { email: '', password: '' };

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onLogin() {
    const { email, password } = this.loginData;

    if (!email || !password) {
      this.toastr.warning('Please fill all fields', 'Warning');
      return;
    }

    this.auth.loginUser(email, password).subscribe({
      next: (user) => {
        //  Blocked user
        if (user && user.isBlocked) {
          this.toastr.error('Your account has been blocked. Please contact the admin.', 'Access Denied');
          this.router.navigate(['/login']);
          return;
        }

        //  Normal login
        if (user) {
          this.toastr.success('Login successful!');

          if (user.role === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/home']);
          }
        } else {
          this.toastr.error('Invalid email or password', 'Login Failed');
        }
      },
      error: () => this.toastr.error('Login failed. Try again.', 'Error')
    });
  }
}
