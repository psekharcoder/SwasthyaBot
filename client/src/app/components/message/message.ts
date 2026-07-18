import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { Message } from '../../models/message';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    CommonModule,
    MarkdownModule
  ],
  templateUrl: './message.html',
  styleUrl: './message.css'
})
export class MessageComponent {

  @Input() msg!: Message;

}