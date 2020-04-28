import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Todo, TodoStateModel } from '../models/todo.model';
import { CreateTodo, EditTodo, DeleteTodo, DeleteAllTodos, SelectTodo, MarkTodo, MarkAllTodos } from './todo.actions';
import { patch, updateItem } from '@ngxs/store/operators';

const sampleTodos: Todo[] = [
  { id: 1, task: 'Task 1', status: true },
  { id: 2, task: 'Task 2', status: true },
  { id: 3, task: 'Task 3', status: false },
];

@State<TodoStateModel>({
  name: 'todo',
  defaults: {
    todo: null,
    todos: sampleTodos,
  },
})
export class TodoState {
  @Selector()
  static getTodo(state: TodoStateModel): Todo {
    return state.todo;
  }

  @Selector()
  static getAllTodos(state: TodoStateModel): Todo[] {
    return state.todos;
  }

  @Action(CreateTodo)
  createTodo(ctx: StateContext<TodoStateModel>, { payload }: CreateTodo) {
    const state = ctx.getState();
    payload.id = state.todos[state.todos.length - 1].id + 1;
    ctx.patchState({
      todos: [...state.todos, payload]
    });
  }

  @Action(SelectTodo)
  selectTodo({ getState, setState }: StateContext<TodoStateModel>, { payload }: SelectTodo) {
    const state = getState();
    setState({
      ...state,
      todo: payload,
    });
  }

  @Action(EditTodo)
  editTodo({ getState, setState }: StateContext<TodoStateModel>, { payload, id }: EditTodo) {
    const state = getState();
    const todoList = [...state.todos];
    const todoIndex = todoList.findIndex((item) => item.id === id);
    todoList[todoIndex] = payload;
    setState({
      ...state,
      todos: todoList,
    });
  }

  @Action(MarkTodo)
  markTodo(ctx: StateContext<TodoStateModel>, { payload }: MarkTodo) {
    const newStatus = payload.status === false ? true : false;
    ctx.setState(
      patch({
        todos: updateItem((todo) => todo.id === payload.id, patch({ status: newStatus })),
      })
    );
  }

  @Action(DeleteTodo)
  deleteTodo({ getState, setState }: StateContext<TodoStateModel>, { id }: DeleteTodo) {
    const state = getState();
    const filteredArray = state.todos.filter((item) => item.id !== id);
    setState({
      ...state,
      todos: filteredArray,
    });
  }

  @Action(MarkAllTodos)
  markAllTodos(ctx: StateContext<TodoStateModel>, {}: MarkAllTodos) {
    const { todos } = ctx.getState();
    const allDone = todos.every((todo) => todo.status);
    todos.forEach((todo) => (todo.status = !allDone));
    ctx.patchState({
      todos: [...todos],
    });
  }

  @Action(DeleteAllTodos)
  deleteAllTodos(ctx: StateContext<TodoStateModel>, {}: DeleteAllTodos) {
    const newTodos = [];
    ctx.patchState({
      todos: [...newTodos],
    });
  }
}
