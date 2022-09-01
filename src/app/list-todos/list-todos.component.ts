import { Component, OnInit } from '@angular/core';

// export class Todo {
//   constructor(
//     public id: number,
//     public description: string,
//     public done: boolean
//   ) {}
// }
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-list-todos',
  templateUrl: './list-todos.component.html',
  styleUrls: ['./list-todos.component.css'],
})
export class ListTodosComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  // todos = [
  //   new Todo(1, 'Kaedehara Kazuha', true),
  //   new Todo(2, 'Sangonomiya Kokomi', false),
  //   new Todo(3, 'Kamisato Ayaka', true),

  //   // { id: 1, description: 'Kaedehara Kazuha' },
  //   // { id: 2, description: 'Sangonomiya Kokomi' },
  //   // { id: 3, description: 'Kamisato Ayaka' },
  // ];
  constructor() {}

  ngOnInit(): void {}
}
