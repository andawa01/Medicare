import React, { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

const VerifyServicePaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  (useEffect(() => {
    let cancelled = false;
    const verifyServicePayment = async () => {
      const params = new URLSearchParams(location.search || "");
      const sessionId = params.get("session_id");

      if (location.pathname === "/service-appointment/cancel") {
        if (!cancelled) {
          navigate("/appointments?service_payment_status=Cancelled", {
            replace: true,
          });
        }
        return;
      }

      if (!sessionId) {
        if (!cancelled) {
          navigate("/appointments?service_payment_status=Failed", {
            replace: true,
          });
        }
        return;
      }

      try {
        const res = await axios.get(
          `${API_BASE}/api/service-appointments/confirm`,
          {
            params: { session_id: sessionId },
            timeout: 15000,
          },
        );

        if (cancelled) return;
        if (res?.data?.success) {
          navigate("/appointments?service_payment_status=Paid", {
            replace: true,
          });
        } else {
          navigate("/appointments?service_payment_status=Failed", {
            replace: true,
          });
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        if (!cancelled) {
          navigate("/appointments?service_payment_status=Failed", {
            replace: true,
          });
        }
      }
    };

    verifyServicePayment();
    return () => (cancelled = true);
  }),
    [location, navigate]);
  return null;
};

export default VerifyServicePaymentPage;
