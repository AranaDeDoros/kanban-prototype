import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useTasks } from "../api/useTasks";
import { useTokenContext } from "../context/TokenContext";

export default function KanbanBoard({ projectId }) {
  const token = useTokenContext();
  const { data: tasks, isLoading } = useTasks(projectId, token);

  const [columns, setColumns] = useState({
    backlog: [],
    wip: [],
    done: [],
  });

  useEffect(() => {
    if (tasks) {
      setColumns({
        backlog: tasks.filter((t) => t.status === "backlog"),
        wip: tasks.filter((t) => t.status === "wip"),
        done: tasks.filter((t) => t.status === "done"),
      });
    }
  }, [tasks]);

  if (isLoading) return <p>Loading board...</p>;
  if (!tasks) return <p>No tasks found.</p>;

  const handleDragEnd = (result) => {
    console.log(result)
    const { source, destination } = result;

    if (!destination) return; // dropped outside

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    if (sourceCol === destCol) {
      // same column reorder
      const newTasks = Array.from(columns[sourceCol]);
      const [moved] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, moved);
      setColumns({ ...columns, [sourceCol]: newTasks });
    } else {
      // moving between columns
      const sourceTasks = Array.from(columns[sourceCol]);
      const destTasks = Array.from(columns[destCol]);
      const [moved] = sourceTasks.splice(source.index, 1);
      moved.status = destCol; // update status
      destTasks.splice(destination.index, 0, moved);

      setColumns({
        ...columns,
        [sourceCol]: sourceTasks,
        [destCol]: destTasks,
      });

      // TODO: optionally update backend
      // api.patch(`/tasks/${moved.id}/`, { status: destCol }, { headers: { Authorization: `Bearer ${token}` } })
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4 p-4">
        {Object.entries(columns).map(([key, items]) => (
          <Droppable droppableId={key} key={key}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-50 p-4 rounded shadow min-h-[400px] h-dvh"
              >
                <h3 className="font-bold mb-3 text-gray-700 uppercase text-center">
                  {key}
                </h3>

                {items.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="bg-gray-200 rounded p-2 mb-2  hover:shadow-sm"
                      >
                        <div
                          className={`${
                            task.status === "done"
                              ? "bg-green-500"
                              : task.status === "wip"
                              ? "bg-orange-500"
                              : "bg-blue-500"
                          }  text-white rounded p-1 mb-1`}
                        >
                          <strong>{task.title}</strong>
                        </div>
                        <div className="bg-gray-500 text-white rounded p-1 text-sm">
                          <i>{task.description} </i>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
