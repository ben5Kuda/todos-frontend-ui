import {BehaviorSubject, catchError, Observable, of, Subject, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import { Injectable} from "@angular/core";
import {TodoItem} from "../Models/todo-item";

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = 'http://localhost:5176/TodosModule';

  constructor(private http: HttpClient) {
  }

  todos$: BehaviorSubject<TodoItem[]> = new BehaviorSubject<TodoItem[]>([]);
  todos: TodoItem[] = [];
  private readonly localStorageKey = 'todos';

  setLocalStorage() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.todos));
  }
  getTodos() {
    return this.http.get<TodoItem[]>(`${this.apiUrl}/GetTodos`)
      .pipe(
        tap(_ => console.info('fetch todos')),
        catchError(this.handleError<TodoItem[]>('getTodos', []))
      )
      .subscribe(todos => {
        this.todos = todos;
        this.todos$.next(this.todos);
      });
  }

  addTodo(title: string) {
    this.http.post<TodoItem>(`${this.apiUrl}/AddTodos?title=${title}`, {})
      .pipe(
        tap(_ => console.info('add todos')),
        catchError(this.handleError<TodoItem>('addTodos'))
      )
      .subscribe(todo => {
        this.todos.push(todo);
        this.todos$.next(this.todos);
      });
  }

  removeTodo(id: number) {
    return this.http.delete(`${this.apiUrl}/DeleteTodos/${id}`)
      .pipe(
        tap(_ => console.info('delete todos')),
        catchError(this.handleError<TodoItem>('deleteTodos'))
      )
      .subscribe(_ => {
      const index = this.todos.findIndex(d => d.id === id);
      if (index > -1) {
        this.todos.splice(index, 1);
        this.todos$.next(this.todos)
      }
    });
  }

  updateTodo(id: number, isComplete: boolean) {
    return this.http.put<TodoItem[]>(`${this.apiUrl}/UpdateTodos/${id}?isCompleted=${isComplete}`, {})
      .pipe(
        tap(_ => console.info('update todos')),
        catchError(this.handleError<TodoItem>('updateTodos'))
      )
      .subscribe(_ => {
        const index = this.todos.findIndex(d => d.id === id);
        if (index > -1) {
          this.todos[index].isCompleted = isComplete;
          this.todos$.next(this.todos)
        }
      });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}



