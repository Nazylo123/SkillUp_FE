import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import * as signalR from '@microsoft/signalr';
import { TokenService } from '../context/token.service';

export interface ChatMessageDto {
  id: number;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  receiverId: number;
  content: string;
  attachmentUrl?: string;
  attachmentType?: string;
  isRead: boolean;
  createdAt: string;
}

export interface RecentChatDto {
  userId: number;
  fullName: string;
  avatarUrl?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

export interface AvailableUserDto {
  userId: number;
  fullName: string;
  avatarUrl?: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.baseUrl.SKILL_UP}/Chat`;
  private hubUrl = environment.baseUrl.SKILL_UP.replace('/api', '/chathub');
  private hubConnection?: signalR.HubConnection;
  private isBrowser: boolean;

  // Observables for components to subscribe
  private messageReceivedSource = new BehaviorSubject<ChatMessageDto | null>(null);
  public messageReceived$ = this.messageReceivedSource.asObservable();

  private userStatusSource = new BehaviorSubject<{ userId: number, isOnline: boolean } | null>(null);
  public userStatus$ = this.userStatusSource.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // --- HTTP APIs ---

  getHistory(otherUserId: number): Observable<ChatMessageDto[]> {
    return this.http.get<ChatMessageDto[]>(`${this.apiUrl}/history/${otherUserId}`);
  }

  getRecentChats(): Observable<RecentChatDto[]> {
    return this.http.get<RecentChatDto[]>(`${this.apiUrl}/recent`);
  }

  getAvailableUsers(): Observable<AvailableUserDto[]> {
    return this.http.get<AvailableUserDto[]>(`${this.apiUrl}/available-users`);
  }

  markAsRead(senderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/mark-read/${senderId}`, {});
  }

  uploadAttachment(file: File): Observable<{ url: string, fileName: string, fileType: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string, fileName: string, fileType: string }>(`${this.apiUrl}/upload`, formData);
  }

  // --- SignalR ---

  public startConnection(): void {
    if (!this.isBrowser) return;

    const token = this.tokenService.getToken();
    if (!token) return;

    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Chat Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));

    this.hubConnection.on('ReceiveMessage', (message: ChatMessageDto) => {
      this.messageReceivedSource.next(message);
    });

    this.hubConnection.on('UserStatusChanged', (userId: number, isOnline: boolean) => {
      this.userStatusSource.next({ userId, isOnline });
    });
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  public sendMessage(receiverId: number, content: string, attachmentUrl?: string, attachmentType?: string): Promise<void> {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      return this.hubConnection.invoke('SendMessage', receiverId, content, attachmentUrl, attachmentType);
    }
    return Promise.reject('Connection not established');
  }
}
