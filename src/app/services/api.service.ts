import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Character {
  id: number;
  name: string;
  element: number;

  // Map at UI
  elementName?: string;
}

export interface LoginRes {
  valid: boolean;
}

export interface Account {
  username: string;
  password: string;
}

export interface Element {
  id: number;
  name: string;
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
    console.log('😎 ~ character', character);
    return this.http.put<Character[]>(`api/char/${character.id}`, character);
  }

  deleteCharacter(id: number) {
    return this.http.delete(`api/char/${id}`);
  }

  login(account: Account) {
    return this.http.post<LoginRes>('api/login', account);
  }

  getElement(): Observable<Element[]> {
    return this.http.get<Element[]>('api/element');
  }
}
