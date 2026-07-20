import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { Navbar } from '../../components/navbar/navbar';
import { MessageComponent } from '../../components/message/message';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Chat } from '../../services/chat';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api';

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

  selectedFile: File | null = null;

  recognition: any;

  isListening = false;

  voiceEnabled = true;



  @ViewChild('chatBody')

  chatBody!: ElementRef;


  startNewChat() {

    this.chat.clearChat();

    this.chat.currentConversationId = "";

    this.message = "";

    setTimeout(() => {

      this.chatBody.nativeElement.scrollTop = 0;

    }, 100);

  }

  constructor(
    private api: ApiService,
    public chat: Chat,
    private cdr: ChangeDetectorRef
  ) {

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {

      this.recognition = new SpeechRecognition();

      this.recognition.lang = "en-US";
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

    }

  }

  sendMessage() {

    if (!this.message.trim()) return;

    this.chat.addUserMessage(this.message);

    this.scrollToBottom();

    const userMessage = this.message;

    this.message = "";

    const token = localStorage.getItem("token");

    if (!token) {

      alert("Please login again.");

      return;

    }

    this.isTyping = true;

    this.api.chat(

      userMessage,

      this.chat.currentConversationId,

      token

    ).subscribe({

      next: (res: any) => {

        this.isTyping = false;

        this.chat.addBotMessage(res.reply);
        this.speak(res.reply);

        // Save conversation id only once
        if (!this.chat.currentConversationId) {

          this.chat.currentConversationId = res.conversationId;

          this.chat.currentChat._id = res.conversationId;

        }

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

  startListening() {

    if (!this.recognition) {

      alert("Speech Recognition is not supported in this browser.");

      return;

    }

    this.isListening = true;

    this.recognition.start();

    this.recognition.onresult = (event: any) => {

      this.message = event.results[0][0].transcript;

      this.isListening = false;

      // Force Angular to update the UI
      this.cdr.detectChanges();

      setTimeout(() => {

        this.sendMessage();

      }, 1000);

    };

    this.recognition.onerror = () => {

      this.isListening = false;

      console.log("Speech recognition failed.");

    };

  }

  toggleVoice() {

    this.voiceEnabled = !this.voiceEnabled;

    if (!this.voiceEnabled) {

      speechSynthesis.cancel();

    }

  }

  speak(text: string) {

    if (!this.voiceEnabled) return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";

    utterance.rate = 1;

    utterance.pitch = 1;

    speechSynthesis.speak(utterance);

  }

  onFileSelected(event: any) {

    const file = event.target.files[0];

    if (!file) return;

    this.selectedFile = file;

    const token = localStorage.getItem("token");

    if (!token) {

      alert("Please login again.");

      return;

    }

    this.api.uploadFile(file, token).subscribe({

      next: (res: any) => {

        console.log(res);

        this.chat.addUserMessage("📎 " + file.name);

        this.chat.addBotMessage(
          "✅ File uploaded successfully.\n\nYou can now ask me questions about this file."
        );

        this.scrollToBottom();

      },

      error: (err) => {

        console.log(err);

        this.chat.addBotMessage("❌ File upload failed.");

        this.scrollToBottom();

      }

    });

  }

}