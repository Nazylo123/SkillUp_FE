import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";

export interface Document {
  id: number;
  name: string;
  size: string;
  uploadDate: Date;
  type: string;
}

@Component({
    selector: 'document-dialog',
    templateUrl: './document-dialog.component.html',
    styleUrls: ['./document-dialog.component.scss'],
    imports: [CommonModule, MatButtonModule, MatIcon, MatFormFieldModule, MatInputModule, FormsModule, MatDialogModule, MatDividerModule, MatTooltipModule]
})
export class DocumentDialog {
    documents: Document[] = [
      {
        id: 1,
        name: 'Angular Fundamentals.pdf',
        size: '2.5 MB',
        uploadDate: new Date('2024-01-15'),
        type: 'pdf'
      },
      {
        id: 2,
        name: 'Course Outline.docx',
        size: '1.2 MB',
        uploadDate: new Date('2024-01-14'),
        type: 'doc'
      },
      {
        id: 3,
        name: 'Student Guidelines.pdf',
        size: '800 KB',
        uploadDate: new Date('2024-01-13'),
        type: 'pdf'
      }
    ];

    filteredDocuments: Document[] = [...this.documents];
    selectedFiles: File[] = [];
    searchTerm = '';
    isDragOver = false;
    isUploading = false;

    constructor(
        public dialogRef: MatDialogRef<DocumentDialog>
    ) {}

    ngOnInit() {
      this.filterDocuments();
    }

    onDragOver(event: DragEvent) {
      event.preventDefault();
      this.isDragOver = true;
    }

    onDragLeave(event: DragEvent) {
      event.preventDefault();
      this.isDragOver = false;
    }

    onDrop(event: DragEvent) {
      event.preventDefault();
      this.isDragOver = false;
      
      const files = Array.from(event.dataTransfer?.files || []) as File[];
      this.handleFiles(files);
    }

    onFileSelect(event: any) {
      const files = Array.from(event.target.files || []) as File[];
      this.handleFiles(files);
    }

    private handleFiles(files: File[]) {
      const validTypes = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt', '.xlsx', '.xls'];
      const validFiles = files.filter(file => {
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        return validTypes.includes(extension);
      });

      this.selectedFiles.push(...validFiles);
    }

    removeSelectedFile(index: number) {
      this.selectedFiles.splice(index, 1);
    }

    clearSelectedFiles() {
      this.selectedFiles = [];
    }

    uploadFiles() {
      if (this.selectedFiles.length === 0) return;
      
      this.isUploading = true;
      
      // Simulate upload process
      setTimeout(() => {
        this.selectedFiles.forEach(file => {
          const newDoc: Document = {
            id: this.documents.length + 1,
            name: file.name,
            size: this.formatFileSize(file.size),
            uploadDate: new Date(),
            type: this.getFileType(file.name)
          };
          this.documents.unshift(newDoc);
        });
        
        this.selectedFiles = [];
        this.isUploading = false;
        this.filterDocuments();
      }, 2000);
    }

    deleteDocument(id: number) {
      if (confirm('Are you sure you want to delete this document?')) {
        this.documents = this.documents.filter(doc => doc.id !== id);
        this.filterDocuments();
      }
    }

    downloadDocument(doc: Document) {
      // Simulate download
      console.log('Downloading document:', doc.name);
    }

    previewDocument(doc: Document) {
      // Simulate preview
      console.log('Previewing document:', doc.name);
    }

    filterDocuments() {
      if (!this.searchTerm.trim()) {
        this.filteredDocuments = [...this.documents];
      } else {
        this.filteredDocuments = this.documents.filter(doc =>
          doc.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }
    }

    getFileType(fileName: string): string {
      const extension = fileName.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'pdf': return 'pdf';
        case 'doc':
        case 'docx': return 'doc';
        case 'xls':
        case 'xlsx': return 'excel';
        case 'ppt':
        case 'pptx': return 'ppt';
        default: return 'file';
      }
    }

    formatFileSize(bytes: number): string {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    close() {
        this.dialogRef.close();
    }
}