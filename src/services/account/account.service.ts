import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account, LoginRes } from './account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClient) {}

  login(account: Account) {
    return this.http.post<LoginRes>('api/login', account);
  }
}
