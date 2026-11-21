<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import type * as ThreeNS from 'three';
import { RotateCcw, Sparkles, ZoomIn, ZoomOut } from 'lucide-vue-next';
import {
    formatPortionAr,
    getFoodById,
    MEAL_META,
    type MealEntry,
    type MealType,
    type SyrianFoodItem,
} from '@/data/syrianFoods';
import {
    createFoodMesh,
    disposeObject3D,
    getFoodFootprintRadius,
    type ThreeModule,
} from './foodMeshFactory';

const props = defineProps<{
    meal: MealType;
    entries: MealEntry[];
    selectedFoodId: string | null;
    status: 'deficit' | 'maintenance' | 'surplus';
    /** Horizontal px shift of the scene centre (positive = shift left) to make room for overlay panels. */
    viewOffsetX?: number;
}>();

const emit = defineEmits<{
    (e: 'select-food', foodId: string | null): void;
}>();

const containerRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const isLoading = ref(true);
const webglUnavailable = ref(false);
const isDragging = ref(false);
const hoveredFoodId = ref<string | null>(null);

const STATUS_META: Record<
    'deficit' | 'maintenance' | 'surplus',
    { labelAr: string; hex: string; badgeClass: string; dotClass: string }
> = {
    deficit: {
        labelAr: 'عجز سعرات',
        hex: '#10b981',
        badgeClass:
            'border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
        dotClass: 'bg-emerald-500',
    },
    maintenance: {
        labelAr: 'توازن وثبات',
        hex: '#0ea5e9',
        badgeClass: 'border-sky-500/30 bg-sky-500/15 text-sky-700 dark:text-sky-300',
        dotClass: 'bg-sky-500',
    },
    surplus: {
        labelAr: 'فائض سعرات',
        hex: '#f43f5e',
        badgeClass: 'border-rose-500/30 bg-rose-500/15 text-rose-700 dark:text-rose-300',
        dotClass: 'bg-rose-500',
    },
};

const mealMeta = computed(() => MEAL_META[props.meal]);
const statusMeta = computed(() => STATUS_META[props.status]);

const resolvedEntries = computed(() =>
    props.entries
        .map((entry) => {
            const food = getFoodById(entry.foodId);
            return food ? { entry, food } : null;
        })
        .filter((item): item is { entry: MealEntry; food: SyrianFoodItem } => item !== null),
);

const selectedEntryInfo = computed(() => {
    if (!props.selectedFoodId) return null;
    return resolvedEntries.value.find((item) => item.food.id === props.selectedFoodId) ?? null;
});

const sceneAriaLabel = computed(() => {
    const count = resolvedEntries.value.length;
    const itemsText =
        count === 0
            ? 'السفرة فارغة حالياً'
            : `تضم ${count} ${count === 1 ? 'طبقاً' : count === 2 ? 'طبقين' : 'أطباق'}`;
    return `سفرة سورية ثلاثية الأبعاد لوجبة ${mealMeta.value.titleAr}، ${itemsText}، الحالة الحرارية: ${statusMeta.value.labelAr}`;
});

const backdropGradientClass = computed(() => {
    if (props.meal === 'late_dinner') {
        return 'from-slate-950 via-indigo-950 to-slate-900';
    }
    if (props.meal === 'lunch') {
        return 'from-amber-100 via-orange-50 to-stone-100 dark:from-stone-900 dark:via-amber-950/60 dark:to-stone-950';
    }
    return 'from-sky-100 via-amber-50 to-stone-100 dark:from-slate-900 dark:via-slate-800 dark:to-stone-900';
});

// ---- Three.js Runtime State (non-reactive for 60fps performance) ----
interface PlateSlot {
    foodId: string;
    portion: number;
    wrapper: ThreeNS.Group;
    meshGroup: ThreeNS.Group;
    selectionRing: ThreeNS.Mesh;
    targetX: number;
    targetZ: number;
    currentX: number;
    currentZ: number;
    dropY: number;
    dropVel: number;
    scale: number;
    scaleVel: number;
    ringOpacity: number;
    hoverLift: number;
    phaseOffset: number;
}

interface ExitingSlot {
    wrapper: ThreeNS.Group;
    scale: number;
    elapsed: number;
}

interface MoodTarget {
    bg: ThreeNS.Color;
    hemiSky: ThreeNS.Color;
    hemiGround: ThreeNS.Color;
    hemiIntensity: number;
    sunColor: ThreeNS.Color;
    sunIntensity: number;
    sunPos: ThreeNS.Vector3;
    lanternIntensity: number;
    lanternY: number;
    lanternEmissive: number;
}

const TABLE_RADIUS = 2.38;
const SAFE_FOOD_RADIUS = 2.02;

let THREE: ThreeModule | null = null;
let renderer: ThreeNS.WebGLRenderer | null = null;
let scene: ThreeNS.Scene | null = null;
let camera: ThreeNS.PerspectiveCamera | null = null;
let resizeObserver: ResizeObserver | null = null;
let rafId: number | null = null;
let reducedMotion = false;
let motionMediaQuery: MediaQueryList | null = null;

let foodRoot: ThreeNS.Group | null = null;
let auraRingMat: ThreeNS.MeshStandardMaterial | null = null;
let auraGlowMat: ThreeNS.MeshBasicMaterial | null = null;
let hemiLight: ThreeNS.HemisphereLight | null = null;
let sunLight: ThreeNS.DirectionalLight | null = null;
let fillLight: ThreeNS.DirectionalLight | null = null;
let lanternGroup: ThreeNS.Group | null = null;
let lanternPointLight: ThreeNS.PointLight | null = null;
let lanternCoreMat: ThreeNS.MeshStandardMaterial | null = null;

let raycaster: ThreeNS.Raycaster | null = null;
let pointerNdc: ThreeNS.Vector2 | null = null;

const activeSlots = new Map<string, PlateSlot>();
const exitingSlots: ExitingSlot[] = [];

// Orbit camera state
const DEFAULT_THETA = 0.56;
const DEFAULT_PHI = 0.92;
const DEFAULT_RADIUS = 5.45;

const orbit = {
    theta: DEFAULT_THETA,
    phi: DEFAULT_PHI,
    radius: DEFAULT_RADIUS,
    targetTheta: DEFAULT_THETA,
    targetPhi: DEFAULT_PHI,
    targetRadius: DEFAULT_RADIUS,
};

const dragState = {
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    movedPx: 0,
};

let moodTargets: Record<MealType, MoodTarget> | null = null;
let currentBgColor: ThreeNS.Color | null = null;
let currentAuraColor: ThreeNS.Color | null = null;
let targetAuraColor: ThreeNS.Color | null = null;
let baseLanternIntensity = 0;
let lastFrameTime = 0;

function getTier(food: SyrianFoodItem): 'center' | 'middle' | 'edge' {
    if (
        food.meshKind === 'tea_drink' ||
        food.meshKind === 'yogurt_cup' ||
        food.meshKind === 'nuts'
    ) {
        return 'edge';
    }
    if (
        food.meshKind === 'rice_stew' ||
        food.meshKind === 'kebab_grill' ||
        food.meshKind === 'shawarma' ||
        food.meshKind === 'manousheh' ||
        food.meshKind === 'kibbeh' ||
        food.category === 'cooked_dish'
    ) {
        return 'center';
    }
    return 'middle';
}

function computeTableLayout(
    items: Array<{ entry: MealEntry; food: SyrianFoodItem }>,
): Map<string, { x: number; z: number }> {
    const result = new Map<string, { x: number; z: number }>();
    if (items.length === 0) return result;

    const centerItems: SyrianFoodItem[] = [];
    const middleItems: SyrianFoodItem[] = [];
    const edgeItems: SyrianFoodItem[] = [];

    for (const { food } of items) {
        const tier = getTier(food);
        if (tier === 'center') centerItems.push(food);
        else if (tier === 'edge') edgeItems.push(food);
        else middleItems.push(food);
    }

    // If there are no main center dishes, promote the first middle dish to anchor the center
    if (centerItems.length === 0 && middleItems.length > 0) {
        const promoted = middleItems.shift();
        if (promoted) centerItems.push(promoted);
    }

    interface Node {
        id: string;
        x: number;
        z: number;
        r: number;
        maxR: number;
    }

    const nodes: Node[] = [];

    // Place center ring
    centerItems.forEach((food, idx) => {
        const r = getFoodFootprintRadius(food.meshKind);
        if (centerItems.length === 1) {
            nodes.push({ id: food.id, x: 0, z: 0, r, maxR: SAFE_FOOD_RADIUS - r });
        } else {
            const ringR = centerItems.length === 2 ? 0.56 : 0.7;
            const angle = (idx / centerItems.length) * Math.PI * 2 - Math.PI / 4;
            nodes.push({
                id: food.id,
                x: Math.cos(angle) * ringR,
                z: Math.sin(angle) * ringR,
                r,
                maxR: SAFE_FOOD_RADIUS - r,
            });
        }
    });

    // Place middle ring
    const middleRingR = centerItems.length <= 1 ? 1.18 : 1.38;
    middleItems.forEach((food, idx) => {
        const r = getFoodFootprintRadius(food.meshKind);
        const angle = (idx / Math.max(middleItems.length, 1)) * Math.PI * 2 + 0.35;
        nodes.push({
            id: food.id,
            x: Math.cos(angle) * middleRingR,
            z: Math.sin(angle) * middleRingR,
            r,
            maxR: SAFE_FOOD_RADIUS - r,
        });
    });

    // Place edge ring (drinks/nuts near table rim in gaps)
    const edgeRingR = 1.66;
    edgeItems.forEach((food, idx) => {
        const r = getFoodFootprintRadius(food.meshKind);
        const angle =
            (idx / Math.max(edgeItems.length, 1)) * Math.PI * 2 +
            Math.PI / Math.max(middleItems.length, 3) +
            0.7;
        nodes.push({
            id: food.id,
            x: Math.cos(angle) * edgeRingR,
            z: Math.sin(angle) * edgeRingR,
            r,
            maxR: SAFE_FOOD_RADIUS - r,
        });
    });

    // 2D collision relaxation so plates never clip or overlap
    const padding = 0.08;
    for (let iter = 0; iter < 20; iter += 1) {
        for (let i = 0; i < nodes.length; i += 1) {
            for (let j = i + 1; j < nodes.length; j += 1) {
                const a = nodes[i];
                const b = nodes[j];
                let dx = b.x - a.x;
                let dz = b.z - a.z;
                let dist = Math.hypot(dx, dz);
                const minDist = a.r + b.r + padding;

                if (dist < minDist) {
                    if (dist < 0.0001) {
                        dx = 0.01;
                        dz = 0.01;
                        dist = Math.hypot(dx, dz);
                    }
                    const push = (minDist - dist) * 0.52;
                    const nx = dx / dist;
                    const nz = dz / dist;
                    a.x -= nx * push;
                    a.z -= nz * push;
                    b.x += nx * push;
                    b.z += nz * push;
                }
            }
        }

        // Clamp within safe table tabletop boundary
        for (const node of nodes) {
            const d = Math.hypot(node.x, node.z);
            if (d > node.maxR && d > 0.0001) {
                const scale = node.maxR / d;
                node.x *= scale;
                node.z *= scale;
            }
        }
    }

    for (const node of nodes) {
        result.set(node.id, { x: node.x, z: node.z });
    }
    return result;
}

function buildDamasceneTable(T: ThreeModule): ThreeNS.Group {
    const table = new T.Group();

    const walnutMat = new T.MeshStandardMaterial({
        color: '#5a351e',
        flatShading: true,
        roughness: 0.68,
        metalness: 0.06,
    });
    const walnutDarkMat = new T.MeshStandardMaterial({
        color: '#3f2414',
        flatShading: true,
        roughness: 0.76,
        metalness: 0.05,
    });
    const pearlInlayMat = new T.MeshStandardMaterial({
        color: '#f2e8d2',
        flatShading: true,
        roughness: 0.34,
        metalness: 0.14,
    });
    const brassMat = new T.MeshStandardMaterial({
        color: '#c9973e',
        flatShading: true,
        roughness: 0.32,
        metalness: 0.65,
    });

    // Octagonal Damascene tabletop (top surface at y = 0)
    const tabletop = new T.Mesh(new T.CylinderGeometry(TABLE_RADIUS, TABLE_RADIUS * 0.94, 0.17, 8), walnutMat);
    tabletop.position.y = -0.085;
    tabletop.receiveShadow = true;
    tabletop.castShadow = true;
    table.add(tabletop);

    // Beveled apron below tabletop
    const apron = new T.Mesh(new T.CylinderGeometry(TABLE_RADIUS * 0.9, TABLE_RADIUS * 0.78, 0.14, 8), walnutDarkMat);
    apron.position.y = -0.24;
    apron.castShadow = true;
    apron.receiveShadow = true;
    table.add(apron);

    // Subtle inlaid mother-of-pearl outer geometric border on tabletop
    const outerInlay = new T.Mesh(new T.TorusGeometry(2.14, 0.018, 4, 8), pearlInlayMat);
    outerInlay.rotation.x = Math.PI / 2;
    outerInlay.rotation.z = Math.PI / 8;
    outerInlay.position.y = 0.002;
    table.add(outerInlay);

    // Inner subtle Damascene inlay ring
    const innerInlay = new T.Mesh(new T.TorusGeometry(1.02, 0.012, 4, 8), pearlInlayMat);
    innerInlay.rotation.x = Math.PI / 2;
    innerInlay.position.y = 0.002;
    table.add(innerInlay);

    // 8 small diamond pearl/brass accents around the outer border
    for (let i = 0; i < 8; i += 1) {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        const diamond = new T.Mesh(
            new T.CylinderGeometry(0.055, 0.055, 0.008, 4),
            i % 2 === 0 ? pearlInlayMat : brassMat,
        );
        diamond.position.set(Math.cos(a) * 2.02, 0.003, Math.sin(a) * 2.02);
        diamond.rotation.y = a;
        table.add(diamond);
    }

    // Turned octagonal pedestal leg
    const pedestalPts = [
        new T.Vector2(0, -1.35),
        new T.Vector2(1.05, -1.35),
        new T.Vector2(0.92, -1.2),
        new T.Vector2(0.36, -1.04),
        new T.Vector2(0.28, -0.78),
        new T.Vector2(0.42, -0.56),
        new T.Vector2(0.32, -0.32),
        new T.Vector2(0, -0.32),
    ];
    const pedestal = new T.Mesh(new T.LatheGeometry(pedestalPts, 8), walnutDarkMat);
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    table.add(pedestal);

    // Brass collar ring on pedestal
    const collar = new T.Mesh(new T.TorusGeometry(0.37, 0.032, 5, 8), brassMat);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = -0.58;
    table.add(collar);

    // Warm tiled Damascene courtyard floor disc
    const floorGroup = new T.Group();
    const floorBase = new T.Mesh(
        new T.CylinderGeometry(4.8, 4.9, 0.14, 16),
        new T.MeshStandardMaterial({
            color: '#dfd0b8',
            flatShading: true,
            roughness: 0.9,
            metalness: 0.02,
        }),
    );
    floorBase.position.y = -1.42;
    floorBase.receiveShadow = true;
    floorGroup.add(floorBase);

    const tileRing1 = new T.Mesh(
        new T.RingGeometry(1.45, 2.25, 8),
        new T.MeshStandardMaterial({
            color: '#cbb292',
            flatShading: true,
            roughness: 0.88,
            side: T.DoubleSide,
        }),
    );
    tileRing1.rotation.x = -Math.PI / 2;
    tileRing1.position.y = -1.345;
    tileRing1.receiveShadow = true;
    floorGroup.add(tileRing1);

    const tileRing2 = new T.Mesh(
        new T.RingGeometry(3.0, 3.35, 16),
        new T.MeshStandardMaterial({
            color: '#b88663',
            flatShading: true,
            roughness: 0.88,
            side: T.DoubleSide,
        }),
    );
    tileRing2.rotation.x = -Math.PI / 2;
    tileRing2.position.y = -1.344;
    tileRing2.receiveShadow = true;
    floorGroup.add(tileRing2);

    table.add(floorGroup);

    // Status aura ring around/beneath table rim
    auraRingMat = new T.MeshStandardMaterial({
        color: STATUS_META[props.status].hex,
        emissive: new T.Color(STATUS_META[props.status].hex),
        emissiveIntensity: 0.65,
        flatShading: true,
        roughness: 0.35,
        metalness: 0.15,
    });
    const auraRing = new T.Mesh(new T.TorusGeometry(TABLE_RADIUS * 1.015, 0.048, 6, 8), auraRingMat);
    auraRing.rotation.x = Math.PI / 2;
    auraRing.rotation.z = Math.PI / 8;
    auraRing.position.y = -0.14;
    table.add(auraRing);

    auraGlowMat = new T.MeshBasicMaterial({
        color: STATUS_META[props.status].hex,
        transparent: true,
        opacity: 0.16,
        side: T.DoubleSide,
        depthWrite: false,
    });
    const auraDisc = new T.Mesh(new T.RingGeometry(TABLE_RADIUS * 0.96, TABLE_RADIUS * 1.24, 16), auraGlowMat);
    auraDisc.rotation.x = -Math.PI / 2;
    auraDisc.position.y = -0.17;
    table.add(auraDisc);

    return table;
}

function buildHangingLantern(T: ThreeModule): ThreeNS.Group {
    const lantern = new T.Group();
    const brassMat = new T.MeshStandardMaterial({
        color: '#c9973e',
        flatShading: true,
        roughness: 0.32,
        metalness: 0.72,
    });

    // Hanging chain
    const chain = new T.Mesh(new T.CylinderGeometry(0.014, 0.014, 1.5, 5), brassMat);
    chain.position.y = 0.95;
    lantern.add(chain);

    // Dome cap
    const cap = new T.Mesh(new T.ConeGeometry(0.24, 0.22, 6), brassMat);
    cap.position.y = 0.2;
    lantern.add(cap);

    // Glowing warm amber core
    lanternCoreMat = new T.MeshStandardMaterial({
        color: '#ffd17a',
        emissive: new T.Color('#ff9d3b'),
        emissiveIntensity: 0.1,
        flatShading: true,
        roughness: 0.25,
    });
    const core = new T.Mesh(new T.CylinderGeometry(0.14, 0.11, 0.3, 6), lanternCoreMat);
    core.position.y = -0.04;
    lantern.add(core);

    // Brass cage ribs
    for (let i = 0; i < 6; i += 1) {
        const a = (i / 6) * Math.PI * 2;
        const rib = new T.Mesh(new T.BoxGeometry(0.022, 0.34, 0.022), brassMat);
        rib.position.set(Math.cos(a) * 0.165, -0.04, Math.sin(a) * 0.165);
        lantern.add(rib);
    }

    // Bottom finial
    const base = new T.Mesh(new T.ConeGeometry(0.16, 0.14, 6), brassMat);
    base.rotation.x = Math.PI;
    base.position.y = -0.25;
    lantern.add(base);

    // PointLight inside lantern for twilight warmth
    lanternPointLight = new T.PointLight('#ff9f43', 0, 9.5, 1.6);
    lanternPointLight.position.set(0, -0.08, 0);
    lantern.add(lanternPointLight);

    lantern.position.set(-1.75, 2.55, -1.25);
    return lantern;
}

function createSelectionRing(T: ThreeModule, radius: number): ThreeNS.Mesh {
    const ring = new T.Mesh(
        new T.RingGeometry(radius * 0.88, radius * 1.12, 16),
        new T.MeshBasicMaterial({
            color: '#fbbf24',
            transparent: true,
            opacity: 0,
            side: T.DoubleSide,
            depthWrite: false,
        }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.015;
    return ring;
}

function syncFoodMeshes(): void {
    if (!THREE || !foodRoot) return;
    const T = THREE;

    const currentItems = resolvedEntries.value;
    const layout = computeTableLayout(currentItems);
    const nextIds = new Set(currentItems.map((i) => i.food.id));

    // Move removed items into exitingSlots
    for (const [foodId, slot] of activeSlots.entries()) {
        if (!nextIds.has(foodId)) {
            activeSlots.delete(foodId);
            if (reducedMotion) {
                foodRoot.remove(slot.wrapper);
                disposeObject3D(slot.wrapper);
            } else {
                exitingSlots.push({
                    wrapper: slot.wrapper,
                    scale: slot.wrapper.scale.x,
                    elapsed: 0,
                });
            }
        }
    }

    // Add or update existing items
    for (const { entry, food } of currentItems) {
        const pos = layout.get(food.id) ?? { x: 0, z: 0 };
        const existing = activeSlots.get(food.id);

        if (!existing) {
            const wrapper = new T.Group();
            wrapper.userData.foodId = food.id;

            const meshGroup = createFoodMesh(T, food, entry.portion);
            wrapper.add(meshGroup);

            const ringRadius = getFoodFootprintRadius(food.meshKind) + 0.05;
            const selectionRing = createSelectionRing(T, ringRadius);
            wrapper.add(selectionRing);

            const startDropY = reducedMotion ? 0 : 1.05;
            const startScale = reducedMotion ? 1 : 0.2;
            wrapper.position.set(pos.x, startDropY, pos.z);
            wrapper.scale.setScalar(startScale);

            foodRoot.add(wrapper);

            activeSlots.set(food.id, {
                foodId: food.id,
                portion: entry.portion,
                wrapper,
                meshGroup,
                selectionRing,
                targetX: pos.x,
                targetZ: pos.z,
                currentX: pos.x,
                currentZ: pos.z,
                dropY: startDropY,
                dropVel: 0,
                scale: startScale,
                scaleVel: reducedMotion ? 0 : 4.2,
                ringOpacity: 0,
                hoverLift: 0,
                phaseOffset: Math.random() * Math.PI * 2,
            });
        } else {
            existing.targetX = pos.x;
            existing.targetZ = pos.z;

            if (existing.portion !== entry.portion) {
                existing.portion = entry.portion;
                existing.wrapper.remove(existing.meshGroup);
                disposeObject3D(existing.meshGroup);

                const nextMesh = createFoodMesh(T, food, entry.portion);
                existing.meshGroup = nextMesh;
                existing.wrapper.add(nextMesh);

                if (!reducedMotion) {
                    existing.scale = 0.78;
                    existing.scaleVel = 4.6;
                }
            }
        }
    }
}

function updateCameraPosition(): void {
    if (!camera) return;
    const sinPhi = Math.sin(orbit.phi);
    const x = orbit.radius * sinPhi * Math.sin(orbit.theta);
    const y = orbit.radius * Math.cos(orbit.phi);
    const z = orbit.radius * sinPhi * Math.cos(orbit.theta);
    camera.position.set(x, y, z);
    camera.lookAt(0, 0.1, 0);
}

function zoomBy(delta: number): void {
    orbit.targetRadius = Math.max(3.4, Math.min(7.6, orbit.targetRadius + delta));
    if (reducedMotion) {
        orbit.radius = orbit.targetRadius;
        updateCameraPosition();
    }
}

function resetCamera(): void {
    orbit.targetTheta = DEFAULT_THETA;
    orbit.targetPhi = DEFAULT_PHI;
    orbit.targetRadius = getResponsiveRadius();
    if (reducedMotion) {
        orbit.theta = orbit.targetTheta;
        orbit.phi = orbit.targetPhi;
        orbit.radius = orbit.targetRadius;
        updateCameraPosition();
    }
}

function getResponsiveRadius(): number {
    const width = containerRef.value?.clientWidth ?? 640;
    if (width < 420) return 6.45;
    if (width < 560) return 5.85;
    return DEFAULT_RADIUS;
}

function findFoodIdFromObject(obj: ThreeNS.Object3D | null): string | null {
    let cur: ThreeNS.Object3D | null = obj;
    while (cur) {
        if (typeof cur.userData?.foodId === 'string') {
            return cur.userData.foodId;
        }
        cur = cur.parent;
    }
    return null;
}

function pickFoodAtClientPos(clientX: number, clientY: number): string | null {
    if (!canvasRef.value || !raycaster || !pointerNdc || !camera || !foodRoot) return null;
    const rect = canvasRef.value.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;

    pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointerNdc, camera);
    const hits = raycaster.intersectObjects(foodRoot.children, true);
    for (const hit of hits) {
        const foodId = findFoodIdFromObject(hit.object);
        if (foodId) return foodId;
    }
    return null;
}

function onPointerDown(e: PointerEvent): void {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    dragState.active = true;
    dragState.pointerId = e.pointerId;
    dragState.startX = e.clientX;
    dragState.startY = e.clientY;
    dragState.lastX = e.clientX;
    dragState.lastY = e.clientY;
    dragState.movedPx = 0;
    isDragging.value = false;
    canvasRef.value?.setPointerCapture?.(e.pointerId);
}

function onPointerMove(e: PointerEvent): void {
    if (dragState.active && dragState.pointerId === e.pointerId) {
        const dx = e.clientX - dragState.lastX;
        const dy = e.clientY - dragState.lastY;
        dragState.lastX = e.clientX;
        dragState.lastY = e.clientY;
        dragState.movedPx += Math.hypot(dx, dy);

        if (dragState.movedPx >= 5) {
            isDragging.value = true;
            orbit.targetTheta -= dx * 0.0085;
            orbit.targetPhi = Math.max(0.38, Math.min(1.3, orbit.targetPhi - dy * 0.0065));
            if (reducedMotion) {
                orbit.theta = orbit.targetTheta;
                orbit.phi = orbit.targetPhi;
                updateCameraPosition();
            }
        }
        return;
    }

    if (e.pointerType === 'mouse') {
        hoveredFoodId.value = pickFoodAtClientPos(e.clientX, e.clientY);
    }
}

function onPointerUp(e: PointerEvent): void {
    if (!dragState.active || dragState.pointerId !== e.pointerId) return;
    const wasClick = dragState.movedPx < 6;
    dragState.active = false;
    dragState.pointerId = -1;
    isDragging.value = false;
    canvasRef.value?.releasePointerCapture?.(e.pointerId);

    if (wasClick) {
        const picked = pickFoodAtClientPos(e.clientX, e.clientY);
        emit('select-food', picked);
    }
}

function onPointerCancel(e: PointerEvent): void {
    if (dragState.pointerId === e.pointerId) {
        dragState.active = false;
        dragState.pointerId = -1;
        isDragging.value = false;
    }
}

function onPointerLeave(): void {
    hoveredFoodId.value = null;
}

function animate(now: number): void {
    rafId = window.requestAnimationFrame(animate);
    if (!renderer || !scene || !camera || !moodTargets || !currentBgColor) return;

    const dt = Math.min(0.05, Math.max(0.001, (now - lastFrameTime) / 1000));
    lastFrameTime = now;
    const t = now * 0.001;
    const lerpRate = reducedMotion ? 1 : Math.min(1, dt * 6.5);
    const moodLerp = reducedMotion ? 1 : Math.min(1, dt * 3.8);

    // 1. Orbit camera damping
    orbit.theta += (orbit.targetTheta - orbit.theta) * Math.min(1, dt * 10);
    orbit.phi += (orbit.targetPhi - orbit.phi) * Math.min(1, dt * 10);
    orbit.radius += (orbit.targetRadius - orbit.radius) * Math.min(1, dt * 10);
    updateCameraPosition();

    // 2. Smooth time-of-day mood lighting
    const mood = moodTargets[props.meal];
    currentBgColor.lerp(mood.bg, moodLerp);
    scene.background = currentBgColor;
    if (THREE && scene.fog instanceof THREE.Fog) {
        scene.fog.color.copy(currentBgColor);
    }

    if (hemiLight) {
        hemiLight.color.lerp(mood.hemiSky, moodLerp);
        hemiLight.groundColor.lerp(mood.hemiGround, moodLerp);
        hemiLight.intensity += (mood.hemiIntensity - hemiLight.intensity) * moodLerp;
    }
    if (sunLight) {
        sunLight.color.lerp(mood.sunColor, moodLerp);
        sunLight.intensity += (mood.sunIntensity - sunLight.intensity) * moodLerp;
        sunLight.position.lerp(mood.sunPos, moodLerp);
    }
    if (fillLight) {
        const targetFill = props.meal === 'late_dinner' ? 0.55 : 0.4;
        fillLight.intensity += (targetFill - fillLight.intensity) * moodLerp;
    }

    // 3. Hanging Damascene brass lantern
    if (lanternGroup && lanternPointLight && lanternCoreMat) {
        lanternGroup.position.y += (mood.lanternY - lanternGroup.position.y) * moodLerp;
        baseLanternIntensity += (mood.lanternIntensity - baseLanternIntensity) * moodLerp;
        lanternCoreMat.emissiveIntensity +=
            (mood.lanternEmissive - lanternCoreMat.emissiveIntensity) * moodLerp;

        if (!reducedMotion && props.meal === 'late_dinner') {
            lanternGroup.rotation.z = Math.sin(t * 1.15) * 0.045;
            lanternGroup.rotation.x = Math.cos(t * 0.85) * 0.03;
            lanternPointLight.intensity =
                baseLanternIntensity + Math.sin(t * 6.2) * 0.14 + Math.cos(t * 9.7) * 0.08;
        } else {
            lanternGroup.rotation.z *= 0.9;
            lanternGroup.rotation.x *= 0.9;
            lanternPointLight.intensity = baseLanternIntensity;
        }
    }

    // 4. Status aura ring color + gentle pulse
    if (auraRingMat && auraGlowMat && currentAuraColor && targetAuraColor) {
        currentAuraColor.lerp(targetAuraColor, moodLerp);
        auraRingMat.color.copy(currentAuraColor);
        auraRingMat.emissive.copy(currentAuraColor);
        auraGlowMat.color.copy(currentAuraColor);

        const pulse = reducedMotion ? 0 : Math.sin(t * 2.3) * 0.14;
        auraRingMat.emissiveIntensity =
            (props.meal === 'late_dinner' ? 0.95 : 0.62) + pulse;
        auraGlowMat.opacity = (props.meal === 'late_dinner' ? 0.24 : 0.15) + pulse * 0.2;
    }

    // 5. Active plate animations (drop bounce, scale spring, layout slide, selection lift)
    for (const slot of activeSlots.values()) {
        const isSelected = slot.foodId === props.selectedFoodId;
        const isHovered = slot.foodId === hoveredFoodId.value;

        slot.currentX += (slot.targetX - slot.currentX) * lerpRate;
        slot.currentZ += (slot.targetZ - slot.currentZ) * lerpRate;

        if (reducedMotion) {
            slot.dropY = 0;
            slot.scale = 1;
            slot.hoverLift = isSelected ? 0.1 : 0;
        } else {
            // Spring physics for dropY -> 0
            const stiffnessY = 180;
            const dampingY = 16;
            const forceY = -stiffnessY * slot.dropY - dampingY * slot.dropVel;
            slot.dropVel += forceY * dt;
            slot.dropY += slot.dropVel * dt;
            if (slot.dropY < 0) {
                slot.dropY = 0;
                slot.dropVel = Math.abs(slot.dropVel) * 0.25;
                if (slot.dropVel < 0.05) slot.dropVel = 0;
            }

            // Spring physics for scale -> 1
            const stiffnessS = 210;
            const dampingS = 14;
            const forceS = stiffnessS * (1 - slot.scale) - dampingS * slot.scaleVel;
            slot.scaleVel += forceS * dt;
            slot.scale = Math.max(0.05, slot.scale + slot.scaleVel * dt);

            const targetLift = isSelected
                ? 0.11 + Math.sin(t * 3.1 + slot.phaseOffset) * 0.022
                : isHovered
                  ? 0.045
                  : 0;
            slot.hoverLift += (targetLift - slot.hoverLift) * Math.min(1, dt * 11);

            if (isSelected) {
                slot.meshGroup.rotation.y += dt * 0.45;
            }
        }

        slot.wrapper.position.set(slot.currentX, slot.dropY + slot.hoverLift, slot.currentZ);
        slot.wrapper.scale.setScalar(slot.scale);

        // Selection golden ring
        const targetRingOp = isSelected ? 0.88 : isHovered ? 0.32 : 0;
        slot.ringOpacity += (targetRingOp - slot.ringOpacity) * Math.min(1, dt * 12);
        const ringMat = slot.selectionRing.material as ThreeNS.MeshBasicMaterial;
        ringMat.opacity = slot.ringOpacity;
        slot.selectionRing.position.y = 0.015 - slot.hoverLift;
        if (!reducedMotion && isSelected) {
            const s = 1 + Math.sin(t * 4) * 0.04;
            slot.selectionRing.scale.set(s, s, 1);
        } else {
            slot.selectionRing.scale.set(1, 1, 1);
        }
    }

    // 6. Exiting plate pop-out animations
    for (let i = exitingSlots.length - 1; i >= 0; i -= 1) {
        const item = exitingSlots[i];
        item.elapsed += dt;
        const progress = Math.min(1, item.elapsed / 0.22);
        const s = Math.max(0.01, item.scale * (1 - progress * progress));
        item.wrapper.scale.setScalar(s);
        item.wrapper.position.y += dt * 0.65;

        if (progress >= 1) {
            foodRoot?.remove(item.wrapper);
            disposeObject3D(item.wrapper);
            exitingSlots.splice(i, 1);
        }
    }

    renderer.render(scene, camera);
}

function handleContextLost(event: Event): void {
    event.preventDefault();
    webglUnavailable.value = true;
    if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
    }
}

function handleResize(): void {
    if (!containerRef.value || !renderer || !camera) return;
    const width = Math.max(1, containerRef.value.clientWidth);
    const height = Math.max(1, containerRef.value.clientHeight);
    camera.aspect = width / height;
    const offset = Math.round(props.viewOffsetX ?? 0);
    if (offset !== 0 && width > 640) {
        camera.setViewOffset(width, height, offset, 0, width, height);
    } else {
        camera.clearViewOffset();
    }
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
}

function onWheel(e: WheelEvent): void {
    zoomBy(e.deltaY > 0 ? 0.35 : -0.35);
}

function handleReducedMotionChange(event: MediaQueryListEvent): void {
    reducedMotion = event.matches;
}

onMounted(async () => {
    if (typeof window === 'undefined' || !canvasRef.value || !containerRef.value) return;

    motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = motionMediaQuery.matches;
    motionMediaQuery.addEventListener?.('change', handleReducedMotionChange);

    try {
        const T = await import('three');
        THREE = T;

        const canvas = canvasRef.value;
        canvas.addEventListener('webglcontextlost', handleContextLost, false);

        renderer = new T.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = T.PCFSoftShadowMap;
        renderer.toneMapping = T.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.08;

        scene = new T.Scene();
        moodTargets = {
            breakfast: {
                bg: new T.Color('#f7efe2'),
                hemiSky: new T.Color('#e0f2fe'),
                hemiGround: new T.Color('#d4b996'),
                hemiIntensity: 1.05,
                sunColor: new T.Color('#fff2d6'),
                sunIntensity: 1.75,
                sunPos: new T.Vector3(4.4, 5.8, 3.8),
                lanternIntensity: 0,
                lanternY: 3.35,
                lanternEmissive: 0.05,
            },
            lunch: {
                bg: new T.Color('#f4e3c5'),
                hemiSky: new T.Color('#fffbeb'),
                hemiGround: new T.Color('#c8a377'),
                hemiIntensity: 1.12,
                sunColor: new T.Color('#ffe0a3'),
                sunIntensity: 2.05,
                sunPos: new T.Vector3(2.6, 7.6, 2.4),
                lanternIntensity: 0,
                lanternY: 3.35,
                lanternEmissive: 0.05,
            },
            late_dinner: {
                bg: new T.Color('#141b33'),
                hemiSky: new T.Color('#6474b8'),
                hemiGround: new T.Color('#271e2b'),
                hemiIntensity: 0.58,
                sunColor: new T.Color('#9ab4ff'),
                sunIntensity: 0.65,
                sunPos: new T.Vector3(-3.8, 5.4, 3.2),
                lanternIntensity: 4.4,
                lanternY: 1.92,
                lanternEmissive: 1.85,
            },
        };

        const initialMood = moodTargets[props.meal];
        const initialBg = initialMood.bg.clone();
        currentBgColor = initialBg;
        scene.background = initialBg;
        scene.fog = new T.Fog(initialBg.clone(), 9.5, 19);

        const initialAuraHex = STATUS_META[props.status].hex;
        currentAuraColor = new T.Color(initialAuraHex);
        targetAuraColor = new T.Color(initialAuraHex);

        const width = Math.max(1, containerRef.value.clientWidth);
        const height = Math.max(1, containerRef.value.clientHeight);
        camera = new T.PerspectiveCamera(40, width / height, 0.1, 40);

        orbit.radius = getResponsiveRadius();
        orbit.targetRadius = orbit.radius;
        updateCameraPosition();

        // Lights
        hemiLight = new T.HemisphereLight(
            initialMood.hemiSky.clone(),
            initialMood.hemiGround.clone(),
            initialMood.hemiIntensity,
        );
        scene.add(hemiLight);

        sunLight = new T.DirectionalLight(initialMood.sunColor.clone(), initialMood.sunIntensity);
        sunLight.position.copy(initialMood.sunPos);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.set(1024, 1024);
        sunLight.shadow.camera.near = 1;
        sunLight.shadow.camera.far = 16;
        sunLight.shadow.camera.left = -3.4;
        sunLight.shadow.camera.right = 3.4;
        sunLight.shadow.camera.top = 3.4;
        sunLight.shadow.camera.bottom = -3.4;
        sunLight.shadow.bias = -0.0008;
        scene.add(sunLight);

        fillLight = new T.DirectionalLight('#ffd9b3', 0.42);
        fillLight.position.set(-4.5, 3.2, -3.5);
        scene.add(fillLight);

        // Table & Courtyard
        const tableGroup = buildDamasceneTable(T);
        scene.add(tableGroup);

        // Hanging Brass Lantern
        lanternGroup = buildHangingLantern(T);
        lanternGroup.position.y = initialMood.lanternY;
        baseLanternIntensity = initialMood.lanternIntensity;
        if (lanternPointLight) lanternPointLight.intensity = baseLanternIntensity;
        if (lanternCoreMat) lanternCoreMat.emissiveIntensity = initialMood.lanternEmissive;
        scene.add(lanternGroup);

        // Food container
        foodRoot = new T.Group();
        scene.add(foodRoot);

        raycaster = new T.Raycaster();
        pointerNdc = new T.Vector2();

        handleResize();
        resizeObserver = new ResizeObserver(() => handleResize());
        resizeObserver.observe(containerRef.value);

        syncFoodMeshes();
        isLoading.value = false;

        lastFrameTime = performance.now();
        rafId = window.requestAnimationFrame(animate);
    } catch {
        webglUnavailable.value = true;
        isLoading.value = false;
    }
});

watch(
    () => props.entries,
    () => {
        syncFoodMeshes();
    },
    { deep: true },
);

watch(
    () => props.viewOffsetX,
    () => handleResize(),
);

watch(
    () => props.status,
    (nextStatus) => {
        if (THREE && targetAuraColor) {
            targetAuraColor.set(STATUS_META[nextStatus].hex);
        }
    },
);

onUnmounted(() => {
    if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
    }
    motionMediaQuery?.removeEventListener?.('change', handleReducedMotionChange);
    resizeObserver?.disconnect();
    resizeObserver = null;

    canvasRef.value?.removeEventListener('webglcontextlost', handleContextLost);

    activeSlots.clear();
    exitingSlots.length = 0;

    if (scene) {
        disposeObject3D(scene);
        scene.clear();
        scene = null;
    }
    if (renderer) {
        renderer.dispose();
        renderer = null;
    }
    camera = null;
    foodRoot = null;
    auraRingMat = null;
    auraGlowMat = null;
    hemiLight = null;
    sunLight = null;
    fillLight = null;
    lanternGroup = null;
    lanternPointLight = null;
    lanternCoreMat = null;
    raycaster = null;
    pointerNdc = null;
    moodTargets = null;
    currentBgColor = null;
    currentAuraColor = null;
    targetAuraColor = null;
    THREE = null;
});
</script>

<template>
    <div
        ref="containerRef"
        class="relative h-full w-full overflow-hidden bg-gradient-to-b select-none"
        :class="backdropGradientClass"
    >
        <!-- Graceful Non-WebGL / Context-Lost Arabic Fallback -->
        <div
            v-if="webglUnavailable"
            class="flex h-full w-full flex-col justify-between p-4 sm:p-5"
            dir="rtl"
        >
            <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                    <span class="text-xl" aria-hidden="true">{{ mealMeta.emoji }}</span>
                    <div>
                        <p class="text-sm font-semibold text-foreground">
                            سفرة {{ mealMeta.titleAr }}
                        </p>
                        <p class="text-xs text-muted-foreground">
                            عرض مبسّط (تعذّر تشغيل العرض ثلاثي الأبعاد على هذا الجهاز)
                        </p>
                    </div>
                </div>
                <span
                    class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
                    :class="statusMeta.badgeClass"
                >
                    <span class="size-2 rounded-full" :class="statusMeta.dotClass" />
                    {{ statusMeta.labelAr }}
                </span>
            </div>

            <div
                v-if="resolvedEntries.length === 0"
                class="my-auto flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 bg-background/60 p-6 text-center backdrop-blur-sm"
            >
                <Sparkles class="size-6 text-muted-foreground" />
                <p class="text-sm font-medium text-foreground">السفرة فارغة حالياً</p>
                <p class="text-xs text-muted-foreground">
                    أضف أطباقك من القائمة لتظهر هنا مباشرة
                </p>
            </div>

            <div
                v-else
                class="my-auto grid max-h-[240px] grid-cols-2 gap-2 overflow-y-auto py-2 sm:grid-cols-3"
            >
                <button
                    v-for="{ entry, food } in resolvedEntries"
                    :key="food.id"
                    type="button"
                    class="flex items-center gap-2.5 rounded-xl border p-2.5 text-start transition-colors"
                    :class="
                        selectedFoodId === food.id
                            ? 'border-amber-500 bg-amber-500/15 shadow-xs'
                            : 'border-border/70 bg-background/75 hover:bg-background'
                    "
                    @click="emit('select-food', food.id)"
                >
                    <span class="text-xl" aria-hidden="true">{{ food.emoji }}</span>
                    <span class="min-w-0 flex-1">
                        <span class="block truncate text-xs font-semibold text-foreground">
                            {{ food.nameAr }}
                        </span>
                        <span class="block text-[11px] text-muted-foreground">
                            الحصة: {{ formatPortionAr(entry.portion) }}×
                        </span>
                    </span>
                </button>
            </div>

            <p class="text-center text-xs text-muted-foreground">
                اضغط على أي طبق لتعديل حصته أو استبداله
            </p>
        </div>

        <!-- Interactive Three.js 3D Canvas -->
        <template v-else>
            <canvas
                ref="canvasRef"
                role="img"
                :aria-label="sceneAriaLabel"
                class="block h-full w-full touch-pan-y outline-none"
                :class="
                    isDragging
                        ? 'cursor-grabbing'
                        : hoveredFoodId
                          ? 'cursor-pointer'
                          : 'cursor-grab'
                "
                @pointerdown="onPointerDown"
                @pointermove="onPointerMove"
                @pointerup="onPointerUp"
                @pointercancel="onPointerCancel"
                @pointerleave="onPointerLeave"
                @wheel.prevent="onWheel"
            />

            <!-- Loading indicator while Three.js chunk boots -->
            <div
                v-if="isLoading"
                class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/40 backdrop-blur-[2px]"
            >
                <progress class="loading-spinner text-amber-600 dark:text-amber-400" />
                <span class="text-xs font-medium text-foreground/80">
                    جاري تجهيز السفرة الشامية...
                </span>
            </div>

            <!-- Empty-Table State Prompt -->
            <div
                v-if="!isLoading && resolvedEntries.length === 0"
                class="pointer-events-none absolute inset-0 flex items-center justify-center p-4"
            >
                <div
                    class="max-w-xs rounded-2xl border border-white/30 bg-background/85 px-4 py-3 text-center shadow-md backdrop-blur-md dark:border-white/10 dark:bg-slate-900/80"
                    dir="rtl"
                >
                    <p class="text-sm font-semibold text-foreground">السفرة بانتظار أطباقك</p>
                    <p class="mt-0.5 text-xs text-muted-foreground">
                        اختر وجباتك الشامية من القائمة لتترتب هنا فوراً
                    </p>
                </div>
            </div>

            <!-- Camera Quick Controls (bottom-end) -->
            <div class="pointer-events-none absolute end-2 top-1/2 flex -translate-y-1/2 flex-col items-end gap-2 sm:end-4" dir="rtl">
                <div
                    class="pointer-events-auto flex flex-col items-center gap-1 rounded-2xl border border-white/25 bg-background/80 p-1 shadow-md backdrop-blur-md dark:border-white/10 dark:bg-slate-900/75"
                >
                    <button
                        type="button"
                        aria-label="تكبير المشهد"
                        title="تكبير"
                        class="flex size-9 items-center justify-center rounded-xl text-foreground/80 transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                        @click="zoomBy(-0.7)"
                    >
                        <ZoomIn class="size-4" />
                    </button>
                    <button
                        type="button"
                        aria-label="تصغير المشهد"
                        title="تصغير"
                        class="flex size-9 items-center justify-center rounded-xl text-foreground/80 transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                        @click="zoomBy(0.7)"
                    >
                        <ZoomOut class="size-4" />
                    </button>
                    <button
                        type="button"
                        aria-label="إعادة ضبط الكاميرا"
                        title="إعادة ضبط الزاوية"
                        class="flex size-9 items-center justify-center rounded-xl text-foreground/80 transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                        @click="resetCamera"
                    >
                        <RotateCcw class="size-4" />
                    </button>
                </div>
            </div>
        </template>
    </div>
</template>
