// TODO: actually a part of Islefire XR engine, but as the owner of Islefire, can do things. Business < Progress.

// TODO: particle: vec3 pos; u32 color;
// TODO: particle physics (Velocity Verlet): vec3 vel; u8 bounciness; u1 sticky; u8 friction; 
//  - sticky just makes it flow down the walls etc by inv friction
// TODO: don't use 64bit doubles.. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays
// TODO: objects are added as [start,count]. Keep empty list of ranges too.

import { vec3 } from './vecmath'

interface Particle {
  pos: vec3
  color: string // TODO: u32 RGBA
}

interface ParticlePhysics {
  vel: vec3
  bounciness: number // TODO: u8
  friction: number // TODO: u8, bounce 0.0 friction 1.0 sticks to walls
}

const MAX_PARTICLES = 1024*1024; // TODO: more?
export const particles = new Array<Particle>(MAX_PARTICLES);
export const particlephysics = new Array<ParticlePhysics>(MAX_PARTICLES);
