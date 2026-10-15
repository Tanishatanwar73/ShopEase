import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP, resendOTP } from "../services/api";

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const demoOtp = location.state?.demoOtp || "";

  const [otp, setOtp] = useState(demoOtp || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setLoading(true);

    try {
      const data = await verifyOTP({
        email,
        otp,
      });

      if (!data.success) {
        setError(data.message || "Invalid OTP");
        return;
      }

      setMessage("Email verified successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      console.error(error);
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const data = await resendOTP(email);

      if (data.success) {
        setMessage("New OTP sent to your email");
      } else {
        setError(data.message || "Failed to resend OTP");
      }

    } catch (error) {
      setError("Cannot connect to server");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        <h1 className="text-2xl font-bold text-center mb-4">
          Verify OTP
        </h1>

        <p className="text-center text-gray-600 mb-6">
          OTP sent to:
          <br />
          <b>{email}</b>
        </p>

        {demoOtp && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center text-sm font-semibold text-amber-800">
            Demo OTP: {demoOtp}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
            placeholder="Enter 6 digit OTP"
            className="w-full border rounded-lg px-4 py-3 text-center text-xl tracking-widest"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg mt-4"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

        <button
          onClick={handleResend}
          className="w-full text-blue-600 mt-4"
        >
          Resend OTP
        </button>

      </div>
    </div>
  );
}

export default VerifyOTP;