import { ITodo } from '../entities/ITodo';
import { IUser } from '../entities/IUser';

import { CreateStore } from './create-store';

interface IGlobalStore {
  user: IUser | null;
  todos: ITodo[];
  login(): void;
  logout(): void;
  addTodo(title: string, author?: string): void;
  toggleTodoDone(todoId: number): void;
  removeTodo(todoId: number): void;
}

export const useGlobalStore = CreateStore<IGlobalStore>(
  (setState, getState) => ({
    user: null,
    todos: [],
    login: () =>
      setState({
        user: {
          email: 'daniel@gmail.com',
          name: 'Daniel Farias',
        },
      }),
    logout: () => setState({ user: null }),
    addTodo: (title: string) => {
      const { user } = getState();

      setState((prevState) => ({
        todos: prevState.todos.concat({
          id: Date.now(),
          title,
          author: user?.name ?? 'Convidado',
          done: false,
        }),
      }));
    },
    toggleTodoDone: (todoId: number) => {
      setState((prevState) => ({
        todos: prevState.todos.map((todo) =>
          todo.id === todoId ? { ...todo, done: !todo.done } : todo,
        ),
      }));
    },
    removeTodo: (todoId: number) => {
      setState((prevState) => ({
        todos: prevState.todos.filter((todo) => todo.id !== todoId),
      }));
    },
  }),
);
