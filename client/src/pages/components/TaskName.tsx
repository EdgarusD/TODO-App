import React, { FormEvent, useState, KeyboardEvent } from "react";
import { trpc } from "../../../utils/trpc";

export type taskProps = {
  id: number;
  name: string;
};

export default function TaskName({ name, id }: taskProps) {
  const [isEditing, SetIsEditing] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(name);

  const utils = trpc.useContext();
  const mutation = trpc.updateTaskName.useMutation({
    onSuccess() {
      utils.getTasks.invalidate();
    },
  });

  const handlerSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.length === 0) {
      SetIsEditing(false);
      return;
    }
    mutation.mutate({ name: nameInput, id: id });
    SetIsEditing(false);
  };

  return isEditing ? (
    <div className="flex items-center w-11/12 px-2 text-slate-100 ">
      <div onClick={() => SetIsEditing(false)} className="hover:text-slate-400">
        ✎
      </div>
      <form onSubmit={handlerSubmit}>
        <input
          className="placeholder:italic px-2 placeholder:text-slate-400 w-full bg-[#00000000] outline-none text-[#ffffffb6]"
          value={nameInput}
          onChange={(e) => setNameInput(e.currentTarget.value)}
          tabIndex={0}
        />
      </form>
    </div>
  ) : (
    <div className="flex items-center w-11/12 px-2 text-slate-400 hover:text-slate-200">
      <div onClick={() => SetIsEditing(true)}>✎</div>
      <text
        className="text-slate-400 px-2 truncate"
        onDoubleClick={() => SetIsEditing(!isEditing)}
      >
        {name}
      </text>
    </div>
  );
}
