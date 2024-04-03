// Modified from the original JS one (TODO: this is not KISS..)

/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 */

// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one-finger move
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - right mouse, or left mouse + ctrl/meta/shiftKey, or arrow keys / touch: two-finger move

import * as THREE from 'three'
import { EventDispatcher, Quaternion, Vector3 } from 'three'

enum STATE {
  NONE = -1,
  ROTATE = 0,
  DOLLY = 1,
  PAN = 2,
  TOUCH_ROTATE = 3,
  TOUCH_DOLLY_PAN = 4,
}

enum mouseButtons {
  LEFT = THREE.MOUSE.LEFT,
  MIDDLE = THREE.MOUSE.MIDDLE,
  RIGHT = THREE.MOUSE.RIGHT,
}

enum keys {
  LEFT = 37,
  UP = 38,
  RIGHT = 39,
  BOTTOM = 40,
}

export class OrbitCamera extends EventDispatcher {
  object: any
  domElement: HTMLElement | Document
  enabled: boolean
  target: THREE.Vector3
  minDistance: number
  maxDistance: number
  minZoom: number
  maxZoom: number
  minPolarAngle: number
  maxPolarAngle: number
  minAzimuthAngle: number
  maxAzimuthAngle: number
  enableDamping: boolean
  dampingFactor: number
  enableZoom: boolean
  zoomSpeed: number
  enableRotate: boolean
  rotateSpeed: number
  enablePan: boolean
  panSpeed: number
  screenSpacePanning: boolean
  keyPanSpeed: number
  autoRotate: boolean
  autoRotateSpeed: number
  enableKeys: boolean
  target0: any
  position0: Vector3
  zoom0: number

  constructor(object: any, domElement: HTMLElement) {
    super()

    this.object = object
    this.domElement = domElement !== undefined ? domElement : document
    this.enabled = true
    this.target = new THREE.Vector3()

    // How far you can dolly in and out ( PerspectiveCamera only )
    this.minDistance = 0
    this.maxDistance = Infinity

    // How far you can zoom in and out ( OrthographicCamera only )
    this.minZoom = 0
    this.maxZoom = Infinity

    // How far you can orbit vertically, upper and lower limits.
    // Range is 0 to Math.PI radians.
    this.minPolarAngle = 0 // radians
    this.maxPolarAngle = Math.PI // radians

    // How far you can orbit horizontally, upper and lower limits.
    // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
    this.minAzimuthAngle = -Infinity // radians
    this.maxAzimuthAngle = Infinity // radians

    // Set to true to enable damping (inertia)
    // If damping is enabled, you must call controls.update() in your animation loop
    this.enableDamping = false
    this.dampingFactor = 0.25

    // This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
    // Set to false to disable zooming
    this.enableZoom = true
    this.zoomSpeed = 1.0

    // Set to false to disable rotating
    this.enableRotate = true
    this.rotateSpeed = 1.0

    // Set to false to disable panning
    this.enablePan = true
    this.panSpeed = 1.0
    this.screenSpacePanning = false // if true, pan in screen-space
    this.keyPanSpeed = 7.0 // pixels moved per arrow key push

    // Set to true to automatically rotate around the target
    // If auto-rotate is enabled, you must call controls.update() in your animation loop
    this.autoRotate = false
    this.autoRotateSpeed = 2.0 // 30 seconds per round when fps is 60

    // Set to false to disable use of the keys
    this.enableKeys = true

    // for reset
    this.target0 = this.target.clone()
    this.position0 = this.object.position.clone()
    this.zoom0 = this.object.zoom

    this.domElement.addEventListener('contextmenu', this.onContextMenu, false)
    this.domElement.addEventListener('mousedown', this.onMouseDown, false)
    this.domElement.addEventListener('wheel', this.onMouseWheel, false)
    this.domElement.addEventListener('touchstart', this.onTouchStart, false)
    this.domElement.addEventListener('touchend', this.onTouchEnd, false)
    this.domElement.addEventListener('touchmove', this.onTouchMove, false)
    window.addEventListener('keydown', this.onKeyDown, false)

    this.update() // force an update at start
  }

  getPolarAngle() {
    return this.spherical.phi
  }

  getAzimuthalAngle() {
    return this.spherical.theta
  }

  saveState() {
    this.target0.copy(this.target)
    this.position0.copy(this.object.position)
    this.zoom0 = this.object.zoom
  }

  reset() {
    this.target.copy(this.target0)
    this.object.position.copy(this.position0)
    this.object.zoom = this.zoom0

    this.object.updateProjectionMatrix()
    //dispatchEvent(this.changeEvent) // TODO:

    this.update()

    this.state = STATE.NONE
  }

  update() {
    var offset = new THREE.Vector3()

    // so camera.up is the orbit axis
    var quat: Quaternion = new Quaternion().setFromUnitVectors(
      this.object.up,
      new THREE.Vector3(0, 1, 0)
    )
    var quatInverse = quat; //.clone().inverse()

    var lastPosition = new THREE.Vector3()
    var lastQuaternion = new THREE.Quaternion()

    var position = this.object.position

    offset.copy(position).sub(this.target)

    // rotate offset to "y-axis-is-up" space
    offset.applyQuaternion(quat)

    // angle from z-axis around y-axis
    this.spherical.setFromVector3(offset)

    if (this.autoRotate && this.state === STATE.NONE) {
      this.rotateLeft(this.getAutoRotationAngle())
    }

    this.spherical.theta += this.sphericalDelta.theta
    this.spherical.phi += this.sphericalDelta.phi

    // restrict theta to be between desired limits
    this.spherical.theta = Math.max(
      this.minAzimuthAngle,
      Math.min(this.maxAzimuthAngle, this.spherical.theta)
    )

    // restrict phi to be between desired limits
    this.spherical.phi = Math.max(
      this.minPolarAngle,
      Math.min(this.maxPolarAngle, this.spherical.phi)
    )
    this.spherical.makeSafe()
    this.spherical.radius *= this.scale

    // restrict radius to be between desired limits
    this.spherical.radius = Math.max(
      this.minDistance,
      Math.min(this.maxDistance, this.spherical.radius)
    )

    // move target to panned location
    this.target.add(this.panOffset)

    offset.setFromSpherical(this.spherical) // rotate offset back to "camera-up-vector-is-up" space
    offset.applyQuaternion(quatInverse)

    position.copy(this.target).add(offset)

    this.object.lookAt(this.target)

    if(this.enableDamping === true) {
      this.sphericalDelta.theta *= 1 - this.dampingFactor
      this.sphericalDelta.phi *= 1 - this.dampingFactor

      this.panOffset.multiplyScalar(1 - this.dampingFactor)
    } else {
      this.sphericalDelta.set(0, 0, 0)
      this.panOffset.set(0, 0, 0)
    }

    this.scale = 1

    // update condition is:
    // min(camera displacement, camera rotation in radians)^2 > EPS
    // using small-angle approximation cos(x/2) = 1 - x^2 / 8
    if (this.zoomChanged ||
        lastPosition.distanceToSquared(this.object.position) > this.EPS ||
        8 * (1 - lastQuaternion.dot(this.object.quaternion)) > this.EPS) {
      //this.dispatchEvent(changeEvent) // TODO:

      lastPosition.copy(this.object.position)
      lastQuaternion.copy(this.object.quaternion)
      this.zoomChanged = false

      return true
    }

    return false
  }

  dispose() {
    this.domElement.removeEventListener('contextmenu', this.onContextMenu, false)
    this.domElement.removeEventListener('mousedown', this.onMouseDown, false)
    this.domElement.removeEventListener('wheel', this.onMouseWheel, false)

    this.domElement.removeEventListener('touchstart', this.onTouchStart, false)
    this.domElement.removeEventListener('touchend', this.onTouchEnd, false)
    this.domElement.removeEventListener('touchmove', this.onTouchMove, false)

    document.removeEventListener('mousemove', this.onMouseMove, false)
    document.removeEventListener('mouseup', this.onMouseUp, false)

    window.removeEventListener('keydown', this.onKeyDown, false)

    //this.dispatchEvent( { type: 'dispose' } ); // should this be added here?
  }

  //
  // internals
  //

  this = this

  changeEvent = { type: 'change' }
  startEvent = { type: 'start' }
  endEvent = { type: 'end' }

  state = STATE.NONE

  EPS = 0.000001

  // current position in spherical coordinates
  spherical = new THREE.Spherical()
  sphericalDelta = new THREE.Spherical()

  scale = 1
  panOffset = new THREE.Vector3()
  zoomChanged = false

  rotateStart = new THREE.Vector2()
  rotateEnd = new THREE.Vector2()
  rotateDelta = new THREE.Vector2()

  panStart = new THREE.Vector2()
  panEnd = new THREE.Vector2()
  panDelta = new THREE.Vector2()

  dollyStart = new THREE.Vector2()
  dollyEnd = new THREE.Vector2()
  dollyDelta = new THREE.Vector2()

  getAutoRotationAngle() {
    return ((2 * Math.PI) / 60 / 60) * this.autoRotateSpeed
  }

  getZoomScale() {
    return Math.pow(0.95, this.zoomSpeed)
  }

  rotateLeft(angle: number) {
    this.sphericalDelta.theta -= angle
  }

  rotateUp(angle: number) {
    this.sphericalDelta.phi -= angle
  }

  panLeft(distance: number, objectMatrix: /*TODO: */ any) {
    const v = new THREE.Vector3()
    v.setFromMatrixColumn(objectMatrix, 0) // get X column of objectMatrix
    v.multiplyScalar(-distance)
    this.panOffset.add(v)
  }

  panUp(distance: number, objectMatrix: /*TODO: */ any) {
    var v = new THREE.Vector3()
    if (this.screenSpacePanning === true) {
      v.setFromMatrixColumn(objectMatrix, 1)
    } else {
      v.setFromMatrixColumn(objectMatrix, 0)
      v.crossVectors(this.object.up, v)
    }
    v.multiplyScalar(distance)
    this.panOffset.add(v)
  }

  // deltaX and deltaY are in pixels; right and down are positive
  pan(deltaX: number, deltaY: number) {
    var offset = new THREE.Vector3()
    var element = this.domElement === document ? this.domElement.body : this.domElement

    if (this.object.isPerspectiveCamera) {
      // perspective
      var position = this.object.position
      offset.copy(position).sub(this.target)
      var targetDistance = offset.length()

      // half of the fov is center to top of screen
      targetDistance *= Math.tan(((this.object.fov / 2) * Math.PI) / 180.0)

      // we use only clientHeight here so aspect ratio does not distort speed
      this.panLeft((2 * deltaX * this.targetDistance) / element.clientHeight, this.object.matrix)
      this.panUp((2 * deltaY * this.targetDistance) / element.clientHeight, this.object.matrix)
    } else if (this.object.isOrthographicCamera) {
      // orthographic
      this.panLeft(
        (deltaX * (this.object.right - this.object.left)) / this.object.zoom / element.clientWidth,
        this.object.matrix
      )
      this.panUp(
        (deltaY * (this.object.top - this.object.bottom)) / this.object.zoom / element.clientHeight,
        this.object.matrix
      )
    } else {
      // camera neither orthographic nor perspective
      console.warn(
        'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.'
      )
      this.enablePan = false
    }
  }

  dollyIn(dollyScale: number) {
    if (this.object.isPerspectiveCamera) {
      this.scale /= dollyScale
    } else if (this.object.isOrthographicCamera) {
      this.object.zoom = Math.max(
        this.minZoom,
        Math.min(this.maxZoom, this.object.zoom * dollyScale)
      )
      this.object.updateProjectionMatrix()
      this.zoomChanged = true
    } else {
      console.warn(
        'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.'
      )
      this.enableZoom = false
    }
  }

  dollyOut(dollyScale: number) {
    if (this.object.isPerspectiveCamera) {
      this.scale *= dollyScale
    } else if (this.object.isOrthographicCamera) {
      this.object.zoom = Math.max(
        this.minZoom,
        Math.min(this.maxZoom, this.object.zoom / dollyScale)
      )
      this.object.updateProjectionMatrix()
      this.zoomChanged = true
    } else {
      console.warn(
        'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.'
      )
      this.enableZoom = false
    }
  }

  //
  // event callbacks - update the object state
  //
  handleMouseDownRotate(event: MouseEvent) {
    //console.log( 'handleMouseDownRotate' );
    this.rotateStart.set(event.clientX, event.clientY)
  }

  handleMouseDownDolly(event: MouseEvent) {
    //console.log( 'handleMouseDownDolly' );
    this.dollyStart.set(event.clientX, event.clientY)
  }

  handleMouseDownPan(event: MouseEvent) {
    //console.log( 'handleMouseDownPan' );
    this.panStart.set(event.clientX, event.clientY)
  }

  handleMouseMoveRotate(event: MouseEvent) {
    //console.log( 'handleMouseMoveRotate' );
    this.rotateEnd.set(event.clientX, event.clientY)

    this.rotateDelta
      .subVectors(this.rotateEnd, this.rotateStart)
      .multiplyScalar(this.rotateSpeed)

    var element = this.domElement === document ? this.domElement.body : this.domElement

    this.rotateLeft((2 * Math.PI * this.rotateDelta.x) / element.clientHeight) // yes, height
    this.rotateUp((2 * Math.PI * this.rotateDelta.y) / element.clientHeight)

    this.rotateStart.copy(this.rotateEnd)

    this.update()
  }

  handleMouseMoveDolly(event: MouseEvent) {
    //console.log( 'handleMouseMoveDolly' );
    this.dollyEnd.set(event.clientX, event.clientY)
    this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart)

    if (this.dollyDelta.y > 0) {
      this.dollyIn(this.getZoomScale())
    } else if (dollyDelta.y < 0) {
      this.dollyOut(this.getZoomScale())
    }

    this.dollyStart.copy(this.dollyEnd)
    this.update()
  }

  handleMouseMovePan(event: MouseEvent) {
    //console.log( 'handleMouseMovePan' );
    this.panEnd.set(event.clientX, event.clientY)
    this.panDelta.subVectors(this.panEnd, this.panStart).multiplyScalar(this.panSpeed)
    this.pan(this.panDelta.x, this.panDelta.y)
    this.panStart.copy(this.panEnd)
    this.update()
  }

  handleMouseUp(event: MouseEvent) {
    // console.log( 'handleMouseUp' );
  }

  handleMouseWheel(event: WheelEvent) {
    // console.log( 'handleMouseWheel' );
    if (event.deltaY < 0) {
      this.dollyOut(this.getZoomScale())
    } else if (event.deltaY > 0) {
      this.dollyIn(this.getZoomScale())
    }

    this.update()
  }

  handleKeyDown(event: KeyboardEvent) {
    // console.log( 'handleKeyDown' );
    var needsUpdate = false

    switch (event.keyCode) {
      case keys.UP:     this.pan(0, this.keyPanSpeed); needsUpdate = true; break;
      case keys.BOTTOM: this.pan(0, -this.keyPanSpeed); needsUpdate = true; break;
      case keys.LEFT:   this.pan(this.keyPanSpeed, 0); needsUpdate = true; break;
      case keys.RIGHT:  this.pan(-this.keyPanSpeed, 0); needsUpdate = true; break;
    }

    if (needsUpdate) {
      // prevent the browser from scrolling on cursor keys
      event.preventDefault()
      this.update()
    }
  }

  handleTouchStartRotate(event: TouchEvent) {
    //console.log( 'handleTouchStartRotate' );
    this.rotateStart.set(event.touches[0].pageX, event.touches[0].pageY)
  }

  handleTouchStartDollyPan(event: TouchEvent) {
    //console.log( 'handleTouchStartDollyPan' );
    if (this.enableZoom) {
      var dx = event.touches[0].pageX - event.touches[1].pageX
      var dy = event.touches[0].pageY - event.touches[1].pageY

      var distance = Math.sqrt(dx * dx + dy * dy)

      this.dollyStart.set(0, distance)
    }

    if (this.enablePan) {
      var x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX)
      var y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY)

      this.panStart.set(x, y)
    }
  }

  handleTouchMoveRotate(event: TouchEvent) {
    //console.log( 'handleTouchMoveRotate' );
    this.rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY)

    this.rotateDelta
      .subVectors(this.rotateEnd, this.rotateStart)
      .multiplyScalar(this.rotateSpeed)

    var element =
      this.domElement === document ? this.domElement.body : this.domElement

    this.rotateLeft((2 * Math.PI * this.rotateDelta.x) / element.clientHeight) // yes, height
    this.rotateUp((2 * Math.PI * this.rotateDelta.y) / element.clientHeight)

    this.rotateStart.copy(this.rotateEnd)

    this.update()
  }

  handleTouchMoveDollyPan(event: TouchEvent) {
    //console.log( 'handleTouchMoveDollyPan' );
    if (this.enableZoom) {
      var dx = event.touches[0].pageX - event.touches[1].pageX
      var dy = event.touches[0].pageY - event.touches[1].pageY
      var distance = Math.sqrt(dx * dx + dy * dy)

      this.dollyEnd.set(0, distance)
      this.dollyDelta.set(0, Math.pow(this.dollyEnd.y / this.dollyStart.y, this.zoomSpeed))

      this.dollyIn(this.dollyDelta.y)

      this.dollyStart.copy(this.dollyEnd)
    }

    if (this.enablePan) {
      var x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX)
      var y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY)
      this.panEnd.set(x, y)
      this.panDelta.subVectors(this.panEnd, this.panStart).multiplyScalar(this.panSpeed)

      this.pan(this.panDelta.x, this.panDelta.y)

      this.panStart.copy(this.panEnd)
    }

    this.update()
  }

  handleTouchEnd(event: TouchEvent) {
    //console.log( 'handleTouchEnd' );
  }

  //
  // event handlers - FSM: listen for events and reset state
  //
  onMouseDown(event: MouseEvent) {
    if (this.enabled === false) return

    // Prevent the browser from scrolling.
    event.preventDefault()

    // Manually set the focus since calling preventDefault above
    // prevents the browser from setting it automatically.
    this.domElement.onfocus ? this.domElement.onfocus : window.focus() // TODO: was domElement.focus, check

    switch (event.button) {
      case mouseButtons.LEFT:
        if (event.ctrlKey || event.metaKey || event.shiftKey) {
          if (this.enablePan === false) return
          this.handleMouseDownPan(event)
          this.state = STATE.PAN
        } else {
          if (this.enableRotate === false) return
          this.handleMouseDownRotate(event)
          this.state = STATE.ROTATE
        }
        break

      case mouseButtons.MIDDLE:
        if (this.enableZoom === false) return
        this.handleMouseDownDolly(event)
        this.state = STATE.DOLLY
        break

      case mouseButtons.RIGHT:
        if (this.enablePan === false) return
        this.handleMouseDownPan(event)
        this.state = STATE.PAN
        break
    }

    if (this.state !== STATE.NONE) {
      document.addEventListener('mousemove', this.onMouseMove, false)
      document.addEventListener('mouseup', this.onMouseUp, false)
      //dispatchEvent(this.startEvent) // TODO:
    }
  }

  onMouseMove(event: MouseEvent) {
    if (this.enabled === false) return
    event.preventDefault()

    switch (this.state) {
      case STATE.ROTATE:
        if (this.enableRotate === false) return
        this.handleMouseMoveRotate(event)
        break

      case STATE.DOLLY:
        if (this.enableZoom === false) return
        this.handleMouseMoveDolly(event)
        break

      case STATE.PAN:
        if (this.enablePan === false) return
        this.handleMouseMovePan(event)
        break
    }
  }

  onMouseUp(event: MouseEvent) {
    if (this.enabled === false) return
    this.handleMouseUp(event)

    document.removeEventListener('mousemove', this.onMouseMove, false)
    document.removeEventListener('mouseup', this.onMouseUp, false)

    //this.dispatchEvent(endEvent) // TODO:

    this.state = STATE.NONE
  }

  onMouseWheel(event: WheelEvent) {
    if (this.enabled === false ||
        this.enableZoom === false ||
       (this.state !== STATE.NONE && this.state !== STATE.ROTATE)) return

    event.preventDefault()
    event.stopPropagation()

    //this.dispatchEvent(startEvent) // TODO:
    this.handleMouseWheel(event)
    //this.dispatchEvent(endEvent) // TODO:
  }

  onKeyDown(event: KeyboardEvent) {
    if (this.enabled === false ||
        this.enableKeys === false ||
        this.enablePan === false)
      return
    
    this.handleKeyDown(event)
  }

  onTouchStart(event: TouchEvent) {
    if (this.enabled === false) return

    event.preventDefault()

    switch (event.touches.length) {
      case 1: // one-fingered touch: rotate
        if (this.enableRotate === false) return

        this.handleTouchStartRotate(event)

        this.state = STATE.TOUCH_ROTATE

        break

      case 2: // two-fingered touch: dolly-pan
        if (this.enableZoom === false && this.enablePan === false) return

        this.handleTouchStartDollyPan(event)

        this.state = STATE.TOUCH_DOLLY_PAN

        break

      default:
        this.state = STATE.NONE
    }

    if (this.state !== STATE.NONE) {
      //this.dispatchEvent(startEvent) // TODO:
    }
  }

  onTouchMove(event: TouchEvent) {
    if (this.enabled === false) return

    event.preventDefault()
    event.stopPropagation()

    switch (event.touches.length) {
      case 1: // one-fingered touch: rotate
        if (this.enableRotate === false) return
        if (this.state !== STATE.TOUCH_ROTATE) return // is this needed?
        this.handleTouchMoveRotate(event)
        break

      case 2: // two-fingered touch: dolly-pan
        if (this.enableZoom === false && this.enablePan === false) return
        if (this.state !== STATE.TOUCH_DOLLY_PAN) return // is this needed?
        this.handleTouchMoveDollyPan(event)
        break

      default:
        this.state = STATE.NONE
    }
  }

  onTouchEnd(event: TouchEvent) {
    if (this.enabled === false) return
    this.handleTouchEnd(event)
    //this.dispatchEvent(endEvent) // TODO:
    this.state = STATE.NONE
  }

  onContextMenu(event: Event) {
    if (this.enabled === false) return
    event.preventDefault()
  }
}