import { Component, Input, OnInit } from '@angular/core';
import { ListState } from '../../enums/ListState';

@Component({
  selector: 'my-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent {

  @Input('state') listState: ListState;

  constructor() { }
}
