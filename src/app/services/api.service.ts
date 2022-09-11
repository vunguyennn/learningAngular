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
    return this.http.get<Character[]>(
      'https://pendo-api.herokuapp.com/api/char'
    );
  }

  postCharacter(character: Character) {
    return this.http.post<Character[]>(
      'https://pendo-api.herokuapp.com/api/char',
      character
    );
  }

  updateCharacter(character: Character) {
    return this.http.patch<Character[]>(
      'https://pendo-api.herokuapp.com/api/char',
      character
    );
  }

  deleteCharacter(name: string) {
    return this.http.delete(`https://pendo-api.herokuapp.com/api/char/${name}`);
  }

  login(account: Account) {
    return this.http.post<LoginRes>(
      'https://pendo-api.herokuapp.com/api/login',
      account
    );
  }
}
