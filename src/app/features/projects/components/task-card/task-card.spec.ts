import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCard } from './task-card';
import { Task } from '../../models/task.models';

const mockTask: Task = {
  id: 1,
  projectId: 1,
  title: 'Migrer endpoint',
  description: 'Description',
  status: 'en_cours',
  priority: 'haute',
  assigneeId: 1,
  createdAt: '2026-01-10T09:00:00.000Z',
  deadline: null
};

describe('TaskCard', () => {
  let component: TaskCard;
  let fixture: ComponentFixture<TaskCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCard],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('task', mockTask);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('affiche le titre de la tâche', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Migrer endpoint');
  });

  it('affiche "Non assignée" si aucun assigné', () => {
    fixture.componentRef.setInput('task', { ...mockTask, assigneeId: null });
    fixture.componentRef.setInput('assignee', null);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Non assignée');
  });
});
