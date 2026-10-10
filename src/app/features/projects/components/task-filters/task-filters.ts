import { Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  TaskPriority,
  TaskStatus,
} from '../../models/task.models';

/** Valeur de filtre "aucun". */
export type StatusFilter = TaskStatus | 'all';
export type PriorityFilter = TaskPriority | 'all';

export interface TaskFiltersValue {
  status: StatusFilter;
  priority: PriorityFilter;
  deadlineFrom: string | null;
  deadlineTo: string | null;
}

@Component({
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule],
  selector: 'app-task-filters',
  styleUrl: './task-filters.scss',
  templateUrl: './task-filters.html',
})
export class TaskFilters {
  /** Valeur courante reçue du parent (one-way). */
  value = input.required<TaskFiltersValue>();
  /** Émis à chaque changement de filtre. */
  valueChange = output<TaskFiltersValue>();

  protected readonly statuses = TASK_STATUSES;
  protected readonly priorities = TASK_PRIORITIES;
  protected readonly statusLabels = TASK_STATUS_LABELS;
  protected readonly priorityLabels = TASK_PRIORITY_LABELS;

  onStatusChange(status: StatusFilter): void {
    this.valueChange.emit({ ...this.value(), status });
  }

  onPriorityChange(priority: PriorityFilter): void {
    this.valueChange.emit({ ...this.value(), priority });
  }

  onFromChange(deadlineFrom: string | null): void {
    this.valueChange.emit({ ...this.value(), deadlineFrom: deadlineFrom || null });
  }

  onToChange(deadlineTo: string | null): void {
    this.valueChange.emit({ ...this.value(), deadlineTo: deadlineTo || null });
  }

  onReset(): void {
    this.valueChange.emit({
      status: 'all',
      priority: 'all',
      deadlineFrom: null,
      deadlineTo: null,
    });
  }
}
