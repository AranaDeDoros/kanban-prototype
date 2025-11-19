import React, { useState, useEffect, useRef } from "react";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/solid";
import { MinusIcon } from "@heroicons/react/24/solid";

export const CriteriaList = ({ onChange }) => {
  const [items, setItems] = useState([]);
  const lastInputRef = useRef(null);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    onChange?.(items);
  }, [onChange, items]);

  useEffect(() => {
    const prevLen = prevLengthRef.current;

    if (items.length > prevLen) {
      // SOLO si se agregó un nuevo criterio
      if (lastInputRef.current) {
        lastInputRef.current.focus();
      }
    }

    // actualizar para el siguiente render
    prevLengthRef.current = items.length;
  }, [items]);

  const handleCreate = () => {
    setItems([...items, { id: Date.now(), value: "" }]);
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleChange = (id, newValue) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, value: newValue } : item
      )
    );
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <span>Criteria:</span>
          <button onClick={handleCreate}>
            <PlusIcon className="size-4 text-red-500 inline-block mr-1" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {items.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-2">
              <input
                ref={idx === items.length - 1 ? lastInputRef : null}
                type="text"
                placeholder="test"
                value={item.value}
                onChange={(e) => handleChange(item.id, e.target.value)}
                className="flex-1 border border-gray-300 rounded p-2
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button onClick={() => handleDelete(item.id)}>
                <MinusIcon className="size-5 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
