import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData = { name: '', email: '', phone: '', password: '' };
  private apiUrl = 'http://localhost:3000/users';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient
  ) {}

  onRegister(form: any) {
    // Check if form invalid

    if (!form.valid) {
      this.toastr.warning('Please fill all required fields correctly.', 'Invalid Form', {
        timeOut: 1500,
        positionClass: 'toast-top-right'
      });
      return;
    }

    //  Validate password length
    if (this.registerData.password.length >8) {
      this.toastr.warning('Password must be at least 8 characters long.', 'Weak Password', {
        timeOut: 1500,
        positionClass: 'toast-top-right'
      });
      return;
    }

    //Validate phone number
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(this.registerData.phone)) {
      this.toastr.warning('Phone number must be 10 digits.', 'Invalid Phone', {
        timeOut: 1500,
        positionClass: 'toast-top-right'
      });
      return;
    }

    // Check email already exists

    this.http.get<any[]>(`${this.apiUrl}?email=${this.registerData.email}`).subscribe(users => {
      if (users.length > 0) {
        this.toastr.error('This email is already registered.', 'Duplicate Email', {
          timeOut: 1500,
          positionClass: 'toast-top-right'
        });
        return;
      }

      
      this.authService.registerUser(this.registerData).subscribe({
        next: () => {
          this.toastr.success('Registration successful! Please login.', 'Success', {
            timeOut: 1500,
            positionClass: 'toast-top-right'
          });
          this.router.navigate(['/login']);
        },
        error: () => {
          this.toastr.error('Registration failed. Try again.', 'Error', {
            timeOut: 1500,
            positionClass: 'toast-top-right'
          });
        }
      });
    });
  }
}
