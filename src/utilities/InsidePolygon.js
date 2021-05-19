const MIN = (x, y) => {
  if (x < y) return x;
  else return y;
};

const MAX = (x, y) => {
  if (x > y) return x;
  else return y;
};
export const InsidePolygon = (polygon, p) => {
  let n = polygon.length - 1;
  let counter = 0;
  let i;
  let xinters;
  let p1 = [0, 0];
  let p2 = [0, 0];

  p1 = polygon[0];
  for (i = 1; i <= n; i++) {
    let j = i % n;
    p2 = polygon[j];
    if (p[1] > MIN(p1[1], p2[1])) {
      if (p[1] <= MAX(p1[1], p2[1])) {
        if (p[0] <= MAX(p1[0], p2[0])) {
          if (p1[1] != p2[1]) {
            xinters =
              ((p[1] - p1[1]) * (p2[0] - p1[0])) / (p2[1] - p1[1]) + p1[0];
            if (p1[0] === p2[0] || p[0] <= xinters) {
              counter++;
            }
          }
        }
      }
    }
    p1 = p2;
  }
  if (counter % 2 === 0) return 1;
  else return 0;
};
