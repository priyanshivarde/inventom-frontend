import React, { useEffect, useState } from "react";

export default function HabitCard({ habit, onComplete, fetchStatus }) {
  const [doneToday, setDoneToday] = useState(false);

  useEffect(() => {
    const date = new Date().toISOString().slice(0,10);
    fetchStatus(habit._id, date).then(res => {
      if (res && typeof res.done !== "undefined") setDoneToday(res.done);
    }).catch(()=>{});
  }, [habit, fetchStatus]);

  return (
    <div className="border rounded p-4 flex justify-between items-center mb-3 bg-white">
      <div>
        <h3 className="font-semibold">{habit.name}</h3>
        <p className="text-sm text-slate-600">{habit.description}</p>
        <p className="text-xs mt-1">{habit.completions?.length || 0} days completed</p>
      </div>
      <div>
        <button
          onClick={async () => { await onComplete(habit._id); setDoneToday(true); }}
          className={`btn ${doneToday ? "bg-green-500 text-white" : "bg-gray-200 text-black"}`}
        >
          {doneToday ? "Done ✓" : "Mark done"}
        </button>
      </div>
    </div>
  );
}
