
// Re-export everything from the new modular structure
// This ensures backwards compatibility with existing code
export { 
  fetchAllTasks,
  fetchUserTasks,
  addNewTask,
  updateExistingTask,
  deleteTaskById,
  mapDbTaskToTask,
  mapTaskToDbTask
} from './tasks';
