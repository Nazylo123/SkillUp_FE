import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChatService, ChatMessageDto, RecentChatDto, AvailableUserDto } from '../../../services/chat.service';
import { TokenService } from '../../../context/token.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  recentChats: RecentChatDto[] = [];
  availableUsers: AvailableUserDto[] = [];
  selectedUser: RecentChatDto | null = null;
  messages: ChatMessageDto[] = [];
  newMessage: string = '';
  currentUserId: number = 0;
  isUploading = false;
  showUserPicker = false;  // Ẩn/hiện panel chọn người mới

  private subscriptions = new Subscription();

  constructor(
    private chatService: ChatService,
    private tokenService: TokenService
  ) {
    const token = this.tokenService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Try various claim names used by .NET JWT
        const idValue = payload['UserId'] || payload['sub'] || payload['nameid'] ||
          payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
        this.currentUserId = parseInt(idValue);
        console.log('Chat currentUserId:', this.currentUserId);
      } catch (e) {
        console.error('Failed to parse token', e);
      }
    }
  }

  ngOnInit(): void {
    this.chatService.startConnection();
    this.loadRecentChats();
    this.loadAvailableUsers();

    // Listen to new messages
    this.subscriptions.add(
      this.chatService.messageReceived$.subscribe(msg => {
        if (msg) {
          const otherUserId = msg.senderId === this.currentUserId ? msg.receiverId : msg.senderId;
          if (this.selectedUser && otherUserId === this.selectedUser.userId) {
            this.messages.push(msg);
            if (msg.senderId === this.selectedUser.userId) {
              this.chatService.markAsRead(msg.senderId).subscribe();
            }
          }
          this.loadRecentChats();
        }
      })
    );

    // Listen to user status changes
    this.subscriptions.add(
      this.chatService.userStatus$.subscribe(status => {
        if (status) {
          const chat = this.recentChats.find(c => c.userId === status.userId);
          if (chat) chat.isOnline = status.isOnline;
          if (this.selectedUser?.userId === status.userId) {
            this.selectedUser.isOnline = status.isOnline;
          }
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  loadRecentChats(): void {
    this.chatService.getRecentChats().subscribe(chats => {
      this.recentChats = chats;
    });
  }

  loadAvailableUsers(): void {
    this.chatService.getAvailableUsers().subscribe(users => {
      this.availableUsers = users;
    });
  }

  selectUser(chat: RecentChatDto): void {
    this.selectedUser = chat;
    this.showUserPicker = false;
    this.chatService.getHistory(chat.userId).subscribe(msgs => {
      this.messages = msgs;
      this.chatService.markAsRead(chat.userId).subscribe(() => {
        chat.unreadCount = 0;
      });
    });
  }

  // Bắt đầu chat mới với người chưa từng nhắn tin
  startNewChat(user: AvailableUserDto): void {
    // Kiểm tra xem đã có trong recent chưa
    const existing = this.recentChats.find(c => c.userId === user.userId);
    if (existing) {
      this.selectUser(existing);
    } else {
      // Tạo giả một RecentChatDto để mở khung chat
      const newChat: RecentChatDto = {
        userId: user.userId,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        lastMessage: '',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        isOnline: false
      };
      this.recentChats.unshift(newChat);
      this.selectUser(newChat);
    }
    this.showUserPicker = false;
  }

  sendMessage(): void {
    if ((!this.newMessage.trim() && !this.isUploading) || !this.selectedUser) return;

    const content = this.newMessage.trim();
    this.newMessage = '';

    this.chatService.sendMessage(this.selectedUser.userId, content)
      .catch(err => console.error(err));
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && this.selectedUser) {
      this.isUploading = true;
      this.chatService.uploadAttachment(file).subscribe({
        next: (res) => {
          this.chatService.sendMessage(this.selectedUser!.userId, `Đã gửi tệp: ${res.fileName}`, res.url, res.fileType)
            .then(() => this.isUploading = false);
        },
        error: () => this.isUploading = false
      });
    }
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}