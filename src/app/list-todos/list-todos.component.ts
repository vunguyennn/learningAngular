import { Component, OnInit } from '@angular/core';

export class Todo {
  constructor(
    public id: number,
    public description: string,
    public done: boolean
  ) {}
}

@Component({
  selector: 'app-list-todos',
  templateUrl: './list-todos.component.html',
  styleUrls: ['./list-todos.component.css'],
})
export class ListTodosComponent implements OnInit {
  todos = [
    new Todo(1, 'Kaedehara Kazuha', true),
    new Todo(2, 'Sangonomiya Kokomi', false),
    new Todo(3, 'Kamisato Ayaka', true),

    // { id: 1, description: 'Kaedehara Kazuha' },
    // { id: 2, description: 'Sangonomiya Kokomi' },
    // { id: 3, description: 'Kamisato Ayaka' },
  ];
  constructor() {}

  ngOnInit(): void {}
}
