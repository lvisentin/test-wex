import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError, of, Observable } from "rxjs";
import { EditTodoRequest, InsertTodoRequest, Todo } from "src/app/pages/todos/models/todolist.model";

@Injectable({
  providedIn: "root",
})
export class TodoService {
  private readonly BASE_URL =
    "https://6078ed5ae7f4f50017184e92.mockapi.io/api/v1";

  constructor(private readonly httpClient: HttpClient) {}

  public getAllTodos(): Observable<any> {
    const url = `${this.BASE_URL}/todo`;

    return this.httpClient
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => throwError(error)));
  }

  public createNewTodo(data: InsertTodoRequest): Observable<any> {
    const url = `${this.BASE_URL}/todo`;

    return this.httpClient
      .post(url, data)
      .pipe(catchError((error: HttpErrorResponse) => throwError(error)));
  }

  public deleteTodo(id: string): Observable<any> {
    const url = `${this.BASE_URL}/todo/${id}`;

    return this.httpClient
      .delete(url)
      .pipe(catchError((error: HttpErrorResponse) => throwError(error)));
  }

  public editTodo(todoRequest: EditTodoRequest): Observable<any> {
    console.log(todoRequest)
    const url = `${this.BASE_URL}/todo/${todoRequest.id}`;

    return this.httpClient
      .put(url, { title: todoRequest.title, content: todoRequest.content})
      .pipe(catchError((error: HttpErrorResponse) => throwError(error)));
  }
}
