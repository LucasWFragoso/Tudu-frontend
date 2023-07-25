import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../service/user.service';

interface AuthForm {
  email: FormControl<string>;
  password: FormControl<string>;
  password_confirmation?: FormControl<string>;
  name?: FormControl<string>;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy{
  authType= 'login';
  title = '';
  isSubmiting = false;
  authForm: FormGroup<AuthForm>;
  destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService
  ) {
    
    this.authForm = new FormGroup<AuthForm>({
      email: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
      password: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  toggleForm(): void {
    this.authType = this.authType === 'login' ? 'register' : 'login';
    this.title = this.authType === 'login' ? 'Entrar' : 'Cadastrar';
    
    if (this.authType === 'register') {
      this.authForm.addControl(
        'password_confirmation',
        new FormControl('', {
          validators: [Validators.required],
          nonNullable: true,
        })
      );
    } else {
      this.authForm.removeControl('password_confirmation');
    }
  }

  ngOnInit(): void {
    this.title = this.authType === 'login' ? 'Entrar' : 'Cadastrar';
    if (this.authType === 'register') {
      this.authForm.addControl(
        'password_confirmation',
        new FormControl('', {
          validators: [Validators.required],
          nonNullable: true,
        })
      );
    }
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(): void {
    this.isSubmiting = true;

    let observable =
      this.authType === 'login'
        ? this.userService.login(
            this.authForm.value as { email: string; password: string }
          )
        : this.userService.register(
            this.authForm.value as {
              email: string;
              password: string;
              password_confirmation: string;
            }
          );

    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => void this.router.navigate(["/"]),
      error: (err) => {
        this.isSubmiting = false;
      },
    });
  }
}
