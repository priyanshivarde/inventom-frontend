import React, { useState } from "react";

export default function AddHabitForm({ onCreate, loading }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("daily"); // default value

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Habit name is required");
    onCreate({ 
      name: name.trim(), 
      description: description.trim(), 
      frequency 
    });
    setName("");
    setDescription("");
    setFrequency("daily");
  };

  return (
    <form onSubmit={submit} className="mb-6 flex flex-col gap-2">
      <input
        className="border p-2 rounded"
        placeholder="Habit name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className="border p-2 rounded"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        className="border p-2 rounded"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
      <button
        type="submit"
        disabled={loading}
        className={`bg-blue-600 text-white py-2 rounded hover:bg-blue-700 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Creating..." : "Add Habit"}
      </button>
    </form>
  );
}
