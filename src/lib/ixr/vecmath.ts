// TODO: actually a part of Islefire XR engine, but as the owner of Islefire, can do things. Business < Progress.

//************************************************************************
//  2D vector
//************************************************************************
export interface vec2 {
  x: number;
  y: number;
}

export namespace vec2 {
  export function zero()  : vec2 { return { x: 0, y: 0 }; }
  export function right() : vec2 { return { x: 1, y: 0 }; }
  export function left()  : vec2 { return { x: -1, y: 0 }; }
  export function up()    : vec2 { return { x: 0, y: 1 }; }
  export function down()  : vec2 { return { x: 0, y: -1 }; }

  export function len(v: vec2): number {
    return Math.sqrt(v.x*v.x + v.y*v.y);
  }
  export function oneOverLen(v: vec2): number {
    return 1.0 / len(v); // TODO: handle zero vector divide-by-zero?
  }
  export function normalize(v: vec2): vec2 {
    const rcp = oneOverLen(v);
    return { x: rcp*v.x, y: rcp*v.y };
  }
}

//************************************************************************
//  3D vector
//************************************************************************
export interface vec3 {
  x: number;
  y: number;
  z: number;
}

export namespace vec3 {
  export function zero()    : vec3 { return { x: 0, y: 0, z: 0 }; }
  export function right()   : vec3 { return { x: 1, y: 0, z: 1 }; }
  export function up()      : vec3 { return { x: 0, y: 1, z: 0 }; }
  export function forward() : vec3 { return { x: 0, y: 0, z: 1 }; }
  
  export function len(v: vec3): number {
    return Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
  }
  export function oneOverLen(v: vec3): number {
    return 1.0 / len(v); // TODO: handle zero vector divide-by-zero?
  }
  export function normalize(v: vec3): vec3 {
    const rcp = oneOverLen(v);
    return { x: rcp*v.x, y: rcp*v.y, z: rcp*v.z };
  }
}

//************************************************************************
//  4D vector
//************************************************************************
export interface vec4 {
  x: number;
  y: number;
  z: number;
  w: number;
}

export namespace vec4 {
  export function zero() : vec4 { return { x: 0, y: 0, z: 0, w: 0 }; }
  export function origin() : vec4 { return { x: 0, y: 0, z: 0, w: 1 }; }
  export function dir(v: vec3) : vec4 { return {x: v.x, y: v.y, z: v.z, w: 0 } }
  export function point(v: vec3) : vec4 { return {x: v.x, y: v.y, z: v.z, w: 1 } }
}

//************************************************************************
//  3x3 matrix
//
//  Example usage:
//    const rotationMatrix = mat3.rotationX(Math.PI / 2); // Rotate 90 degrees around X axis
//    console.log(rotationMatrix.get(1, 1)); // Output: 0
//    console.log(rotationMatrix.get(2, 2)); // Output: 1
//************************************************************************
export class mat3 {
  private data: number[][];

  constructor() {
    this.data = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
  }

  float32Array(): Float32Array {
    const flatData = this.data.flat();
    return new Float32Array(flatData);
  }

  // Set value at specific row and column
  set(row: number, col: number, value: number): void {
    this.data[row][col] = value;
  }

  // Get value at specific row and column
  get(row: number, col: number): number {
    return this.data[row][col];
  }

  // Identity matrix
  static identity(): mat3 {
    const mat = new mat3();
    for (let i = 0; i < 3; i++) {
      mat.set(i, i, 1);
    }
    return mat;
  }

  // Rotation matrix around X axis (counter-clockwise)
  static rotationX(angle: number): mat3 {
    const mat = new mat3();
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    mat.set(0, 0, 1);
    mat.set(1, 1, cosA);
    mat.set(1, 2, -sinA);
    mat.set(2, 1, sinA);
    mat.set(2, 2, cosA);
    return mat;
  }

  // Rotation matrix around Y axis (counter-clockwise)
  static rotationY(angle: number): mat3 {
    const mat = new mat3();
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    mat.set(0, 0, cosA);
    mat.set(0, 2, sinA);
    mat.set(1, 1, 1);
    mat.set(2, 0, -sinA);
    mat.set(2, 2, cosA);
    return mat;
  }

  // Rotation matrix around Z axis (counter-clockwise)
  static rotationZ(angle: number): mat3 {
    const mat = new mat3();
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    mat.set(0, 0, cosA);
    mat.set(0, 1, -sinA);
    mat.set(1, 0, sinA);
    mat.set(1, 1, cosA);
    mat.set(2, 2, 1);
    return mat;
  }

  // Multiplication of two matrices
  static multiply(mat1: mat3, mat2: mat3): mat3 {
    const result = new mat3();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let sum = 0;
        for (let k = 0; k < 3; k++) {
          sum += mat1.get(i, k) * mat2.get(k, j);
        }
        result.set(i, j, sum);
      }
    }
    return result;
  }

  // Fluent/chainable multiply
  multiply(other: mat3): mat3 {
    const result = new mat3();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let sum = 0;
        for (let k = 0; k < 3; k++) {
          sum += this.get(i, k) * other.get(k, j);
        }
        result.set(i, j, sum);
      }
    }
    return result;
  }
}
