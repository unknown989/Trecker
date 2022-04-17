import { useEffect } from "react";
import { useState } from "react";

export default function useDocTitle(_title) {
  const updateTitle = (_t) => {
    document.title = _t;
  };
  if (typeof _title === "function") {
    updateTitle(_title(document.title));
  } else if (typeof _title === "string") {
    updateTitle(_title);
  } else {
    throw new Error("the title provided is neither a string nor an function");
  }

  return [document.title, updateTitle];
}
