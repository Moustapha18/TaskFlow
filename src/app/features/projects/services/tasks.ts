import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Task, TaskPriority, TaskStatus } from '../models/task.models';

export interface TaskDraft {
  projectId: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: number | null;
  deadline: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  private readonly _tasks = signal<Task[]>([]);
  private readonly _loading = signal(true);

  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();

  /** Nombre de tâches urgentes, tous projets confondus (utilisé par le Header plus tard). */
  readonly urgentTasksCount = computed(
    () => this._tasks().filter((t) => t.priority === 'urgente').length,
  );

  constructor() {
    this.http.get<Task[]>(this.apiUrl).subscribe({
      next: (tasks) => {
        this._tasks.set(tasks);
        this._loading.set(false);
      },
      error: () => this._loading.set(false),
    });
  }

  /** Renvoie un signal dérivé : tâches d'un projet donné. */
  tasksByProject(projectId: number) {
    return computed(() => this._tasks().filter((t) => t.projectId === projectId));
  }

  addTask(draft: TaskDraft): Observable<Task> {
    const payload: Omit<Task, 'id' | 'createdAt'> = {
      ...draft,
      assigneeId: draft.assigneeId,
    };

    return this.http
      .post<Task & { createdAt: string }>(this.apiUrl, {
        ...payload,
        createdAt: new Date().toISOString(),
      })
      .pipe(tap((task) => this._tasks.update((tasks) => [...tasks, task])));
  }

  updateTask(id: number, draft: TaskDraft): Observable<Task> {
  const existing = this._tasks().find((t) => t.id === id);
  if (!existing) throw new Error(`Task ${id} introuvable`);

  const payload: Task = {
    ...existing,
    ...draft,
  };

  return this.http.put<Task>(`${this.apiUrl}/${id}`, payload).pipe(
    tap((updated) =>
      this._tasks.update((tasks) =>
        tasks.map((t) => (t.id === id ? updated : t)),
      ),
    ),
  );
}
/** Déplace une tâche dans une autre colonne du Kanban. */
moveTask(id: number, status: TaskStatus): Observable<Task> {
  const existing = this._tasks().find((t) => t.id === id);
  if (!existing) throw new Error(`Task ${id} introuvable`);

  const updated: Task = { ...existing, status };

  return this.http.put<Task>(`${this.apiUrl}/${id}`, updated).pipe(
    tap((task) =>
      this._tasks.update((tasks) => tasks.map((t) => (t.id === id ? task : t))),
    ),
  );
}
deleteTask(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
    tap(() => this._tasks.update((tasks) => tasks.filter((t) => t.id !== id))),
  );
}
/** Met à jour uniquement la deadline d'une tâche. */
setDeadline(id: number, deadline: string | null): Observable<Task> {
  const existing = this._tasks().find((t) => t.id === id);
  if (!existing) throw new Error(`Task ${id} introuvable`);

  const updated: Task = { ...existing, deadline };

  return this.http.put<Task>(`${this.apiUrl}/${id}`, updated).pipe(
    tap((task) =>
      this._tasks.update((tasks) => tasks.map((t) => (t.id === id ? task : t))),
    ),
  );
}
}
