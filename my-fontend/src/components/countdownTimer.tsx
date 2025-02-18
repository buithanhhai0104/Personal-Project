import { useEffect, useState } from "react";
import moment from "moment";

interface CountdownProps {
  seatExpiresAt: string | undefined;
}

const CountdownTimer: React.FC<CountdownProps> = ({ seatExpiresAt }) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  console.log(seatExpiresAt);
  useEffect(() => {
    if (seatExpiresAt) {
      // Chuyển seatExpiresAt thành thời gian UTC
      const expiresAt = moment(seatExpiresAt).utc().valueOf();
      const currentTime = Date.now();

      // Kiểm tra nếu thời gian hết hạn ngay lập tức
      if (expiresAt <= currentTime) {
        setTimeLeft(0);
        return;
      }

      const interval = setInterval(() => {
        const remaining = expiresAt - Date.now();

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
