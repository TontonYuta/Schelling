/**
 * A simple and efficient 2D KD-Tree implementation for spatial queries.
 */

export type Point = {
  x: number;
  y: number;
  id: number;
};

class KDNode {
  point: Point;
  left: KDNode | null = null;
  right: KDNode | null = null;
  axis: number;

  constructor(point: Point, axis: number) {
    this.point = point;
    this.axis = axis;
  }
}

export class KDTree {
  root: KDNode | null = null;

  constructor(points: Point[]) {
    this.root = this.build(points, 0);
  }

  private build(points: Point[], depth: number): KDNode | null {
    if (points.length === 0) return null;

    const axis = depth % 2;
    
    // Use a simple median selection by sorting. 
    // To make it O(N log N) total, we could use quickselect, 
    // but sorting the sub-array is O(K log K) where K is sub-array size.
    // The recurrence T(N) = 2T(N/2) + O(N log N) is O(N log^2 N).
    // To get O(N log N), we need T(N) = 2T(N/2) + O(N).
    // We can achieve this by using a median-finding algorithm (Quickselect).
    
    const medianIndex = Math.floor(points.length / 2);
    this.quickSelect(points, 0, points.length - 1, medianIndex, axis);
    
    const node = new KDNode(points[medianIndex], axis);
    node.left = this.build(points.slice(0, medianIndex), depth + 1);
    node.right = this.build(points.slice(medianIndex + 1), depth + 1);

    return node;
  }

  private quickSelect(arr: Point[], left: number, right: number, k: number, axis: number) {
    while (right > left) {
      const pivotIndex = this.partition(arr, left, right, axis);
      if (pivotIndex === k) return;
      if (pivotIndex > k) right = pivotIndex - 1;
      else left = pivotIndex + 1;
    }
  }

  private partition(arr: Point[], left: number, right: number, axis: number): number {
    const pivot = arr[right];
    let i = left;
    for (let j = left; j < right; j++) {
      const val = axis === 0 ? arr[j].x : arr[j].y;
      const pivotVal = axis === 0 ? pivot.x : pivot.y;
      if (val < pivotVal) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i++;
      }
    }
    [arr[i], arr[right]] = [arr[right], arr[i]];
    return i;
  }

  /**
   * Finds all points within a given radius of a target point.
   */
  queryRadius(target: { x: number; y: number }, radius: number): Point[] {
    const result: Point[] = [];
    const radiusSq = radius * radius;

    const search = (node: KDNode | null) => {
      if (!node) return;

      const dx = target.x - node.point.x;
      const dy = target.y - node.point.y;
      const distSq = dx * dx + dy * dy;

      if (distSq <= radiusSq) {
        result.push(node.point);
      }

      const axisDist = node.axis === 0 ? target.x - node.point.x : target.y - node.point.y;

      if (axisDist < radius) {
        search(node.left);
      }
      if (axisDist > -radius) {
        search(node.right);
      }
    };

    search(this.root);
    return result;
  }
}
