import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QuizService } from '../../../../services/quiz.service';
import { QuizCreateRequest, Question, AnswerOption } from '../../../../models/quiz.models';
import { QuestionType } from '../../../../enums/api.enums';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-quiz-creator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './quiz-creator.component.html',
  styleUrls: ['./quiz-creator.component.scss']
})
export class QuizCreatorComponent implements OnInit {
  quizForm: FormGroup;
  QuestionType = QuestionType;
  courseId: number | null = null;
  existingQuizId: number | null = null;
  isEditMode = false;
  isLoading = false;
  isSubmitting = false;
  isPopulatingForm = false; // Flag to prevent duplicate answers during form population
  private lastSubmitTime = 0; // Track last submit timestamp

  questionTypes = [
    { value: QuestionType.SINGLE_CHOICE, label: 'One answer correct' },
    { value: QuestionType.MULTIPLE_CHOICE, label: 'Multi answer correct' },
    { value: QuestionType.TRUE_FALSE, label: 'True/False' },
    { value: QuestionType.TEXT, label: 'Text' }
  ];

  constructor(
    private fb: FormBuilder,
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      attemptLimit: [1, [Validators.required, Validators.min(1)]],
      passScore: [70, [Validators.required, Validators.min(0), Validators.max(100)]],
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Get courseId from route params
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.courseId = parseInt(id, 10);
        this.loadExistingQuiz();
      }
    });
  }

  /**
   * Load existing quiz for this course (if exists)
   */
  private loadExistingQuiz(): void {
    if (!this.courseId) return;

    this.isLoading = true;
    this.quizService.getQuizByCourseId(this.courseId).subscribe({
      next: (quiz) => {
        console.log('Existing quiz found:', quiz);
        this.existingQuizId = quiz.quizId;
        this.isEditMode = true;
        this.populateForm(quiz);
        this.isLoading = false;
      },
      error: (error) => {
        // 404 means no quiz exists yet (CREATE mode)
        if (error.status === 404) {
          console.log('No existing quiz found. CREATE mode.');
          this.isEditMode = false;
        } else {
          console.error('Error loading quiz:', error);
          this.snackBar.open('⚠️ Error loading quiz. You can still create a new one.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
        this.isLoading = false;
      }
    });
  }

  /**
   * Populate form with existing quiz data
   */
  private populateForm(quiz: any): void {
    this.isPopulatingForm = true; // Start populating

    // Set basic quiz info
    this.quizForm.patchValue({
      title: quiz.title,
      passScore: quiz.passScore,
      attemptLimit: quiz.attemptLimit
    });

    // Clear existing questions
    while (this.questions.length) {
      this.questions.removeAt(0);
    }

    // Populate questions
    if (quiz.questions && quiz.questions.length > 0) {
      quiz.questions.forEach((q: any) => {
        const questionGroup = this.fb.group({
          questionId: [q.questionId], // Store question ID for update/delete
          type: [q.questionType, Validators.required],
          question: [q.title, Validators.required],
          answers: this.fb.array([]),
          textAnswer: ['']
        });

        // Add question to form
        this.questions.push(questionGroup);
        const questionIndex = this.questions.length - 1;

        // Populate answers
        if (q.answerOptions && q.answerOptions.length > 0) {
          q.answerOptions.forEach((option: any) => {
            const answerGroup = this.fb.group({
              text: [option.content, Validators.required],
              isCorrect: [option.isCorrect]
            });
            this.getAnswers(questionIndex).push(answerGroup);
          });

          // For text questions, set textAnswer
          if (q.questionType === QuestionType.TEXT && q.answerOptions[0]) {
            questionGroup.patchValue({
              textAnswer: q.answerOptions[0].content
            });
          }
        }
      });
    }

    this.isPopulatingForm = false; // Done populating
  }

  /**
   * Generate unique name for radio buttons to prevent crosstalk between questions
   * Each question needs a unique radio group name
   */
  getName(questionIndex: number): string {
    return `question-${questionIndex}-answer`;
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  getAnswers(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('answers') as FormArray;
  }

  addQuestion(): void {
    const questionGroup = this.fb.group({
      questionId: [null], // New question - no ID yet
      type: [QuestionType.SINGLE_CHOICE, Validators.required],
      question: ['', Validators.required],
      answers: this.fb.array([]),
      textAnswer: ['']
    });

    this.questions.push(questionGroup);
    const newQuestionIndex = this.questions.length - 1;

    console.log(`✅ Added Question ${newQuestionIndex + 1}`);

    this.addAnswer(newQuestionIndex, '', true);
    this.addAnswer(newQuestionIndex);

    console.log(`   Initial answers added: ${this.getAnswers(newQuestionIndex).length}`);
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  onQuestionTypeChange(questionIndex: number): void {
    // Skip if we're currently populating the form from backend data
    if (this.isPopulatingForm) {
      return;
    }

    const question = this.questions.at(questionIndex);
    const type = question.get('type')?.value;
    const answers = this.getAnswers(questionIndex);

    answers.clear();

    if (type === QuestionType.TRUE_FALSE) {
      this.addAnswer(questionIndex, 'True', true);
      this.addAnswer(questionIndex, 'False');
    } else if (type === QuestionType.TEXT) {
      question.get('textAnswer')?.setValidators([Validators.required]);
      question.get('textAnswer')?.updateValueAndValidity();
    } else {
      question.get('textAnswer')?.clearValidators();
      question.get('textAnswer')?.updateValueAndValidity();
      this.addAnswer(questionIndex, "", true);
      this.addAnswer(questionIndex);
    }
  }

  addAnswer(questionIndex: number, defaultValue: string = '', isCorrect: boolean = false): void {
    const answers = this.getAnswers(questionIndex);
    const answerGroup = this.fb.group({
      text: [defaultValue, Validators.required],
      isCorrect: [isCorrect]
    });

    answers.push(answerGroup);
  }

  removeAnswer(questionIndex: number, answerIndex: number): void {
    const answers = this.getAnswers(questionIndex);
    if (answers.length > 1) {
      answers.removeAt(answerIndex);
    }
  }

  onSingleChoiceChange(questionIndex: number, answerIndex: number): void {
    const answers = this.getAnswers(questionIndex);
    answers.controls.forEach((answer, index) => {
      answer.get('isCorrect')?.setValue(index === answerIndex);
    });
  }

  canAddAnswer(questionIndex: number): boolean {
    const question = this.questions.at(questionIndex);
    const type = question.get('type')?.value;
    return type === QuestionType.SINGLE_CHOICE || type === QuestionType.MULTIPLE_CHOICE;
  }

  canRemoveAnswer(questionIndex: number): boolean {
    const answers = this.getAnswers(questionIndex);
    return answers.length > 1;
  }

  isTextQuestion(questionIndex: number): boolean {
    const question = this.questions.at(questionIndex);
    return question.get('type')?.value === QuestionType.TEXT;
  }

  isTrueFalseQuestion(questionIndex: number): boolean {
    const question = this.questions.at(questionIndex);
    return question.get('type')?.value === QuestionType.TRUE_FALSE;
  }

  isSingleChoice(questionIndex: number): boolean {
    const question = this.questions.at(questionIndex);
    return question.get('type')?.value === QuestionType.SINGLE_CHOICE;
  }

  onSubmit(): void {
    // Prevent double submit
    if (this.isSubmitting) {
      console.log('Submit already in progress, ignoring...');
      return;
    }

    // Debounce: Prevent multiple submits within 1 second
    const now = Date.now();
    if (now - this.lastSubmitTime < 1000) {
      console.log('Submitting too fast, ignoring...');
      return;
    }
    this.lastSubmitTime = now;

    if (this.quizForm.valid && this.questions.length > 0) {
      if (!this.courseId) {
        this.snackBar.open('❌ Course ID is missing. Please access this page from a course.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      this.isSubmitting = true;
      const formValue = this.quizForm.value;

      // DEBUG: Log form data before submit
      console.log('📋 Form value before submit:', formValue);
      console.log('📋 Total questions in form:', formValue.questions.length);
      formValue.questions.forEach((q: any, idx: number) => {
        console.log(`   Q${idx + 1}: ${q.question} | Answers: ${q.answers?.length || 0} | QuestionId: ${q.questionId}`);
      });

      if (this.isEditMode && this.existingQuizId) {
        // EDIT MODE: Update quiz info + update each question separately
        this.updateExistingQuiz(formValue);
      } else {
        // CREATE MODE: Create quiz with all questions at once
        const quizRequest: QuizCreateRequest = {
          courseId: this.courseId,
          title: formValue.title,
          passScore: formValue.passScore,
          attemptLimit: formValue.attemptLimit,
          questions: this.transformQuestionsToAPI(formValue.questions)
        };

        console.log('Creating quiz:', quizRequest);

        this.quizService.createQuiz(quizRequest).subscribe({
          next: (response) => {
            console.log('✅ Quiz created successfully:', response);
            this.isSubmitting = false;

            this.snackBar.open(
              `✅ Quiz "${response.title}" created successfully with ${response.questions.length} questions!`,
              'Close',
              { duration: 3000, panelClass: ['success-snackbar'] }
            );

            // Navigate back to course detail immediately
            console.log(`🔄 Navigating to: /lecturer/courses/${this.courseId}`);
            this.router.navigate(['/lecturer/courses', this.courseId]).then(
              success => console.log('✅ Navigation success:', success),
              error => console.error('❌ Navigation error:', error)
            );
          },
          error: (error) => {
            console.error('Error creating quiz:', error);
            this.isSubmitting = false;

            const errorMessage = error.error?.message || error.message || 'Failed to create quiz';
            this.snackBar.open(`❌ Error: ${errorMessage}`, 'Close', {
              duration: 7000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    } else {
      // Validation errors
      let errorMessage = '⚠️ Please fix the following issues:\n\n';

      if (this.questions.length === 0) {
        errorMessage += '• Add at least one question\n';
      }

      if (this.quizForm.get('title')?.hasError('required')) {
        errorMessage += '• Quiz title is required\n';
      }

      if (this.quizForm.get('attemptLimit')?.hasError('required')) {
        errorMessage += '• Attempt limit is required\n';
      }

      if (this.quizForm.get('passScore')?.hasError('required')) {
        errorMessage += '• Pass score is required\n';
      }

      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      this.markFormGroupTouched(this.quizForm);
    }
  }

  /**
   * Update existing quiz (EDIT MODE)
   * Step 1: Update quiz info (title, passScore, attemptLimit)
   * Step 2: Delete removed questions
   * Step 3: Use batch API to update existing questions and create new questions
   */
  private updateExistingQuiz(formValue: any): void {
    console.log('🚀 NEW CODE: Using batch API for CREATE, individual UPDATE');

    if (!this.existingQuizId) {
      console.error('No quiz ID for update');
      this.isSubmitting = false;
      return;
    }

    // Step 1: Update quiz basic info (without questions)
    const quizInfoUpdate = {
      courseId: this.courseId!,
      title: formValue.title,
      passScore: formValue.passScore,
      attemptLimit: formValue.attemptLimit,
      questions: [] // Backend expects this but won't update it
    };

    console.log('Step 1: Updating quiz info:', quizInfoUpdate);

    this.quizService.updateQuiz(this.existingQuizId, quizInfoUpdate).subscribe({
      next: async (quizResponse) => {
        console.log('✅ Quiz info updated:', quizResponse);

        // Step 2: Handle add/update/delete questions
        const formQuestions = formValue.questions;
        const existingQuestionIds = quizResponse.questions.map((q: any) => q.questionId);
        const formQuestionIds = formQuestions.map((q: any) => q.questionId).filter((id: any) => id != null);

        console.log('Step 2: Syncing questions...');
        console.log('Existing question IDs:', existingQuestionIds);
        console.log('Form question IDs:', formQuestionIds);

        try {
          // 1. Delete removed questions (individual DELETE calls)
          const questionsToDelete = existingQuestionIds.filter(id => !formQuestionIds.includes(id));
          if (questionsToDelete.length > 0) {
            console.log(`Deleting ${questionsToDelete.length} questions:`, questionsToDelete);
            const deletePromises = questionsToDelete.map(questionId =>
              firstValueFrom(this.quizService.deleteQuestion(questionId))
            );
            await Promise.all(deletePromises);
            console.log('✅ Deleted questions successfully');
          }

          // 2. Separate questions into UPDATE vs CREATE
          const questionsToUpdate: Question[] = [];
          const questionsToCreate: Question[] = [];

          formQuestions.forEach((formQ: any, index: number) => {
            const questionData = this.transformSingleQuestionToAPI(formQ, index);

            if (formQ.questionId) {
              // Existing question - UPDATE
              questionData.questionId = formQ.questionId;
              questionData.quizId = this.existingQuizId!;
              questionsToUpdate.push(questionData);
            } else {
              // New question - CREATE
              questionData.quizId = this.existingQuizId!;
              questionsToCreate.push(questionData);
            }
          });

          console.log(`Step 3: Batch updating ${questionsToUpdate.length} questions and creating ${questionsToCreate.length} questions`);

          // 3. Use individual UPDATE API for existing questions (not batch)
          // Reason: Batch API handles both CREATE and UPDATE, but we need them separate to avoid duplicates
          if (questionsToUpdate.length > 0) {
            console.log(`Updating ${questionsToUpdate.length} existing questions individually:`);
            const updatePromises = questionsToUpdate.map(question => {
              console.log(`  UPDATE Request - Question ${question.questionId}:`, {
                title: question.title,
                type: question.questionType,
                answersCount: question.answerOptions.length,
                answers: question.answerOptions
              });
              return firstValueFrom(this.quizService.updateQuestion(question.questionId!, question));
            });

            const updateResponses = await Promise.all(updatePromises);

            console.log('✅ Updated existing questions successfully');
            updateResponses.forEach((response: any, idx: number) => {
              console.log(`  UPDATE Response Q${idx + 1}: ID=${response.questionId}, Answers=${response.answerOptions?.length || 0}`);
            });
          }

          // 4. Use individual CREATE API for new questions (WORKAROUND: batch API has duplicate bug)
          if (questionsToCreate.length > 0) {
            console.log(`Creating ${questionsToCreate.length} new questions individually (batch API has duplicate bug):`);
            questionsToCreate.forEach((q, idx) => {
              console.log(`  New Q${idx + 1}:`, {
                title: q.title,
                type: q.questionType,
                answersCount: q.answerOptions.length,
                answers: q.answerOptions
              });
            });

            const createPromises = questionsToCreate.map((question, idx) => {
              console.log(`  Creating question ${idx + 1}:`, question);
              return firstValueFrom(this.quizService.createQuestion(this.existingQuizId!, question));
            });

            const createResponses = await Promise.all(createPromises);

            console.log('✅ Individual create responses from backend:', createResponses);
            createResponses.forEach((q: any, idx: number) => {
              console.log(`  Response Q${idx + 1}: ID=${q.questionId}, Answers=${q.answerOptions?.length || 0}`);
            });
          }

          // All done!
          console.log('✅ All questions synced successfully');
          this.isSubmitting = false;

          this.snackBar.open(
            `✅ Quiz "${quizResponse.title}" updated successfully with ${formQuestions.length} questions!`,
            'Close',
            { duration: 3000, panelClass: ['success-snackbar'] }
          );

          // Navigate back to course detail
          console.log(`🔄 Navigating to: /lecturer/courses/${this.courseId}`);
          this.router.navigate(['/lecturer/courses', this.courseId]).then(
            success => console.log('✅ Navigation success:', success),
            error => console.error('❌ Navigation error:', error)
          );

        } catch (error: any) {
          console.error('Error updating questions:', error);
          this.isSubmitting = false;

          const errorMessage = error?.error?.message || error?.message || 'Failed to update questions';
          this.snackBar.open(`❌ Error: ${errorMessage}`, 'Close', {
            duration: 7000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (error) => {
        console.error('Error updating quiz info:', error);
        this.isSubmitting = false;

        const errorMessage = error.error?.message || error.message || 'Failed to update quiz';
        this.snackBar.open(`❌ Error: ${errorMessage}`, 'Close', {
          duration: 7000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  /**
   * Transform a single form question to API format
   */
  private transformSingleQuestionToAPI(formQuestion: any, orderIndex: number): Question {
    const question: Question = {
      title: formQuestion.question,
      questionType: formQuestion.type,
      points: 1,
      orderIndex: orderIndex,
      answerOptions: []
    };

    // Transform answers to API format
    if (formQuestion.type === QuestionType.TEXT) {
      question.answerOptions = [{
        content: formQuestion.textAnswer || '',
        isCorrect: true
      }];
    } else {
      question.answerOptions = formQuestion.answers.map((answer: any) => ({
        content: answer.text,
        isCorrect: answer.isCorrect
      }));
    }

    return question;
  }

  /**
   * Transform form questions to API format
   */
  private transformQuestionsToAPI(formQuestions: any[]): Question[] {
    return formQuestions.map((q, index) => {
      const question: Question = {
        title: q.question,
        questionType: q.type,
        points: 1, // Default 1 point per question
        orderIndex: index,
        answerOptions: []
      };

      // Transform answers to API format
      if (q.type === QuestionType.TEXT) {
        // For text questions, create one answer option with the correct answer
        question.answerOptions = [{
          content: q.textAnswer || '',
          isCorrect: true
        }];
      } else {
        // For choice questions, map answers
        question.answerOptions = q.answers.map((answer: any) => ({
          content: answer.text,
          isCorrect: answer.isCorrect
        }));
      }

      // Debug log to check for duplicates
      console.log(`Question ${index}:`, {
        title: question.title,
        type: question.questionType,
        answersCount: question.answerOptions.length,
        answers: question.answerOptions
      });

      return question;
    });
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }
}