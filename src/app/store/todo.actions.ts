import { Todo } from '../models/todo.model';

export class CreateTodo {
  static readonly type = '[Todo List] CreateTodo';

  constructor(public payload: Todo) {}
}

export class SelectTodo {
  static readonly type = '[Todo List] SelectTodo';

  constructor(public payload: Todo) {}
}

export class EditTodo {
  static readonly type = '[Todo List] EditTodo';

  constructor(public payload: Todo, public id: number) {}
}

export class MarkTodo {
  static readonly type = '[Todo List] MarkTodo';

  constructor(public payload: Todo) {}
}

export class DeleteTodo {
  static readonly type = '[Todo List] DeleteTodo';

  constructor(public id: number) {}
}

export class MarkAllTodos {
  static readonly type = '[Todo List] MarkAllTodos';
}

export class DeleteAllTodos {
  static readonly type = '[Todo List] DeleteAllTodos';
}

