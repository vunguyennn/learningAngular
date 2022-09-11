import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Character {
  name: string;
  element: string;
}

export interface LoginRes {
  valid: boolean;
}

export interface Account {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getCharacters(): Observable<Character[]> {
    return this.http.get<Character[]>('api/char');
  }

  postCharacter(character: Character) {
    return this.http.post<Character[]>('api/char', character);
  }

  updateCharacter(character: Character) {
    return this.http.patch<Character[]>('api/char', character);
  }

  deleteCharacter(name: string) {
    return this.http.delete(`api/char/${name}`);
  }

  login(account: Account) {
    return this.http.post<LoginRes>('api/login', account);
  }
}