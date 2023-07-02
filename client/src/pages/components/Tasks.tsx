import { trpc } from "../../../utils/trpc";
import * as React from "react";
import Notasks from "./Notasks";
import TaskName from "./TaskName";

export default function tasks() {
  const utils = trpc.useContext();

  const dataTask = trpc.getTasks.useQuery();
  const deleteMutation = trpc.deleteTask.useMutation({
    onSuccess() {
      utils.getTasks.invalidate();
    },
  });
  const updateMutation = trpc.completeTask.useMutation({
    onSuccess() {
      utils.getTasks.invalidate();
    },
  });

  if (!dataTask.data) {
    return <div>Loading...</div>;
  }
  const toggleTask = (id: number) => {
    updateMutation.mutate({ id });
  };

  const deleteTask = (id: number) => {
    deleteMutation.mutate({ id });
  };

  const tasks = dataTask.data.map((task) => {
    return (
      <div className="flex bg-[#24273D] h-14 px-4 py-3 items-center relative border-b border-[#7a7a7a57]">
        <button onClick={() => toggleTask(task.id)}>
          <div className="border-[#666666] border h-5 w-5 rounded-[50%] text-[#666666] flex justify-center items-center">
            {task.done ? <div>&#10003;</div> : <div></div>}
          </div>
        </button>
        <TaskName name={task.name!} id={task.id} />
        <button
          className="absolute right-0 "
          onClick={() => deleteTask(task.id)}
        >
          <div className="h-12 w-8 p-1 text-[#dddddda9] flex items-center hover:text-[#5a5a5a8a] ">
            &#10007;
          </div>
        </button>
      </div>
    );
  });

  return (
    <div className="flex flex-col-reverse">
      {dataTask.data.length === 0 ? <Notasks /> : tasks}
    </div>
  );
}
