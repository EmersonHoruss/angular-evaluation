export interface Task {
  id: number;
  title: string;
  due_date: null | Date;
  important: boolean;
  completed: boolean;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTask {
  title: string;
  due_date: string | null;
}

export interface EditTask {
  important?: boolean;
  completed?: boolean;
}

export interface EditTaskWithId extends EditTask {
  id: number;
}

export interface TaskState {
  tasks: Task[] | null;
  error: Error | null;
  loading: boolean;
}

export type sortTaskType = 'old_first' | 'new_first' | 'a_z' | 'z_a';

export type filterTaskType = 'pending' | 'important' | 'pending_important';
