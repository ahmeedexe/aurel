import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const glb = path.join(root, "..", "public", "models", "aurel-type-01.glb");
const buf = await readFile(glb);
const loader = new GLTFLoader();
const draco = new DRACOLoader();
draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
loader.setDRACOLoader(draco);
const gltf = await new Promise((resolve, reject) => {
  loader.parse(buf.buffer, "", resolve, reject);
});

const names = [];
gltf.scene.traverse((o) => {
  if (o instanceof THREE.Mesh) names.push(o.name);
});
console.log(JSON.stringify([...new Set(names)].sort(), null, 2));