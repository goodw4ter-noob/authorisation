import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorisationService {

  private emailsArr = ['qwe@mail.ru', 'asd@mail.ru', 'zxc@mail.ru'];

  constructor() { }

  public validateName(name: string): Observable<boolean> {
    if (name === 'John') return of(true);
    else return of(false);
  }

  public validateEmail(email: string): Observable<boolean> {
    if (this.emailsArr.includes(email)) return of(true);
    else return of(false);
  }

}
