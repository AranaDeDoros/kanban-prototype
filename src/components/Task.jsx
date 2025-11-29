import { UserIcon } from "@heroicons/react/24/solid";
import { FireIcon } from "@heroicons/react/24/solid";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { ArrowDownCircleIcon } from "@heroicons/react/24/solid";

//striphtml might change into a utility function later idk
export const Task = ({ user, task, stripHtml }) => {
  return (
    <>
      <div
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
        <strong className="text-sm">{task.title}</strong>

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
          <p className="italic text-gray-400">No description</p>
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
          {task.status !== "backlog" ? user.username : "NA"}
        </span>
      </div>
    </>
  );
};
