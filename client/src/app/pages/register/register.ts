import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { ApiService } from '../../services/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  name = "";
  email = "";
  password = "";
  confirmPassword = "";
  otp = "";

  otpSent = false;

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  sendOTP() {

    if (!this.name || !this.email || !this.password || !this.confirmPassword) {

      alert("Please fill all fields.");
      return;

    }

    if (this.password !== this.confirmPassword) {

      alert("Passwords do not match.");
      return;

    }

    this.api.signup({

      name: this.name,
      email: this.email,
      password: this.password

    }).subscribe({

      next: (res: any) => {

        alert(res.message);

        this.otpSent = true;

      },

      error: (err) => {

        alert(err.error.message);

      }

    });

  }

  verifyRegister() {

    if (!this.otp) {

      alert("Enter OTP");
      return;

    }

    this.api.verifyOTP({

      email: this.email,
      otp: this.otp

    }).subscribe({

      next: (res: any) => {

        alert(res.message);

        this.router.navigate(['/login']);

      },

      error: (err) => {

        alert(err.error.message);

      }

    });

  }

}