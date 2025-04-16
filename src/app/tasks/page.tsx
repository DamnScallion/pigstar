import { logger } from "@/lib/utils";

async function TasksPage() {
  const response = await fetch("http://localhost:3000/api/tasks", {
    cache: "no-store",
  });
  const tasks = await response.json();

  logger.info("tasks:", tasks);

  return <div>TasksPage</div>;
}
export default TasksPage;