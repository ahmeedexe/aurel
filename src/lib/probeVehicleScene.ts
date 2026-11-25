import * as THREE from "three";
import { LAMP_MESH_NAMES, WHEEL_HUB_NAMES, type WheelHubId } from "@/lib/glbHierarchy";

export type WheelSpinPart = {
  mesh: THREE.Mesh;
  baseRotation: THREE.Euler;
};

export type WheelProbe = {
  id: WheelHubId;
  group: THREE.Object3D;
  hub: THREE.Vector3;
  /** World-space axle (FL → FR). */
  axleWorld: THREE.Vector3;
  /** Spin axis in wheel-hub local space. */
  axleLocal: THREE.Vector3;
  spinParts: WheelSpinPart[];
};

export type LampProbe = {
  drlL: THREE.Vector3;
  drlR: THREE.Vector3;
  headL: THREE.Vector3;
  headR: THREE.Vector3;
  rear: THREE.Vector3;
  forward: THREE.Vector3;
  local: {
    drlL: THREE.Vector3;
    drlR: THREE.Vector3;
    headL: THREE.Vector3;
    headR: THREE.Vector3;
    rear: THREE.Vector3;
    forward: THREE.Vector3;
    groundL: THREE.Vector3;
    groundR: THREE.Vector3;
  };
  drlMesh: THREE.Mesh | null;
  headMesh: THREE.Mesh | null;
  rearMesh: THREE.Mesh | null;
};

export type ExhaustProbe = {
  left: THREE.Vector3;
  right: THREE.Vector3;
  localLeft: THREE.Vector3;
  localRight: THREE.Vector3;
};

export type VehicleSceneProbe = {
  wheels: WheelProbe[];
  lamps: LampProbe;
  exhaust: ExhaustProbe;
};

const _box = new THREE.Box3();
const _center = new THREE.Vector3();
const _size = new THREE.Vector3();
const _axle = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _inv = new THREE.Matrix4();

function toRigLocal(rig: THREE.Object3D, world: THREE.Vector3): THREE.Vector3 {
  _inv.copy(rig.matrixWorld).invert();
  return world.clone().applyMatrix4(_inv);
}

function meshWorldCenter(mesh: THREE.Mesh, target: THREE.Vector3) {
  _box.setFromObject(mesh);
  _box.getCenter(target);
  return target;
}

function splitLateral(mesh: THREE.Mesh): { left: THREE.Vector3; right: THREE.Vector3 } {
  mesh.updateWorldMatrix(true, true);
  _box.setFromObject(mesh);
  _box.getCenter(_center);
  _box.getSize(_size);

  const left = _center.clone();
  const right = _center.clone();
  const lateral = _size.z >= _size.x ? _size.z : _size.x;
  const offset = lateral * 0.22;
  if (_size.z >= _size.x) {
    left.z -= offset;
    right.z += offset;
  } else {
    left.x -= offset;
    right.x += offset;
  }
  return { left, right };
}

function computeForwardFromWheels(
  flHub: THREE.Vector3,
  frHub: THREE.Vector3,
  rlHub: THREE.Vector3,
  rig: THREE.Object3D
): THREE.Vector3 {
  const lateral = computeAxle(flHub, frHub);
  const up = new THREE.Vector3(0, 1, 0);
  const forward = new THREE.Vector3().crossVectors(lateral, up).normalize();
  const flToRl = rlHub.clone().sub(flHub);
  if (forward.dot(flToRl) < 0) forward.negate();
  rig.getWorldQuaternion(_q);
  forward.applyQuaternion(_q).normalize();
  return forward;
}

function axleLocalForGroup(group: THREE.Object3D, axleWorld: THREE.Vector3): THREE.Vector3 {
  group.updateWorldMatrix(true, false);
  _inv.copy(group.matrixWorld).invert();
  return axleWorld.clone().transformDirection(_inv).normalize();
}

const SPIN_MESH_RE = /^(tire|wheel|brake|centre|nuts|rim_(fl|fr|rl|rr))$/;

function collectSpinParts(group: THREE.Object3D): WheelSpinPart[] {
  const list: WheelSpinPart[] = [];
  group.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    if (!SPIN_MESH_RE.test(obj.name.toLowerCase())) return;
    list.push({ mesh: obj, baseRotation: obj.rotation.clone() });
  });
  return list;
}

function computeAxle(flHub: THREE.Vector3, frHub: THREE.Vector3): THREE.Vector3 {
  return _axle.copy(frHub).sub(flHub).normalize();
}

export function probeVehicleScene(rig: THREE.Object3D, model: THREE.Object3D): VehicleSceneProbe | null {
  rig.updateWorldMatrix(true, true);

  const wheelGroups = new Map<WheelHubId, THREE.Object3D>();
  let body: THREE.Object3D | null = null;
  let drlMesh: THREE.Mesh | null = null;
  let headMesh: THREE.Mesh | null = null;
  let rearMesh: THREE.Mesh | null = null;

  model.traverse((obj) => {
    const name = obj.name as WheelHubId | string;
    if ((WHEEL_HUB_NAMES as readonly string[]).includes(name)) {
      wheelGroups.set(name as WheelHubId, obj);
    }
    if (name === "body") body = obj;
    if (name === LAMP_MESH_NAMES.drl && obj instanceof THREE.Mesh) drlMesh = obj;
    if (name === LAMP_MESH_NAMES.headlamp && obj instanceof THREE.Mesh) headMesh = obj;
    if (name === LAMP_MESH_NAMES.rear && obj instanceof THREE.Mesh) rearMesh = obj;
  });

  if (wheelGroups.size < 4) return null;

  const flGroup = wheelGroups.get("wheel_fl")!;
  const frGroup = wheelGroups.get("wheel_fr")!;
  const rlGroup = wheelGroups.get("wheel_rl")!;
  const flHub = new THREE.Vector3();
  const frHub = new THREE.Vector3();
  const rlHub = new THREE.Vector3();
  flGroup.getWorldPosition(flHub);
  frGroup.getWorldPosition(frHub);
  rlGroup.getWorldPosition(rlHub);
  const axleWorld = computeAxle(flHub, frHub);

  const wheels: WheelProbe[] = WHEEL_HUB_NAMES.map((id) => {
    const group = wheelGroups.get(id)!;
    const hub = new THREE.Vector3();
    group.getWorldPosition(hub);
    return {
      id,
      group,
      hub,
      axleWorld: axleWorld.clone(),
      axleLocal: axleLocalForGroup(group, axleWorld),
      spinParts: collectSpinParts(group),
    };
  });

  const forward = computeForwardFromWheels(flHub, frHub, rlHub, rig);

  let drlL = flHub.clone();
  let drlR = frHub.clone();
  let headL = drlL.clone();
  let headR = drlR.clone();
  let rear = new THREE.Vector3();

  if (drlMesh) {
    const split = splitLateral(drlMesh);
    drlL = split.left;
    drlR = split.right;
  }

  if (headMesh) {
    const split = splitLateral(headMesh);
    headL = split.left;
    headR = split.right;
    headL.y += 0.02;
    headR.y += 0.02;
  } else if (drlMesh) {
    headL = drlL.clone();
    headR = drlR.clone();
    headL.add(forward.clone().multiplyScalar(0.06));
    headR.add(forward.clone().multiplyScalar(0.06));
  }

  if (rearMesh) {
    meshWorldCenter(rearMesh, rear);
  } else {
    rear.copy(_center);
    if (body) {
      _box.setFromObject(body);
      _box.getCenter(rear);
      rear.x -= _box.getSize(_size).x * 0.42;
    }
  }

  rig.updateWorldMatrix(true, true);
  const fwdLocal = toRigLocal(rig, forward).normalize();
  const groundWorldL = headL.clone().add(forward.clone().multiplyScalar(2.85));
  const groundWorldR = headR.clone().add(forward.clone().multiplyScalar(2.85));
  groundWorldL.y = Math.min(flHub.y, frHub.y) - 0.02;
  groundWorldR.y = groundWorldL.y;
  const groundL = toRigLocal(rig, groundWorldL);
  const groundR = toRigLocal(rig, groundWorldR);

  let exhaustLeft = rear.clone();
  let exhaustRight = rear.clone();
  if (rearMesh) {
    meshWorldCenter(rearMesh, rear);
    _box.setFromObject(rearMesh);
    _box.getSize(_size);
    const spread = Math.max(_size.z, _size.x) * 0.22;
    const tail = rear.clone().add(forward.clone().multiplyScalar(-0.18));
    tail.y = _box.min.y + Math.max(_size.y * 0.15, 0.03);
    exhaustLeft = tail.clone().add(axleWorld.clone().multiplyScalar(-spread));
    exhaustRight = tail.clone().add(axleWorld.clone().multiplyScalar(spread));
  } else if (body) {
    _box.setFromObject(body);
    _box.getSize(_size);
    _box.getCenter(_center);
    const spread = Math.max(_size.length() * 0.06, 0.09);
    const halfLen = Math.max(_size.x, _size.z) * 0.44;
    const rearCenter = _center.clone().sub(forward.clone().multiplyScalar(halfLen));
    rearCenter.y = _box.min.y + Math.max(_size.y * 0.07, 0.04);
    exhaustLeft = rearCenter.clone().add(axleWorld.clone().multiplyScalar(-spread));
    exhaustRight = rearCenter.clone().add(axleWorld.clone().multiplyScalar(spread));
  } else {
    exhaustRight = exhaustLeft.clone().add(axleWorld.clone().multiplyScalar(0.18));
  }

  return {
    wheels,
    exhaust: {
      left: exhaustLeft,
      right: exhaustRight,
      localLeft: toRigLocal(rig, exhaustLeft),
      localRight: toRigLocal(rig, exhaustRight),
    },
    lamps: {
      drlL,
      drlR,
      headL,
      headR,
      rear,
      forward,
      local: {
        drlL: toRigLocal(rig, drlL),
        drlR: toRigLocal(rig, drlR),
        headL: toRigLocal(rig, headL),
        headR: toRigLocal(rig, headR),
        rear: toRigLocal(rig, rear),
        forward: fwdLocal,
        groundL,
        groundR,
      },
      drlMesh,
      headMesh,
      rearMesh,
    },
  };
}