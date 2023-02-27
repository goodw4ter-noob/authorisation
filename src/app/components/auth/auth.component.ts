import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { auditTime, debounceTime, fromEvent, map, Observable, of, Subscription, tap } from 'rxjs';
import { AuthorisationService, Status } from 'src/app/services/authorisation.service';
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
    return (control: AbstractControl<string>): Observable<ValidationErrors | null> => {
      return this.authService.validateName(control.value)
        .pipe(
          untilDestroyed(this),
          map(data => {
            if (data === true) return { key: 'The name is already taken' }
            else return null;
          })
        )
    }
  }

  private asyncEmailValidation(): AsyncValidatorFn {
    return (control: AbstractControl<string>): Observable<ValidationErrors | null> => {
      return this.authService.validateEmail(control.value)
        .pipe(
          untilDestroyed(this),
          map((data: Status) => {
            if (data === Status.error) return { key: 'The email already exists!' }
            else return null
          })
        )
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
