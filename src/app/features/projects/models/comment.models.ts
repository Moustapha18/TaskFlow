export interface Comment {
  id: number;
  taskId: number;
  authorId: number;
  content: string;
  createdAt: string;
}

/** Payload envoyé à l'API lors de la création d'un commentaire. */
export type CommentDraft = Omit<Comment, 'id' | 'createdAt'>;
