
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const DEFAULT_BENCHES = [
  { minX: -8.35, maxX: -1.65, minZ: -3.0, maxZ: -1.0 },
  { minX: 1.15, maxX: 7.85, minZ: -3.0, maxZ: -1.0 },
  { minX: -4.3, maxX: 4.3, minZ: 3.2, maxZ: 5.2 },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function findNearestBenchPosition(x, z, benches) {
  let bestPosition = null;
  let shortestDistance = Infinity;

  for (const bench of benches) {
    const candidateX = clamp(x, bench.minX, bench.maxX);
    const candidateZ = clamp(z, bench.minZ, bench.maxZ);

    const distance =
      (candidateX - x) ** 2 +
      (candidateZ - z) ** 2;

    if (distance < shortestDistance) {
      shortestDistance = distance;
      bestPosition = {
        x: candidateX,
        z: candidateZ,
      };
    }
  }

  // Snap to a half-unit grid for more predictable placement.
  return {
    x: clamp(Math.round(bestPosition.x * 2) / 2, -8.35, 8.35),
    z: Math.round(bestPosition.z * 2) / 2,
  };
}

export default function DraggableEquipment({
  objectId,
  position = [0, 0, 0],
  onSelect,
  onDrop,
  onDragChange,
  snapAreas = DEFAULT_BENCHES,
  children,
}) {
  const groupRef = useRef(null);
  const visualRef = useRef(null);

  const targetPosition = useRef(
    new THREE.Vector3(...position)
  );

  const dragPlane = useRef(new THREE.Plane());
  const dragOffset = useRef(new THREE.Vector3());

  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const pointerStart = useRef(new THREE.Vector2());

  const originalY = useRef(position[1]);
  const [posX, posY, posZ] = position;

  useEffect(() => {
    if (draggingRef.current) return;

    targetPosition.current.set(posX, posY, posZ);
    originalY.current = posY;
  }, [posX, posY, posZ]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    const visual = visualRef.current;

    if (!group || !visual) return;

    const target = targetPosition.current;

    group.position.x = THREE.MathUtils.damp(
      group.position.x,
      target.x,
      24,
      delta
    );

    group.position.y = THREE.MathUtils.damp(
      group.position.y,
      target.y,
      24,
      delta
    );

    group.position.z = THREE.MathUtils.damp(
      group.position.z,
      target.z,
      24,
      delta
    );

    const lift = draggingRef.current ? 0.18 : 0;

    visual.position.y = THREE.MathUtils.damp(
      visual.position.y,
      lift,
      18,
      delta
    );

    const scale = THREE.MathUtils.damp(
      visual.scale.x,
      draggingRef.current ? 1.05 : 1,
      16,
      delta
    );

    visual.scale.setScalar(scale);
  });

  const handlePointerDown = (event) => {
    if (event.button !== undefined && event.button !== 0) return;

    event.stopPropagation();

    const group = groupRef.current;
    if (!group) return;

    draggingRef.current = true;
    movedRef.current = false;

    pointerStart.current.set(event.clientX, event.clientY);

    group.updateWorldMatrix(true, false);

    const worldPosition = new THREE.Vector3();
    group.getWorldPosition(worldPosition);

    dragPlane.current.set(
      new THREE.Vector3(0, 1, 0),
      -worldPosition.y
    );

    const intersection = new THREE.Vector3();

    if (event.ray.intersectPlane(
      dragPlane.current,
      intersection
    )) {
      dragOffset.current.copy(
        worldPosition.clone().sub(intersection)
      );
    }

    targetPosition.current.copy(group.position);

    onSelect?.(objectId);
    onDragChange?.(true);

    try {
      event.target.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture may not be supported.
    }
  };

  const handlePointerMove = (event) => {
    if (!draggingRef.current || !groupRef.current) return;

    event.stopPropagation();

    const distance = Math.hypot(
      event.clientX - pointerStart.current.x,
      event.clientY - pointerStart.current.y
    );

    if (distance > 4) {
      movedRef.current = true;
    }

    const intersection = new THREE.Vector3();

    const hit = event.ray.intersectPlane(
      dragPlane.current,
      intersection
    );

    if (!hit) return;

    const worldPosition = intersection.add(
      dragOffset.current
    );

    const parent = groupRef.current.parent;

    const localPosition = parent
      ? parent.worldToLocal(worldPosition.clone())
      : worldPosition;

    targetPosition.current.set(
      localPosition.x,
      originalY.current,
      localPosition.z
    );
  };

  const finishDragging = (event) => {
    if (!draggingRef.current) return;

    event.stopPropagation();

    draggingRef.current = false;

    onDragChange?.(false);

    try {
      event.target.releasePointerCapture(event.pointerId);
    } catch {
      // Ignore unsupported pointer release.
    }

    if (!movedRef.current) return;

    const snapped = findNearestBenchPosition(
      targetPosition.current.x,
      targetPosition.current.z,
      snapAreas
    );

    targetPosition.current.set(
      snapped.x,
      originalY.current,
      snapped.z
    );

    onDrop?.({
      objectId,
      position: targetPosition.current.toArray(),
    });
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDragging}
      onPointerCancel={finishDragging}
    >
      <group ref={visualRef}>
        {children}
      </group>
    </group>
  );
}



