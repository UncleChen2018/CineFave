

function ratingToColor(rating) {
  if (rating >= 7) {
    return 'green.400';
  } else if (rating >= 4) {
    return 'yellow.400';
  } else {
    return 'red.400';
  }
}

export { ratingToColor };
