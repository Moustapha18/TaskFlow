import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Comment } from '../../models/comment.models';
import { User } from '../../../../core/auth/user.model';

@Component({
  imports: [DatePipe, MatButtonModule],
  selector: 'app-comment-list',
  styleUrl: './comment-list.scss',
  templateUrl: './comment-list.html',
})
export class CommentList {
  comments = input.required<Comment[]>();
  /** Map (authorId → User) pour résoudre l'auteur. */
  authors = input.required<Map<number, User | undefined>>();
  /** Id de l'auteur courant, pour n'afficher le bouton supprimer qu'à lui. */
  currentUserId = input.required<number | null>();

  remove = output<Comment>();

  onDelete(comment: Comment): void {
    this.remove.emit(comment);
  }
}
