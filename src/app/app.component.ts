import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TodoService} from "./services/todo-service";
import {CommonModule, NgClass} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TodoItem} from "./Models/todo-item";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  task = '';
  todos: TodoItem[] = [];
  formControl = new FormControl('', Validators.required);
  constructor(public todoService: TodoService) {
  }

   ngOnInit() {
      this.getTodos();
      this.todoService.$todos.subscribe((todos) => {
        this.todos = todos;
    });
  }

  getTodos() {
    this.todoService.getTodos();
  }

  addTodo() {
    if (!this.task) {
      return;
    }
    this.todoService.addTodo(this.task);
  }

  searchTodo() {
      this.todoService.$todos.next(this.todos.filter(x => x.title.toLowerCase() == this.task.toLowerCase()));
  }
  updateTodo(todo: TodoItem) {
    this.todoService.updateTodo(todo.id, !todo.isCompleted);
  }

  deleteTodo(id: number){
      this.todoService.removeTodo(id);
  }
}
