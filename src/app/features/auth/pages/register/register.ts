import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../../../core/auth/auth';
import { passwordsMatchValidator } from '../../../projects/validators/passwords-match.validators';

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  protected readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: [passwordsMatchValidator] },
  );

  protected readonly registerFailed = signal(false);
  protected readonly submitting = signal(false);

  protected get emailCtrl() { return this.form.controls.email; }
  protected get nameCtrl() { return this.form.controls.name; }
  protected get passwordCtrl() { return this.form.controls.password; }
  protected get confirmCtrl() { return this.form.controls.confirmPassword; }

  onSubmit(): void {
    if (this.form.invalid || this.form.pending) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const { name, email, password } = this.form.getRawValue();

    this.authService.register({ name, email, password }).subscribe({
      // Pas de session créée : on redirige vers /login pour que
      // l'utilisateur s'authentifie avec ses identifiants.
      next: () => this.router.navigate(['/login'], {
        queryParams: { registered: '1', email },
      }),
      error: () => {
        this.registerFailed.set(true);
        this.submitting.set(false);
      },
    });
  }
}
