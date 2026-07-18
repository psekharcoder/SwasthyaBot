import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { Navbar } from '../../components/navbar/navbar';
import { MessageComponent } from '../../components/message/message';
import { Sidebar } from '../../components/sidebar/sidebar';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api';
import { Message } from '../../models/message';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,

    FormsModule,

    MatCardModule,

    MatInputModule,

    MatButtonModule,

    MarkdownModule,

    Navbar,

    MessageComponent,

    Sidebar

  ],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css'
})
export class Chatbot {

  message = '';

  isTyping = false;

  messages: Message[] = [];

  @ViewChild('chatBody')

  chatBody!: ElementRef;


  startNewChat() {

  this.messages = [];
  this.message = "";

  setTimeout(() => {
    this.chatBody.nativeElement.scrollTop = 0;
  }, 100);

}

  constructor(

    private api: ApiService

  ) { }

  sendMessage() {

    if (!this.message.trim()) return;

    this.messages.push({

      sender: 'user',

      text: this.message


    });


    this.scrollToBottom();

    const userMessage = this.message;

    this.message = '';

    const token = localStorage.getItem('token');

    if (!token) {

      alert("Please login again.");

      return;

    }

    this.isTyping = true;

    this.api.chat(userMessage, token).subscribe({

      next: (res: any) => {

        this.isTyping = false;

        this.messages.push({

          sender: 'bot',

          text: res.reply

        });

        this.scrollToBottom();

      },

      error: (err) => {

        this.isTyping = false;

        console.log(err);

      }

    });

  }

  selectSuggestion(question: string) {
    this.message = question;
  }

  private scrollToBottom() {

    setTimeout(() => {

      this.chatBody.nativeElement.scrollTop =
        this.chatBody.nativeElement.scrollHeight;

    }, 100);

  }

}