const buildSeats = (rows, seatsPerRow, section, price) => {
  const seats = [];

  for (const row of rows) {
    for (let i = 1; i <= seatsPerRow; i++) {
      seats.push({
        seatNumber: `${row}${i}`,
        section,
        price,
        booked: false,
      });
    }
  }

  return seats;
};

const generateFixedSeatMap = () => {
  return [
    ...buildSeats(["A", "B", "C"], 18, "VIP", 8500),
    ...buildSeats(["A", "B", "C", "D"], 22, "Premium", 4500),
    ...buildSeats(["A", "B", "C", "D", "E", "F"], 26, "Standard", 2500),
  ];
};

module.exports = generateFixedSeatMap;