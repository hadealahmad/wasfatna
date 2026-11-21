import type * as ThreeNS from 'three';
import type { FoodMeshKind, SyrianFoodItem } from '@/data/syrianFoods';

export type ThreeModule = typeof import('three');

const CERAMIC_CREAM = '#f6f0e4';
const CERAMIC_RIM = '#2a6f8f';
const CERAMIC_WARM = '#eadcc8';
const WOOD_WALNUT = '#7a4b2a';
const BRASS_GOLD = '#c9973e';
const IRON_DARK = '#2e333b';

const FOOTPRINT_RADIUS: Record<FoodMeshKind, number> = {
    bread: 0.48,
    dip_bowl: 0.42,
    cheese_olives: 0.46,
    eggs: 0.48,
    falafel: 0.44,
    manousheh: 0.48,
    makdous: 0.39,
    rice_stew: 0.54,
    kebab_grill: 0.56,
    kibbeh: 0.45,
    shawarma: 0.52,
    salad: 0.46,
    fries: 0.38,
    pastry_sweet: 0.42,
    fruit: 0.42,
    tea_drink: 0.28,
    nuts: 0.32,
    yogurt_cup: 0.3,
};

export function getFoodFootprintRadius(meshKind: FoodMeshKind): number {
    return FOOTPRINT_RADIUS[meshKind] ?? 0.44;
}

/**
 * Deterministic PRNG so portion updates rebuild identical organic layouts without jitter.
 */
function createSeededRandom(seedKey: string): () => number {
    let hash = 2166136261;
    for (let i = 0; i < seedKey.length; i += 1) {
        hash ^= seedKey.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    let state = hash >>> 0;
    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function clampPortion(portion: number): number {
    if (!Number.isFinite(portion)) return 1;
    return Math.max(0.25, Math.min(2.5, portion));
}

function makeMat(
    THREE: ThreeModule,
    color: ThreeNS.ColorRepresentation,
    options: {
        roughness?: number;
        metalness?: number;
        transparent?: boolean;
        opacity?: number;
        emissive?: ThreeNS.ColorRepresentation;
        emissiveIntensity?: number;
    } = {},
): ThreeNS.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
        color,
        flatShading: true,
        roughness: options.roughness ?? 0.72,
        metalness: options.metalness ?? 0.04,
        transparent: options.transparent ?? false,
        opacity: options.opacity ?? 1,
        ...(options.emissive !== undefined
            ? {
                  emissive: new THREE.Color(options.emissive),
                  emissiveIntensity: options.emissiveIntensity ?? 0.2,
              }
            : {}),
    });
}

function enableShadows(obj: ThreeNS.Object3D, cast = true, receive = true): void {
    obj.traverse((child) => {
        const mesh = child as ThreeNS.Mesh;
        if (mesh.isMesh) {
            mesh.castShadow = cast;
            mesh.receiveShadow = receive;
        }
    });
}

function createCeramicPlate(
    THREE: ThreeModule,
    radius = 0.42,
    rimColor: string = CERAMIC_RIM,
    baseColor: string = CERAMIC_CREAM,
): ThreeNS.Group {
    const plate = new THREE.Group();
    const baseMat = makeMat(THREE, baseColor, { roughness: 0.42, metalness: 0.05 });
    const rimMat = makeMat(THREE, rimColor, { roughness: 0.35, metalness: 0.08 });

    const body = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius * 0.74, 0.055, 10),
        baseMat,
    );
    body.position.y = 0.0275;
    plate.add(body);

    const innerWell = new THREE.Mesh(
        new THREE.CylinderGeometry(radius * 0.84, radius * 0.84, 0.012, 10),
        makeMat(THREE, '#efe7d6', { roughness: 0.48 }),
    );
    innerWell.position.y = 0.054;
    plate.add(innerWell);

    const rim = new THREE.Mesh(
        new THREE.TorusGeometry(radius * 0.94, 0.018, 5, 10),
        rimMat,
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.056;
    plate.add(rim);

    return plate;
}

function createGlazedBowl(
    THREE: ThreeModule,
    radius = 0.36,
    height = 0.2,
    bodyColor = CERAMIC_CREAM,
    rimColor = CERAMIC_RIM,
    metalness = 0.06,
): ThreeNS.Group {
    const bowl = new THREE.Group();
    const points = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(radius * 0.56, 0),
        new THREE.Vector2(radius * 0.84, height * 0.36),
        new THREE.Vector2(radius, height * 0.88),
        new THREE.Vector2(radius * 0.94, height),
        new THREE.Vector2(radius * 0.84, height * 0.84),
        new THREE.Vector2(radius * 0.68, height * 0.28),
        new THREE.Vector2(0, height * 0.2),
    ];

    const geom = new THREE.LatheGeometry(points, 10);
    const mat = makeMat(THREE, bodyColor, {
        roughness: metalness > 0.3 ? 0.34 : 0.38,
        metalness,
    });
    const mesh = new THREE.Mesh(geom, mat);
    bowl.add(mesh);

    const rim = new THREE.Mesh(
        new THREE.TorusGeometry(radius * 0.95, 0.016, 5, 10),
        makeMat(THREE, rimColor, {
            roughness: 0.32,
            metalness: metalness > 0.3 ? 0.55 : 0.1,
        }),
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = height * 0.97;
    bowl.add(rim);

    return bowl;
}

function createPieWedgeMesh(
    THREE: ThreeModule,
    radius: number,
    thickness: number,
    startAngle: number,
    sweepAngle: number,
    material: ThreeNS.Material,
): ThreeNS.Mesh {
    const shape = new THREE.Shape();
    const segments = Math.max(3, Math.round((sweepAngle / (Math.PI * 2)) * 12));
    shape.moveTo(0, 0);
    for (let i = 0; i <= segments; i += 1) {
        const a = startAngle + (sweepAngle * i) / segments;
        shape.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
    }
    shape.closePath();

    const geom = new THREE.ExtrudeGeometry(shape, {
        depth: thickness,
        bevelEnabled: true,
        bevelThickness: 0.008,
        bevelSize: 0.008,
        bevelSegments: 1,
    });
    geom.rotateX(-Math.PI / 2);
    return new THREE.Mesh(geom, material);
}

function addGarnishSpecks(
    THREE: ThreeModule,
    parent: ThreeNS.Group,
    count: number,
    radius: number,
    yBase: number,
    colors: string[],
    rand: () => number,
    size = 0.022,
): void {
    const mats = colors.map((c) => makeMat(THREE, c, { roughness: 0.65 }));
    for (let i = 0; i < count; i += 1) {
        const angle = rand() * Math.PI * 2;
        const r = Math.sqrt(rand()) * radius;
        const speck = new THREE.Mesh(
            new THREE.DodecahedronGeometry(size * (0.75 + rand() * 0.5), 0),
            mats[i % mats.length],
        );
        speck.position.set(Math.cos(angle) * r, yBase + (rand() - 0.5) * 0.012, Math.sin(angle) * r);
        speck.rotation.set(rand() * 3, rand() * 3, rand() * 3);
        parent.add(speck);
    }
}

function buildBread(
    THREE: ThreeModule,
    food: SyrianFoodItem,
    portion: number,
    rand: () => number,
): ThreeNS.Group {
    const group = new THREE.Group();
    const plate = createCeramicPlate(THREE, 0.45, '#b8763e', CERAMIC_WARM);
    group.add(plate);

    const pitaColor = food.primaryColor || '#e2b97c';
    const toastColor = food.accentColor || '#b57b42';
    const pitaMat = makeMat(THREE, pitaColor, { roughness: 0.85 });
    const toastMat = makeMat(THREE, toastColor, { roughness: 0.82 });

    const addFullLoaf = (y: number, rotY: number, offsetX = 0, offsetZ = 0) => {
        const loaf = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.34, 0.044, 10), pitaMat);
        body.position.y = 0.022;
        loaf.add(body);

        const puff = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.34, 0.022, 10), pitaMat);
        puff.position.y = 0.052;
        loaf.add(puff);

        for (let i = 0; i < 4; i += 1) {
            const a = rand() * Math.PI * 2;
            const d = 0.07 + rand() * 0.18;
            const blister = new THREE.Mesh(
                new THREE.CylinderGeometry(0.036, 0.045, 0.01, 6),
                toastMat,
            );
            blister.position.set(Math.cos(a) * d, 0.062, Math.sin(a) * d);
            loaf.add(blister);
        }

        loaf.position.set(offsetX, y, offsetZ);
        loaf.rotation.y = rotY;
        group.add(loaf);
    };

    const addQuarterWedges = (count: number, baseY: number) => {
        for (let i = 0; i < count; i += 1) {
            const angle = i * (Math.PI * 0.52) + 0.15;
            const wedge = createPieWedgeMesh(THREE, 0.34, 0.038, 0, Math.PI * 0.46, pitaMat);
            wedge.position.set(
                Math.cos(angle + 0.4) * 0.025,
                baseY + i * 0.012,
                Math.sin(angle + 0.4) * 0.025,
            );
            wedge.rotation.y = angle;
            group.add(wedge);

            const blister = new THREE.Mesh(
                new THREE.CylinderGeometry(0.03, 0.036, 0.01, 5),
                toastMat,
            );
            blister.position.set(
                wedge.position.x + Math.cos(angle + 0.25) * 0.16,
                wedge.position.y + 0.044,
                wedge.position.z - Math.sin(angle + 0.25) * 0.16,
            );
            group.add(blister);
        }
    };

    if (portion <= 0.35) {
        addQuarterWedges(1, 0.062);
    } else if (portion <= 0.62) {
        addQuarterWedges(2, 0.062);
    } else if (portion <= 0.88) {
        addQuarterWedges(3, 0.062);
    } else if (portion <= 1.25) {
        addFullLoaf(0.06, 0.2);
    } else if (portion <= 1.75) {
        addFullLoaf(0.06, 0.1);
        addQuarterWedges(2, 0.118);
    } else {
        addFullLoaf(0.06, 0.15);
        addFullLoaf(0.118, 0.85, 0.02, -0.02);
    }

    return group;
}

function buildDipBowl(
    THREE: ThreeModule,
    food: SyrianFoodItem,
    portion: number,
    rand: () => number,
): ThreeNS.Group {
    const group = new THREE.Group();
    const bowl = createGlazedBowl(THREE, 0.37, 0.19, CERAMIC_CREAM, CERAMIC_RIM);
    group.add(bowl);

    const fillRatio = 0.45 + Math.min(portion, 2) * 0.42;
    const dipHeight = Math.min(0.24, 0.07 + fillRatio * 0.11);
    const dipRadius = 0.28 + Math.min(portion, 2) * 0.035;

    const dipMat = makeMat(THREE, food.primaryColor || '#e9d8a6', { roughness: 0.62 });
    const dipBase = new THREE.Mesh(
        new THREE.CylinderGeometry(dipRadius, dipRadius * 0.78, dipHeight * 0.75, 10),
        dipMat,
    );
    dipBase.position.y = 0.06 + dipHeight * 0.35;
    group.add(dipBase);

    const mound = new THREE.Mesh(
        new THREE.SphereGeometry(dipRadius * 0.94, 9, 5, 0, Math.PI * 2, 0, Math.PI * 0.46),
        dipMat,
    );
    mound.scale.set(1, 0.36 + portion * 0.18, 1);
    mound.position.y = 0.06 + dipHeight * 0.65;
    group.add(mound);

    const topY = mound.position.y + dipRadius * 0.94 * (0.36 + portion * 0.18) * 0.82;

    // Olive oil pool
    const oilPool = new THREE.Mesh(
        new THREE.CylinderGeometry(dipRadius * 0.42, dipRadius * 0.46, 0.012, 8),
        makeMat(THREE, food.accentColor || '#b7a428', { roughness: 0.16, metalness: 0.06 }),
    );
    oilPool.position.y = topY;
    group.add(oilPool);

    // Garnish specks (paprika/sumac, chickpeas, mint)
    addGarnishSpecks(
        THREE,
        group,
        Math.round(5 + portion * 5),
        dipRadius * 0.65,
        topY + 0.01,
        ['#c0392b', '#2f855a', '#d8b467'],
        rand,
        0.02,
    );

    return group;
}

function buildCheeseOlives(
    THREE: ThreeModule,
    food: SyrianFoodItem,
    portion: number,
    rand: () => number,
): ThreeNS.Group {
    const group = new THREE.Group();

    // Wooden mezze board
    const board = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.4, 0.045, 8),
        makeMat(THREE, WOOD_WALNUT, { roughness: 0.78 }),
    );
    board.position.y = 0.0225;
    group.add(board);

    const cheeseMat = makeMat(THREE, food.primaryColor || '#f7f3e3', { roughness: 0.55 });
    const sliceCount = Math.max(1, Math.min(6, Math.round(portion * 3)));
    for (let i = 0; i < sliceCount; i += 1) {
        const row = i % 3;
        const layer = Math.floor(i / 3);
        const slice = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.11), cheeseMat);
        slice.position.set(
            -0.14 + row * 0.095,
            0.075 + layer * 0.058,
            -0.11 + row * 0.065 + layer * 0.03,
        );
        slice.rotation.y = 0.25 + row * 0.14;
        slice.rotation.z = layer > 0 ? 0.08 : -0.14;
        group.add(slice);
    }

    // Olives cluster
    const greenOliveMat = makeMat(THREE, food.accentColor || '#5c7c32', {
        roughness: 0.24,
        metalness: 0.06,
    });
    const darkOliveMat = makeMat(THREE, '#2e2532', { roughness: 0.22, metalness: 0.08 });
    const oliveCount = Math.max(2, Math.min(9, Math.round(portion * 4.5)));

    for (let i = 0; i < oliveCount; i += 1) {
        const a = (i / oliveCount) * Math.PI * 1.4 - 0.4;
        const r = 0.05 + (i % 3) * 0.055;
        const olive = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.042, 0),
            i % 3 === 0 ? darkOliveMat : greenOliveMat,
        );
        olive.scale.set(1.2, 0.88, 0.88);
        olive.position.set(0.16 + Math.cos(a) * r, 0.072 + (i > 5 ? 0.04 : 0), 0.11 + Math.sin(a) * r);
        olive.rotation.set(rand() * 2, rand() * 3, rand() * 2);
        group.add(olive);
    }

    return group;
}

function buildEggs(
    THREE: ThreeModule,
    food: SyrianFoodItem,
    portion: number,
    rand: () => number,
): ThreeNS.Group {
    const group = new THREE.Group();

    // Cast-iron breakfast skillet
    const ironMat = makeMat(THREE, IRON_DARK, { roughness: 0.65, metalness: 0.45 });
    const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.34, 0.075, 10), ironMat);
    pan.position.y = 0.038;
    group.add(pan);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.02, 5, 10), ironMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.076;
    group.add(rim);

    // Skillet handle
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.028, 0.065), ironMat);
    handle.position.set(0.46, 0.085, 0);
    handle.rotation.z = 0.16;
    group.add(handle);

    const eggCount = portion <= 0.62 ? 1 : portion <= 1.25 ? 2 : portion <= 1.75 ? 3 : 4;
    const whiteMat = makeMat(THREE, '#fbf8ef', { roughness: 0.45 });
    const yolkMat = makeMat(THREE, food.primaryColor || '#f59e0b', { roughness: 0.22 });

    const eggRadius = portion <= 0.35 ? 0.12 : 0.15;
    const offsets: Array<[number, number]> =
        eggCount === 1
            ? [[0, 0]]
            : eggCount === 2
              ? [
                    [-0.12, -0.05],
                    [0.12, 0.06],
                ]
              : eggCount === 3
                ? [
                      [0, -0.13],
                      [-0.13, 0.09],
                      [0.13, 0.09],
                  ]
                : [
                      [-0.13, -0.11],
                      [0.13, -0.1],
                      [-0.11, 0.12],
                      [0.12, 0.12],
                  ];

    for (let i = 0; i < eggCount; i += 1) {
        const [ox, oz] = offsets[i];
        const white = new THREE.Mesh(
            new THREE.CylinderGeometry(eggRadius, eggRadius * 1.08, 0.024, 7),
            whiteMat,
        );
        white.scale.set(1 + (rand() - 0.5) * 0.18, 1, 1 + (rand() - 0.5) * 0.18);
        white.position.set(ox, 0.088, oz);
        group.add(white);

        const yolk = new THREE.Mesh(
            new THREE.SphereGeometry(eggRadius * 0.42, 6, 4, 0, Math.PI * 2, 0, Math.PI * 0.55),
            yolkMat,
        );
        yolk.position.set(ox + (rand() - 0.5) * 0.025, 0.096, oz + (rand() - 0.5) * 0.025);
        group.add(yolk);
    }

    addGarnishSpecks(THREE, group, 6, 0.25, 0.105, ['#2f855a', '#4a2c2a'], rand, 0.015);
    return group;
}

function buildFalafel(
    THREE: ThreeModule,
    food: SyrianFoodItem,
    portion: number,
    rand: () => number,
): ThreeNS.Group {
    const group = new THREE.Group();
    const plate = createCeramicPlate(THREE, 0.42, '#2f7a5b', CERAMIC_CREAM);
    group.add(plate);

    const count = Math.max(2, Math.min(9, Math.round(portion * 4.5 + 0.6)));
    const falafelMat = makeMat(THREE, food.primaryColor || '#8c5327', { roughness: 0.82 });
    const sesameMat = makeMat(THREE, '#f2dfb3', { roughness: 0.7 });

    for (let i = 0; i < count; i += 1) {
        const isSecondTier = i >= 6;
        const ringIdx = isSecondTier ? i - 6 : i;
        const ringTotal = isSecondTier ? Math.max(1, count - 6) : Math.min(count, 6);
        const radius = isSecondTier ? 0.09 : ringTotal === 1 ? 0 : 0.18;
        const angle = (ringIdx / ringTotal) * Math.PI * 2 + (isSecondTier ? 0.5 : 0);

        const patty = new THREE.Mesh(new THREE.IcosahedronGeometry(0.088, 0), falafelMat);
        patty.scale.set(1.05, 0.58, 1.05);
        patty.position.set(
            Math.cos(angle) * radius,
            0.096 + (isSecondTier ? 0.082 : 0),
            Math.sin(angle) * radius,
        );
        patty.rotation.set(0.15 * (rand() - 0.5), rand() * Math.PI, 0.15 * (rand() - 0.5));
        group.add(patty);

        const seed = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.008, 0.01), sesameMat);
        seed.position.set(patty.position.x, patty.position.y + 0.052, patty.position.z);
        seed.rotation.y = rand() * Math.PI;
        group.add(seed);
    }

    // Parsley/mint leaves
    addGarnishSpecks(
        THREE,
        group,
        Math.round(4 + portion * 3),
        0.26,
        0.08,
        [food.accentColor || '#2f855a', '#48a868'],
        rand,
        0.028,
    );

    return group;
}

function buildManousheh(
    THREE: ThreeModule,
    food: SyrianFoodItem,
    portion: number,
    rand: () => number,
): ThreeNS.Group {
    const group = new THREE.Group();
    const board = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.43, 0.04, 10),
        makeMat(THREE, WOOD_WALNUT, { roughness: 0.76 }),
    );
    board.position.y = 0.02;
    group.add(board);

    const doughMat = makeMat(THREE, '#e4ba7a', { roughness: 0.84 });
    const toppingMat = makeMat(THREE, food.primaryColor || '#4d5d2b', { roughness: 0.74 });
    const accentMat = makeMat(THREE, food.accentColor || '#e7cf9c', { roughness: 0.65 });

    const addFlatbread = (y: number, sweepQuarters: number, rotOffset = 0) => {
        if (sweepQuarters >= 4) {
            const base = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.38, 0.036, 12), doughMat);
            base.position.y = y + 0.018;
            group.add(base);

            const topping = new THREE.Mesh(
                new THREE.CylinderGeometry(0.33, 0.34, 0.016, 12),
                toppingMat,
            );
            topping.position.y = y + 0.042;
            group.add(topping);

            // Crust ring
            const crust = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.025, 5, 12), doughMat);
            crust.rotation.x = Math.PI / 2;
            crust.position.y = y + 0.036;
            group.add(crust);

            for (let i = 0; i < 7; i += 1) {
                const a = rand() * Math.PI * 2;
                const r = rand() * 0.25;
                const dot = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.01, 0.02), accentMat);
                dot.position.set(Math.cos(a) * r, y + 0.054, Math.sin(a) * r);
                dot.rotation.y = rand() * Math.PI;
                group.add(dot);
            }
            return;
        }

        for (let i = 0; i < sweepQuarters; i += 1) {
            const angle = rotOffset + i * (Math.PI * 0.51);
            const sliceBase = createPieWedgeMesh(THREE, 0.38, 0.032, 0, Math.PI * 0.47, doughMat);
            sliceBase.position.set(0, y + i * 0.004, 0);
            sliceBase.rotation.y = angle;
            group.add(sliceBase);

            const sliceTop = createPieWedgeMesh(THREE, 0.32, 0.014, 0.04, Math.PI * 0.4, toppingMat);
            sliceTop.position.set(0, y + 0.034 + i * 0.004, 0);
            sliceTop.rotation.y = angle;
            group.add(sliceTop);
        }
    };

    if (portion <= 0.35) {
        addFlatbread(0.044, 1, 0.4);
    } else if (portion <= 0.62) {
        addFlatbread(0.044, 2, 0.2);
    } else if (portion <= 0.88) {
        addFlatbread(0.044, 3, 0.1);
    } else if (portion <= 1.25) {
        addFlatbread(0.044, 4);
    } else if (portion <= 1.75) {
        addFlatbread(0.044, 4);
        addFlatbread(0.098, 2, 0.8);
    } else {
        addFlatbread(0.044, 4);
        addFlatbread(0.098, 4);
    }

    return group;
}

function buildMakdous(
    THREE: ThreeModule,
    food: SyrianFoodItem,
    portion: number,
    rand: () => number,
): ThreeNS.Group {
    const group = new THREE.Group();
    const dish = createCeramicPlate(THREE, 0.37, '#7e3a6f', CERAMIC_CREAM);
    group.add(dish);

    // Glistening olive oil puddle
    const oil = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.28, 0.01, 10),
        makeMat(THREE, '#b9a632', { roughness: 0.15, metalness: 0.06 }),
    );
    oil.position.y = 0.06;
    group.add(oil);

    const count = Math.max(1, Math.min(6, Math.round(portion * 3)));
    const eggplantMat = makeMat(THREE, food.primaryColor || '#4d2347', { roughness: 0.38 });
    const pepperMat = makeMat(THREE, food.accentColor || '#c0392b', { roughness: 0.55 });
    const walnutMat = makeMat(THREE, '#b5814b', { roughness: 0.72 });

    for (let i = 0; i < count; i += 1) {
        const piece = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.058, 0.17, 7), eggplantMat);
        body.rotation.z = Math.PI / 2;
        piece.add(body);

        const capL = new THREE.Mesh(new THREE.SphereGeometry(0.048, 6, 4), eggplantMat);
        capL.position.x = 0.082;
        piece.add(capL);

        const capR = new THREE.Mesh(new THREE.SphereGeometry(0.056, 6, 4), eggplantMat);
        capR.position.x = -0.082;
        piece.add(capR);

        // Stuffing peek
        const stuffing = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.032, 0.036), pepperMat);
        stuffing.position.set(0, 0.044, 0);
        piece.add(stuffing);

        const walnut = new THREE.Mesh(new THREE.DodecahedronGeometry(0.022, 0), walnutMat);
        walnut.position.set(0.02, 0.056, 0.01);
        piece.add(walnut);

        const angle = (i / Math.max(count, 1)) * Math.PI * 2 + 0.25;
        const r = count === 1 ? 0 : 0.14;
        piece.position.set(
            Math.cos(angle) * r,
            0.105 + (i >= 4 ? 0.07 : 0),
            Math.sin(angle) * r,
        );
        piece.rotation.y = angle + Math.PI * 0.4 + (rand() - 0.5) * 0.3;
        group.add(piece);
    }

    return group;
}

function buildRiceStew(
    THREE: ThreeModule,
    food: SyrianFoodItem,
    portion: number,
    rand: () => number,
): ThreeNS.Group {
    const group = new THREE.Group();
    const plate = createCeramicPlate(THREE, 0.5, '#b85d38', CERAMIC_CREAM);
    group.add(plate);

    const scaleR = 0.68 + Math.min(portion, 2) * 0.22;
    const moundH = 0.12 + Math.min(portion, 2) * 0.14;

    const riceMat = makeMat(THREE, food.primaryColor || '#f2e6cc', { roughness: 0.78 });
    const mound = new THREE.Mesh(
        new THREE.ConeGeometry(0.38 * scaleR, moundH, 9),
        riceMat,
    );
    mound.position.y = 0.06 + moundH * 0.45;
    group.add(mound);

    const roundedTop = new THREE.Mesh(
        new THREE.SphereGeometry(0.22 * scaleR, 7, 5),
        riceMat,
    );
    roundedTop.scale.set(1.2, 0.55, 1.2);
    roundedTop.position.y = 0.06 + moundH * 0.62;
    group.add(roundedTop);

    // Meat / stew chunks
    const stewMat = makeMat(THREE, food.accentColor || '#7b3e26', { roughness: 0.56 });
    const chunkCount = Math.max(2, Math.min(9, Math.round(portion * 4.5)));
    for (let i = 0; i < chunkCount; i += 1) {
        const a = (i / chunkCount) * Math.PI * 2 + rand() * 0.4;
        const r = (0.06 + rand() * 0.16) * scaleR;
        const chunk = new THREE.Mesh(new THREE.DodecahedronGeometry(0.052, 0), stewMat);
        chunk.scale.set(1.1, 0.72, 0.95);
        chunk.position.set(
            Math.cos(a) * r,
            0.075 + moundH * (0.78 - r * 1.1),
            Math.sin(a) * r,
        );
        chunk.rotation.set(rand() * 2, rand() * 3, rand() * 2);
        group.add(chunk);
    }

    // Toasted pine nuts / vermicelli accents
    addGarnishSpecks(
        THREE,
        group,
        Math.round(6 + portion * 4),
        0.22 * scaleR,
        0.08 + moundH * 0.74,
        ['#e8c782', '#388e3c', '#9c5a2d'],
        rand,
        0.017,
    );

    return group;
}

function buildKebabGrill(
    THREE: ThreeModule,
    food: SyrianFoodItem,
    portion: number,
    rand: () => number,
): ThreeNS.Group {
    const group = new THREE.Group();

    // Oblong grill platter
    const platter = createCeramicPlate(THREE, 0.46, '#8b3a2b', CERAMIC_CREAM);
    platter.scale.set(1.18, 1, 0.78);
    group.add(platter);

    // Flat bread bed
    const bed = new THREE.Mesh(
        new THREE.CylinderGeometry(0.36, 0.36, 0.014, 10),
        makeMat(THREE, '#dfb272', { roughness: 0.86 }),
    );
    bed.scale.set(1.16, 1, 0.74);
    bed.position.y = 0.064;
    group.add(bed);

    const skewerCount = portion <= 0.62 ? 1 : portion <= 1.25 ? 2 : portion <= 1.75 ? 3 : 4;
    const kebabMat = makeMat(THREE, food.primaryColor || '#6e3322', { roughness: 0.68 });
    const charMat = makeMat(THREE, '#3a1c14', { roughness: 0.76 });
    const metalMat = makeMat(THREE, '#9ea7b2', { roughness: 0.3, metalness: 0.78 });

    const skewerLen = portion <= 0.35 ? 0.38 : 0.62;
    for (let s = 0; s < skewerCount; s += 1) {
        const z = (s - (skewerCount - 1) / 2) * 0.125;
        const rod = new THREE.Mesh(
            new THREE.CylinderGeometry(0.008, 0.008, skewerLen + 0.16, 5),
            metalMat,
        );
        rod.rotation.z = Math.PI / 2;
        rod.position.set(0, 0.12, z);
        group.add(rod);

        const segs = portion <= 0.35 ? 3 : 5;
        for (let k = 0; k < segs; k += 1) {
            const x = ((k + 0.5) / segs - 0.5) * skewerLen;
            const meat = new THREE.Mesh(
                new THREE.CylinderGeometry(0.044, 0.048, skewerLen / segs - 0.012, 6),
                k % 2 === 0 ? kebabMat : charMat,
            );
            meat.rotation.z = Math.PI / 2;
            meat.position.set(x, 0.12, z);
            group.add(meat);
        }
    }

    // Roasted tomato & green pepper chunks on side
    const tomatoMat = makeMat(THREE, food.accentColor || '#d63031', { roughness: 0.42 });
    const pepperMat = makeMat(THREE, '#2e7d32', { roughness: 0.48 });

    const tomato = new THREE.Mesh(new THREE.SphereGeometry(0.065, 6, 4), tomatoMat);
    tomato.scale.set(1, 0.7, 1);
    tomato.position.set(0.32, 0.105, 0.15);
    group.add(tomato);

    const pepper = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.04, 0.18, 6), pepperMat);
    pepper.rotation.set(0.15, 0.5, Math.PI / 2);
    pepper.position.set(-0.28, 0.1, -0.17);
    group.add(pepper);

    addGarnishSpecks(THREE, group, 5, 0.28, 0.085, ['#2f855a', '#f7f3e3'], rand, 0.018);

    return group;
}

function buildKibbeh(
    THREE: ThreeModule,
    food: SyrianFoodItem,
    portion: number,
    rand: () => number,
): ThreeNS.Group {
    const group = new THREE.Group();
    const plate = createCeramicPlate(THREE, 0.43, '#a85a2a', CERAMIC_CREAM);
    group.add(plate);

    // Pointed torpedo profile via LatheGeometry
    const torpedoPts = [
        new THREE.Vector2(0, -0.12),
        new THREE.Vector2(0.042, -0.07),
        new THREE.Vector2(0.066, 0),
        new THREE.Vector2(0.042, 0.07),
        new THREE.Vector2(0, 0.12),
    ];
    const kibbehGeom = new THREE.LatheGeometry(torpedoPts, 7);
    const kibbehMat = makeMat(THREE, food.primaryColor || '#8c4b23', { roughness: 0.72 });

    const count = Math.max(1, Math.min(8, Math.round(portion * 4)));
    for (let i = 0; i < count; i += 1) {
        const tier2 = i >= 5;
        const idx = tier2 ? i - 5 : i;
        const ringN = tier2 ? Math.max(1, count - 5) : Math.min(count, 5);
        const r = tier2 ? 0.07 : ringN === 1 ? 0 : 0.165;
        const angle = (idx / ringN) * Math.PI * 2 + (tier2 ? 0.7 : 0.2);

        const piece = new THREE.Mesh(kibbehGeom, kibbehMat);
        piece.rotation.z = Math.PI / 2;
        piece.rotation.y = angle + 0.5 + (rand() - 0.5) * 0.25;
        piece.position.set(
            Math.cos(angle) * r,
            0.11 + (tier2 ? 0.082 : 0),
            Math.sin(angle) * r,
        );
        group.add(piece);
    }

    // Lemon wedge accent
    const lemon = createPieWedgeMesh(
        THREE,
        0.1,
        0.04,
        0,
        Math.PI * 0.45,
        makeMat(THREE, food.accentColor || '#f4d03f', { roughness: 0.45 }),
    );
    lemon.position.set(0.22, 0.066, 0.18);
    lemon.rotation.y = 0.7;
    group.add(lemon);

    return group;
}

function buildShawarma(
    THREE: ThreeModule,
    food: SyrianFoodItem,
    portion: number,
    _rand: () => number,
): ThreeNS.Group {
    const group = new THREE.Group();

    // Rectangular parchment tray
    const tray = new THREE.Mesh(
        new THREE.BoxGeometry(0.68, 0.04, 0.48),
        makeMat(THREE, WOOD_WALNUT, { roughness: 0.78 }),
    );
    tray.position.y = 0.02;
    group.add(tray);

    const paper = new THREE.Mesh(
        new THREE.BoxGeometry(0.61, 0.008, 0.41),
        makeMat(THREE, '#faf4e6', { roughness: 0.9 }),
    );
    paper.position.y = 0.044;
    group.add(paper);

    const wrapMat = makeMat(THREE, '#dfb270', { roughness: 0.78 });
    const fillingMat = makeMat(THREE, food.primaryColor || '#7d3f24', { roughness: 0.65 });
    const toumMat = makeMat(THREE, '#fffdf5', { roughness: 0.45 });
    const pickleMat = makeMat(THREE, food.accentColor || '#c93b75', { roughness: 0.4 });

    const rollCount =
        portion <= 0.35 ? 1 : portion <= 0.62 ? 2 : portion <= 0.88 ? 2 : portion <= 1.25 ? 3 : portion <= 1.75 ? 4 : 5;
    const rollLength = portion <= 0.35 ? 0.22 : portion <= 0.62 ? 0.24 : 0.32;

    for (let i = 0; i < rollCount; i += 1) {
        const tier2 = i >= 3;
        const col = tier2 ? i - 3 : i;
        const rowLen = tier2 ? rollCount - 3 : Math.min(rollCount, 3);
        const z = (col - (rowLen - 1) / 2) * 0.125;

        const roll = new THREE.Group();
        const shell = new THREE.Mesh(
            new THREE.CylinderGeometry(0.056, 0.056, rollLength, 8),
            wrapMat,
        );
        shell.rotation.z = Math.PI / 2;
        roll.add(shell);

        const endL = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.044, 0.012, 7), fillingMat);
        endL.rotation.z = Math.PI / 2;
        endL.position.x = rollLength / 2 + 0.002;
        roll.add(endL);

        const endR = endL.clone();
        endR.position.x = -rollLength / 2 - 0.002;
        roll.add(endR);

        roll.position.set(-0.04, 0.1 + (tier2 ? 0.092 : 0), z);
        roll.rotation.y = (col - 1) * 0.06;
        group.add(roll);
    }

    // Small toum dip cup & pickled turnip sticks
    const cup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.06, 0.07, 8),
        makeMat(THREE, CERAMIC_CREAM, { roughness: 0.4 }),
    );
    cup.position.set(0.22, 0.08, -0.11);
    group.add(cup);

    const toum = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 4), toumMat);
    toum.scale.set(1, 0.45, 1);
    toum.position.set(0.22, 0.115, -0.11);
    group.add(toum);

    for (let p = 0; p < 3; p += 1) {
        const pickle = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.02, 0.022), pickleMat);
        pickle.position.set(0.21, 0.062, 0.06 + p * 0.045);
        pickle.rotation.y = 0.2 * p;
        group.add(pickle);
    }

    return group;
}

function buildSalad(
    THREE: ThreeModule,
    food: SyrianFoodItem,
    portion: number,
    rand: () => number,
): ThreeNS.Group {
    const group = new THREE.Group();
    const bowl = createGlazedBowl(THREE, 0.41, 0.21, CERAMIC_CREAM, '#3b8c5a');
    group.add(bowl);

    const greensMat = makeMat(THREE, food.primaryColor || '#388e3c', { roughness: 0.72 });
    const lightGreenMat = makeMat(THREE, '#66bb6a', { roughness: 0.74 });
    const tomatoMat = makeMat(THREE, '#e53935', { roughness: 0.42 });
    const pitaChipMat = makeMat(THREE, food.accentColor || '#d99b43', { roughness: 0.78 });

    const fillScale = 0.55 + Math.min(portion, 2) * 0.36;
    const leafCount = Math.max(6, Math.min(22, Math.round(portion * 10 + 3)));

    for (let i = 0; i < leafCount; i += 1) {
        const a = rand() * Math.PI * 2;
        const r = Math.sqrt(rand()) * 0.28;
        const h = 0.09 + (1 - r / 0.34) * 0.14 * fillScale + rand() * 0.04;
        const leaf = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.068, 0),
            i % 2 === 0 ? greensMat : lightGreenMat,
        );
        leaf.scale.set(1.2, 0.55, 1.1);
        leaf.position.set(Math.cos(a) * r, h, Math.sin(a) * r);
        leaf.rotation.set(rand() * 2, rand() * 3, rand() * 2);
        group.add(leaf);
    }

    // Diced tomato cubes
    const tomatoCount = Math.max(3, Math.min(10, Math.round(portion * 5)));
    for (let i = 0; i < tomatoCount; i += 1) {
        const a = rand() * Math.PI * 2;
        const r = rand() * 0.23;
        const cube = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.05, 0.055), tomatoMat);
        cube.position.set(Math.cos(a) * r, 0.14 + 0.12 * fillScale, Math.sin(a) * r);
        cube.rotation.set(rand(), rand(), rand());
        group.add(cube);
    }

    // Crispy fattoush pita triangles jutting out
    const chipCount = Math.max(2, Math.min(7, Math.round(portion * 3.5)));
    for (let i = 0; i < chipCount; i += 1) {
        const a = (i / chipCount) * Math.PI * 2 + 0.3;
        const chip = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.015, 3), pitaChipMat);
        chip.position.set(Math.cos(a) * 0.19, 0.16 + 0.12 * fillScale, Math.sin(a) * 0.19);
        chip.rotation.set(0.55, a, 0.35);
        group.add(chip);
    }

    return group;
}

function buildFries(
    THREE: ThreeModule,
    food: SyrianFoodItem,
    portion: number,
    rand: () => number,
): ThreeNS.Group {
    const group = new THREE.Group();

    // Stylized faceted fry cup/holder
    const holder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.15, 0.22, 6),
        makeMat(THREE, food.accentColor || '#c84b31', { roughness: 0.6 }),
    );
    holder.position.y = 0.11;
    group.add(holder);

    const saucer = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.24, 0.025, 8),
        makeMat(THREE, CERAMIC_CREAM, { roughness: 0.45 }),
    );
    saucer.position.y = 0.0125;
    group.add(saucer);

    const fryMatA = makeMat(THREE, food.primaryColor || '#f4b942', { roughness: 0.72 });
    const fryMatB = makeMat(THREE, '#e5a42c', { roughness: 0.75 });
    const count = Math.max(5, Math.min(24, Math.round(portion * 12)));

    for (let i = 0; i < count; i += 1) {
        const a = (i / count) * Math.PI * 2 + rand() * 0.35;
        const r = 0.02 + rand() * 0.11;
        const height = 0.22 + rand() * 0.14 + Math.min(portion, 2) * 0.03;
        const fry = new THREE.Mesh(
            new THREE.BoxGeometry(0.04, height, 0.04),
            i % 2 === 0 ? fryMatA : fryMatB,
        );
        fry.position.set(Math.cos(a) * r, 0.16 + height * 0.36, Math.sin(a) * r);
        fry.rotation.set((rand() - 0.5) * 0.45, rand() * Math.PI, (rand() - 0.5) * 0.45);
        group.add(fry);
    }

    return group;
}

function buildPastrySweet(
    THREE: ThreeModule,
    food: SyrianFoodItem,
    portion: number,
    rand: () => number,
): ThreeNS.Group {
    const group = new THREE.Group();

    // Ornate octagonal brass-rimmed sweet tray
    const tray = new THREE.Mesh(
        new THREE.CylinderGeometry(0.39, 0.34, 0.04, 8),
        makeMat(THREE, '#f2e8d5', { roughness: 0.35 }),
    );
    tray.position.y = 0.02;
    group.add(tray);

    const brassRim = new THREE.Mesh(
        new THREE.TorusGeometry(0.38, 0.018, 5, 8),
        makeMat(THREE, BRASS_GOLD, { roughness: 0.28, metalness: 0.65 }),
    );
    brassRim.rotation.x = Math.PI / 2;
    brassRim.position.y = 0.042;
    group.add(brassRim);

    // Diamond baklava shape
    const diamond = new THREE.Shape();
    diamond.moveTo(0, 0.095);
    diamond.lineTo(0.068, 0);
    diamond.lineTo(0, -0.095);
    diamond.lineTo(-0.068, 0);
    diamond.closePath();

    const pieceGeom = new THREE.ExtrudeGeometry(diamond, {
        depth: 0.065,
        bevelEnabled: true,
        bevelThickness: 0.006,
        bevelSize: 0.005,
        bevelSegments: 1,
    });
    pieceGeom.rotateX(-Math.PI / 2);

    const pastryMat = makeMat(THREE, food.primaryColor || '#d4872c', {
        roughness: 0.34,
        metalness: 0.06,
    });
    const pistachioMat = makeMat(THREE, food.accentColor || '#5cb85c', { roughness: 0.72 });

    const count = Math.max(1, Math.min(7, Math.round(portion * 3.5)));
    for (let i = 0; i < count; i += 1) {
        const isCenterTop = i >= 5;
        const idx = isCenterTop ? i - 5 : i;
        const ringN = isCenterTop ? Math.max(1, count - 5) : Math.min(count, 5);
        const r = isCenterTop ? 0.05 : ringN === 1 ? 0 : 0.16;
        const a = (idx / ringN) * Math.PI * 2 + (isCenterTop ? 0.6 : 0);

        const piece = new THREE.Mesh(pieceGeom, pastryMat);
        piece.position.set(
            Math.cos(a) * r,
            0.048 + (isCenterTop ? 0.072 : 0),
            Math.sin(a) * r,
        );
        piece.rotation.y = a + Math.PI / 2;
        group.add(piece);

        // Pistachio topping crown
        for (let k = 0; k < 3; k += 1) {
            const crumb = new THREE.Mesh(new THREE.DodecahedronGeometry(0.017, 0), pistachioMat);
            crumb.position.set(
                piece.position.x + (rand() - 0.5) * 0.045,
                piece.position.y + 0.078,
                piece.position.z + (rand() - 0.5) * 0.045,
            );
            group.add(crumb);
        }
    }

    return group;
}

function buildFruit(
    THREE: ThreeModule,
    food: SyrianFoodItem,
    portion: number,
    rand: () => number,
): ThreeNS.Group {
    const group = new THREE.Group();
    const plate = createCeramicPlate(THREE, 0.39, '#4c956c', CERAMIC_CREAM);
    group.add(plate);

    const fruitMatA = makeMat(THREE, food.primaryColor || '#e76f51', { roughness: 0.42 });
    const fruitMatB = makeMat(THREE, food.accentColor || '#f4a261', { roughness: 0.45 });
    const stemMat = makeMat(THREE, '#5c3d2e', { roughness: 0.85 });
    const leafMat = makeMat(THREE, '#3a8a5c', { roughness: 0.65 });

    const count = Math.max(1, Math.min(6, Math.round(portion * 3)));
    for (let i = 0; i < count; i += 1) {
        const tier2 = i >= 4;
        const idx = tier2 ? i - 4 : i;
        const ringN = tier2 ? Math.max(1, count - 4) : Math.min(count, 4);
        const r = tier2 ? 0.05 : ringN === 1 ? 0 : 0.145;
        const a = (idx / ringN) * Math.PI * 2 + 0.3;

        const fruit = new THREE.Group();
        const radius = count === 1 ? 0.135 : 0.105;
        const body = new THREE.Mesh(
            new THREE.IcosahedronGeometry(radius, 0),
            i % 2 === 0 ? fruitMatA : fruitMatB,
        );
        body.scale.set(1, 0.92, 1);
        fruit.add(body);

        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.012, 0.055, 5), stemMat);
        stem.position.y = radius * 0.95;
        stem.rotation.z = 0.2;
        fruit.add(stem);

        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.036, 0.075, 4), leafMat);
        leaf.position.set(0.035, radius * 0.96, 0);
        leaf.rotation.z = -1.1;
        fruit.add(leaf);

        fruit.position.set(
            Math.cos(a) * r,
            0.06 + radius * 0.92 + (tier2 ? 0.14 : 0),
            Math.sin(a) * r,
        );
        fruit.rotation.y = rand() * Math.PI * 2;
        group.add(fruit);
    }

    return group;
}

function buildTeaDrink(
    THREE: ThreeModule,
    food: SyrianFoodItem,
    portion: number,
    _rand: () => number,
): ThreeNS.Group {
    const group = new THREE.Group();

    const addIstikan = (offsetX: number, offsetZ: number, fillFactor: number) => {
        const sub = new THREE.Group();

        // Tiny ornate saucer
        const saucer = new THREE.Mesh(
            new THREE.CylinderGeometry(0.21, 0.14, 0.025, 10),
            makeMat(THREE, CERAMIC_CREAM, { roughness: 0.35 }),
        );
        saucer.position.y = 0.0125;
        sub.add(saucer);

        const saucerRim = new THREE.Mesh(
            new THREE.TorusGeometry(0.2, 0.01, 5, 10),
            makeMat(THREE, BRASS_GOLD, { roughness: 0.3, metalness: 0.65 }),
        );
        saucerRim.rotation.x = Math.PI / 2;
        saucerRim.position.y = 0.026;
        sub.add(saucerRim);

        // Waisted Syrian istikan glass profile
        const glassPts = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.088, 0),
            new THREE.Vector2(0.115, 0.09),
            new THREE.Vector2(0.082, 0.19),
            new THREE.Vector2(0.118, 0.3),
            new THREE.Vector2(0.11, 0.3),
            new THREE.Vector2(0.075, 0.19),
            new THREE.Vector2(0.105, 0.09),
            new THREE.Vector2(0.078, 0.02),
            new THREE.Vector2(0, 0.02),
        ];
        const glass = new THREE.Mesh(
            new THREE.LatheGeometry(glassPts, 10),
            makeMat(THREE, '#e8f4f8', {
                roughness: 0.12,
                metalness: 0.08,
                transparent: true,
                opacity: 0.42,
            }),
        );
        glass.position.y = 0.024;
        sub.add(glass);

        // Liquid fill
        const maxH = 0.255;
        const fillH = Math.max(0.06, Math.min(maxH, maxH * fillFactor));
        const liqPts: ThreeNS.Vector2[] = [
            new THREE.Vector2(0, 0.022),
            new THREE.Vector2(0.074, 0.022),
        ];
        if (fillH > 0.09) {
            liqPts.push(new THREE.Vector2(0.102, 0.09));
        }
        if (fillH > 0.19) {
            liqPts.push(new THREE.Vector2(0.073, 0.19));
        }
        const topR =
            fillH <= 0.09
                ? 0.074 + (fillH / 0.09) * 0.028
                : fillH <= 0.19
                  ? 0.102 - ((fillH - 0.09) / 0.1) * 0.029
                  : 0.073 + ((fillH - 0.19) / 0.11) * 0.032;
        liqPts.push(new THREE.Vector2(topR, fillH));
        liqPts.push(new THREE.Vector2(0, fillH));

        const liquid = new THREE.Mesh(
            new THREE.LatheGeometry(liqPts, 10),
            makeMat(THREE, food.primaryColor || '#9e3812', {
                roughness: 0.18,
                metalness: 0.04,
            }),
        );
        liquid.position.y = 0.024;
        sub.add(liquid);

        // Tiny brass spoon on saucer
        const spoon = new THREE.Mesh(
            new THREE.BoxGeometry(0.16, 0.01, 0.022),
            makeMat(THREE, BRASS_GOLD, { roughness: 0.28, metalness: 0.72 }),
        );
        spoon.position.set(0.11, 0.034, 0.11);
        spoon.rotation.y = -0.65;
        sub.add(spoon);

        // Mint sprig if accent color suggests herbs
        if (food.accentColor) {
            const leaf = new THREE.Mesh(
                new THREE.ConeGeometry(0.032, 0.06, 4),
                makeMat(THREE, food.accentColor, { roughness: 0.55 }),
            );
            leaf.position.set(0.02, 0.024 + fillH + 0.01, 0);
            leaf.rotation.z = 0.6;
            sub.add(leaf);
        }

        sub.position.set(offsetX, 0, offsetZ);
        group.add(sub);
    };

    if (portion <= 1.25) {
        const fill = Math.max(0.28, Math.min(0.95, 0.25 + portion * 0.7));
        addIstikan(0, 0, fill);
    } else {
        addIstikan(-0.14, -0.04, 0.94);
        addIstikan(0.15, 0.06, Math.min(0.94, (portion - 1) * 0.85 + 0.25));
    }

    return group;
}

function buildNuts(
    THREE: ThreeModule,
    food: SyrianFoodItem,
    portion: number,
    rand: () => number,
): ThreeNS.Group {
    const group = new THREE.Group();
    const bowl = createGlazedBowl(THREE, 0.29, 0.16, BRASS_GOLD, '#e6be6a', 0.55);
    group.add(bowl);

    const nutMats = [
        makeMat(THREE, food.primaryColor || '#cfa064', { roughness: 0.68 }),
        makeMat(THREE, food.accentColor || '#9ab973', { roughness: 0.65 }),
        makeMat(THREE, '#8d5b4c', { roughness: 0.72 }),
    ];

    const count = Math.max(6, Math.min(28, Math.round(portion * 13 + 3)));
    const moundHeight = 0.06 + Math.min(portion, 2) * 0.075;

    for (let i = 0; i < count; i += 1) {
        const a = rand() * Math.PI * 2;
        const r = Math.sqrt(rand()) * 0.21;
        const h = 0.08 + (1 - r / 0.24) * moundHeight + rand() * 0.03;
        const nut = new THREE.Mesh(
            new THREE.DodecahedronGeometry(0.036, 0),
            nutMats[i % nutMats.length],
        );
        nut.scale.set(1.3, 0.72, 0.88);
        nut.position.set(Math.cos(a) * r, h, Math.sin(a) * r);
        nut.rotation.set(rand() * 3, rand() * 3, rand() * 3);
        group.add(nut);
    }

    return group;
}

function buildYogurtCup(
    THREE: ThreeModule,
    food: SyrianFoodItem,
    portion: number,
    rand: () => number,
): ThreeNS.Group {
    const group = new THREE.Group();

    const addCup = (x: number, z: number, fillRatio: number, scale = 1) => {
        const cupGroup = new THREE.Group();
        const cupHeight = 0.32 * scale;
        const topR = 0.135 * scale;
        const botR = 0.095 * scale;

        const vessel = new THREE.Mesh(
            new THREE.CylinderGeometry(topR, botR, cupHeight, 9, 1, true),
            makeMat(THREE, '#eef4f8', {
                roughness: 0.22,
                metalness: 0.05,
                transparent: true,
                opacity: 0.55,
            }),
        );
        vessel.position.y = cupHeight / 2 + 0.015;
        cupGroup.add(vessel);

        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(botR, botR, 0.02, 9),
            makeMat(THREE, '#dfe9f0', { roughness: 0.28 }),
        );
        base.position.y = 0.01;
        cupGroup.add(base);

        const liqH = Math.max(0.07, cupHeight * 0.88 * fillRatio);
        const liqTopR = botR + (topR - botR) * (liqH / cupHeight);
        const liquid = new THREE.Mesh(
            new THREE.CylinderGeometry(liqTopR * 0.92, botR * 0.9, liqH, 9),
            makeMat(THREE, food.primaryColor || '#f7f7f2', { roughness: 0.45 }),
        );
        liquid.position.y = 0.02 + liqH / 2;
        cupGroup.add(liquid);

        // Frothy ayran foam ring
        const foam = new THREE.Mesh(
            new THREE.TorusGeometry(liqTopR * 0.72, 0.018 * scale, 5, 9),
            makeMat(THREE, '#ffffff', { roughness: 0.65 }),
        );
        foam.rotation.x = Math.PI / 2;
        foam.position.y = 0.02 + liqH;
        cupGroup.add(foam);

        addGarnishSpecks(
            THREE,
            cupGroup,
            4,
            liqTopR * 0.55,
            0.032 + liqH,
            [food.accentColor || '#3a8a5c'],
            rand,
            0.014,
        );

        cupGroup.position.set(x, 0, z);
        group.add(cupGroup);
    };

    if (portion <= 1.25) {
        addCup(0, 0, Math.max(0.32, Math.min(0.95, 0.28 + portion * 0.65)));
    } else {
        addCup(-0.12, -0.02, 0.95, 1.02);
        addCup(0.14, 0.05, Math.min(0.95, (portion - 1) * 0.8 + 0.3), 0.88);
    }

    return group;
}

/**
 * Pure procedural low-poly 3D Syrian food builder.
 * Accepts the dynamically imported Three.js module so there are zero SSR side effects.
 */
export function createFoodMesh(
    THREE: ThreeModule,
    food: SyrianFoodItem,
    portion: number,
): ThreeNS.Group {
    const safePortion = clampPortion(portion);
    const rand = createSeededRandom(`${food.id}:${food.meshKind}`);

    let root: ThreeNS.Group;
    switch (food.meshKind) {
        case 'bread':
            root = buildBread(THREE, food, safePortion, rand);
            break;
        case 'dip_bowl':
            root = buildDipBowl(THREE, food, safePortion, rand);
            break;
        case 'cheese_olives':
            root = buildCheeseOlives(THREE, food, safePortion, rand);
            break;
        case 'eggs':
            root = buildEggs(THREE, food, safePortion, rand);
            break;
        case 'falafel':
            root = buildFalafel(THREE, food, safePortion, rand);
            break;
        case 'manousheh':
            root = buildManousheh(THREE, food, safePortion, rand);
            break;
        case 'makdous':
            root = buildMakdous(THREE, food, safePortion, rand);
            break;
        case 'rice_stew':
            root = buildRiceStew(THREE, food, safePortion, rand);
            break;
        case 'kebab_grill':
            root = buildKebabGrill(THREE, food, safePortion, rand);
            break;
        case 'kibbeh':
            root = buildKibbeh(THREE, food, safePortion, rand);
            break;
        case 'shawarma':
            root = buildShawarma(THREE, food, safePortion, rand);
            break;
        case 'salad':
            root = buildSalad(THREE, food, safePortion, rand);
            break;
        case 'fries':
            root = buildFries(THREE, food, safePortion, rand);
            break;
        case 'pastry_sweet':
            root = buildPastrySweet(THREE, food, safePortion, rand);
            break;
        case 'fruit':
            root = buildFruit(THREE, food, safePortion, rand);
            break;
        case 'tea_drink':
            root = buildTeaDrink(THREE, food, safePortion, rand);
            break;
        case 'nuts':
            root = buildNuts(THREE, food, safePortion, rand);
            break;
        case 'yogurt_cup':
            root = buildYogurtCup(THREE, food, safePortion, rand);
            break;
        default:
            root = buildDipBowl(THREE, food, safePortion, rand);
            break;
    }

    root.name = `food-${food.id}`;
    root.userData.foodId = food.id;
    root.userData.meshKind = food.meshKind;
    root.userData.portion = safePortion;
    root.userData.footprintRadius = getFoodFootprintRadius(food.meshKind);

    enableShadows(root, true, true);
    return root;
}

/**
 * Safely disposes all BufferGeometries and Materials within an Object3D subtree.
 */
export function disposeObject3D(root: ThreeNS.Object3D): void {
    const geometries = new Set<ThreeNS.BufferGeometry>();
    const materials = new Set<ThreeNS.Material>();

    root.traverse((obj) => {
        const mesh = obj as ThreeNS.Mesh;
        if (mesh.geometry) {
            geometries.add(mesh.geometry);
        }
        if (mesh.material) {
            if (Array.isArray(mesh.material)) {
                for (const m of mesh.material) {
                    materials.add(m);
                }
            } else {
                materials.add(mesh.material);
            }
        }
    });

    for (const geom of geometries) {
        geom.dispose();
    }
    for (const mat of materials) {
        mat.dispose();
    }
}
