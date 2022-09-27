import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  firstValueFrom,
  Observable,
  Subject,
  tap,
} from 'rxjs';
import { Character, UploadImageReq } from './character.model';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  // private characters: Character[] = [];
  private characters$ = new BehaviorSubject(null); // set init value
  // private characters$ = new Subject(); // get init value from api
  characters$$ = this.characters$.asObservable() as Observable<Character[]>;
  setCharacters(characters: Character[]) {
    this.characters$.next(characters);
  }

  private activeCharacter$ = new BehaviorSubject(null);
  activeCharacter$$ = this.activeCharacter$.asObservable();
  async setActiveCharacter(id: number) {
    const characters = await firstValueFrom(this.characters$$);
    const activeCharacter = characters.find((c) => c.id === id);
    this.activeCharacter$.next(activeCharacter);
  }

  constructor(private http: HttpClient) {}

  // http.get<Character[]> ==> the api returns Character[]
  getCharacters(): Observable<Character[]> {
    return this.http
      .get<Character[]>('api/char')
      .pipe(tap((characters) => this.setCharacters(characters)));
  }

  postCharacter(character: Character) {
    return this.http.post<Character[]>('api/char', character);
  }

  updateCharacter(character: Character) {
    return this.http.put<Character[]>(`api/char/${character.id}`, character);
  }

  deleteCharacter(id: number) {
    return this.http.delete<Character[]>(`api/char/${id}`);
  }

  deleteAllCharacters() {
    return this.http.delete<Character[]>(`api/char`);
  }

  uploadImage(data: Partial<UploadImageReq>) {
    return this.http.post('api/char/image', data);
  }
}
