import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from './models/todo.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// NGXS
import { Store, Select } from '@ngxs/store';
import { TodoState } from './store/todo.state';
import { CreateTodo, DeleteTodo, EditTodo, SelectTodo, MarkTodo, MarkAllTodos, DeleteAllTodos } from './store/todo.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  title = 'todo-angular9-juan';
  todoForm: FormGroup;
  editStatus = false;
  private destroy$ = new Subject();

  // NGXS
  @Select(TodoState.getAllTodos) todos: Observable<Todo[]>;
  @Select(TodoState.getTodo) todo: Observable<Todo>;

  constructor(private formBuilder: FormBuilder, private store: Store) {
    this.createForm();
    this.patchForm();
  }

  createForm() {
    this.todoForm = this.formBuilder.group({
      id: null,
      task: [null, Validators.required],
      status: false,
    });
  }

  patchForm() {
    this.todo.pipe(takeUntil(this.destroy$)).subscribe((todo) => {
      if (todo) {
        this.todoForm.patchValue({
          id: todo.id ? todo.id : null,
          task: todo.task,
          status: todo.status,
        });
        this.editStatus = true;
      } else {
        this.editStatus = false;
      }
    });
  }

  onEditTodo(payload: Todo) {
    this.store.dispatch(new SelectTodo(payload));
  }

  onCreateTodo(form: FormGroup) {
    if (this.editStatus) {
      this.store
        .dispatch(new EditTodo(form.value, form.value.id))
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.clearForm();
        });
    } else {
      this.store
        .dispatch(new CreateTodo(form.value))
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.clearForm();
        });
    }
  }

  onMark(value: Todo) {
    console.log(value);
    this.store.dispatch(new MarkTodo(value));
    this.clearForm();
  }

  onDeleteTodo(id: number) {
    this.store.dispatch(new DeleteTodo(id));
    this.clearForm();
  }

  onMarkAllTodos() {
    this.store.dispatch(new MarkAllTodos());
    this.clearForm();
  }

  onDeleteAllTodos() {
    this.store.dispatch(new DeleteAllTodos());
    this.clearForm();
  }

  clearForm() {
    this.todoForm.reset();
    this.store.dispatch(new SelectTodo(null));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
