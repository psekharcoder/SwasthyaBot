import { Injectable } from '@angular/core';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class Chat {

  // Current conversation
  messages: Message[] = [];

  // All conversations
  history: any[] = [];

  constructor() {}

  addUserMessage(text: string) {

    this.messages.push({

      sender: 'user',

      text

    });

  }

  addBotMessage(text: string) {

    this.messages.push({

      sender: 'bot',

      text

    });

  }

  clearChat() {

    this.messages = [];

  }

}