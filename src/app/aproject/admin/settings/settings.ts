import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class SettingsComponent implements OnInit {
  aiSettings = {
    provider: 'Ollama',
    ollamaModelName: 'llama3.2',
    openRouterModelName: 'google/gemini-2.0-flash-lite-preview-02-05:free',
    apiKey: ''
  };
  
  isLoading = false;
  showApiKey = false;

  constructor(
    private settingsService: SettingsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAiSettings();
  }

  loadAiSettings(): void {
    this.isLoading = true;
    this.settingsService.getAiSettings().subscribe({
      next: (data) => {
        if (data) {
           this.aiSettings = {
             provider: data.provider || 'Ollama',
             ollamaModelName: data.ollamaModelName || 'llama3.2',
             openRouterModelName: data.openRouterModelName || 'google/gemini-2.0-flash-lite-preview-02-05:free',
             apiKey: data.apiKey || ''
           };
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load AI settings', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  saveAiSettings(): void {
    if (this.aiSettings.provider === 'OpenRouter' && (!this.aiSettings.apiKey || this.aiSettings.apiKey.trim() === '')) {
      this.snackBar.open('API key cannot be empty when OpenRouter is selected', 'Close', { duration: 3000 });
      return;
    }

    if (!confirm('Update System AI Config?')) {
      return;
    }

    this.isLoading = true;
    this.settingsService.updateAiSettings(this.aiSettings).subscribe({
      next: (data) => {
        this.aiSettings.apiKey = data.apiKey || '';
        this.snackBar.open('AI Configuration updated successfully', 'Close', { duration: 3000 });
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to update AI settings', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
}
