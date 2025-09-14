import { useState } from "react"
import AuthInput from "../components/AuthInput"

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Register data:", form)
    // TODO: Gọi API đăng ký sau này
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Đăng ký</h2>
        <AuthInput label="Tên" name="name" value={form.name} onChange={handleChange} />
        <AuthInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
        <AuthInput label="Mật khẩu" name="password" type="password" value={form.password} onChange={handleChange} />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Đăng ký
        </button>
      </form>
    </div>
  )
}

export default Register