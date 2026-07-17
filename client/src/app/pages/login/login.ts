import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { ApiService } from '../../services/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';

  constructor(
    private api: ApiService,
    private router: Router
  ) { }

  login() {

    this.api.login({

      email: this.email,

      password: this.password

    }).subscribe({

      next: (res: any) => {

        console.log(res);

        // Save JWT Token
        localStorage.setItem("token", res.token);

        // Navigate to chatbot page
        this.router.navigate(['/chat']);

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

}