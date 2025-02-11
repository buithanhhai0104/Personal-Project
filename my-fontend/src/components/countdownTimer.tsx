import { useEffect, useState } from "react";
interface CountdownProps {
  seatExpiresAt: string | undefined;
}

const CountdownTimer: React.FC<CountdownProps> = ({ seatExpiresAt }) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (seatExpiresAt) {
      const expiresAt = new Date(seatExpiresAt).getTime();
      const interval = setInterval(() => {
        const currentTime = Date.now();
        const remaining = expiresAt - currentTime;

        if (remaining <= 0) {
          clearInterval(interval);
          setTimeLeft(0);
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [seatExpiresAt]);

  if (timeLeft === null) return null;

  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <div>
      {timeLeft > 0 ? (
        <span>
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds} phút
        </span>
      ) : (
        <span>Hết hạn</span>
      )}
    </div>
  );
};

export default CountdownTimer;
