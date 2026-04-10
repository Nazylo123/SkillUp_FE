import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, inject, OnDestroy, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ChatMessage } from '../../models/ai.models';
import { RagService, RagChatRequest } from '../../services/rag.service';
import { AuthService } from '../../context/auth.service';
import { Subscription } from 'rxjs';
import { UserInfo } from '../../models/user.models';

@Component({
  selector: 'app-course-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule
  ],
  template: `
    <!-- Floating Toggle Button -->
    <button 
      *ngIf="!isOpen" 
      class="course-chat-toggle"
      (click)="isOpen = true">
      <i class="ri-robot-2-line"></i>
      <span>Hỏi AI Trợ giảng</span>
    </button>

    <!-- Chat Panel -->
    <div *ngIf="isOpen" class="course-chat-panel">
      <!-- Header -->
      <div class="ccp-header">
        <div class="ccp-header-info">
          <div class="ccp-avatar">
            <i class="ri-robot-2-line"></i>
          </div>
          <div>
            <h4>AI Trợ giảng</h4>
            <small>Hỏi đáp về khóa học này</small>
          </div>
        </div>
        <button class="ccp-close" (click)="isOpen = false">
          <i class="ri-close-line"></i>
        </button>
      </div>

      <!-- Messages -->
      <div class="ccp-messages" #messagesContainer>
        <div *ngFor="let msg of messages" 
             class="ccp-msg" 
             [class.ccp-msg-user]="!msg.isBot"
             [class.ccp-msg-bot]="msg.isBot">
          
          <div *ngIf="msg.isBot" class="ccp-msg-avatar">
            <i class="ri-robot-2-line"></i>
          </div>
          
          <div class="ccp-msg-bubble" [class.typing]="msg.typing">
            <span *ngIf="!msg.typing">{{ msg.text }}</span>
            <span *ngIf="msg.typing" class="ccp-typing">
              <span></span><span></span><span></span>
            </span>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="ccp-input">
        <input 
          [(ngModel)]="newMessage" 
          (keydown.enter)="sendMessage()"
          placeholder="Hỏi về nội dung khóa học..."
          [disabled]="isTyping">
        <button (click)="sendMessage()" [disabled]="!newMessage.trim() || isTyping">
          <i class="ri-send-plane-2-fill"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      position: fixed;
      bottom: 100px; /* Đẩy lên cao để không đè lên chat-box trang chủ */
      right: 24px;
      z-index: 9999;
    }

    .course-chat-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 8px 24px rgba(118, 75, 162, 0.4);
      transition: all 0.3s;

      i { font-size: 20px; }
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 28px rgba(118, 75, 162, 0.5);
      }
    }

    .course-chat-panel {
      width: 380px;
      height: 520px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 2px solid #667eea;
    }

    .ccp-header {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 14px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .ccp-header-info {
        display: flex;
        align-items: center;
        gap: 10px;

        h4 { margin: 0; font-size: 15px; font-weight: 600; }
        small { opacity: 0.85; font-size: 12px; }
      }

      .ccp-avatar {
        width: 36px;
        height: 36px;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        i { font-size: 20px; }
      }

      .ccp-close {
        background: rgba(255,255,255,0.15);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        i { font-size: 18px; }
        &:hover { background: rgba(255,255,255,0.3); }
      }
    }

    .ccp-messages {
      flex: 1;
      overflow-y: auto;
      padding: 14px;
      background: #f8f9fa;
      display: flex;
      flex-direction: column;
      gap: 12px;

      &::-webkit-scrollbar { width: 5px; }
      &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
    }

    .ccp-msg {
      display: flex;
      gap: 8px;
      animation: fadeIn 0.3s ease;

      &.ccp-msg-user {
        justify-content: flex-end;
        .ccp-msg-bubble {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-radius: 16px 16px 4px 16px;
        }
      }

      &.ccp-msg-bot {
        .ccp-msg-bubble {
          background: white;
          color: #1f2937;
          border-radius: 16px 16px 16px 4px;
          border: 1px solid #d1fae5;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
      }

      .ccp-msg-avatar {
        width: 28px;
        height: 28px;
        background: linear-gradient(135deg, #10b981, #059669);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        i { color: white; font-size: 14px; }
      }

      .ccp-msg-bubble {
        max-width: 260px;
        padding: 10px 14px;
        font-size: 13px;
        line-height: 1.5;
        word-wrap: break-word;
        white-space: pre-wrap;
      }
    }

    .ccp-typing {
      display: flex;
      gap: 4px;
      padding: 4px 0;
      span {
        width: 7px; height: 7px;
        background: #667eea;
        border-radius: 50%;
        animation: bounce 1.2s infinite ease-in-out;
        &:nth-child(2) { animation-delay: 0.15s; }
        &:nth-child(3) { animation-delay: 0.3s; }
      }
    }

    .ccp-input {
      padding: 12px;
      background: white;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 8px;

      input {
        flex: 1;
        border: 1px solid #d1d5db;
        border-radius: 24px;
        padding: 10px 16px;
        font-size: 13px;
        outline: none;
        transition: border-color 0.2s;
        &:focus { border-color: #667eea; }
        &:disabled { background: #f9fafb; }
      }

      button {
        width: 38px;
        height: 38px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        i { font-size: 18px; }
        &:hover { background: #764ba2; }
        &:disabled { background: #d1d5db; cursor: not-allowed; }
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-8px); }
    }

    @media (max-width: 480px) {
      .course-chat-panel { width: calc(100vw - 32px); }
    }
  `]
})
export class CourseChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  private ragService = inject(RagService);
  private authService = inject(AuthService);
  private sub?: Subscription;
  @ViewChild('messagesContainer') private msgContainer!: ElementRef;

  @Input() courseId!: number;

  isOpen = false;
  newMessage = '';
  messages: ChatMessage[] = [];
  isTyping = false;
  currentUser: UserInfo | null = null;

  ngOnInit(): void {
    this.sub = this.authService.currentUser$.subscribe(u => {
      this.currentUser = u;
      if (u && this.messages.length === 0) {
        this.addBotMessage('Xin chào! 🎓 Tôi là trợ giảng AI của khóa học này.\nBạn có thể hỏi bất kỳ câu hỏi nào về nội dung khóa học!');
      }
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }
  ngAfterViewChecked(): void { this.scrollToBottom(); }

  sendMessage(): void {
    if (!this.newMessage.trim() || this.isTyping) return;
    const text = this.newMessage.trim();
    this.messages.push({ id: this.genId(), text, isBot: false, timestamp: new Date() });
    this.newMessage = '';
    this.isTyping = true;
    this.messages.push({ id: 'typing', text: '', isBot: true, timestamp: new Date(), typing: true });

    const payload: RagChatRequest = {
      question: text,
      courseId: this.courseId,
      history: this.messages.filter(m => m.id !== 'typing').map(m => ({
        role: m.isBot ? 'Assistant' : 'User',
        content: m.text
      }))
    };

    this.ragService.chat(payload).subscribe({
      next: (res) => {
        this.messages = this.messages.filter(m => m.id !== 'typing');
        this.isTyping = false;
        let reply = res.answer;
        if (res.sources?.length) reply += '\n\n📚 Nguồn: ' + res.sources.join(', ');
        this.addBotMessage(reply);
      },
      error: () => {
        this.messages = this.messages.filter(m => m.id !== 'typing');
        this.isTyping = false;
        this.addBotMessage('Xin lỗi, không thể trả lời lúc này.');
      }
    });
  }

  private addBotMessage(text: string): void {
    this.messages.push({ id: this.genId(), text, isBot: true, timestamp: new Date() });
  }

  private genId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 5);
  }

  private scrollToBottom(): void {
    try {
      if (this.msgContainer) {
        this.msgContainer.nativeElement.scrollTop = this.msgContainer.nativeElement.scrollHeight;
      }
    } catch {}
  }
}
