import {
  CalculatorIcon,
  UserIcon,
  FireIcon,
  ExclamationCircleIcon,
  ArrowDownCircleIcon,
  ListBulletIcon,
  TagIcon,
  CheckBadgeIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import { useState } from "react";

//striphtml might change into a utility function later idk
export const Task = ({ user, task, stripHtml }) => {
  const [open, setOpen] = useState(false);
  const bgColors = {
    done: "from-green-500 to-green-600",
    wip: "from-orange-400 to-orange-500",
    backlog: "from-blue-500 to-blue-600",
  };

  const softBg = {
    done: "bg-green-50",
    wip: "bg-orange-50",
    backlog: "bg-blue-50",
  };

  const hardBg = {
    done: "bg-green-500 hover:bg-green-800",
    wip: "bg-orange-500 hover:bg-orange-800",
    backlog: "bg-blue-500 hover:bg-sky-800",
  };
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer active:scale-[0.99] transition-transform"
      >
        <div
          className={`px-3 py-2 flex justify-between items-center text-white bg-gradient-to-r ${
            bgColors[task.status]
          }`}
        >
          <strong className="text-sm">{task.title}</strong>

          {task.priority === "low" ? (
            <ArrowDownCircleIcon className="size-5" />
          ) : task.priority === "regular" ? (
            <EyeIcon className="size-5" />
          ) : (
            <FireIcon className="size-5" />
          )}
        </div>

        <div className="px-3 py-2 text-gray-700 text-sm border-t bg-gray-50">
          {task.description ? (
            <p className="leading-tight bold">
              {stripHtml(task.description).slice(0, 120)}...
            </p>
          ) : (
            <p className="italic text-gray-400">No description</p>
          )}
        </div>

        <div
          className={`${
            softBg[task.status]
          } px-3 py-2 rounded-b-md border-t flex justify-end`}
        >
          <span className="flex items-center gap-1 text-gray-700 text-sm">
            <UserIcon className="size-4 text-gray-600" />
            {task.status !== "backlog" ? user.username : "NA"}
          </span>
        </div>
      </div>
      {/* preview */}
      <Transition show={open} as={Fragment}>
        <Dialog onClose={() => setOpen(false)} className="relative z-50">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            aria-hidden="true"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="mx-auto w-full max-w-lg rounded-xl bg-white p-5 shadow-xl">
              <DialogTitle className="text-lg font-semibold mb-3 flex justify-between">
                <div class="flex gap-2 align-center justify-center items-center">
                  <CheckBadgeIcon className="size-6 ml-2 text-green-500" />
                  <span>{task.title}</span>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setOpen(false)}
                >
                  ✕
                </button>
              </DialogTitle>

              <div
                className={`h-2 rounded-md mb-4 bg-gradient-to-r ${
                  bgColors[task.status]
                }`}
              />

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Description:</strong>
                  </p>
                  <div
                    className="p-2 bg-gray-100 rounded text-sm text-gray-700"
                    dangerouslySetInnerHTML={{ __html: task.description }}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <ListBulletIcon className="size-5 text-gray-600" />
                    <strong>Criteria:</strong>
                  </p>
                  <ul className="list-disc list-inside ml-4">
                    {task.acceptance_criteria.split("\n").map((c, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <CalculatorIcon className="size-5 text-gray-600" />
                  <strong>Estimate:</strong>
                  <span>{task.estimate_points ?? "N/A"}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <UserIcon className="size-5 text-gray-600" />
                  <strong>Assigned to:</strong>
                  <span>
                    {task.status !== "backlog" ? user.username : "N/A"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <FireIcon className="size-5 text-gray-600" />
                  <strong>Priority:</strong>
                  <span className="capitalize">{task.priority}</span>
                </div>

                <div className="flex items-center gap-2 text-sm ">
                  <div className="">
                    <TagIcon className="size-5 text-gray-600" />
                  </div>
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span className={`${hardBg[task.status]} chip`}>
                      some static tag 1
                    </span>
                    <span className={`${hardBg[task.status]} chip`}>
                      some static tag 2
                    </span>
                    <span className={`${hardBg[task.status]} chip`}>
                      some static tag 3
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className={`px-4 py-2 ${
                    hardBg[task.status]
                  } text-white rounded-md hover:${
                    hardBg[task.status]
                  } transition-colors`}
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
