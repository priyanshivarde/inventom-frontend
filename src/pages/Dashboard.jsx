import { useEffect, useState } from "react";
import { getAllHabits, completeHabit, createHabit } from "../api/habit";
import AddHabitForm from "../components/AddHabitForm";
import dayjs from "dayjs";


function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalHabit, setModalHabit] = useState(null);
  const [marking, setMarking] = useState(false);

 
  const loadHabits = async () => {
    try {
      const res = await getAllHabits();
      const habitsArray = Array.isArray(res.data) ? res.data : res.data.data;
      setHabits(habitsArray || []);
    } catch (err) {
      console.error("Error loading habits:", err);
      setHabits([]);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  
  const markDone = async (habit) => {
    setMarking(true);
    try {
      const res = await completeHabit(habit._id);
      const updatedCompletions = res.data.data?.completions || [];
      setHabits((prev) =>
        prev.map((h) =>
          h._id === habit._id ? { ...h, completions: updatedCompletions } : h
        )
      );
      setModalHabit(null); 
    } catch (err) {
      console.error("Error completing habit:", err);
      alert(err.response?.data?.message || "Failed to mark habit as done");
    } finally {
      setMarking(false);
    }
  };

  // Handle new habit creation
  const handleCreateHabit = async (habitData) => {
    setLoading(true);
    try {
      await createHabit(habitData);
      setShowForm(false);
      loadHabits();
    } catch (err) {
      console.error("Error creating habit:", err);
      alert(err.response?.data?.message || "Failed to create habit");
    } finally {
      setLoading(false);
    }
  };

  // Determine if habit is done based on completions
  const isHabitDone = (habit) => {
    const today = dayjs();
    if (!habit.completions || habit.completions.length === 0) return false;

    const lastCompletion = dayjs(habit.completions[habit.completions.length - 1]);
    const frequency = habit.frequency[0];

    if (frequency === "daily") return lastCompletion.isSame(today, "day");
    if (frequency === "weekly") return lastCompletion.add(7, "day").isAfter(today);
    if (frequency === "monthly") return lastCompletion.add(1, "month").isAfter(today);
    return false;
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Habits Dashboard</h1>

      {/* Button to show create habit form */}
      <div className="mb-4 text-center">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Create New Habit"}
        </button>
      </div>

      {/* Add Habit Form */}
      {showForm && <AddHabitForm onCreate={handleCreateHabit} loading={loading} />}

      {/* Habit List */}
      <div className="grid grid-cols-1 gap-4">
        {habits.length === 0 && (
          <p className="text-center text-gray-500">No habits yet. Add one above!</p>
        )}
        {habits.map((habit) => (
          <div
            key={habit._id}
            className="border rounded p-4 flex justify-between items-center shadow-sm bg-white"
          >
            <div>
              <h2 className="font-semibold text-lg">{habit.name}</h2>
              {habit.description && <p className="text-gray-600">{habit.description}</p>}
              {habit.frequency && (
                <p className="text-sm text-gray-500">Frequency: {habit.frequency[0]}</p>
              )}
            </div>
            <button
              onClick={() => setModalHabit(habit)}
              className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Status
            </button>
          </div>
        ))}
      </div>

      {/* Modal for marking habit as done */}
      <Modal isOpen={modalHabit !== null} onClose={() => setModalHabit(null)}>
        {modalHabit && (
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-xl">{modalHabit.name}</h2>
            {modalHabit.description && <p>{modalHabit.description}</p>}
            <p className="text-sm text-gray-500">Frequency: {modalHabit.frequency[0]}</p>

            <button
              onClick={() => markDone(modalHabit)}
              disabled={isHabitDone(modalHabit) || marking}
              className={`py-2 px-4 rounded ${
                isHabitDone(modalHabit) || marking
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isHabitDone(modalHabit) ? "Marked Done" : marking ? "Marking..." : "Mark as Done"}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
