export interface Todo {
  id: number;
  task: string;
  status: boolean;
}

export interface TodoStateModel {
  todo: Todo;
  todos: Todo[];
}
