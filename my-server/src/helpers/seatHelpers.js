const generateDefaultSeats = (busType) => {
  const seats = [];
  let totalSeats = 40; // Mặc định tổng số ghế

  // Xác định số ghế theo loại xe
  if (busType === "Limousine") totalSeats = 20;
  else if (busType === "Giường") totalSeats = 30;
  else if (busType === "Ghế") totalSeats = 40;

  // Chia tầng
  const seatsPerFloor = Math.ceil(totalSeats / 2); // Số ghế mỗi tầng

  // Tạo ghế cho tầng A
  for (let i = 1; i <= seatsPerFloor; i++) {
    seats.push({
      seat_number: `A${i}`, // Ghế tầng A
      status: "available",
    });
  }

  // Tạo ghế cho tầng B
  for (let i = 1; i <= totalSeats - seatsPerFloor; i++) {
    seats.push({
      seat_number: `B${i}`, // Ghế tầng B
      status: "available",
    });
  }

  return seats;
};

module.exports = generateDefaultSeats;
