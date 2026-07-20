import { Injectable } from '@angular/core';
import { Message } from '../models/message';

export interface Conversation {

  _id: string;

  title: string;

  messages: Message[];

}

@Injectable({
  providedIn: 'root'
})
export class Chat {

  conversations: Conversation[] = [];

  currentChat!: Conversation;

  currentConversationId: string = "";

  constructor() {

    this.createNewChat();

  }

  createNewChat() {

    this.currentConversationId = "";

    this.currentChat = {

      _id: "",

      title: "New Chat",

      messages: []

    };

    this.conversations.unshift(this.currentChat);

  }

  addUserMessage(text: string) {

    if (this.currentChat.messages.length === 0) {

      this.currentChat.title = this.generateTitle(text);

    }

    this.currentChat.messages.push({

      sender: "user",

      text

    });

  }

  addBotMessage(text: string) {

    this.currentChat.messages.push({

      sender: "bot",

      text

    });

  }

  clearChat() {

    this.createNewChat();

  }

  selectConversation(id: string) {

    const chat = this.conversations.find(c => c._id === id);

    if (chat) {

      this.currentChat = chat;

      this.currentConversationId = id;

    }

  }

  private generateTitle(text: string): string {

    const msg = text.toLowerCase();

    if (msg.includes("fever")) return "🤒 Fever";
    if (msg.includes("cough")) return "😷 Cough";
    if (msg.includes("cold")) return "🤧 Cold";
    if (msg.includes("headache")) return "🤕 Headache";
    if (msg.includes("diabetes")) return "🩸 Diabetes";
    if (msg.includes("blood pressure")) return "❤️ Blood Pressure";
    if (msg.includes("heart")) return "❤️ Heart Health";
    if (msg.includes("skin")) return "🧴 Skin Problem";
    if (msg.includes("weight")) return "⚖️ Weight Loss";
    if (msg.includes("diet")) return "🥗 Healthy Diet";
    if (msg.includes("stomach")) return "🤢 Stomach Pain";
    if (msg.includes("anxiety")) return "🧠 Anxiety";

    return text.length > 25
      ? text.substring(0, 25) + "..."
      : text;

  }

}