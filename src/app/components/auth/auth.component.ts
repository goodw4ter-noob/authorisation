import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, of, Subscription, tap } from 'rxjs';
import { AuthorisationService } from 'src/app/services/authorisation.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';


@UntilDestroy()
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  public validateForm!: FormGroup;

  constructor(private authService: AuthorisationService) {
    this.validateForm = this.formBuilder();
  }

  public ngOnDestroy(): void {

  }

  public ngOnInit(): void {
    this.test();
  }

  public submitForm() {

  }

  private getAsyncPromise(): Promise<number> {
    return new Promise(res => {
      res(1);
    })
  }

  private async test() {
    const num = await this.getAsyncPromise();
    console.log(num);
  }

  private userNameAsyncValidation(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      let response!: Observable<ValidationErrors | null>;

      this.authService.validateName(control.value)
        .pipe(
          tap(data => console.log(data)),
          untilDestroyed(this))
        .subscribe({
          next: data => {
            if (data) response = of({ key: 'The name is already taken' });
            else response = of(null);
          },
          error: err => console.log(err),
          complete: () => console.log('done!')
        })

      return response;
    }
  }

  private asyncEmailValidation(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      let response!: Observable<ValidationErrors | null>;

      this.authService.validateEmail(control.value)
        .pipe(untilDestroyed(this))
        .subscribe(res => {
          if (res) {
            response = of({ key: 'The email already exists' });
          } else {
            response = of(null);
          }
        })

      return response;
    }
  }

  private formBuilder() {
    const form = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        asyncValidators: this.asyncEmailValidation(),
      }),
      user: new FormControl('', {
        validators: [Validators.required],
        asyncValidators: this.userNameAsyncValidation(),
      }),
      remember: new FormControl(true),
    })

    return form;
  }


}
