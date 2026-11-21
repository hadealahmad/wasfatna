import {
  ActivityLevel,
  CalorieProfileData,
  formatPortionAr,
  getFoodById,
  MealEntry,
  MealType,
} from '@/data/syrianFoods';

export type DeficitStatus = 'deficit' | 'maintenance' | 'surplus';
export type CrossCheckStatus = 'aligned' | 'hidden_calories' | 'higher_burn';

export interface MacroTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealBreakdownItem extends MacroTotals {
  count: number;
}

export interface CalorieAnalysis {
  bmr: number;
  theoreticalTdee: number;
  calibratedTdee: number;
  targetCalories: number;
  currentDailyCalories: number;
  baselineDailyCalories: number | null;
  dailyDelta: number;
  vsTargetDelta: number;
  vsBaselineDelta: number | null;
  status: DeficitStatus;
  estimatedWeeklyKgChange: number;
  mealBreakdown: Record<MealType, MealBreakdownItem>;
  macros: { protein: number; carbs: number; fat: number };
  crossCheckInsightAr: string;
  crossCheckStatus: CrossCheckStatus;
}

export interface CoachSuggestion {
  id: string;
  type: 'partition' | 'remove' | 'swap' | 'add';
  meal: MealType;
  foodId: string;
  newPortion?: number;
  swapToFoodId?: string;
  calorieImpact: number;
  titleAr: string;
  reasonAr: string;
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'late_dinner'];

const PARTITIONABLE_FOOD_IDS = new Set([
  'arabic_bread',
  'rice_vermicelli',
  'manousheh',
  'fatayer',
  'kabsa_ouzi',
  'fries',
  'noodles',
  'fatteh_hummus',
  'shawarma',
  'cheese_sandwich',
]);

const MEAL_LABEL_AR: Record<MealType, string> = {
  breakfast: 'الفطور',
  lunch: 'الغداء',
  late_dinner: 'العشاء المتأخر',
};

export function calculateBmr(
  profile: Pick<CalorieProfileData, 'gender' | 'age' | 'height_cm' | 'weight_kg'>
): number {
  const genderOffset = profile.gender === 'male' ? 5 : -161;
  const raw = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age + genderOffset;
  return Math.round(raw);
}

export function calculateTheoreticalTdee(
  profile: Pick<CalorieProfileData, 'gender' | 'age' | 'height_cm' | 'weight_kg' | 'activity_level'>
): number {
  const bmr = calculateBmr(profile);
  const multiplier = ACTIVITY_MULTIPLIERS[profile.activity_level] ?? 1.375;
  return Math.round(bmr * multiplier);
}

export function calculateMealTotals(entries: MealEntry[]): MacroTotals {
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;

  for (const entry of entries) {
    const food = getFoodById(entry.foodId);
    if (!food || entry.portion <= 0) continue;

    calories += food.calories * entry.portion;
    protein += food.protein * entry.portion;
    carbs += food.carbs * entry.portion;
    fat += food.fat * entry.portion;
  }

  return {
    calories: Math.round(calories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
  };
}

function sumAllMealsCalories(meals: CalorieProfileData['meals']): number {
  return MEAL_ORDER.reduce((sum, meal) => sum + calculateMealTotals(meals[meal] ?? []).calories, 0);
}

export function analyzeCalorieProfile(profile: CalorieProfileData): CalorieAnalysis {
  const bmr = calculateBmr(profile);
  const theoreticalTdee = calculateTheoreticalTdee(profile);

  const mealBreakdown: Record<MealType, MealBreakdownItem> = {
    breakfast: { ...calculateMealTotals(profile.meals.breakfast ?? []), count: profile.meals.breakfast?.length ?? 0 },
    lunch: { ...calculateMealTotals(profile.meals.lunch ?? []), count: profile.meals.lunch?.length ?? 0 },
    late_dinner: { ...calculateMealTotals(profile.meals.late_dinner ?? []), count: profile.meals.late_dinner?.length ?? 0 },
  };

  const currentDailyCalories =
    mealBreakdown.breakfast.calories + mealBreakdown.lunch.calories + mealBreakdown.late_dinner.calories;

  const macros = {
    protein: mealBreakdown.breakfast.protein + mealBreakdown.lunch.protein + mealBreakdown.late_dinner.protein,
    carbs: mealBreakdown.breakfast.carbs + mealBreakdown.lunch.carbs + mealBreakdown.late_dinner.carbs,
    fat: mealBreakdown.breakfast.fat + mealBreakdown.lunch.fat + mealBreakdown.late_dinner.fat,
  };

  const baselineDailyCalories = profile.baseline_meals ? sumAllMealsCalories(profile.baseline_meals) : null;
  const referenceIntake = baselineDailyCalories ?? currentDailyCalories;

  let calibratedTdee = theoreticalTdee;
  let crossCheckStatus: CrossCheckStatus = 'aligned';
  let crossCheckInsightAr =
    'سعرات أكلك اليومية متناسقة تماماً مع حرق جسمك التقديري ومؤشر وزنك الحالي.';

  const minCalibrated = Math.round(theoreticalTdee * 0.8);
  const maxCalibrated = Math.round(theoreticalTdee * 1.2);

  if (profile.weight_trend === 'maintaining') {
    if (referenceIntake <= 800) {
      crossCheckInsightAr =
        'أضف بقية وجباتك المعتادة على السفرة لنتمكن من مطابقة حرق جسمك بدقة أعلى.';
    } else {
      const gap = referenceIntake - theoreticalTdee;

      if (Math.abs(gap) > 180) {
        const blended = Math.round(theoreticalTdee + gap * 0.35);
        calibratedTdee = Math.min(maxCalibrated, Math.max(minCalibrated, blended));
      }

      if (referenceIntake > theoreticalTdee + 250) {
        crossCheckStatus = 'higher_burn';
        crossCheckInsightAr =
          'وزنك ثابت رغم أن سعراتك أعلى من التقدير النظري، وهذا يدل أن نشاطك وحركتك اليومية تحرق أكثر مما توقعنا.';
      } else if (referenceIntake < theoreticalTdee - 250) {
        crossCheckStatus = 'hidden_calories';
        crossCheckInsightAr =
          'ثبات وزنك مع سعرات أقل من الحرق النظري يشير غالباً لسعرات مخفية غير محسوبة (مثل زيت الزيتون، الطحينة، أو لقيمات الخبز).';
      } else {
        crossCheckStatus = 'aligned';
        crossCheckInsightAr =
          'سفرتك اليومية تطابق حرق جسمك النظري بدقة، ولهذا وزنك مستقر حالياً.';
      }
    }
  } else if (profile.weight_trend === 'gaining') {
    if (referenceIntake <= theoreticalTdee + 100) {
      crossCheckStatus = 'hidden_calories';
      calibratedTdee = Math.round(theoreticalTdee * 0.9);
      crossCheckInsightAr =
        'زيادة الوزن رغم أن المسجل قريب من الحرق النظري تعني وجود سعرات خفية (إضافات الزيت والسمنة، الخبز، أو تسالي السهرة)، لذا عدّلنا تقدير الحرق قليلاً.';
    } else {
      crossCheckStatus = 'aligned';
      crossCheckInsightAr =
        'الفائض المسجل في وجباتك يفسّر زيادة الوزن الحالية بوضوح، ويمكن ضبطه بتعديلات بسيطة على السفرة.';
    }
  } else if (profile.weight_trend === 'losing') {
    if (referenceIntake >= theoreticalTdee - 100) {
      crossCheckStatus = 'higher_burn';
      calibratedTdee = Math.round(theoreticalTdee * 1.08);
      crossCheckInsightAr =
        'نزول وزنك رغم أن أكلك يساوي أو يفوق الحرق النظري يشير لحرق يومي أعلى من المتوسط، فرفعنا تقدير حرقك الحقيقي.';
    } else {
      crossCheckStatus = 'aligned';
      crossCheckInsightAr =
        'العجز الحالي في سعراتك متوافق مع نزول وزنك بشكل صحي ومتوازن.';
    }
  }

  const calorieFloor = profile.gender === 'male' ? 1500 : 1200;
  let targetCalories = calibratedTdee;

  if (profile.goal === 'lose') {
    targetCalories = Math.max(calorieFloor, calibratedTdee - 450);
  } else if (profile.goal === 'gain') {
    targetCalories = calibratedTdee + 350;
  }

  const dailyDelta = currentDailyCalories - calibratedTdee;
  const vsTargetDelta = currentDailyCalories - targetCalories;
  const vsBaselineDelta = baselineDailyCalories !== null ? currentDailyCalories - baselineDailyCalories : null;

  const status: DeficitStatus =
    dailyDelta <= -150 ? 'deficit' : dailyDelta >= 150 ? 'surplus' : 'maintenance';

  const estimatedWeeklyKgChange = Number(((dailyDelta * 7) / 7700).toFixed(2));

  return {
    bmr,
    theoreticalTdee,
    calibratedTdee,
    targetCalories,
    currentDailyCalories,
    baselineDailyCalories,
    dailyDelta,
    vsTargetDelta,
    vsBaselineDelta,
    status,
    estimatedWeeklyKgChange,
    mealBreakdown,
    macros,
    crossCheckInsightAr,
    crossCheckStatus,
  };
}

export function generateCoachSuggestions(
  profile: CalorieProfileData,
  analysis: CalorieAnalysis
): CoachSuggestion[] {
  const suggestions: CoachSuggestion[] = [];
  const seenKeys = new Set<string>();

  const pushUnique = (suggestion: CoachSuggestion) => {
    const key = `${suggestion.type}:${suggestion.meal}:${suggestion.foodId}`;
    if (seenKeys.has(key)) return;
    seenKeys.add(key);
    suggestions.push(suggestion);
  };

  const vsTarget = analysis.vsTargetDelta;

  if (vsTarget > 100) {
    // 1. Smart swaps for items that have a lighter Syrian alternative
    for (const meal of MEAL_ORDER) {
      for (const entry of profile.meals[meal] ?? []) {
        const food = getFoodById(entry.foodId);
        if (!food?.swapTargetId) continue;
        const swapTarget = getFoodById(food.swapTargetId);
        if (!swapTarget) continue;

        const impact = Math.round((swapTarget.calories - food.calories) * entry.portion);
        if (impact >= -25) continue;

        pushUnique({
          id: `swap-${meal}-${food.id}-${swapTarget.id}`,
          type: 'swap',
          meal,
          foodId: food.id,
          swapToFoodId: swapTarget.id,
          calorieImpact: impact,
          titleAr: `بدّل ${food.nameAr} بـ ${swapTarget.nameAr} في ${MEAL_LABEL_AR[meal]}`,
          reasonAr: `توفير ${Math.abs(impact)} سعرة مع الحفاظ على متعة السفرة الشامية.`,
        });
      }
    }

    // 2. Partition heavy carb/dense dishes
    for (const meal of MEAL_ORDER) {
      for (const entry of profile.meals[meal] ?? []) {
        const food = getFoodById(entry.foodId);
        if (!food || entry.portion < 1 || !PARTITIONABLE_FOOD_IDS.has(food.id)) continue;

        const newPortion = entry.portion >= 1.5 ? 1 : 0.5;
        const impact = Math.round(food.calories * (newPortion - entry.portion));

        pushUnique({
          id: `partition-${meal}-${food.id}`,
          type: 'partition',
          meal,
          foodId: food.id,
          newPortion,
          calorieImpact: impact,
          titleAr: `خفّف حصة ${food.nameAr} إلى ${formatPortionAr(newPortion)} في ${MEAL_LABEL_AR[meal]}`,
          reasonAr: `تخفيف الكمية دون حرمان يوفر ${Math.abs(impact)} سعرة يومياً.`,
        });
      }
    }

    // 3. Remove heavy late-dinner extras when surplus is large
    if (vsTarget > 350) {
      const heavyRemovables = new Set(['fries', 'noodles', 'syrian_sweets', 'soda_juice', 'fatayer']);
      for (const meal of ['late_dinner', 'lunch', 'breakfast'] as MealType[]) {
        for (const entry of profile.meals[meal] ?? []) {
          const food = getFoodById(entry.foodId);
          if (!food || !heavyRemovables.has(food.id)) continue;

          const impact = -Math.round(food.calories * entry.portion);
          pushUnique({
            id: `remove-${meal}-${food.id}`,
            type: 'remove',
            meal,
            foodId: food.id,
            calorieImpact: impact,
            titleAr: `احذف ${food.nameAr} من ${MEAL_LABEL_AR[meal]}`,
            reasonAr: `إلغاء هذا الصنف الإضافي يخفض ${Math.abs(impact)} سعرة مباشرة نحو هدفك.`,
          });
        }
      }
    }

    suggestions.sort((a, b) => a.calorieImpact - b.calorieImpact);
  } else if (vsTarget < -300 || (profile.goal === 'gain' && vsTarget < -100)) {
    // Under-eating or bulking: recommend nutritious additions
    const addCandidates: Array<{ meal: MealType; foodId: string; portion: number; reasonAr: string }> = [
      {
        meal: 'breakfast',
        foodId: 'eggs',
        portion: 1,
        reasonAr: 'يرفع البروتين الصباحي ويشبعك لفترة أطول.',
      },
      {
        meal: 'lunch',
        foodId: 'grills',
        portion: 1,
        reasonAr: 'بروتين عالٍ ممتاز لبناء العضل ودعم سعراتك.',
      },
      {
        meal: 'breakfast',
        foodId: 'foul_mudammas',
        portion: 1,
        reasonAr: 'يضيف ألياف وبروتين نباتي مع سعرات متوازنة.',
      },
      {
        meal: 'late_dinner',
        foodId: 'nuts_seeds',
        portion: 1,
        reasonAr: 'دهون صحية مركّزة تساعدك للوصول إلى هدفك بسهولة.',
      },
      {
        meal: 'late_dinner',
        foodId: 'warm_milk',
        portion: 1,
        reasonAr: 'وجبة خفيفة مسائية لطيفة بالبروتين والكالسيوم.',
      },
      {
        meal: 'late_dinner',
        foodId: 'fruits',
        portion: 1,
        reasonAr: 'يعوّض الفيتامينات والطاقة الخفيفة قبل النوم.',
      },
    ];

    for (const candidate of addCandidates) {
      const alreadyExists = (profile.meals[candidate.meal] ?? []).some((e) => e.foodId === candidate.foodId);
      if (alreadyExists) continue;
      const food = getFoodById(candidate.foodId);
      if (!food) continue;

      const impact = Math.round(food.calories * candidate.portion);
      pushUnique({
        id: `add-${candidate.meal}-${food.id}`,
        type: 'add',
        meal: candidate.meal,
        foodId: food.id,
        newPortion: candidate.portion,
        calorieImpact: impact,
        titleAr: `أضف ${food.nameAr} إلى ${MEAL_LABEL_AR[candidate.meal]}`,
        reasonAr: `${candidate.reasonAr} (+${impact} سعرة)`,
      });
    }
  } else {
    // Near target: suggest smart quality/health optimizations
    for (const meal of MEAL_ORDER) {
      for (const entry of profile.meals[meal] ?? []) {
        const food = getFoodById(entry.foodId);
        if (!food?.swapTargetId) continue;
        const swapTarget = getFoodById(food.swapTargetId);
        if (!swapTarget) continue;

        const impact = Math.round((swapTarget.calories - food.calories) * entry.portion);
        pushUnique({
          id: `swap-${meal}-${food.id}-${swapTarget.id}`,
          type: 'swap',
          meal,
          foodId: food.id,
          swapToFoodId: swapTarget.id,
          calorieImpact: impact,
          titleAr: `استبدل ${food.nameAr} بـ ${swapTarget.nameAr} في ${MEAL_LABEL_AR[meal]}`,
          reasonAr: `خيار أخف وأنقى غذائياً (${impact >= 0 ? `+${impact}` : impact} سعرة).`,
        });
      }
    }

    const qualityAdds: Array<{ meal: MealType; foodId: string; reasonAr: string }> = [
      {
        meal: 'lunch',
        foodId: 'fattoush',
        reasonAr: 'يضيف أليافاً وفيتامينات ممتازة مع وجبة الغداء.',
      },
      {
        meal: 'breakfast',
        foodId: 'fresh_veggies',
        reasonAr: 'يرفع الشبع والفيتامينات بسعرات شبه معدومة.',
      },
      {
        meal: 'late_dinner',
        foodId: 'yogurt_cucumber',
        reasonAr: 'خيار مسائي منعش وخفيف على الهضم.',
      },
    ];

    for (const candidate of qualityAdds) {
      const alreadyExists = (profile.meals[candidate.meal] ?? []).some((e) => e.foodId === candidate.foodId);
      if (alreadyExists) continue;
      const food = getFoodById(candidate.foodId);
      if (!food) continue;

      pushUnique({
        id: `add-${candidate.meal}-${food.id}`,
        type: 'add',
        meal: candidate.meal,
        foodId: food.id,
        newPortion: 1,
        calorieImpact: food.calories,
        titleAr: `أضف ${food.nameAr} إلى ${MEAL_LABEL_AR[candidate.meal]}`,
        reasonAr: `${candidate.reasonAr} (+${food.calories} سعرة)`,
      });
    }
  }

  return suggestions.slice(0, 6);
}
