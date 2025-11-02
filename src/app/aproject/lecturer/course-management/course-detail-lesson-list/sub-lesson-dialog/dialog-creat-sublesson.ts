import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { Validators } from "@angular/forms";
import { Inject } from "@angular/core";

@Component({
    selector: 'create-sublesson',
    templateUrl: './dialog-create-sublesson.html',
    styleUrls: ['./dialog-create-sublesson.scss'],
    imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIcon, ReactiveFormsModule, FormsModule]
})
export class CreateSubLesson {
    subLessonForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<CreateSubLesson>, 
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder
    ) {
        this.subLessonForm = this.fb.group({
            name: [data.subLesson?.name || '', Validators.required],
            description: [data.subLesson?.description || ''],
            duration: [data.subLesson?.duration || '', Validators.required],
            videoUrl: [data.subLesson?.videoUrl || '']
        });
    }

    ngOnInit() {
        console.log('SubLesson dialog data:', this.data);
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.subLessonForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    onSubmit(): void {
        if (this.subLessonForm.valid) {
            this.dialogRef.close(this.subLessonForm.value);
        } else {
            // Mark all fields as touched to show validation errors
            Object.keys(this.subLessonForm.controls).forEach(key => {
                this.subLessonForm.get(key)?.markAsTouched();
            });
        }
    }

    close(): void {
        this.dialogRef.close();
    }
}
