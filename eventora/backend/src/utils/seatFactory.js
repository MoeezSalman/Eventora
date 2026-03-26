function makeSeats(rows, seatsPerRow, tier, prefix, price) {
  return rows.flatMap((row) =>
    Array.from({ length: seatsPerRow }, (_, index) => ({
      code: `${prefix}_${row}${index + 1}`,
      tier,
      price,
      isBooked: false,
    }))
  );
}

function buildDefaultSeatMap() {
  return [
    ...makeSeats(["A", "B", "C"], 18, "VIP", "VIP", 8500),
    ...makeSeats(["A", "B", "C", "D"], 22, "Premium", "P", 4500),
    ...makeSeats(["A", "B", "C", "D", "E", "F"], 26, "Standard", "S", 2500),
  ];
}

module.exports = { buildDefaultSeatMap };
