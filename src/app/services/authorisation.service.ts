import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export enum Status {
  ok = "ok",
  error = 'error',
}

@Injectable({
  providedIn: 'root'
})
export class AuthorisationService {

  private emailsArr = ['qwe@mail.ru', 'asd@mail.ru', 'zxc@mail.ru'];

  constructor() { }


  public validateName(name: string): Observable<boolean> {

    if (name === 'John') {console.log(name); return of(true)}
    else {return of(false);}
  }

  public validateEmail(email: string): Observable<Status> {
    console.log(email);
    if (this.emailsArr.includes(email)) return of(Status.error);
    else return of(Status.ok);
  }

}
