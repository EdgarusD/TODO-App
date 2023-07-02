import { trpc } from "../../utils/trpc";
import { FormEvent, useState } from "react";
import Tasks from "./components/Tasks";

export default function Home() {
  const utils = trpc.useContext();
  const mutation = trpc.createTask.useMutation({
    onSuccess() {
      utils.getTasks.invalidate();
    },
  });

  const [name, setName] = useState<string>("");

  const handlerSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.length === 0) {
      return;
    }
    mutation.mutate({ name });
    setName("");
  };

  return (
    <div className="flex justify-center">
      <div className="w-1/3 mt-24 ">
        <div className=" mb-12 flex bg-[#24273D] h-14 px-4 py-3 rounded-md items-center">
          <div className="border-[#666666] border h-5 w-5 rounded-[50%]"></div>
          <form onSubmit={handlerSubmit} className="w-11/12 px-4">
            <input
              type="text"
              className="placeholder:italic placeholder:text-slate-400 w-full bg-[#00000000] outline-none text-[#ffffffb6]"
              placeholder="add a task"
              onChange={(e) => setName(e.currentTarget.value)}
              value={name}
              required
            />
          </form>
        </div>
        <Tasks />
      </div>
    </div>
  );
}
