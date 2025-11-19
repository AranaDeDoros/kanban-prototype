import React, { useState, useEffect } from "react";

export default function Loader({startStatus = false}) {
    const [isLoading, setisLoading] = useState(null)
    useEffect(() => {
      setisLoading(startStatus);
    }, [startStatus]);

    return (
      <>
        {isLoading && (
          <button type="button" class="bg-indigo-500 ..." disabled>
            <svg class="mr-3 size-5 animate-spin ..." viewBox="0 0 24 24"></svg>
            Processing…
          </button>
        )}
      </>
    );

}