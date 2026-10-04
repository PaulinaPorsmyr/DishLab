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
    <div className="card border-success mb-4 shadow-sm">
      <div className="card-header bg-success text-white">
        <h2 className="h4 m-0">Dashboard / Sammanställning</h2>
      </div>
      <div className="card-body">
        <p className="card-text">Totalt antal rätter: <strong>{dishes.length}</strong></p>
        {topDish ? (
          <div className="alert alert-success mb-0">
            <h3 className="h5 alert-heading">Högst betygsatta rätten:</h3>
            <p className="mb-0">
              <strong>{topDish.name}</strong> — {highestAverage.toFixed(1)} / 5 i snittbetyg
            </p>
          </div>
        ) : (
          <p className="text-muted mb-0">Inga betyg satta än.</p>
        )}
      </div>
    </div>
  );
}