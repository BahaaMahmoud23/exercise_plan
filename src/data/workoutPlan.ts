type MediaSection = "push" | "pull" | "legs" | "upper" | "lower" | "rest";

export type WorkoutSlug = "upper-a" | "lower-a" | "upper-b" | "lower-b" | "rest";

export type Warmup = {
  title: string;
  video: string;
  instructions: string[];
};

export type Exercise = {
  unit?: "reps" | "seconds";
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
  weekday: string;
  cardio?: string;
  title: string;
  slug: WorkoutSlug;
  description: string;
  targetMuscles: string[];
  warmup?: Warmup;
  exercises: Exercise[];
  isRest?: boolean;
};

const exerciseVideoPaths: Partial<Record<`${Exclude<MediaSection, "rest">}/${string}`, string>> = {
  "push/butterfly-machine": "/videos/workout/push/butterfly-machine.mp4",
  "push/flat-bench-press": "/videos/workout/push/flat-bench-press.mp4",
  "push/incline-dumbbell-press": "/videos/workout/push/Incline Dumbbell Press.mp4",
  "push/seated-dumbbell-lateral-raises": "/videos/workout/push/seated-dumbbell-lateral-raises.mp4",
  "push/single-arm-triceps-pushdown": "/videos/workout/push/single-arm-triceps-pushdown.mp4",
  "push/shoulder-press-machine": "/videos/workout/push/Shoulder Press Machine.mp4",
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

const mediaPath = (section: Exclude<MediaSection, "rest">, slug: string) => ({
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
  section: Exclude<MediaSection, "rest">,
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

const addedExerciseVideos: Record<string, string> = {
  "chest-press": "/videos/workout/" + encodeURIComponent("Chest Press.mp4"),
  "romanian-deadlift": "/videos/workout/" + encodeURIComponent("Romanian Deadlift.mp4"),
  "cable-crunch": "/videos/workout/" + encodeURIComponent("Cable Crunch.mp4"),
  "seated-leg-curl": "/videos/workout/" + encodeURIComponent("Seated Leg Curl.mp4"),
  "overhead-triceps-extension": "/videos/workout/" + encodeURIComponent("Overhead Triceps Extension.mp4"),
  "hammer-curl": "/videos/workout/" + encodeURIComponent("Hammer Curl.mp4"),
  "chest-supported-row": "/videos/workout/" + encodeURIComponent("Chest Supported Row.mp4"),
  "lat-pulldown-alternative-grip": "/videos/workout/" + encodeURIComponent("Lat Pulldown (Alternative Grip).mp4"),
  "plank": "/videos/workout/" + encodeURIComponent("Plank.mp4"),
};

// Stable exercise slugs are reused across sessions; session records snapshot their targets.
const exercise = (name: string, slug: string, sets: number, range: string, muscle: string,
  media?: [Exclude<MediaSection, "rest">, string], unit: "reps" | "seconds" = "reps"): Exercise => ({
  ...createExercise(media?.[0] ?? "upper", name, media?.[1] ?? slug, sets, Array(sets).fill(range), muscle),
  slug, unit,
  // Only use existing demos that match the exercise, never a different movement.
  image: media ? mediaPath(...media).image : "",
  video: addedExerciseVideos[slug] ?? (media ? mediaPath(...media).video : ""),
});

const upperA = [
  exercise("Chest Press", "chest-press", 3, "8–12", "Chest"),
  exercise("Lat Pulldown", "lat-pulldown", 3, "8–12", "Lats", ["pull", "lat-pulldown"]),
  exercise("Seated Cable Row", "seated-cable-row", 2, "10–12", "Mid Back", ["pull", "wide-grip-seated-row"]),
  exercise("Shoulder Press", "shoulder-press", 2, "10–12", "Shoulders", ["push", "shoulder-press-machine"]),
  exercise("Lateral Raise", "lateral-raise", 2, "12–15", "Side Delts", ["push", "seated-dumbbell-lateral-raises"]),
  exercise("Triceps Pushdown", "triceps-pushdown", 2, "10–15", "Triceps", ["push", "single-arm-triceps-pushdown"]),
  exercise("Biceps Curl", "biceps-curl", 2, "10–15", "Biceps", ["pull", "seated-dumbbell-curls"]),
];
const lowerA = [
  exercise("Leg Press", "leg-press", 3, "10–12", "Quads", ["lower", "leg-press"]),
  exercise("Romanian Deadlift", "romanian-deadlift", 2, "8–10", "Hamstrings"),
  exercise("Leg Curl", "leg-curl", 3, "10–12", "Hamstrings", ["legs", "lying-or-seated-leg-curls"]),
  exercise("Leg Extension", "leg-extension", 2, "12–15", "Quads", ["lower", "leg-extension"]),
  exercise("Calf Raises", "calf-raises", 3, "12–15", "Calves", ["lower", "seated-calf-raises-machine"]),
  exercise("Plank", "plank", 3, "20–40", "Core", undefined, "seconds"),
];
const upperB = [
  exercise("Incline Chest Press", "incline-chest-press", 3, "8–12", "Upper Chest", ["push", "incline-dumbbell-press"]),
  exercise("Lat Pulldown (Alternative Grip)", "lat-pulldown-alternative-grip", 3, "10–12", "Lats"),
  exercise("Chest Supported Row", "chest-supported-row", 2, "10–12", "Mid Back"),
  exercise("Pec Deck", "pec-deck", 2, "12–15", "Chest", ["push", "butterfly-machine"]),
  exercise("Reverse Pec Deck", "reverse-pec-deck", 2, "12–15", "Rear Delts", ["pull", "reverse-flyes-machine"]),
  exercise("Hammer Curl", "hammer-curl", 2, "10–12", "Biceps"),
  exercise("Overhead Triceps Extension", "overhead-triceps-extension", 2, "10–12", "Triceps"),
];
const lowerB = [
  exercise("Squat / Hack Squat", "squat-hack-squat", 3, "8–12", "Quads", ["legs", "hack-squats"]),
  exercise("Hip Thrust", "hip-thrust", 3, "10–12", "Glutes", ["lower", "smith-machine-hip-thrust"]),
  exercise("Seated Leg Curl", "seated-leg-curl", 3, "10–12", "Hamstrings"),
  exercise("Leg Extension", "leg-extension", 2, "12–15", "Quads", ["lower", "leg-extension"]),
  exercise("Calf Raises", "calf-raises", 3, "12–15", "Calves", ["lower", "seated-calf-raises-machine"]),
  exercise("Cable Crunch", "cable-crunch", 3, "12–15", "Core"),
];
const trainingDay = (day: number, weekday: string, title: string, slug: WorkoutSlug, exercises: Exercise[], upper: boolean): WorkoutDay => ({
  day, weekday, title, slug, exercises,
  description: upper ? "Balanced upper body training with chest, back, shoulders, and arms." : "Lower body training with quads, hamstrings, glutes, calves, and core.",
  targetMuscles: upper ? ["Chest", "Back", "Shoulders", "Arms"] : ["Quads", "Hamstrings", "Glutes", "Core"],
  warmup: upper ? upperBodyWarmup : lowerBodyWarmup,
  cardio: "Optional: 10 minutes of brisk walking after resistance training.",
});
const restDay = (day: number, weekday: string, walking = false): WorkoutDay => ({
  day, weekday, title: "Rest", slug: "rest", exercises: [], isRest: true,
  description: "Recovery day for sleep, hydration, and easy mobility.",
  targetMuscles: ["Recovery", "Mobility"],
  cardio: walking ? "Optional: 15–20 minutes of walking." : undefined,
});
export const workoutPlan: WorkoutDay[] = [
  trainingDay(1, "Saturday", "Upper A", "upper-a", upperA, true),
  trainingDay(2, "Sunday", "Lower A", "lower-a", lowerA, false),
  restDay(3, "Monday", true),
  trainingDay(4, "Tuesday", "Upper B", "upper-b", upperB, true),
  trainingDay(5, "Wednesday", "Lower B", "lower-b", lowerB, false),
  restDay(6, "Thursday", true),
  restDay(7, "Friday"),
];
export const workoutInstructions = [
  "Warm up before working sets and keep every repetition controlled.",
  "Keep 1-2 reps in reserve and earn heavier loads with consistent form.",
  "Log each working set in kilograms; track plank holds in seconds.",
  "Walking is optional: 10 minutes after training, and 15–20 minutes on Monday and Thursday.",
];
