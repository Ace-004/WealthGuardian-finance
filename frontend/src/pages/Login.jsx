import Navbar from "../components/common/Navbar";
import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <h2 className="text-3xl mb-6 text-white font-bold">
          Log In to Wealth Guardian
        </h2>
        <LoginForm />
      </div>
    </div>
  );
}
