import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {

  history: any[] = [];

  @Output() newChatClicked = new EventEmitter<void>();

newChat() {

  this.newChatClicked.emit();

}

  constructor(
    private api: ApiService
  ) {}

  ngOnInit() {

    const token = localStorage.getItem("token");

    if (!token) return;

    this.api.getHistory(token).subscribe({

      next: (res: any) => {

        this.history = res.history;

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

}