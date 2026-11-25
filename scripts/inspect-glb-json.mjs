/**
 * Read GLB JSON chunk only (no Draco decode) — mesh/node names and hierarchy.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const glb = path.join(root, "..", "public", "models", "aurel-type-01.glb");
const buf = await readFile(glb);
const jsonLen = buf.readUInt32LE(12);
const json = JSON.parse(buf.slice(20, 20 + jsonLen).toString("utf8"));

const meshes = (json.meshes ?? []).map((m, i) => ({
  index: i,
  name: m.name ?? `mesh_${i}`,
  primitives: m.primitives?.length ?? 0,
}));

const nodes = (json.nodes ?? []).map((n, i) => ({
  index: i,
  name: n.name ?? `node_${i}`,
  mesh: n.mesh,
  children: n.children ?? [],
}));

function buildTree(nodeIndex, depth = 0) {
  const n = nodes[nodeIndex];
  if (!n) return null;
  const meshName = n.mesh != null ? meshes[n.mesh]?.name : null;
  return {
    name: n.name,
    mesh: meshName,
    depth,
    children: n.children.map((c) => buildTree(c, depth + 1)).filter(Boolean),
  };
}

const scenes = (json.scenes ?? []).map((s, si) => ({
  scene: si,
  name: s.name,
  tree: (s.nodes ?? []).map((ni) => buildTree(ni)),
}));

const meshNames = [...new Set(meshes.map((m) => m.name))].sort();

console.log(
  JSON.stringify(
    {
      asset: json.asset,
      meshCount: meshes.length,
      uniqueMeshNames: meshNames,
      meshes,
      nodeCount: nodes.length,
      nodes: nodes.map((n) => ({
        name: n.name,
        mesh: n.mesh != null ? meshes[n.mesh]?.name : null,
        children: n.children,
      })),
      scenes,
    },
    null,
    2
  )
);