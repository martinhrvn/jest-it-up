const getNewThresholds = (thresholds, coverages, margin, round, tolerance) =>
  Object.entries(thresholds).reduce((acc, [type, threshold]) => {
    const { pct: coverage } = coverages[type]

    const desiredCoverage = coverage - tolerance
    const r = round || 0.001
    // Only update threshold if new coverage is higher than
    // current threshold + margin
    if (desiredCoverage >= threshold + margin) {
      acc[type] = {
        prev: threshold,
        next: Math.floor(desiredCoverage / r) * r,
        diff: +(desiredCoverage - threshold).toFixed(2),
      }
    }

    return acc
  }, {})

module.exports = getNewThresholds
