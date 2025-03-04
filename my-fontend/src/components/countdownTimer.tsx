import { useEffect, useState } from "react";

interface CountdownProps {
  seatExpiresAt: string | undefined;
  setPaymentTimeExpires: (value: boolean) => void;
}

const CountdownTimer: React.FC<CountdownProps> = ({
  seatExpiresAt,
  setPaymentTimeExpires,
}) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (seatExpiresAt) {
      const expiresAt = new Date(seatExpiresAt).getTime();
      const currentTime = Date.now();

      if (expiresAt <= currentTime) {
        setTimeLeft(0);
        setPaymentTimeExpires(false);

        return;
      }

      setPaymentTimeExpires(true);

      const interval = setInterval(() => {
        const remaining = expiresAt - Date.now();

        if (remaining <= 0) {
          clearInterval(interval);
          setTimeLeft(0);
          setPaymentTimeExpires(false);
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [seatExpiresAt, setPaymentTimeExpires]);

  if (timeLeft === null) return null;

  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <span>
      {timeLeft > 0
        ? `${minutes}:${seconds < 10 ? `0${seconds}` : seconds} phút`
        : "Hết hạn"}
    </span>
  );
};

export default CountdownTimer;
