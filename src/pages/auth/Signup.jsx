// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { showSuccessToast } from "../../utils/toastConfig";

// const Signup = () => {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     role: "ADMIN",
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post("/user/createUser", form);

//       if (res.data.success) {
//         showSuccessToast(res.data.msg || "User created successfully");

//         // Optional: Redirect to login page after signup
//         setTimeout(() => navigate("/"), 500);
//       }
//     } catch (error) {
//       // Error automatically handled by interceptor (toast + logging)
//       console.error("Signup Error:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-md border p-8">
//         <h2 className="text-xl font-semibold text-center mb-6">
//           Create an Account
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Name */}
//           <div>
//             <label className="block mb-1 font-medium text-sm">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               required
//               className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block mb-1 font-medium text-sm">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               required
//               className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
//             />
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="block mb-1 font-medium text-sm">Phone</label>
//             <input
//               type="text"
//               name="phone"
//               value={form.phone}
//               onChange={handleChange}
//               required
//               className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block mb-1 font-medium text-sm">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               required
//               className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
//             />
//           </div>

//           {/* Role */}
//           <div>
//             <label className="block mb-1 font-medium text-sm">Role</label>
//             <select
//               name="role"
//               value={form.role}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-4 py-2"
//             >
//               <option value="SUPER_ADMIN">Super Admin</option>
//               <option value="ADMIN">Admin</option>
//               <option value="MANAGER">Manager</option>
//               <option value="CASHIER">Cashier</option>
//             </select>
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary/90 transition"
//           >
//             Sign Up
//           </button>
//         </form>

//         <p className="text-center text-sm text-gray-500 mt-4">
//           Already have an account?{" "}
//           <span
//             className="text-primary font-medium cursor-pointer"
//             onClick={() => navigate("/")}
//           >
//             Login
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2, LayoutDashboard } from "lucide-react";
import { showSuccessToast } from "../../utils/toastConfig";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "ADMIN",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/user/createUser", form);

      if (res.data.success) {
        showSuccessToast(res.data.msg || "User created successfully");
        setTimeout(() => navigate("/"), 500);
      }
    } catch (error) {
      console.error("Signup Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side Branding */}
      <div className="hidden md:flex md:w-1/2 bg-primary/50 items-center justify-center">
        <div className="text-center p-8">
          <div className="flex items-center justify-center mb-6">
            <span className="text-4xl md:text-7xl tracking-widest font-bold text-white">
              POS
            </span>
          </div>
          <p className="text-white mt-3 text-xl">Create your account.</p>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <div className="flex items-center justify-center mb-6">
            <LayoutDashboard className="text-primary" size={28} />
          </div>

          <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
            Create an Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2"
              >
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="CASHIER">Cashier</option>
              </select>
            </div>

            {/* Submit Button w/ Loader */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-primary text-white py-2.5 rounded-lg font-medium 
              transition flex items-center justify-center gap-2
              ${
                loading ? "opacity-80 cursor-not-allowed" : "hover:bg-primary"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/")}
              className="text-primary font-medium hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
