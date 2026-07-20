import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { ApiService } from '../../services/api';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  user: any = {};

  constructor(
    private api: ApiService,
    private router: Router
  ) { }

  ngOnInit() {

    const token = localStorage.getItem("token");

    if (!token) {

      this.router.navigate(['/login']);

      return;

    }

    this.api.getProfile(token).subscribe({

      next: (res: any) => {

        console.log("Response:", res);

        this.user = res.user;

        console.log("User:", this.user);

      },
      error: (err) => {

        console.log(err);

      }

    });

  }

  logout() {

    localStorage.removeItem("token");

    this.router.navigate(['/login']);

  }

}