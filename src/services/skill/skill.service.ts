import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Skill } from './skill.model';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private skill$ = new BehaviorSubject<Skill[]>(null);
  skill$$ = this.skill$.asObservable();

  setSkill(skill: Skill[]) {
    this.skill$.next(skill);
  }

  constructor(private http: HttpClient) {}

  getSkill() {
    return this.http
      .get<Skill[]>('api/skill')
      .pipe(tap((skill) => this.setSkill(skill)));
  }
}
