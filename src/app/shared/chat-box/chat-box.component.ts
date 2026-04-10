import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { ChatMessage, ConversationModel } from '../../models/ai.models';
import { RagService, RagChatRequest } from '../../services/rag.service';
import { UserInfo } from '../../models/user.models';
import { AuthService } from '../../context/auth.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatBadgeModule
  ],
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit, AfterViewChecked, OnDestroy {
  private ragService = inject(RagService);
  private authService = inject(AuthService);
  private currentUserSubscription?: Subscription;
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  isExpanded = false;
  isMinimized = true;
  newMessage = '';
  messages: ChatMessage[] = [];
  isTyping = false;
  unreadCount = 0;
  currentUser: UserInfo | null = null;
  public shouldShowChat = false;
  currentUser$: Observable<UserInfo | null> = this.authService.currentUser$;

  ngOnInit(): void {
    this.currentUserSubscription = this.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.shouldShowChat = user !== null;
      
      if (user !== null && this.messages.length === 0) {
        const greetingMessage = `Xin chào! 🎓 Tôi là trợ lý tư vấn khóa học của SkillUp.\n\nTôi có thể giúp bạn tìm khóa học phù hợp. Hãy cho tôi biết bạn muốn học gì nhé!`;
        this.addBotMessage(greetingMessage);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  toggleChat(): void {
    if (this.isMinimized) {
      this.isMinimized = false;
      this.isExpanded = true;
      this.unreadCount = 0;
    } else {
      this.isExpanded = !this.isExpanded;
      if (this.isExpanded) {
        this.unreadCount = 0;
      }
    }
  }

  minimizeChat(): void {
    this.isExpanded = false;
    this.isMinimized = true;
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: this.generateId(),
      text: this.newMessage.trim(),
      isBot: false,
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    this.newMessage = '';
    this.showTypingIndicator();
    this.hideTypingIndicator();
    this.getBotResponse(userMessage.text);
  }

  private addBotMessage(text: string, timestamp: Date = new Date()): void {
    const botMessage: ChatMessage = {
      id: this.generateId(),
      text: text,
      isBot: true,
      timestamp: timestamp
    };
    this.messages.push(botMessage);
    if (this.isMinimized) {
      this.unreadCount++;
    }
  }

  private showTypingIndicator(): void {
    this.isTyping = true;
    const typingMessage: ChatMessage = {
      id: 'typing',
      text: '',
      isBot: true,
      timestamp: new Date(),
      typing: true
    };
    this.messages.push(typingMessage);
  }

  private hideTypingIndicator(): void {
    this.isTyping = false;
    this.messages = this.messages.filter(msg => msg.id !== 'typing');
  }

  private getBotResponse(message: string) {
    // Homepage chat: courseId = null (uses synced course catalog data)
    const payload: RagChatRequest = {
      question: message.trim(),
      courseId: null,
      history: this.messages.map((msg) => ({
        role: msg.isBot ? 'Assistant' : 'User',
        content: msg.text
      }))
    };

    this.ragService.chat(payload).subscribe({
      next: (response) => {
        let replyText = response.answer;
        if (response.sources && response.sources.length > 0) {
          replyText += "\n\nNguồn tham khảo: " + response.sources.join(", ");
        }
        this.addBotMessage(replyText, new Date());
      },
      error: (error) => {
        this.addBotMessage('Xin lỗi, tôi không thể trả lời câu hỏi của bạn.', new Date());
      }
    });
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = 
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  formatTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
