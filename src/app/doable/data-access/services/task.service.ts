import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTask, EditTask, Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = 'https://doable-api-production.up.railway.app';
  private http = inject(HttpClient);

  createTask(token: string, data: CreateTask): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/tasks`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  editTask(token: string, data: EditTask, id: number): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/tasks/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  showTask(token: string, id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  deleteTask(token: string, id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getListTasks(token: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
