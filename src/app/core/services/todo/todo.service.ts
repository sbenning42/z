import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Todo {
  id: string;
  name: string;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  webService = 'http://localhost:4200/api/todos';

  constructor(private http: HttpClient) { }

  private create(todo: Partial<Todo>) {
    return this.http.post<Todo>(this.webService, todo);
  }
  private update(id: string, changes: Partial<Todo>) {
    return this.http.put<Todo>(`${this.webService}/${id}`, changes);
  }

  getAll() {
    return this.http.get<Todo[]>(this.webService);
  }
  getById(id: string) {
    return this.http.get<Todo>(`${this.webService}/${id}`);
  }
  save(todo: Partial<Todo>) {
    return todo.id !== undefined ? this.update(todo.id, todo) : this.create(todo);
  }
  delete(id: string) {
    return this.http.delete<{}>(`${this.webService}/${id}`);
  }

}
