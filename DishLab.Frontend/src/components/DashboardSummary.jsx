export default function DashboardSummary({ dishes }) {
  let topDish = null;
  let highestAverage = 0;

  dishes.forEach((dish) => {
    let totalScore = 0;
    let ratingCount = 0;

    if (dish.variations) {
      dish.variations.forEach((variation) => {
        if (variation.ratings) {
          variation.ratings.forEach((rating) => {
            totalScore += rating.score;
            ratingCount += 1;
          });
        }
      });
    }

    if (ratingCount > 0) {
      const average = totalScore / ratingCount;
      if (average > highestAverage) {
        highestAverage = average;
        topDish = dish;
      }
    }
  });

  return (
    <div style={{ border: '2px solid green', padding: '15px', marginBottom: '20px' }}>
      <h2>Dashboard / Sammanställning</h2>
      <p>Totalt antal rätter: {dishes.length}</p>

      {topDish ? (
        <div>
          <h3>Högst betygsatta rätten:</h3>
          <p><strong>{topDish.name}</strong> ({highestAverage.toFixed(1)} / 5 i snittbetyg)</p>
        </div>
      ) : (
        <p>Inga betyg satta än.</p>
      )}
    </div>
  );
}