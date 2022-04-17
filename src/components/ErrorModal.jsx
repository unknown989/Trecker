import { useState } from "react";
import { IconX } from "@tabler/icons";
import "./ErrorModal.css";
import { useEffect } from "react";

export default function ErrorModal({ error, callback = () => {} }) {
  if (error) {
    return (
      <div className="error-modal">
        {error}
        <div className="todo-icon" onClick={() => callback("")}>
          <IconX color="#800" />
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
