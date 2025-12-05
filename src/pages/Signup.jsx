import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    countrycode: "",
    mobilenumber: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:4001/api/v1/auth/register",
        form
      );

      console.log("API Response:", response.data);

      // Save token and user data
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      if (response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      setSuccess("Account created successfully!");
      
      // redirect to dashboard after 1 second
      setTimeout(() => navigate("/dashboard"), 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-lg p-8 w-[400px] rounded-xl">
        <h2 className="text-2xl font-bold mb-5 text-center">Create Account</h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}
        {success && <p className="text-green-500 text-center mb-3">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="flex gap-2">
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              className="w-1/2 p-2 border rounded"
              value={form.firstname}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              className="w-1/2 p-2 border rounded"
              value={form.lastname}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div className="flex gap-2">
            <input
              type="text"
              name="countrycode"
              placeholder="+91"
              className="w-1/4 p-2 border rounded"
              value={form.countrycode}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="mobilenumber"
              placeholder="Phone Number"
              className="w-3/4 p-2 border rounded"
              value={form.mobilenumber}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white p-2 rounded ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-3 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
