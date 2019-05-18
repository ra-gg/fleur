import { Store, listen } from '@ragg/fleur'
import { TodoActions } from './actions'
import { uuid } from '../../utils/utils'

export interface TodoEntity {
  id: string
  title: string
  completed: boolean
}

interface State {
  todos: TodoEntity[]
}

export class TodoStore extends Store<State> {
  static storeName = 'TodoStore'
  public state = { todos: [] }

  private handleAddTodo = listen(TodoActions.addTodo, ({ title }) => {
    this.updateWith(s => s.todos.push({ id: uuid(), title, completed: false }))
  })

  private handleToggleAll = listen(TodoActions.toggleAll, ({ completed }) => {
    this.updateWith(s => s.todos.forEach(todo => (todo.completed = completed)))
  })

  private handleToggle = listen(TodoActions.toggle, ({ id }) => {
    this.updateWith(s =>
      s.todos
        .filter(todo => todo.id === id)
        .forEach(todo => (todo.completed = !todo.completed)),
    )
  })

  private handleDestroy = listen(TodoActions.destroy, ({ id }) => {
    this.updateWith(s => (s.todos = s.todos.filter(todo => todo.id !== id)))
  })

  private handlePatchTodo = listen(TodoActions.patch, ({ id, title }) => {
    this.updateWith(s =>
      s.todos
        .filter(todo => todo.id === id)
        .forEach(todo => (todo.title = title)),
    )
  })

  private handleClearCompleted = listen(TodoActions.clearCompleted, () => {
    this.updateWith(s => (s.todos = s.todos.filter(todo => !todo.completed)))
  })

  public getTodos() {
    return this.state.todos
  }
}