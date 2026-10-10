import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Comment } from '../models/task.models';

export interface CommentDraft {
  taskId: number;
  authorId: number;
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/comments`;

  private readonly _comments = signal<Comment[]>([]);
  private readonly _loading = signal(true);

  readonly comments = this._comments.asReadonly();
  readonly loading = this._loading.asReadonly();

  constructor() {
    this.http.get<Comment[]>(this.apiUrl).subscribe({
      next: (comments) => {
        this._comments.set(comments);
        this._loading.set(false);
      },
      error: () => this._loading.set(false),
    });
  }

  /** Signal dérivé : commentaires d'une tâche, triés du plus récent au plus ancien. */
  commentsByTask(taskId: number) {
    return computed(() =>
      this._comments()
        .filter((c) => c.taskId === taskId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    );
  }

  addComment(draft: CommentDraft): Observable<Comment> {
    const payload = {
      ...draft,
      content: draft.content.trim(),
      createdAt: new Date().toISOString(),
    };

    return this.http
      .post<Comment>(this.apiUrl, payload)
      .pipe(tap((comment) => this._comments.update((all) => [...all, comment])));
  }
}
