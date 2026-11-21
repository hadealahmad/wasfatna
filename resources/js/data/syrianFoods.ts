export type MealType = 'breakfast' | 'lunch' | 'late_dinner';
export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type WeightTrend = 'losing' | 'maintaining' | 'gaining';
export type GoalType = 'lose' | 'maintain' | 'gain';

export type FoodMeshKind =
  | 'bread'
  | 'dip_bowl'
  | 'cheese_olives'
  | 'eggs'
  | 'falafel'
  | 'manousheh'
  | 'makdous'
  | 'rice_stew'
  | 'kebab_grill'
  | 'kibbeh'
  | 'shawarma'
  | 'salad'
  | 'fries'
  | 'pastry_sweet'
  | 'fruit'
  | 'tea_drink'
  | 'nuts'
  | 'yogurt_cup';

export interface SyrianFoodItem {
  id: string;
  nameAr: string;
  unitLabelAr: string;
  defaultMeals: MealType[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meshKind: FoodMeshKind;
  primaryColor: string;
  accentColor?: string;
  emoji: string;
  category: 'bread_carb' | 'protein' | 'dairy_dip' | 'cooked_dish' | 'veg_fruit' | 'treat_drink';
  swapTargetId?: string;
}

export interface MealEntry {
  foodId: string;
  portion: number;
}

export type MealsState = Record<MealType, MealEntry[]>;

export interface CalorieProfileData {
  gender: Gender;
  age: number;
  height_cm: number;
  weight_kg: number;
  activity_level: ActivityLevel;
  weight_trend: WeightTrend;
  goal: GoalType;
  meals: MealsState;
  baseline_meals: MealsState | null;
}

export const PORTION_STEPS = [0.25, 0.5, 0.75, 1, 1.5, 2] as const;

export const MEAL_META: Record<
  MealType,
  {
    id: MealType;
    titleAr: string;
    subtitleAr: string;
    timeLabelAr: string;
    emoji: string;
    lightingTheme: 'morning' | 'midday' | 'twilight';
  }
> = {
  breakfast: {
    id: 'breakfast',
    titleAr: 'الفطور',
    subtitleAr: 'فطور شامي صباحي',
    timeLabelAr: '٧:٠٠ – ١٠:٣٠ صباحاً',
    emoji: '☀️',
    lightingTheme: 'morning',
  },
  lunch: {
    id: 'lunch',
    titleAr: 'الغداء',
    subtitleAr: 'الوجبة الرئيسية',
    timeLabelAr: '١:٠٠ – ٤:٠٠ عصراً',
    emoji: '🍲',
    lightingTheme: 'midday',
  },
  late_dinner: {
    id: 'late_dinner',
    titleAr: 'العشاء المتأخر',
    subtitleAr: 'لقمة مسائية أو سهرة',
    timeLabelAr: '٨:٠٠ – ١١:٣٠ مساءً',
    emoji: '🌙',
    lightingTheme: 'twilight',
  },
};

export const SYRIAN_FOODS: SyrianFoodItem[] = [
  // Breakfast
  {
    id: 'arabic_bread',
    nameAr: 'خبز عربي',
    unitLabelAr: 'رغيف كامل (١٠٠ غ)',
    defaultMeals: ['breakfast', 'lunch', 'late_dinner'],
    calories: 275,
    protein: 9,
    carbs: 56,
    fat: 1.5,
    meshKind: 'bread',
    primaryColor: '#e4b97c',
    accentColor: '#b97e3f',
    emoji: '🫓',
    category: 'bread_carb',
  },
  {
    id: 'labneh_oil',
    nameAr: 'لبنة بزيت الزيتون',
    unitLabelAr: 'صحن صغير (٣ ملاعق + زيت)',
    defaultMeals: ['breakfast', 'late_dinner'],
    calories: 180,
    protein: 7,
    carbs: 4,
    fat: 15,
    meshKind: 'dip_bowl',
    primaryColor: '#f6f3ea',
    accentColor: '#8aa338',
    emoji: '🥣',
    category: 'dairy_dip',
  },
  {
    id: 'white_cheese',
    nameAr: 'جبنة بيضاء / حلوم',
    unitLabelAr: 'قطعتان متوسطتان (٦٠ غ)',
    defaultMeals: ['breakfast', 'late_dinner'],
    calories: 140,
    protein: 10,
    carbs: 2,
    fat: 10,
    meshKind: 'cheese_olives',
    primaryColor: '#f7f5ee',
    accentColor: '#d9d0bc',
    emoji: '🧀',
    category: 'dairy_dip',
  },
  {
    id: 'olives',
    nameAr: 'زيتون',
    unitLabelAr: '١٠ حبات مع رشة زيت',
    defaultMeals: ['breakfast', 'late_dinner'],
    calories: 70,
    protein: 0.5,
    carbs: 2,
    fat: 6.5,
    meshKind: 'cheese_olives',
    primaryColor: '#526328',
    accentColor: '#2c3018',
    emoji: '🫒',
    category: 'veg_fruit',
  },
  {
    id: 'zaatar_oil',
    nameAr: 'زعتر وزيت زيتون',
    unitLabelAr: 'ملعقتا زعتر + ملعقة زيت',
    defaultMeals: ['breakfast'],
    calories: 160,
    protein: 2,
    carbs: 7,
    fat: 14,
    meshKind: 'dip_bowl',
    primaryColor: '#5a6b2c',
    accentColor: '#9fb840',
    emoji: '🌿',
    category: 'dairy_dip',
  },
  {
    id: 'eggs',
    nameAr: 'بيض مقلي أو مسلوق',
    unitLabelAr: 'بيضتان',
    defaultMeals: ['breakfast', 'late_dinner'],
    calories: 190,
    protein: 13,
    carbs: 1,
    fat: 15,
    meshKind: 'eggs',
    primaryColor: '#fffcf2',
    accentColor: '#f5a623',
    emoji: '🍳',
    category: 'protein',
  },
  {
    id: 'foul_mudammas',
    nameAr: 'فول مدمس بالزيت',
    unitLabelAr: 'صحن وسط بالزيت والحامض',
    defaultMeals: ['breakfast'],
    calories: 260,
    protein: 13,
    carbs: 32,
    fat: 9,
    meshKind: 'dip_bowl',
    primaryColor: '#7a5438',
    accentColor: '#9ab03c',
    emoji: '🫘',
    category: 'cooked_dish',
  },
  {
    id: 'fatteh_hummus',
    nameAr: 'فتة حمص بالسمنة/تسقية',
    unitLabelAr: 'زبدية وسط بالسمنة والمكسرات',
    defaultMeals: ['breakfast'],
    calories: 480,
    protein: 14,
    carbs: 48,
    fat: 26,
    meshKind: 'dip_bowl',
    primaryColor: '#efe2c2',
    accentColor: '#d49a3a',
    emoji: '🍲',
    category: 'cooked_dish',
    swapTargetId: 'foul_mudammas',
  },
  {
    id: 'makdous',
    nameAr: 'مكدوس بالجوز',
    unitLabelAr: 'حبتان متوسطتان',
    defaultMeals: ['breakfast', 'late_dinner'],
    calories: 180,
    protein: 3,
    carbs: 7,
    fat: 16,
    meshKind: 'makdous',
    primaryColor: '#4e273a',
    accentColor: '#b9412c',
    emoji: '🍆',
    category: 'dairy_dip',
  },
  {
    id: 'falafel',
    nameAr: 'فلافل 4 أقراص',
    unitLabelAr: '٤ أقراص مقلية',
    defaultMeals: ['breakfast', 'late_dinner'],
    calories: 280,
    protein: 10,
    carbs: 28,
    fat: 14,
    meshKind: 'falafel',
    primaryColor: '#9f6b32',
    accentColor: '#677c32',
    emoji: '🧆',
    category: 'protein',
    swapTargetId: 'foul_mudammas',
  },
  {
    id: 'manousheh',
    nameAr: 'منقوشة زعتر/جبنة',
    unitLabelAr: 'قرص وسط (١٦٠ غ)',
    defaultMeals: ['breakfast'],
    calories: 390,
    protein: 12,
    carbs: 46,
    fat: 17,
    meshKind: 'manousheh',
    primaryColor: '#e2b66f',
    accentColor: '#5c6e2c',
    emoji: '🫓',
    category: 'bread_carb',
    swapTargetId: 'zaatar_oil',
  },
  {
    id: 'fresh_veggies',
    nameAr: 'صحن بندورة وخيار ونعناع',
    unitLabelAr: 'صحن خضار طازجة',
    defaultMeals: ['breakfast', 'lunch', 'late_dinner'],
    calories: 40,
    protein: 2,
    carbs: 8,
    fat: 0.5,
    meshKind: 'salad',
    primaryColor: '#579c44',
    accentColor: '#d9453a',
    emoji: '🥗',
    category: 'veg_fruit',
  },
  {
    id: 'tea_mate',
    nameAr: 'شاي بسكر / متة',
    unitLabelAr: 'كوب مع ملعقتي سكر',
    defaultMeals: ['breakfast', 'late_dinner'],
    calories: 45,
    protein: 0,
    carbs: 11,
    fat: 0,
    meshKind: 'tea_drink',
    primaryColor: '#9c3e1b',
    accentColor: '#d89b48',
    emoji: '🫖',
    category: 'treat_drink',
    swapTargetId: 'tea_unsweetened',
  },
  {
    id: 'tea_unsweetened',
    nameAr: 'شاي أو قهوة بدون سكر',
    unitLabelAr: 'كوب سادة',
    defaultMeals: ['breakfast', 'lunch', 'late_dinner'],
    calories: 5,
    protein: 0,
    carbs: 1,
    fat: 0,
    meshKind: 'tea_drink',
    primaryColor: '#5b331d',
    accentColor: '#c98842',
    emoji: '☕',
    category: 'treat_drink',
  },
  {
    id: 'halawa_tahini',
    nameAr: 'حلاوة طحينية',
    unitLabelAr: 'قطعة صغيرة (٤٠ غ)',
    defaultMeals: ['breakfast', 'late_dinner'],
    calories: 210,
    protein: 5,
    carbs: 22,
    fat: 12,
    meshKind: 'pastry_sweet',
    primaryColor: '#ebe0c9',
    accentColor: '#b9935a',
    emoji: '🍯',
    category: 'treat_drink',
    swapTargetId: 'labneh_oil',
  },

  // Lunch
  {
    id: 'rice_vermicelli',
    nameAr: 'رز بالشعيرية',
    unitLabelAr: 'صحن وسط (كوب مطبوخ)',
    defaultMeals: ['lunch'],
    calories: 320,
    protein: 6,
    carbs: 56,
    fat: 8,
    meshKind: 'rice_stew',
    primaryColor: '#f4efe2',
    accentColor: '#c98e46',
    emoji: '🍚',
    category: 'bread_carb',
  },
  {
    id: 'syrian_stew',
    nameAr: 'طبخة بيت باللحمة',
    unitLabelAr: 'زبدية يخن أو بامية أو فاصولياء',
    defaultMeals: ['lunch'],
    calories: 340,
    protein: 22,
    carbs: 18,
    fat: 20,
    meshKind: 'rice_stew',
    primaryColor: '#b5452e',
    accentColor: '#6f422b',
    emoji: '🥘',
    category: 'cooked_dish',
  },
  {
    id: 'mujaddara',
    nameAr: 'مجدرة بالزيت والبصل',
    unitLabelAr: 'صحن وسط مع بصل مقلي',
    defaultMeals: ['lunch'],
    calories: 380,
    protein: 14,
    carbs: 54,
    fat: 12,
    meshKind: 'rice_stew',
    primaryColor: '#7b6248',
    accentColor: '#4c321d',
    emoji: '🍛',
    category: 'cooked_dish',
  },
  {
    id: 'kabsa_ouzi',
    nameAr: 'كبسة أو أوزي',
    unitLabelAr: 'صحن رئيسي باللحم والمكسرات',
    defaultMeals: ['lunch'],
    calories: 560,
    protein: 28,
    carbs: 58,
    fat: 24,
    meshKind: 'rice_stew',
    primaryColor: '#d49d4b',
    accentColor: '#8d4829',
    emoji: '🍖',
    category: 'cooked_dish',
    swapTargetId: 'grills',
  },
  {
    id: 'shakriyeh',
    nameAr: 'شاكرية أو شيخ المحشي',
    unitLabelAr: 'صحن وسط باللبن المطبوخ واللحم',
    defaultMeals: ['lunch'],
    calories: 420,
    protein: 24,
    carbs: 16,
    fat: 29,
    meshKind: 'rice_stew',
    primaryColor: '#efe9d8',
    accentColor: '#7a5233',
    emoji: '🥣',
    category: 'cooked_dish',
    swapTargetId: 'syrian_stew',
  },
  {
    id: 'shish_barak',
    nameAr: 'شيش برك باللبن',
    unitLabelAr: 'صحن وسط (١٢ حبة باللبن)',
    defaultMeals: ['lunch'],
    calories: 440,
    protein: 19,
    carbs: 42,
    fat: 22,
    meshKind: 'dip_bowl',
    primaryColor: '#f2ecdc',
    accentColor: '#7a8f45',
    emoji: '🥟',
    category: 'cooked_dish',
    swapTargetId: 'syrian_stew',
  },
  {
    id: 'kibbeh',
    nameAr: 'كبة مقلية 3 أقراص',
    unitLabelAr: '٣ أقراص وسط',
    defaultMeals: ['lunch', 'late_dinner'],
    calories: 390,
    protein: 16,
    carbs: 34,
    fat: 21,
    meshKind: 'kibbeh',
    primaryColor: '#9c5a2d',
    accentColor: '#693414',
    emoji: '🥟',
    category: 'cooked_dish',
    swapTargetId: 'grills',
  },
  {
    id: 'shawarma',
    nameAr: 'سندويشة/وجبة شاورما',
    unitLabelAr: 'سندويشة خبز عربي أو صاج بالثومية',
    defaultMeals: ['lunch', 'late_dinner'],
    calories: 460,
    protein: 27,
    carbs: 42,
    fat: 20,
    meshKind: 'shawarma',
    primaryColor: '#deb472',
    accentColor: '#9d5d2e',
    emoji: '🌯',
    category: 'protein',
    swapTargetId: 'grills',
  },
  {
    id: 'grills',
    nameAr: 'مشاوي شيش أو كباب',
    unitLabelAr: 'سيخان (١٨٠ غ لحم أو دجاج مشوي)',
    defaultMeals: ['lunch'],
    calories: 430,
    protein: 36,
    carbs: 4,
    fat: 29,
    meshKind: 'kebab_grill',
    primaryColor: '#7f3e24',
    accentColor: '#c86432',
    emoji: '🍢',
    category: 'protein',
  },
  {
    id: 'mahashi',
    nameAr: 'محاشي / يبرق',
    unitLabelAr: 'صحن وسط (كوسا وورق عنب)',
    defaultMeals: ['lunch'],
    calories: 410,
    protein: 16,
    carbs: 44,
    fat: 19,
    meshKind: 'rice_stew',
    primaryColor: '#658038',
    accentColor: '#a3402c',
    emoji: '🫑',
    category: 'cooked_dish',
  },
  {
    id: 'fattoush',
    nameAr: 'صحن فتوش أو تبولة',
    unitLabelAr: 'صحن وسط بدبس الرمان والزيت',
    defaultMeals: ['lunch', 'late_dinner'],
    calories: 160,
    protein: 3,
    carbs: 15,
    fat: 10,
    meshKind: 'salad',
    primaryColor: '#4e8a38',
    accentColor: '#c9493b',
    emoji: '🥗',
    category: 'veg_fruit',
  },
  {
    id: 'yogurt_cucumber',
    nameAr: 'خيار بلبن ونعناع',
    unitLabelAr: 'زبدية متوسطة',
    defaultMeals: ['lunch', 'late_dinner'],
    calories: 95,
    protein: 6,
    carbs: 8,
    fat: 4,
    meshKind: 'yogurt_cup',
    primaryColor: '#f3f2eb',
    accentColor: '#639b50',
    emoji: '🥒',
    category: 'dairy_dip',
  },
  {
    id: 'ayran',
    nameAr: 'لبن عيران',
    unitLabelAr: 'كوب كبير (٢٥٠ مل)',
    defaultMeals: ['lunch'],
    calories: 110,
    protein: 6,
    carbs: 9,
    fat: 5.5,
    meshKind: 'yogurt_cup',
    primaryColor: '#f5f5f0',
    accentColor: '#71a862',
    emoji: '🥛',
    category: 'dairy_dip',
  },
  {
    id: 'soda_juice',
    nameAr: 'مشروب غازي أو عصير محلى',
    unitLabelAr: 'عبوة أو كوب (٣٣٠ مل)',
    defaultMeals: ['lunch', 'late_dinner'],
    calories: 140,
    protein: 0,
    carbs: 35,
    fat: 0,
    meshKind: 'tea_drink',
    primaryColor: '#3a241c',
    accentColor: '#d97e2b',
    emoji: '🥤',
    category: 'treat_drink',
    swapTargetId: 'ayran',
  },

  // Late Dinner
  {
    id: 'cheese_sandwich',
    nameAr: 'سندويشة لبنة أو جبنة',
    unitLabelAr: 'رغيف عربي محشي مع زيت',
    defaultMeals: ['late_dinner', 'breakfast'],
    calories: 310,
    protein: 12,
    carbs: 38,
    fat: 12,
    meshKind: 'shawarma',
    primaryColor: '#e4bc7a',
    accentColor: '#f4f0e4',
    emoji: '🥪',
    category: 'bread_carb',
    swapTargetId: 'white_cheese',
  },
  {
    id: 'fries',
    nameAr: 'صحن بطاطا مقلية',
    unitLabelAr: 'صحن وسط (١٥٠ غ)',
    defaultMeals: ['late_dinner', 'lunch'],
    calories: 340,
    protein: 4,
    carbs: 42,
    fat: 17,
    meshKind: 'fries',
    primaryColor: '#e9b949',
    accentColor: '#c93c2b',
    emoji: '🍟',
    category: 'bread_carb',
    swapTargetId: 'fresh_veggies',
  },
  {
    id: 'hummus_mutabbal',
    nameAr: 'حمص أو متبل بالطحينة',
    unitLabelAr: 'صحن وسط مع زيت زيتون',
    defaultMeals: ['late_dinner', 'breakfast'],
    calories: 240,
    protein: 7,
    carbs: 20,
    fat: 15,
    meshKind: 'dip_bowl',
    primaryColor: '#e8d7ae',
    accentColor: '#8ba439',
    emoji: '🧆',
    category: 'dairy_dip',
  },
  {
    id: 'fatayer',
    nameAr: 'فطاير أو صفيحة 3 قطع',
    unitLabelAr: '٣ قطع وسط',
    defaultMeals: ['late_dinner', 'breakfast'],
    calories: 360,
    protein: 13,
    carbs: 42,
    fat: 15,
    meshKind: 'manousheh',
    primaryColor: '#dca65d',
    accentColor: '#8e3828',
    emoji: '🥟',
    category: 'bread_carb',
    swapTargetId: 'fattoush',
  },
  {
    id: 'noodles',
    nameAr: 'معكرونة أو إندومي سريعة',
    unitLabelAr: 'صحن أو عبوة كاملة',
    defaultMeals: ['late_dinner'],
    calories: 350,
    protein: 8,
    carbs: 50,
    fat: 13,
    meshKind: 'rice_stew',
    primaryColor: '#f0cf78',
    accentColor: '#c74d2c',
    emoji: '🍜',
    category: 'bread_carb',
    swapTargetId: 'hummus_mutabbal',
  },
  {
    id: 'fruits',
    nameAr: 'فواكه موسمية مشكلة',
    unitLabelAr: 'صحن صغير (تفاح، برتقال، عنب أو تين)',
    defaultMeals: ['late_dinner', 'breakfast'],
    calories: 110,
    protein: 1.5,
    carbs: 27,
    fat: 0.5,
    meshKind: 'fruit',
    primaryColor: '#d9534f',
    accentColor: '#6ca644',
    emoji: '🍇',
    category: 'veg_fruit',
  },
  {
    id: 'nuts_seeds',
    nameAr: 'مكسرات وبزر سوري',
    unitLabelAr: 'حفنة متوسطة (٣٠ غ)',
    defaultMeals: ['late_dinner'],
    calories: 180,
    protein: 6,
    carbs: 6,
    fat: 15,
    meshKind: 'nuts',
    primaryColor: '#a67b4d',
    accentColor: '#5b4228',
    emoji: '🥜',
    category: 'treat_drink',
  },
  {
    id: 'syrian_sweets',
    nameAr: 'بقلاوة أو كنافة أو هريسة',
    unitLabelAr: 'قطعتان صغيرتان بالقطر',
    defaultMeals: ['late_dinner'],
    calories: 310,
    protein: 5,
    carbs: 38,
    fat: 16,
    meshKind: 'pastry_sweet',
    primaryColor: '#d89b3c',
    accentColor: '#6d9a3e',
    emoji: '🍯',
    category: 'treat_drink',
    swapTargetId: 'fruits',
  },
  {
    id: 'warm_milk',
    nameAr: 'كوب حليب أو لبن دافئ',
    unitLabelAr: 'كوب (٢٤٠ مل)',
    defaultMeals: ['late_dinner'],
    calories: 130,
    protein: 8,
    carbs: 12,
    fat: 5,
    meshKind: 'yogurt_cup',
    primaryColor: '#faf8f2',
    accentColor: '#d8cfb8',
    emoji: '🥛',
    category: 'dairy_dip',
  },
];

export const SYRIAN_FOOD_MAP: Record<string, SyrianFoodItem> = Object.fromEntries(
  SYRIAN_FOODS.map((food) => [food.id, food])
);

export function getFoodById(id: string): SyrianFoodItem | undefined {
  return SYRIAN_FOOD_MAP[id];
}

export function formatPortionAr(portion: number): string {
  if (portion === 0.25) return '¼';
  if (portion === 0.5) return '½';
  if (portion === 0.75) return '¾';
  return String(portion);
}

export const DEFAULT_SYRIAN_MEALS: MealsState = {
  breakfast: [
    { foodId: 'arabic_bread', portion: 1 },
    { foodId: 'labneh_oil', portion: 1 },
    { foodId: 'eggs', portion: 1 },
    { foodId: 'fresh_veggies', portion: 1 },
    { foodId: 'tea_mate', portion: 1 },
  ],
  lunch: [
    { foodId: 'rice_vermicelli', portion: 1 },
    { foodId: 'syrian_stew', portion: 1 },
    { foodId: 'fattoush', portion: 1 },
    { foodId: 'ayran', portion: 1 },
  ],
  late_dinner: [
    { foodId: 'cheese_sandwich', portion: 1 },
    { foodId: 'fruits', portion: 0.5 },
    { foodId: 'tea_unsweetened', portion: 1 },
  ],
};

export const DEFAULT_PROFILE: CalorieProfileData = {
  gender: 'male',
  age: 28,
  height_cm: 175,
  weight_kg: 78,
  activity_level: 'light',
  weight_trend: 'maintaining',
  goal: 'lose',
  meals: {
    breakfast: DEFAULT_SYRIAN_MEALS.breakfast.map((entry) => ({ ...entry })),
    lunch: DEFAULT_SYRIAN_MEALS.lunch.map((entry) => ({ ...entry })),
    late_dinner: DEFAULT_SYRIAN_MEALS.late_dinner.map((entry) => ({ ...entry })),
  },
  baseline_meals: null,
};
