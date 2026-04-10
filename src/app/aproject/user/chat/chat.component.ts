import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RagService, RagChatRequest } from '../../../services/rag.service';

interface ChatMessage {
  role: 'User' | 'Assistant';
  content: string;
  sources?: string[];
  time: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  
  messages: ChatMessage[] = [
    {
      role: 'Assistant',
      content: 'Chào bạn! Mình là AI hỗ trợ nội bộ. Mình đã được đọc các tài liệu của công ty. Bạn muốn hỏi gì?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];
  
  newMessage: string = '';
  isTyping: boolean = false;

  constructor(private ragService: RagService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  sendMessage() {
    if (!this.newMessage.trim() || this.isTyping) return;

    const userMessage: ChatMessage = {
      role: 'User',
      content: this.newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.messages.push(userMessage);
    const question = this.newMessage;
    this.newMessage = '';
    this.isTyping = true;

    // Build history for context (optional, depending on backend implementation)
    const history = this.messages.slice(0, -1).map(m => ({
      role: m.role,
      content: m.content
    }));

    const request: RagChatRequest = {
      question: question,
      history: history
    };

    this.ragService.chat(request).subscribe({
      next: (res) => {
        const botMessage: ChatMessage = {
          role: 'Assistant',
          content: res.answer,
          sources: res.sources,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        this.messages.push(botMessage);
        this.isTyping = false;
      },
      error: (err) => {
        const botMessage: ChatMessage = {
          role: 'Assistant',
          content: 'Xin lỗi, có lỗi kết nối đến hệ thống RAG.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        this.messages.push(botMessage);
        this.isTyping = false;
      }
    });
  }
}