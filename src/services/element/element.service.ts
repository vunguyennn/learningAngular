import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { Element } from './element.model';

@Injectable({
  providedIn: 'root',
})
export class ElementService {
  // private elements: Element[] = [];
  private elements$ = new BehaviorSubject(null);
  // private elements$ = new Subject<Element[]>();

  //! Change from behavior subject to subject bz
  //! behavior subject: emit initialize data [] (set at line 10) -> trigger the combine latest operator with []
  //! subject: emit the first data that set from API call (at line 41) -> trigger ... with data

  // selectElements() {
  //   return this.elements$.asObservable();
  // }
  // OR I often use this:
  //* this observable won't stop until we unsubscribe it bcz it's a custom observable we make
  //* often unsubscribe at component's onDestroy
  elements$$ = this.elements$.asObservable(); // elements$$ === select elements

  //* At first data call, use this to set value to the store,
  //* or when you want to reset the store's value with new one
  setElements(elements: Element[]) {
    this.elements$.next(elements);
  }

  constructor(private http: HttpClient) {}

  //* this observable don't need to unsubscribe bcz it's using http client module
  //* and every call will be automatic unsubscribe
  getElements(): Observable<Element[]> {
    return (
      this.http
        .get<Element[]>('api/element')
        // set value to store
        .pipe(tap((elements) => this.setElements(elements)))
    );
  }
}
