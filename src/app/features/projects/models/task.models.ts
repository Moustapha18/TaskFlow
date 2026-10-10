export type TaskStatus = 'a_faire' | 'en_cours' | 'termine';
export type TaskPriority = 'basse' | 'moyenne' | 'haute' | 'urgente';

export interface Task {
  id: number;
  projectId: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: number | null;
  deadline: string | null;   // ← NOUVEAU : ISO date ou null
  createdAt: string;
}
export interface Comment {
  id: number;
  taskId: number;
  authorId: number;
  content: string;
  createdAt: string;
}
export const DEADLINE_SOON_DAYS = 3;
export const TASK_STATUSES: readonly TaskStatus[] = ['a_faire', 'en_cours', 'termine'];
export const TASK_PRIORITIES: readonly TaskPriority[] = ['basse', 'moyenne', 'haute', 'urgente'];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  a_faire: 'À faire',
  en_cours: 'En cours',
  termine: 'Terminé',
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  basse: 'Basse',
  moyenne: 'Moyenne',
  haute: 'Haute',
  urgente: 'Urgente',
};

/** État calculé d'une deadline, utilisé par les badges. */
export type DeadlineState = 'none' | 'ok' | 'soon' | 'overdue';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const SOON_THRESHOLD_DAYS = 3;

/**
 * Retourne l'état de la deadline :
 * - 'none'    : pas de deadline
 * - 'overdue' : dépassée
 * - 'soon'    : dans moins de 3 jours
 * - 'ok'      : à plus de 3 jours
 */
export function getDeadlineState(deadline: string | null, now = Date.now()): DeadlineState {
  if (!deadline) return 'none';
  const diffMs = new Date(deadline).getTime() - now;
  const diffDays = diffMs / MS_PER_DAY;

  if (diffDays < 0) return 'overdue';
  if (diffDays <= SOON_THRESHOLD_DAYS) return 'soon';
  return 'ok';
}
