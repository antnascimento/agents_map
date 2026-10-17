import * as THREE from 'three';

export interface ExteriorWorld {
  group: THREE.Group;
  update: (delta: number, elapsed: number) => void;
}

export function createExteriorWorld(): ExteriorWorld {
  const group = new THREE.Group();

  // 1. PROCEDURAL ROLLING HILLS (Slow Roads aesthetic)
  // Large terrain mesh with sinusoidal undulating elevations
  const terrainSize = 1200;
  const terrainSegments = 120;
  const terrainGeo = new THREE.PlaneGeometry(terrainSize, terrainSize, terrainSegments, terrainSegments);
  terrainGeo.rotateX(-Math.PI / 2);

  const posAttr = terrainGeo.attributes.position;
  const colors: number[] = [];

  const cValley = new THREE.Color(0x528842); // Lush valley green
  const cHill = new THREE.Color(0x6fa754);   // Sunny hill green
  const cRidge = new THREE.Color(0x8cb86d);  // Distant warm ridge

  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);

    // Keep building footprint (X: [-40, 40], Z: [-40, 40]) flat
    const distFromCenter = Math.hypot(x, z);
    let elevation = 0;

    if (distFromCenter > 50) {
      const blend = Math.min(1, (distFromCenter - 50) / 120);
      // Multi-frequency rolling hills like Slow Roads
      const h1 = Math.sin(x * 0.008 + 1.2) * Math.cos(z * 0.007 + 0.4) * 28;
      const h2 = Math.sin(x * 0.018 - 0.7) * Math.sin(z * 0.015 + 1.5) * 14;
      const h3 = Math.cos(x * 0.004 + z * 0.003) * 35;
      elevation = (h1 + h2 + h3) * blend;
    }

    posAttr.setY(i, elevation - 0.5);

    // Elevation-based meadow color gradient
    const t = Math.max(0, Math.min(1, (elevation + 20) / 60));
    const vertexColor = t < 0.5 ? cValley.clone().lerp(cHill, t * 2) : cHill.clone().lerp(cRidge, (t - 0.5) * 2);
    colors.push(vertexColor.r, vertexColor.g, vertexColor.b);
  }

  terrainGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  terrainGeo.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.85,
    metalness: 0.05,
    flatShading: true,
  });

  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  terrainMesh.receiveShadow = true;
  group.add(terrainMesh);

  // 2. SCENIC HIGHWAY SYSTEM (Winding asphalt roads with lane markings)
  // Winding outer loop road encircling the building valley
  const roadCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.2, 70),
    new THREE.Vector3(140, 4, 120),
    new THREE.Vector3(260, 12, 0),
    new THREE.Vector3(220, 16, -180),
    new THREE.Vector3(60, 8, -250),
    new THREE.Vector3(-140, 10, -220),
    new THREE.Vector3(-250, 15, -60),
    new THREE.Vector3(-210, 8, 140),
    new THREE.Vector3(-90, 2, 180),
    new THREE.Vector3(0, 0.2, 70),
  ]);

  const roadPoints = roadCurve.getPoints(200);
  const roadGeo = new THREE.BufferGeometry();
  const roadVertices: number[] = [];
  const roadNormals: number[] = [];
  const roadWidth = 9.0;

  for (let i = 0; i < roadPoints.length - 1; i++) {
    const p1 = roadPoints[i];
    const p2 = roadPoints[i + 1];
    const forward = new THREE.Vector3().subVectors(p2, p1).normalize();
    const right = new THREE.Vector3(-forward.z, 0, forward.x).normalize();

    const leftEdge1 = p1.clone().addScaledVector(right, -roadWidth / 2);
    const rightEdge1 = p1.clone().addScaledVector(right, roadWidth / 2);
    const leftEdge2 = p2.clone().addScaledVector(right, -roadWidth / 2);
    const rightEdge2 = p2.clone().addScaledVector(right, roadWidth / 2);

    // Quad (2 triangles)
    roadVertices.push(
      leftEdge1.x, leftEdge1.y, leftEdge1.z,
      rightEdge1.x, rightEdge1.y, rightEdge1.z,
      leftEdge2.x, leftEdge2.y, leftEdge2.z,

      rightEdge1.x, rightEdge1.y, rightEdge1.z,
      rightEdge2.x, rightEdge2.y, rightEdge2.z,
      leftEdge2.x, leftEdge2.y, leftEdge2.z
    );

    for (let k = 0; k < 6; k++) roadNormals.push(0, 1, 0);
  }

  roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(roadVertices, 3));
  roadGeo.setAttribute('normal', new THREE.Float32BufferAttribute(roadNormals, 3));

  const roadMat = new THREE.MeshStandardMaterial({
    color: 0x272c33,
    roughness: 0.7,
    metalness: 0.1,
  });
  const roadMesh = new THREE.Mesh(roadGeo, roadMat);
  roadMesh.receiveShadow = true;
  group.add(roadMesh);

  // 3. ANIMATED HIGHWAY TRAFFIC (Slow Roads styled cars & buses moving smoothly)
  const carCount = 18;
  const cars: {
    mesh: THREE.Group;
    t: number;
    speed: number;
    laneOffset: number;
  }[] = [];

  const carColors = [0xef4444, 0x3b82f6, 0xeab308, 0x10b981, 0xf97316, 0x8b5cf6, 0xe2e8f0, 0x334155];

  for (let c = 0; c < carCount; c++) {
    const carGroup = new THREE.Group();
    const color = carColors[c % carColors.length];

    // Car Body
    const bodyGeo = new THREE.BoxGeometry(2.4, 0.9, 4.4);
    const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.4 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.6;
    body.castShadow = true;
    carGroup.add(body);

    // Cabin
    const cabinGeo = new THREE.BoxGeometry(2.1, 0.75, 2.5);
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.2 });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(0, 1.25, -0.3);
    carGroup.add(cabin);

    // Headlights
    const hlGeo = new THREE.BoxGeometry(0.5, 0.2, 0.1);
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xfffae0 });
    const hlL = new THREE.Mesh(hlGeo, hlMat);
    hlL.position.set(-0.7, 0.6, 2.22);
    const hlR = new THREE.Mesh(hlGeo, hlMat);
    hlR.position.set(0.7, 0.6, 2.22);
    carGroup.add(hlL);
    carGroup.add(hlR);

    // Taillights
    const tlMat = new THREE.MeshBasicMaterial({ color: 0xff2222 });
    const tlL = new THREE.Mesh(hlGeo, tlMat);
    tlL.position.set(-0.7, 0.6, -2.22);
    const tlR = new THREE.Mesh(hlGeo, tlMat);
    tlR.position.set(0.7, 0.6, -2.22);
    carGroup.add(tlL);
    carGroup.add(tlR);

    group.add(carGroup);

    cars.push({
      mesh: carGroup,
      t: c / carCount,
      speed: 0.015 + (c % 3) * 0.005,
      laneOffset: c % 2 === 0 ? 2.2 : -2.2,
    });
  }

  // 4. INSTANCED STYLIZED FOREST (Slow Roads Tree Clusters: 450+ Trees)
  // Tree = Wooden Tapered Trunk + 3 Soft Fluffy Foliage Spheres
  const treeCount = 420;
  const trunkGeo = new THREE.CylinderGeometry(0.3, 0.55, 4.2, 7);
  const foliageGeo1 = new THREE.DodecahedronGeometry(2.2, 1);
  const foliageGeo2 = new THREE.DodecahedronGeometry(1.6, 1);

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
  const foliageMat1 = new THREE.MeshStandardMaterial({ color: 0x488a38, roughness: 0.8, flatShading: true });
  const foliageMat2 = new THREE.MeshStandardMaterial({ color: 0x5fa846, roughness: 0.8, flatShading: true });
  const foliageMat3 = new THREE.MeshStandardMaterial({ color: 0x3d7432, roughness: 0.8, flatShading: true });

  const instTrunks = new THREE.InstancedMesh(trunkGeo, trunkMat, treeCount);
  const instFoliage1 = new THREE.InstancedMesh(foliageGeo1, foliageMat1, treeCount);
  const instFoliage2 = new THREE.InstancedMesh(foliageGeo2, foliageMat2, treeCount);

  instTrunks.castShadow = true;
  instFoliage1.castShadow = true;
  instFoliage2.castShadow = true;

  const dummy = new THREE.Object3D();
  let validTreeIdx = 0;

  // Scatter trees naturally on the hills and around the entrance avenue
  for (let i = 0; i < treeCount * 1.5 && validTreeIdx < treeCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const rad = 32 + Math.random() * 450;
    const tx = Math.cos(angle) * rad;
    const tz = Math.sin(angle) * rad;

    // Avoid tree placing on the road curve
    let onRoad = false;
    for (let r = 0; r < roadPoints.length; r += 10) {
      if (Math.hypot(tx - roadPoints[r].x, tz - roadPoints[r].z) < 12) {
        onRoad = true;
        break;
      }
    }
    if (onRoad) continue;

    // Determine terrain elevation at (tx, tz)
    const dist = Math.hypot(tx, tz);
    let ty = 0;
    if (dist > 50) {
      const blend = Math.min(1, (dist - 50) / 120);
      const h1 = Math.sin(tx * 0.008 + 1.2) * Math.cos(tz * 0.007 + 0.4) * 28;
      const h2 = Math.sin(tx * 0.018 - 0.7) * Math.sin(tz * 0.015 + 1.5) * 14;
      const h3 = Math.cos(tx * 0.004 + tz * 0.003) * 35;
      ty = (h1 + h2 + h3) * blend;
    }

    const scale = 0.75 + Math.random() * 0.7;
    const rotY = Math.random() * Math.PI * 2;

    // Trunk
    dummy.position.set(tx, ty + 2.1 * scale, tz);
    dummy.rotation.set(0, rotY, 0);
    dummy.scale.set(scale, scale, scale);
    dummy.updateMatrix();
    instTrunks.setMatrixAt(validTreeIdx, dummy.matrix);

    // Main Foliage Dome
    dummy.position.set(tx, ty + (3.8 + Math.random() * 0.4) * scale, tz);
    dummy.updateMatrix();
    instFoliage1.setMatrixAt(validTreeIdx, dummy.matrix);

    // Secondary Upper Foliage
    dummy.position.set(tx + (Math.random() - 0.5) * 0.6, ty + 5.2 * scale, tz + (Math.random() - 0.5) * 0.6);
    dummy.scale.set(scale * 0.8, scale * 0.8, scale * 0.8);
    dummy.updateMatrix();
    instFoliage2.setMatrixAt(validTreeIdx, dummy.matrix);

    validTreeIdx++;
  }

  instTrunks.instanceMatrix.needsUpdate = true;
  instFoliage1.instanceMatrix.needsUpdate = true;
  instFoliage2.instanceMatrix.needsUpdate = true;

  group.add(instTrunks);
  group.add(instFoliage1);
  group.add(instFoliage2);

  // 5. DISTANT CONTEMPORARY CITY SKYLINE (50+ Skyscrapers, Towers, Glass Spires on Horizon)
  const buildingCount = 55;
  const towerGeos = [
    new THREE.BoxGeometry(16, 1, 16),
    new THREE.BoxGeometry(22, 1, 14),
    new THREE.CylinderGeometry(8, 9, 1, 8),
  ];

  const skylineGroup = new THREE.Group();
  const towerMat1 = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.6 });
  const towerMat2 = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.2, metalness: 0.8 });
  const towerMat3 = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.4, metalness: 0.5 });
  const windowGlowMat = new THREE.MeshBasicMaterial({ color: 0xfffae0 });

  for (let b = 0; b < buildingCount; b++) {
    // Position buildings in an arc along the distant mountains (distance 350 - 650m)
    const angle = (b / buildingCount) * Math.PI * 2 + (b % 4) * 0.1;
    const dist = 380 + (b % 6) * 45;
    const bx = Math.cos(angle) * dist;
    const bz = Math.sin(angle) * dist;

    const bHeight = 50 + (b % 7) * 25 + Math.random() * 40;
    const bWidth = 14 + (b % 5) * 4;
    const bDepth = 14 + ((b + 2) % 5) * 4;

    const bGeo = new THREE.BoxGeometry(bWidth, bHeight, bDepth);
    const mat = b % 3 === 0 ? towerMat1 : b % 3 === 1 ? towerMat2 : towerMat3;
    const tower = new THREE.Mesh(bGeo, mat);
    tower.position.set(bx, bHeight / 2 - 5, bz);
    tower.rotation.y = angle + Math.PI / 4;
    skylineGroup.add(tower);

    // Rooftop Spire & Warning Beacon
    if (b % 2 === 0) {
      const spireH = 15 + (b % 3) * 10;
      const spireGeo = new THREE.CylinderGeometry(0.3, 1.2, spireH, 6);
      const spire = new THREE.Mesh(spireGeo, towerMat2);
      spire.position.set(bx, bHeight + spireH / 2 - 5, bz);
      skylineGroup.add(spire);

      // Red rooftop aviation strobe
      const beaconGeo = new THREE.SphereGeometry(1.0, 8, 8);
      const beacon = new THREE.Mesh(beaconGeo, new THREE.MeshBasicMaterial({ color: 0xff2222 }));
      beacon.position.set(bx, bHeight + spireH - 5, bz);
      skylineGroup.add(beacon);
    }
  }

  group.add(skylineGroup);

  // 6. ARRIVAL PLAZA & REFLECTING WATER BASINS (Around building footprint)
  const plazaSize = 85;
  const plazaSlabGeo = new THREE.BoxGeometry(plazaSize, 0.4, plazaSize);
  const plazaMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.35, metalness: 0.1 });
  const plazaSlab = new THREE.Mesh(plazaSlabGeo, plazaMat);
  plazaSlab.position.set(0, -0.2, 0);
  plazaSlab.receiveShadow = true;
  group.add(plazaSlab);

  // Symmetrical Water Reflection Basins (Flanking South entrance)
  const poolGeo = new THREE.BoxGeometry(16, 0.3, 8);
  const poolWaterMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.65,
    roughness: 0.05,
    transmission: 0.8,
  });

  const poolL = new THREE.Mesh(poolGeo, poolWaterMat);
  poolL.position.set(-18, 0.05, 30);
  const poolR = new THREE.Mesh(poolGeo, poolWaterMat);
  poolR.position.set(18, 0.05, 30);
  group.add(poolL);
  group.add(poolR);

  // Modern Street Lamps along the plaza entrance boulevard
  const lampPosts: THREE.PointLight[] = [];
  const lampPositions = [
    [-10, 0, 24], [10, 0, 24],
    [-10, 0, 36], [10, 0, 36],
    [-26, 0, 10], [26, 0, 10],
    [-26, 0, -10], [26, 0, -10],
  ];

  lampPositions.forEach(([lx, ly, lz]) => {
    const poleGeo = new THREE.CylinderGeometry(0.12, 0.16, 5.0, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(lx, ly + 2.5, lz);
    group.add(pole);

    const fixtureGeo = new THREE.BoxGeometry(0.8, 0.15, 0.5);
    const fixture = new THREE.Mesh(fixtureGeo, new THREE.MeshBasicMaterial({ color: 0xfffae0 }));
    fixture.position.set(lx, ly + 5.0, lz);
    group.add(fixture);

    const pLight = new THREE.PointLight(0xfff3d6, 1.2, 16);
    pLight.position.set(lx, ly + 4.8, lz);
    group.add(pLight);
    lampPosts.push(pLight);
  });

  // 7. DRIFTING 3D CUMULUS CLOUDS (Slow Roads Atmospheric Sky)
  const cloudGroup = new THREE.Group();
  const cloudCount = 14;
  const clouds: { mesh: THREE.Group; speed: number }[] = [];
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
    metalness: 0.0,
    transparent: true,
    opacity: 0.88,
    flatShading: true,
  });

  for (let c = 0; c < cloudCount; c++) {
    const singleCloud = new THREE.Group();
    const puffCount = 5 + Math.floor(Math.random() * 5);

    for (let p = 0; p < puffCount; p++) {
      const puffGeo = new THREE.DodecahedronGeometry(8 + Math.random() * 8, 1);
      const puff = new THREE.Mesh(puffGeo, cloudMat);
      puff.position.set(
        (p - puffCount / 2) * 9 + (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 7
      );
      puff.scale.set(1.2, 0.7 + Math.random() * 0.4, 1.0);
      singleCloud.add(puff);
    }

    const cx = (Math.random() - 0.5) * 800;
    const cy = 110 + Math.random() * 60;
    const cz = (Math.random() - 0.5) * 800;
    singleCloud.position.set(cx, cy, cz);

    cloudGroup.add(singleCloud);
    clouds.push({
      mesh: singleCloud,
      speed: 1.5 + Math.random() * 2.0,
    });
  }

  group.add(cloudGroup);

  // Update loop for highway cars & drifting clouds
  const update = (delta: number, elapsed: number) => {
    // Animate Highway Traffic
    cars.forEach((car) => {
      car.t = (car.t + delta * car.speed * 0.5) % 1.0;
      const pt = roadCurve.getPointAt(car.t);
      const tangent = roadCurve.getTangentAt(car.t).normalize();
      const right = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      car.mesh.position.copy(pt).addScaledVector(right, car.laneOffset);
      const lookTarget = pt.clone().add(tangent);
      car.mesh.lookAt(lookTarget);
    });

    // Animate Drifting Clouds
    clouds.forEach((cloud) => {
      cloud.mesh.position.x += delta * cloud.speed;
      if (cloud.mesh.position.x > 450) {
        cloud.mesh.position.x = -450;
      }
    });

    // Subtle water pool shimmer
    const wave = Math.sin(elapsed * 2) * 0.02;
    poolL.position.y = 0.05 + wave;
    poolR.position.y = 0.05 + wave;
  };

  return {
    group,
    update,
  };
}
