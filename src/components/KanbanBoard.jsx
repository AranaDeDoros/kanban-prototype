import  { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useTasks } from "../api/useTasks";
import { useTokenContext } from "../context/TokenContext";
import { CreateTaskForm } from "./TaskForm";
/* import { UserIcon } from "@heroicons/react/24/solid";
import { FireIcon } from "@heroicons/react/24/solid";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { ArrowDownCircleIcon } from "@heroicons/react/24/solid"; */
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import api from "../api/client";
import { Task } from "./Task";

export default function KanbanBoard({ user, projectId }) {
  const token = useTokenContext();
  const { data: tasks, isLoading } = useTasks(projectId, token);
  const [showCreateForm, setshowCreateForm] = useState(false);
  const navigate = useNavigate();
  const [status, setStatus] = useState("connecting");
  const [search, setSearch] = useState({ backlog: "", wip: "", done: "" });

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws/tasks/");

    socket.onmessage = (event) => {
      handleOnMessage(event);
    };

    socket.onopen = () => setStatus("online");
    socket.onerror = () => setStatus("error");
    socket.onclose = () => {
      console.log("Socket closed");
      setStatus("offline");
    };
    return () => socket.close();
  }, []);

  const handleOnMessage = (event) => {
    const updatedTask = JSON.parse(event.data);
    console.log(" Task update received:", updatedTask);

    setColumns((prev) => {
      const newCols = { ...prev };
      Object.keys(newCols).forEach((key) => {
        newCols[key] = newCols[key].filter((t) => t.id !== updatedTask.id);
      });
      newCols[updatedTask.status].push(updatedTask);
      return newCols;
    });
  };

  const handleTaskCreated = (newTask) => {
    console.log("Task created:", newTask);
    setColumns({
      ...columns,
      backlog: [...columns.backlog, newTask],
    });
  };

  const [columns, setColumns] = useState({
    backlog: [],
    wip: [],
    done: [],
  });

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

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
    console.log(result);
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

      api.patch(
        `/tasks/${moved.id}/`,
        { status: destCol, assigned_to: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  };

  function stripHtml(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  const handleSearch = (value, key) => {
    setSearch((prev) => ({ ...prev, [key]: value.toLowerCase() }));
  };

  return (
    <>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setshowCreateForm(!showCreateForm)}
          className="px-3 py-1 rounded bg-blue-600 text-white"
        >
          add task
        </button>
        <button
          onClick={logout}
          className="px-3 py-1 rounded bg-red-600 text-white"
        >
          logout
        </button>
      </div>

      <Transition appear show={showCreateForm} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setshowCreateForm(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-red/40" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white p-4 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-lg font-semibold">
                    Create Task
                  </Dialog.Title>

                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setshowCreateForm(false)}
                  >
                    ✕
                  </button>
                </div>

                <CreateTaskForm
                  token={token}
                  onTaskCreated={handleTaskCreated}
                  projectId={projectId}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <div className="p-2 grid grid-flow-col auto-cols-max items-center justify-end gap-2">
        <p className={`status-dot ${status}`}></p>
        <span>{status}</span>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-4 p-4 min-h-screen bg-gray-100">
          {Object.entries(columns).map(([key, items]) => (
            <Droppable droppableId={key} key={key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-50 rounded-lg shadow flex flex-col h-[calc(100vh-4rem)]"
                >
                  <div className="p-4 border-b font-bold text-gray-700 uppercase text-center bg-white sticky top-0 z-10">
                    {key}
                  </div>
                  <input
                    type="text"
                    placeholder="search"
                    onChange={(v) => handleSearch(v.target.value, key)}
                    className="mt-1 block w-full border border-gray-100 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 caret-blue bg-[#dddeeef]"
                  />

                  {/* scroll*/}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {items
                      .filter((task) => {
                        const s = search[key];
                        if (!s) return true;
                        const t = task.title.toLowerCase();
                        const d = stripHtml(task.description).toLowerCase();
                        return t.includes(s) || d.includes(s);
                      })
                      .map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id.toString()}
                          index={index}
                          isDragDisabled={task.status === "done"}
                        >
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              className="
                                rounded-xl overflow-hidden
                                shadow-md hover:shadow-lg
                                transition-all duration-200
                                border border-gray-200
                                bg-white
                              "
                            >
                              {/* task */}
                              <Task task={task} user={user} stripHtml={stripHtml} />
                          {/*     <div
                                className={`
                                  px-3 py-2 flex justify-between items-center text-white
                                  bg-gradient-to-r
                                  ${
                                    task.status === "done"
                                      ? "from-green-500 to-green-600"
                                      : task.status === "wip"
                                      ? "from-orange-400 to-orange-500"
                                      : "from-blue-500 to-blue-600"
                                  }
                                `}
                              >
                                <strong className="text-sm">
                                  {task.title}
                                </strong>

                                <div>
                                  {task.priority === "low" ? (
                                    <ArrowDownCircleIcon className="size-5 text-white" />
                                  ) : task.priority === "regular" ? (
                                    <ExclamationCircleIcon className="size-5 text-white" />
                                  ) : (
                                    <FireIcon className="size-5 text-white" />
                                  )}
                                </div>
                              </div>

                              <div className="px-3 py-2 text-gray-700 text-sm border-t bg-gray-50">
                                {task.description ? (
                                  <p className="leading-tight">
                                    {stripHtml(task.description).slice(0, 120)}
                                  </p>
                                ) : (
                                  <p className="italic text-gray-400">
                                    No description
                                  </p>
                                )}
                              </div>

                              <div
                                className={`${
                                  task.status === "done"
                                    ? "bg-green-50"
                                    : task.status === "wip"
                                    ? "bg-orange-50"
                                    : "bg-blue-50"
                                } px-3 py-2 rounded-b-md border-t flex justify-end`}
                              >
                                <span className="flex items-center gap-1 text-gray-700 text-sm">
                                  <UserIcon className="size-4 text-gray-600" />
                                  {task.status !== "backlog"
                                    ? user.username
                                    : "NA"}
                                </span>
                              </div> */}
                              {/* task */}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </>
  );
}
