import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { Chat } from '../../services/chat';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {

  @Output() newChatClicked = new EventEmitter<void>();

  constructor(
    private api: ApiService,
    public chat: Chat
  ) { }

  newChat() {
    this.newChatClicked.emit();
  }

  ngOnInit() {

    const token = localStorage.getItem("token");

    if (!token) return;

    this.api.getConversations(token).subscribe({

      next: (res: any) => {

        this.chat.conversations = res.conversations.map((conv: any) => ({

  _id: conv._id,

  title: conv.title,

  messages: []

}));
      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  openConversation(id: string) {

    const token = localStorage.getItem("token");

    if (!token) return;

    this.api.getConversation(id, token).subscribe({

      next: (res: any) => {

        this.chat.currentConversationId = id;

        this.chat.currentChat = {

          _id: id,

          title: res.conversation.title,

          messages: []

        };

        for (const item of res.chats) {

          this.chat.currentChat.messages.push({

            sender: "user",

            text: item.message

          });

          this.chat.currentChat.messages.push({

            sender: "bot",

            text: item.response

          });

        }

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

}