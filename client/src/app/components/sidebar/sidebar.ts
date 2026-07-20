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

  // ==========================
  // New Chat
  // ==========================

  newChat() {
    this.newChatClicked.emit();
  }

  // ==========================
  // Load Conversations
  // ==========================

  ngOnInit() {

    console.log("Sidebar Loaded");

    const token = localStorage.getItem("token");

    if (!token) return;

    this.api.getConversations(token).subscribe({

      next: (res: any) => {

        console.log("Loaded conversations:", res.conversations);

        this.chat.conversations = res.conversations.map((conv: any) => ({

          _id: conv._id,

          title: conv.title,

          messages: []

        }));

        console.log("Chat conversations:", this.chat.conversations);

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  // ==========================
  // Open Conversation
  // ==========================


  openConversation(id: string) {

    console.log("Open conversation:", id);

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

  // ==========================
  // Delete Conversation
  // ==========================

  deleteConversation(id: string, event: Event) {

      console.log("Delete clicked");

    // Prevent opening conversation when clicking delete
    event.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) return;

    if (!confirm("Delete this conversation?")) return;

    this.api.deleteConversation(id, token).subscribe({

      next: () => {

        // Remove from sidebar
        this.chat.conversations =
          this.chat.conversations.filter(c => c._id !== id);

        // If current conversation was deleted
        if (this.chat.currentConversationId === id) {

          this.chat.clearChat();

        }

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  renameConversation(id: string, currentTitle: string, event: Event) {
      console.log("Rename clicked");

  event.stopPropagation();

  const token = localStorage.getItem("token");

  if (!token) return;

  const newTitle = prompt("Enter new title:", currentTitle);

  if (!newTitle || newTitle.trim() === "") return;

  this.api.renameConversation(id, newTitle, token).subscribe({

    next: (res: any) => {

      const chat = this.chat.conversations.find(c => c._id === id);

      if (chat) {

        chat.title = res.conversation.title;

      }

      if (this.chat.currentConversationId === id) {

        this.chat.currentChat.title = res.conversation.title;

      }

    },

    error: (err) => {

      console.log(err);

    }

  });

}

openWhatsApp() {

  window.open(
    "https://wa.me/917396630673",
    "_blank"
  );

}

}