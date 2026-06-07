export type WorkoutSlug = "push" | "pull" | "legs" | "upper" | "lower" | "rest";

export type Warmup = {
  title: string;
  video: string;
  instructions: string[];
};

export type Exercise = {
  name: string;
  slug: string;
  sets: number;
  reps: string[];
  info: string;
  targetMuscle: string;
  image: string;
  video: string;
  instructions: string[];
  tips: string[];
  mistakes: string[];
  restTime: string;
};

export type WorkoutDay = {
  day: number;
  title: string;
  slug: WorkoutSlug;
  description: string;
  targetMuscles: string[];
  warmup?: Warmup;
  exercises: Exercise[];
  isRest?: boolean;
};

const exerciseVideoPaths: Partial<Record<`${Exclude<WorkoutSlug, "rest">}/${string}`, string>> = {
  "push/butterfly-machine": "/videos/workout/push/butterfly-machine.mp4",
  "push/flat-bench-press": "/videos/workout/push/flat-bench-press.mp4",
  "push/seated-dumbbell-lateral-raises": "/videos/workout/push/seated-dumbbell-lateral-raises.mp4",
  "push/single-arm-triceps-pushdown": "/videos/workout/push/single-arm-triceps-pushdown.mp4",
  "pull/lat-pulldown": "/videos/workout/pull/Wide grip lat pulldown.mp4",
  "pull/wide-grip-seated-row": "/videos/workout/pull/wide grip seated row.mp4",
  "pull/single-arm-dumbbell-row": "/videos/workout/pull/single arm dumbbell row.mp4",
  "pull/reverse-flyes-machine": "/videos/workout/pull/reverse fly machine.mp4",
  "pull/seated-dumbbell-curls": "/videos/workout/pull/seated dumbbell curls.mp4",
  "pull/dumbbell-preacher-curl": "/videos/workout/pull/dumbbell preacher curls.mp4",
  "legs/hack-squats": "/videos/workout/legs/hack squat full range.mp4",
  "legs/lying-or-seated-leg-curls": "/videos/workout/legs/lying leg curls.mp4",
  "legs/leg-extensions": "/videos/workout/legs/leg extensions.mp4",
  "legs/smith-machine-hip-thrust": "/videos/workout/legs/Barbell hip thrust 2.mp4",
  "legs/hip-adduction-machine": "/videos/workout/legs/Hip adduction machine 2.mp4",
  "legs/seated-calf-raises-machine": "/videos/workout/legs/Seated calf raises ( Old vid ).mp4",
  "upper/butterfly-machine": "/videos/workout/upper/Butterfly machine - chest fly (2).mp4",
  "upper/lat-pulldown": "/videos/workout/upper/Wide grip lat pulldown.mp4",
  "upper/cable-lateral-raises": "/videos/workout/upper/cable lateral raises  2.mp4",
  "upper/wide-grip-seated-row": "/videos/workout/upper/wide grip seated row.mp4",
  "upper/single-arm-triceps-pushdown": "/videos/workout/upper/single arm triceps pushdown.mp4",
  "upper/seated-dumbbell-curls": "/videos/workout/upper/seated dumbbell curls.mp4",
  "lower/leg-press": "/videos/workout/lower/leg press ( New vid ).mp4",
  "lower/lying-or-seated-leg-curls": "/videos/workout/lower/lying leg curls.mp4",
  "lower/leg-extension": "/videos/workout/lower/leg extensions.mp4",
  "lower/smith-machine-hip-thrust": "/videos/workout/lower/Barbell hip thrust 2.mp4",
  "lower/hip-adduction-machine": "/videos/workout/lower/Hip adduction machine 2.mp4",
  "lower/seated-calf-raises-machine": "/videos/workout/lower/Seated calf raises ( Old vid ).mp4",
};

const mediaPath = (section: Exclude<WorkoutSlug, "rest">, slug: string) => ({
  image: `/images/workout/${section}/${slug}.jpg`,
  video: exerciseVideoPaths[`${section}/${slug}`] ?? `/videos/workout/${section}/${slug}.mp4`,
});

const upperBodyWarmup: Warmup = {
  title: "Upper Body Warm-up",
  video: "/videos/workout/warmup/rotator-cuff.mp4",
  instructions: [
    "Start with 5 minutes of easy cardio to raise body temperature.",
    "Use rotator cuff warm-up drills before pressing or pulling.",
    "Complete 2 warm-up sets from the first 2 exercises: first at 50%, second at 75-80% of your working weight.",
    "Keep every warm-up rep smooth and controlled.",
  ],
};

const lowerBodyWarmup: Warmup = {
  title: "Lower Body Warm-up",
  video: "/videos/workout/warmup/lateral-lunges.mp4",
  instructions: [
    "Start with 5 minutes of treadmill walking or cycling.",
    "Add lateral lunges, leg kicks, and hip mobility drills.",
    "Complete 2 warm-up sets from the first 2 exercises: first at 50%, second at 75-80% of your working weight.",
    "Move through a full pain-free range before loading heavy.",
  ],
};

const createExercise = (
  section: Exclude<WorkoutSlug, "rest">,
  name: string,
  slug: string,
  sets: number,
  reps: string[],
  targetMuscle: string,
  info = "Keep the movement controlled and stop 1-2 reps before form breaks.",
): Exercise => ({
  name,
  slug,
  sets,
  reps,
  info,
  targetMuscle,
  ...mediaPath(section, slug),
  restTime: "3-6 minutes between hard working sets",
  instructions: [
    `Set up for ${name} with a stable body position and controlled breathing.`,
    "Brace your core and keep the working joints aligned.",
    "Move through the strongest comfortable range of motion.",
    "Pause briefly in the contracted position when possible.",
    "Return under control and reset before the next rep.",
  ],
  tips: [
    "Start lighter if this is your first week or you are returning after a break.",
    "Keep 1-2 reps in reserve on most working sets.",
    "Make the target muscle do the work instead of chasing weight.",
  ],
  mistakes: [
    "Rushing the lowering phase.",
    "Using momentum to finish reps.",
    "Adding load before the movement feels stable.",
  ],
});

export const workoutPlan: WorkoutDay[] = [
  {
    day: 1,
    title: "Push",
    slug: "push",
    description: "Chest, shoulders, and triceps with controlled pressing volume.",
    targetMuscles: ["Chest", "Shoulders", "Triceps"],
    warmup: upperBodyWarmup,
    exercises: [
      createExercise(
        "push",
        "Butterfly Machine",
        "butterfly-machine",
        2,
        ["12-10", "12-10"],
        "Chest",
        "Do not go too heavy. Make sure your form is perfect.",
      ),
      createExercise("push", "Flat Bench Press", "flat-bench-press", 2, ["8-10", "8-10"], "Chest"),
      createExercise("push", "Incline Dumbbell Press", "incline-dumbbell-press", 2, ["8-10", "8-10"], "Upper Chest"),
      createExercise(
        "push",
        "Seated Dumbbell Lateral Raises",
        "seated-dumbbell-lateral-raises",
        4,
        ["12-10", "12-10", "12-10", "12-10"],
        "Side Delts",
      ),
      createExercise("push", "Single Arm Triceps Pushdown", "single-arm-triceps-pushdown", 2, ["12-10", "12-10"], "Triceps"),
      createExercise("push", "Shoulder Press Machine", "shoulder-press-machine", 1, ["6-8"], "Shoulders"),
    ],
  },
  {
    day: 2,
    title: "Pull",
    slug: "pull",
    description: "Back width, rowing strength, rear delts, and biceps.",
    targetMuscles: ["Back", "Rear Delts", "Biceps"],
    warmup: upperBodyWarmup,
    exercises: [
      createExercise("pull", "Lat Pulldown", "lat-pulldown", 2, ["8-10", "8-10"], "Lats"),
      createExercise("pull", "Wide Grip Seated Row", "wide-grip-seated-row", 2, ["12-10", "12-10"], "Mid Back"),
      createExercise("pull", "Single Arm Dumbbell Row", "single-arm-dumbbell-row", 2, ["12-10", "12-10"], "Lats"),
      createExercise("pull", "Reverse Flyes Machine", "reverse-flyes-machine", 2, ["8-10", "8-10"], "Rear Delts"),
      createExercise("pull", "Seated Dumbbell Curls", "seated-dumbbell-curls", 2, ["12-10", "12-10"], "Biceps"),
      createExercise("pull", "Dumbbell Preacher Curl", "dumbbell-preacher-curl", 1, ["12-10"], "Biceps"),
    ],
  },
  {
    day: 3,
    title: "Legs",
    slug: "legs",
    description: "Quad, hamstring, glute, adductor, and calf work.",
    targetMuscles: ["Quads", "Hamstrings", "Glutes", "Calves"],
    warmup: lowerBodyWarmup,
    exercises: [
      createExercise("legs", "Hack Squats", "hack-squats", 2, ["8-10", "8-10"], "Quads"),
      createExercise("legs", "Lying or Seated Leg Curls", "lying-or-seated-leg-curls", 3, ["12-10", "12-10", "12-10"], "Hamstrings"),
      createExercise("legs", "Leg Extensions", "leg-extensions", 2, ["12-10", "12-10"], "Quads"),
      createExercise("legs", "Smith Machine Hip Thrust", "smith-machine-hip-thrust", 2, ["12-10", "12-10"], "Glutes"),
      createExercise("legs", "Hip Adduction Machine", "hip-adduction-machine", 3, ["12-10", "12-10", "12-10"], "Adductors"),
      createExercise(
        "legs",
        "Seated Calf Raises Machine",
        "seated-calf-raises-machine",
        4,
        ["12-10", "12-10", "12-10", "12-10"],
        "Calves",
      ),
    ],
  },
  {
    day: 4,
    title: "Rest",
    slug: "rest",
    description: "Recovery day for sleep, steps, food quality, and easy mobility.",
    targetMuscles: ["Recovery", "Mobility"],
    exercises: [],
    isRest: true,
  },
  {
    day: 5,
    title: "Upper",
    slug: "upper",
    description: "Balanced upper body session with chest, back, delts, and arms.",
    targetMuscles: ["Chest", "Back", "Shoulders", "Arms"],
    warmup: upperBodyWarmup,
    exercises: [
      createExercise("upper", "Butterfly Machine", "butterfly-machine", 2, ["12-10", "12-10"], "Chest"),
      createExercise("upper", "Lat Pulldown", "lat-pulldown", 2, ["8-10", "8-10"], "Lats"),
      createExercise("upper", "Cable Lateral Raises", "cable-lateral-raises", 3, ["12-10", "12-10", "12-10"], "Side Delts"),
      createExercise("upper", "Wide Grip Seated Row", "wide-grip-seated-row", 2, ["8-10", "8-10"], "Mid Back"),
      createExercise(
        "upper",
        "Single Arm Triceps Pushdown",
        "single-arm-triceps-pushdown",
        3,
        ["12-10", "12-10", "12-10"],
        "Triceps",
      ),
      createExercise("upper", "Seated Dumbbell Curls", "seated-dumbbell-curls", 2, ["12-10", "12-10"], "Biceps"),
    ],
  },
  {
    day: 6,
    title: "Lower",
    slug: "lower",
    description: "Leg press-led lower day with posterior chain and calves.",
    targetMuscles: ["Quads", "Hamstrings", "Glutes", "Calves"],
    warmup: lowerBodyWarmup,
    exercises: [
      createExercise("lower", "Leg Press", "leg-press", 2, ["8-10", "8-10"], "Quads"),
      createExercise("lower", "Lying or Seated Leg Curls", "lying-or-seated-leg-curls", 3, ["12-10", "12-10", "12-10"], "Hamstrings"),
      createExercise("lower", "Leg Extension", "leg-extension", 2, ["12-10", "12-10"], "Quads"),
      createExercise("lower", "Smith Machine Hip Thrust", "smith-machine-hip-thrust", 2, ["15-10", "15-10"], "Glutes"),
      createExercise("lower", "Hip Adduction Machine", "hip-adduction-machine", 2, ["12-10", "12-10"], "Adductors"),
      createExercise("lower", "Seated Calf Raises Machine", "seated-calf-raises-machine", 3, ["12-10", "12-10", "12-10"], "Calves"),
    ],
  },
  {
    day: 7,
    title: "Rest",
    slug: "rest",
    description: "Full recovery day. Keep movement easy and prepare for the next week.",
    targetMuscles: ["Recovery", "Readiness"],
    exercises: [],
    isRest: true,
  },
];

export const workoutInstructions = [
  "Warm up well before every exercise with a 50% weight set before working sets.",
  "Get close to muscle failure while keeping 1-2 reps in reserve.",
  "Rest 3-6 minutes between every set for best performance.",
  "If this is your first time or you have not trained for a long time, use 2 warm-up sets: 50% then 75-80% of working weight.",
  "Use Figure 8 straps or old school lifting straps for back work so forearms do not reach failure before your back.",
  "Do not move your shoulders or swing your elbows during triceps or biceps movements.",
  "Do cardio after the workout for at least 20 minutes. Use 30-40 minutes when progress calls for it.",
];

export const cardioGuidance = {
  title: "Post-workout Cardio",
  duration: "20 minutes minimum, 30-40 minutes depending on progress",
  incline: 8,
  speed: 4,
  equipment: ["Treadmill", "Cardio bike"],
  video: "/videos/workout/cardio/treadmill-incline-walk.mp4",
};
