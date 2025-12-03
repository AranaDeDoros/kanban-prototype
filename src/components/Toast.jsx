import { Fragment, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function Toast({
  show,
  onClose,
  message,
  duration = 2500,
  type = "success", // "success" or "error"
}) {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  return (
    <div className="fixed inset-0 flex items-start justify-center pointer-events-none z-50">
      <Transition
        appear
        show={show}
        as={Fragment}
        enter="transform transition ease-out duration-300"
        enterFrom="opacity-0 -translate-y-5"
        enterTo="opacity-100 translate-y-0"
        leave="transform transition ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-5"
      >
        <div
          className="pointer-events-auto mt-6 px-4 py-2 rounded-md shadow-lg
                        bg-gray-200
                        text-black/50 font-medium text-sm"
        >
          {type == "succes" ? (
            <CheckCircleIcon className="w-6 h-6 text-gray-500" />
          ) : (
            <XMarkIcon className="w-6 h-6 text-red-500" />
          )}
          {message}
        </div>
      </Transition>
    </div>
  );
}
