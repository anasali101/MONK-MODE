
import { Mood, Profession, Challenge, BlockedApp, ActivityConfig, QuizQuestion } from "./types";

export const PROFESSIONS: Profession[] = [
  'Software Engineer',
  'Designer',
  'Writer',
  'Marketer',
  'Student',
  'Executive',
  'Other'
];

export const MOODS: { label: string; description: string; value: Mood; emoji: string; activity: ActivityConfig }[] = [
  { 
    label: 'Brain Fog',
    description: 'Mental Haze & Sluggishness',
    value: 'Tired', 
    emoji: '🌫️',
    activity: {
      type: 'TRIVIA',
      title: 'Curiosity Spark',
      description: 'Ignite your neurons with rapid-fire facts.',
      durationSeconds: 0
    }
  },
  { 
    label: 'Anxious',
    description: 'Racing Thoughts & Nerves',
    value: 'Anxious', 
    emoji: '⚡',
    activity: {
      type: 'BREATHING',
      title: 'Nature Calm',
      description: 'Rain, wind, and birdsong to ground you.',
      durationSeconds: 60
    }
  },
  { 
    label: 'Procrastinating',
    description: 'Avoiding Important Work',
    value: 'Procrastinating', 
    emoji: '🐌',
    activity: {
      type: 'SHREDDER',
      title: 'Thought Shredder',
      description: 'Visualize your distractions and destroy them.',
      durationSeconds: 0
    }
  },
  { 
    label: 'Bored',
    description: 'Seeking Cheap Dopamine',
    value: 'Bored', 
    emoji: '🥱',
    activity: {
      type: 'REACTION',
      title: 'Synaptic Snap',
      description: 'Wait for the signal. React instantly.',
      durationSeconds: 0
    }
  },
  { 
    label: 'Overwhelmed',
    description: 'Paralysis by Analysis',
    value: 'Overwhelmed', 
    emoji: '🤯',
    activity: {
      type: 'BREATHING',
      title: 'Nature Calm',
      description: 'Wash away the noise with nature frequencies.',
      durationSeconds: 60
    }
  },
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: 'Monochrome Protocol',
    description: 'Turn your screen to Grayscale. Colors are for closers.',
    baseReward: 500,
    difficulty: 'Medium',
    isActive: false,
    isCompleted: false,
    options: [2, 6, 12, 24] // Hours
  },
  {
    id: 'c2',
    title: 'Deep Work Sprint',
    description: 'Absolute zero notifications. Pure output mode.',
    baseReward: 300,
    difficulty: 'Hard',
    isActive: false,
    isCompleted: false,
    options: [1, 2, 4] // Hours
  },
  {
    id: 'c3',
    title: 'Digital Fasting',
    description: 'A complete detox from all screens and inputs.',
    baseReward: 1000,
    difficulty: 'Hard',
    isActive: false,
    isCompleted: false,
    options: [5, 10, 15, 24] // Hours
  },
  {
    id: 'c4',
    title: 'The Social Purge',
    description: 'Delete your most addictive app for a set duration.',
    baseReward: 800,
    difficulty: 'Hard',
    isActive: false,
    isCompleted: false,
    options: [24, 48, 72]
  },
  {
    id: 'c5',
    title: 'Silence Solitude',
    description: 'No music, no podcasts. Just you and your thoughts.',
    baseReward: 400,
    difficulty: 'Medium',
    isActive: false,
    isCompleted: false,
    options: [1, 3, 5]
  }
];

export const INITIAL_APPS: BlockedApp[] = [
  { id: 'ig', name: 'Instagram', icon: '', brandColor: 'from-purple-500 via-pink-500 to-orange-500', usageMinutes: 45, limitMinutes: 50, isLocked: false },
  { id: 'tk', name: 'TikTok', icon: '', brandColor: 'from-black to-zinc-800 border-cyan-400', usageMinutes: 48, limitMinutes: 50, isLocked: false },
  { id: 'x', name: 'Twitter/X', icon: '', brandColor: 'from-blue-400 to-blue-600', usageMinutes: 12, limitMinutes: 50, isLocked: false },
  { id: 'yt', name: 'YouTube', icon: '', brandColor: 'from-red-600 to-red-700', usageMinutes: 30, limitMinutes: 60, isLocked: false },
];

export const TRIVIA_QUESTIONS: QuizQuestion[] = [
  {
    question: "Which planet has a day longer than its year?",
    options: ["Mars", "Venus", "Mercury", "Jupiter"],
    correctIndex: 1,
    explanation: "Venus rotates so slowly that it takes 243 Earth days to rotate once, but only 225 Earth days to orbit the Sun."
  },
  {
    question: "What is the only letter that doesn't appear in any US state name?",
    options: ["Q", "X", "Z", "J"],
    correctIndex: 0,
    explanation: "You'll find X in Texas, Z in Arizona, J in New Jersey, but Q is nowhere to be found."
  },
  {
    question: "Who was the first person to walk on the Moon?",
    options: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "Michael Collins"],
    correctIndex: 2,
    explanation: "Neil Armstrong made history on July 20, 1969, with the Apollo 11 mission."
  },
  {
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Apparatus"],
    correctIndex: 2,
    explanation: "Mitochondria generate most of the chemical energy needed to power the cell's biochemical reactions."
  },
  {
    question: "Which element has the chemical symbol 'Fe'?",
    options: ["Lead", "Silver", "Iron", "Gold"],
    correctIndex: 2,
    explanation: "It comes from the Latin word 'Ferrum'."
  },
  {
    question: "Who wrote '1984'?",
    options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "J.R.R. Tolkien"],
    correctIndex: 1,
    explanation: "Orwell's dystopian novel introduced concepts like Big Brother and Thought Police."
  },
  {
    question: "What is the speed of light approx?",
    options: ["300,000 km/s", "150,000 km/s", "1,000,000 km/s", "Sound speed x 100"],
    correctIndex: 0,
    explanation: "Light travels at approximately 299,792 kilometers per second in a vacuum."
  },
  {
    question: "Which celebrity is known as the 'King of Pop'?",
    options: ["Elvis Presley", "Prince", "Michael Jackson", "Madonna"],
    correctIndex: 2,
    explanation: "Michael Jackson is one of the most significant cultural figures of the 20th century."
  },
  {
    question: "How many hearts does an octopus have?",
    options: ["One", "Two", "Three", "Four"],
    correctIndex: 2,
    explanation: "Two pump blood to the gills, while a third pumps it to the rest of the body."
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctIndex: 3,
    explanation: "The Pacific Ocean covers more than 30% of the Earth's surface."
  },
  {
    question: "Which country invented tea?",
    options: ["United Kingdom", "India", "China", "Japan"],
    correctIndex: 2,
    explanation: "Tea was discovered in China nearly 5,000 years ago, allegedly by Emperor Shen Nung."
  },
  {
    question: "What does 'HTTP' stand for?",
    options: ["HyperText Transfer Protocol", "HighText Tech Protocol", "Hybrid Text Transfer Program", "HyperText Tech Program"],
    correctIndex: 0,
    explanation: "It is the foundation of data communication for the World Wide Web."
  },
  {
    question: "How many bones are in the human body?",
    options: ["206", "195", "215", "250"],
    correctIndex: 0,
    explanation: "Babies are born with ~270 bones, but some fuse together as they grow, leaving 206."
  },
  {
    question: "Which painter cut off his own ear?",
    options: ["Picasso", "Monet", "Van Gogh", "Da Vinci"],
    correctIndex: 2,
    explanation: "Vincent van Gogh severed part of his left ear in 1888 after an argument with Paul Gauguin."
  },
  {
    question: "What is the hardest natural substance?",
    options: ["Iron", "Diamond", "Graphene", "Quartz"],
    correctIndex: 1,
    explanation: "Diamonds are made of carbon atoms arranged in a crystal structure that makes them incredibly hard."
  },
  {
    question: "Which animal sleeps the most?",
    options: ["Sloth", "Koala", "Cat", "Python"],
    correctIndex: 1,
    explanation: "Koalas sleep for up to 22 hours a day due to their low-energy diet of eucalyptus leaves."
  },
  {
    question: "Who invented the telephone?",
    options: ["Nikola Tesla", "Thomas Edison", "Alexander Graham Bell", "Guglielmo Marconi"],
    correctIndex: 2,
    explanation: "Bell was awarded the first U.S. patent for the telephone in 1876."
  },
  {
    question: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correctIndex: 2,
    explanation: "Canberra was chosen as the capital in 1908 as a compromise between rivals Sydney and Melbourne."
  },
  {
    question: "Which gas do plants absorb?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correctIndex: 2,
    explanation: "Plants absorb Carbon Dioxide for photosynthesis and release Oxygen."
  },
  {
    question: "How long is a marathon?",
    options: ["20 miles", "26.2 miles", "30 miles", "24 miles"],
    correctIndex: 1,
    explanation: "The distance was standardized to 26 miles 385 yards (42.195 km) in 1921."
  }
];
