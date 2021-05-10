export interface Todo {
  content: string;
  createdAt: string;
  id: string;
  title: string;
}

export interface InsertTodoRequest {
  title: string;
  content: string;
}

export interface EditTodoRequest {
  id: string;
  title: string;
  content: string;
}

export interface TodoDialogData {
  id: string;
  title: string;
  content: string;
  mode: string;
}
