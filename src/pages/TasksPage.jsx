import { useTokenContext } from "../context/TokenContext";
import { useTasks } from "../api/useTasks";
import React, { useEffect, useState } from "react";
import ItemList from "../components/ItemList";

export default function TasksPage() {
  const token = useTokenContext();
  const { data: tasks } = useProjects(token);
  return (
    <div>
      <ItemList title="Tasks" items={tasks} basePath="tasks" />
    </div>
  );
}
