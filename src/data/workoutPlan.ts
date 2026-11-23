type MediaSection = "push" | "pull" | "legs" | "upper" | "lower" | "rest";

export type WorkoutSlug = "upper-a" | "lower-core" | "upper-b" | "arms-skills" | "rest";

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
  demoUrl?: string;
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
    "Before loaded work, warm up at roughly 50% and then 75–80% of your working weight. Use more assistance or an easier variation for bodyweight work.",
    "Keep every warm-up rep smooth and controlled.",
  ],
};

const lowerBodyWarmup: Warmup = {
  title: "Lower Body Warm-up",
  video: "/videos/workout/warmup/lateral-lunges.mp4",
  instructions: [
    "Start with 5 minutes of treadmill walking or cycling.",
    "Add lateral lunges, leg kicks, and hip mobility drills.",
    "Before loaded work, warm up at roughly 50% and then 75–80% of your working weight. Use more assistance or an easier variation for bodyweight work.",
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

const youtubeDemo = (id: string) => ({
  demoUrl: `https://www.youtube.com/watch?v=${id}`,
  image: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
});

const inclinePushUps = (range: string): Exercise => ({
  ...exercise("Incline Push-ups", "incline-push-ups", 2, range, "Chest"),
  ...youtubeDemo("JK0Zn6kNs04"),
  info: "Use a stable bench or fixed bar to scale the push-up.",
  instructions: [
    "Place your hands shoulder-width apart on a stable elevated surface and step back into a straight plank.",
    "Bend your elbows and lower your chest toward the surface, then press back up.",
  ],
  tips: ["Start with a higher surface and lower it as you gain control."],
  mistakes: ["Letting the hips sag or flaring the elbows straight out."],
});

const upperA = [
  exercise("Incline Dumbbell Press", "incline-chest-press", 3, "8–12", "Upper Chest", ["push", "incline-dumbbell-press"]),
  exercise("Lat Pulldown", "lat-pulldown", 3, "10–12", "Lats", ["pull", "lat-pulldown"]),
  inclinePushUps("6–10"),
  exercise("Seated Cable Row", "seated-cable-row", 2, "10–12", "Mid Back", ["pull", "wide-grip-seated-row"]),
  exercise("Lateral Raises", "lateral-raise", 2, "12–15", "Side Delts", ["push", "seated-dumbbell-lateral-raises"]),
  exercise("Triceps Pushdown", "triceps-pushdown", 2, "10–12", "Triceps", ["push", "single-arm-triceps-pushdown"]),
];
const lowerCore = [
  exercise("Leg Press", "leg-press", 3, "10–12", "Quads", ["lower", "leg-press"]),
  exercise("Romanian Deadlift", "romanian-deadlift", 3, "8–10", "Hamstrings"),
  exercise("Leg Curl", "leg-curl", 2, "10–12", "Hamstrings", ["legs", "lying-or-seated-leg-curls"]),
  exercise("Calf Raises", "calf-raises", 3, "12–15", "Calves", ["lower", "seated-calf-raises-machine"]),
  {
    ...exercise("Dead Bug", "dead-bug", 3, "10", "Core"),
    ...youtubeDemo("qhwJ63aibsY"),
    info: "Alternate sides for 10 total reps per set.",
    instructions: [
      "Lie on your back with arms up and hips and knees bent to about 90 degrees.",
      "Exhale as you reach one arm overhead and extend the opposite leg. Return to the start and switch sides.",
    ],
    tips: ["Shorten the reach if your lower back starts to lift."],
    mistakes: ["Arching the lower back or moving both limbs on the same side."],
  },
  exercise("Plank", "plank", 3, "20–30", "Core", undefined, "seconds"),
];
const upperB = [
  {
    ...exercise("Assisted Pull-ups", "assisted-pull-ups", 3, "5–8", "Lats"),
    ...youtubeDemo("wFj808u2HWU"),
    info: "Use machine assistance to build toward unassisted pull-ups.",
    instructions: [
      "Select enough assistance for controlled reps, grip the handles, and get onto the machine pad as directed.",
      "Pull your elbows down until your chin approaches bar height, then lower slowly to straight arms.",
    ],
    tips: ["Reduce the assistance gradually after reaching 8 clean reps on all three sets."],
    mistakes: ["Swinging or letting the pad drive the movement."],
  },
  exercise("Chest Press Machine", "chest-press", 3, "8–12", "Chest"),
  exercise("Chest Supported Row", "chest-supported-row", 3, "8–12", "Mid Back"),
  {
    ...exercise("Incline Chest Fly", "incline-chest-fly", 2, "12", "Upper Chest"),
    ...youtubeDemo("iPSsUsShqZs"),
    instructions: [
      "Lie on a low-incline bench with dumbbells over your chest and elbows slightly bent.",
      "Open your arms in an arc to a comfortable stretch, then bring the dumbbells back above your chest.",
    ],
  },
  {
    ...exercise("Face Pull", "face-pull", 2, "12–15", "Rear Delts"),
    instructions: [
      "Set a rope attachment at about eye level and step back until the cable is taut.",
      "Pull the rope toward your face, separating the ends beside your temples, then return slowly.",
    ],
  },
  exercise("Hammer Curl", "hammer-curl", 2, "10–12", "Biceps"),
];
const armsSkills = [
  inclinePushUps("8–12"),
  {
    ...exercise("Incline Pike Push-ups", "incline-pike-push-ups", 2, "5–8", "Shoulders"),
    ...youtubeDemo("Dh5r4KMEKgo"),
    info: "Keep your hands elevated and your hips high to emphasize the shoulders.",
    instructions: [
      "Place your hands on a stable bench and lift your hips into an inverted V, with your feet on the floor.",
      "Bend your elbows to lower the crown of your head toward the bench, then press back up.",
    ],
    tips: ["Use a higher surface or a shorter range to make the movement easier."],
    mistakes: ["Dropping the hips or leading with the chest."],
  },
  exercise("Biceps Curl", "biceps-curl", 3, "10–12", "Biceps", ["pull", "seated-dumbbell-curls"]),
  exercise("Overhead Triceps Extension", "overhead-triceps-extension", 3, "10–12", "Triceps"),
  exercise("Lateral Raises", "lateral-raise", 2, "12–15", "Side Delts", ["push", "seated-dumbbell-lateral-raises"]),
  {
    ...exercise("Hollow Body Hold", "hollow-body-hold", 3, "15–25", "Core", undefined, "seconds"),
    ...youtubeDemo("LlDNef_Ztsc"),
    info: "Hold a braced position while breathing steadily.",
    instructions: [
      "Lie on your back, gently press your lower back into the floor, and lift your shoulders.",
      "Extend your legs and reach overhead only as far as you can maintain floor contact with your lower back.",
    ],
    tips: ["Bend your knees or reach forward with your arms to make the hold easier."],
    mistakes: ["Letting the lower back arch or holding your breath."],
  },
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
  {
    ...trainingDay(1, "Saturday", "Upper A", "upper-a", upperA, true),
    description: "Upper chest and back, with shoulder and triceps work.",
  },
  trainingDay(2, "Sunday", "Lower + Core", "lower-core", lowerCore, false),
  restDay(3, "Monday", true),
  {
    ...trainingDay(4, "Tuesday", "Upper B", "upper-b", upperB, true),
    description: "Chest and back training with assisted pull-up progression.",
  },
  {
    ...trainingDay(5, "Wednesday", "Arms + Calisthenics Skills", "arms-skills", armsSkills, true),
    description: "Arm training with incline push-ups, pike push-ups, and hollow holds.",
    targetMuscles: ["Arms", "Shoulders", "Chest", "Core"],
  },
  restDay(6, "Thursday", true),
  restDay(7, "Friday"),
];
export const workoutInstructions = [
  "Warm up before working sets and keep every repetition controlled.",
  "Keep 1-2 reps in reserve and earn heavier loads with consistent form.",
  "Log weight in kilograms where applicable. Track planks and hollow body holds in seconds.",
  "Walking is optional: 10 minutes after training, and 15–20 minutes on Monday and Thursday.",
];
