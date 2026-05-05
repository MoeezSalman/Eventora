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

function buildDefaultSeatMap(capacity = 0) {
  // If capacity is provided, generate a dynamic seat map
  if (capacity > 0) {
    const tiers = [
      { name: "VIP", percentage: 0.25, price: 8500 },
      { name: "Premium", percentage: 0.35, price: 4500 },
      { name: "Standard", percentage: 0.40, price: 2500 },
    ];

    const seats = [];

    tiers.forEach((tier) => {
      const tierCapacity = Math.floor(capacity * tier.percentage);
      const rowSize = 20;
      const rows = Math.ceil(tierCapacity / rowSize);

      for (let row = 0; row < rows; row++) {
        const rowLetter = String.fromCharCode(65 + row);
        const seatsInRow = Math.min(rowSize, tierCapacity - row * rowSize);

        for (let col = 0; col < seatsInRow; col++) {
          seats.push({
            code: `${tier.name[0]}_${rowLetter}${col + 1}`,
            tier: tier.name,
            price: tier.price,
            isBooked: false,
          });
        }
      }
    });

    return seats;
  }

  return [
    ...makeSeats(["A", "B", "C"], 18, "VIP", "VIP", 8500),
    ...makeSeats(["A", "B", "C", "D"], 22, "Premium", "P", 4500),
    ...makeSeats(["A", "B", "C", "D", "E", "F"], 26, "Standard", "S", 2500),
  ];
}

module.exports = { buildDefaultSeatMap };
