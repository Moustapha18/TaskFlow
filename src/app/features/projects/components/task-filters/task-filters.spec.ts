import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFilters, TaskFiltersValue } from './task-filters';

describe('TaskFilters', () => {
  let component: TaskFilters;
  let fixture: ComponentFixture<TaskFilters>;

  const initial: TaskFiltersValue = {
    status: 'all',
    priority: 'all',
    deadlineFrom: null,
    deadlineTo: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFilters],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFilters);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('value', initial);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('émet valueChange quand on change le statut', () => {
    const emitted: TaskFiltersValue[] = [];
    component.valueChange.subscribe((v) => emitted.push(v));
    component.onStatusChange('en_cours');
    expect(emitted[0].status).toBe('en_cours');
  });

  it('reset ramène tout à "all" et null', () => {
    const emitted: TaskFiltersValue[] = [];
    component.valueChange.subscribe((v) => emitted.push(v));
    component.onReset();
    expect(emitted[0]).toEqual(initial);
  });
});
