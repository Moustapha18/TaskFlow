import { Component, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  selector: 'app-comment-form',
  styleUrl: './comment-form.scss',
  templateUrl: './comment-form.html',
})
export class CommentForm {
  private fb = new FormBuilder();

  /** Empêche l'envoi si l'utilisateur n'est pas connecté. */
  disabled = input(false);

  submitted = output<string>();

  protected readonly form = this.fb.nonNullable.group({
    content: ['', [Validators.required, Validators.maxLength(500)]],
  });

  protected readonly sending = signal(false);

  onSubmit(): void {
    if (this.form.invalid || this.disabled()) {
      this.form.markAllAsTouched();
      return;
    }
    const { content } = this.form.getRawValue();
    this.submitted.emit(content.trim());
    this.form.reset({ content: '' });
  }
}
