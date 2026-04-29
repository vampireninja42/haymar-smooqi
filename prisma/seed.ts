import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Topics
// ---------------------------------------------------------------------------
async function seedTopics() {
  console.log('Seeding topics...');

  const topics = [
    {
      sortOrder: 1,
      slug: 'communication-skills',
      name: 'Communication Skills',
      icon: '\u{1F4AC}',
      colorHex: '#F3F0FF',
      colorName: 'purple',
      description: 'Master the art of clear, confident, and persuasive communication in every situation.',
    },
    {
      sortOrder: 2,
      slug: 'psychology-mindset',
      name: 'Psychology & Mindset',
      icon: '\u{1F9E0}',
      colorHex: '#FFF1F3',
      colorName: 'rose',
      description: 'Understand how the mind works and develop a growth-oriented mindset for lasting change.',
    },
    {
      sortOrder: 3,
      slug: 'personal-finance',
      name: 'Personal Finance',
      icon: '\u{1F4B0}',
      colorHex: '#F0FDF4',
      colorName: 'mint',
      description: 'Build financial literacy and learn to manage, save, and grow your money wisely.',
    },
    {
      sortOrder: 4,
      slug: 'philosophy',
      name: 'Philosophy',
      icon: '\u{1F3DB}\uFE0F',
      colorHex: '#EFF6FF',
      colorName: 'blue',
      description: 'Explore the big questions of existence, ethics, and meaning through the lens of great thinkers.',
    },
    {
      sortOrder: 5,
      slug: 'art-culture',
      name: 'Art & Culture',
      icon: '\u{1F3A8}',
      colorHex: '#FFF7ED',
      colorName: 'peach',
      description: 'Discover the world of visual arts, cultural movements, and creative expression.',
    },
    {
      sortOrder: 6,
      slug: 'movie-knowledge',
      name: 'Movie Knowledge',
      icon: '\u{1F3AC}',
      colorHex: '#FEF2F2',
      colorName: 'red',
      description: 'Deepen your understanding of cinema history, film techniques, and storytelling on screen.',
    },
    {
      sortOrder: 7,
      slug: 'biology',
      name: 'Biology',
      icon: '\u{1F9EC}',
      colorHex: '#F0FDFA',
      colorName: 'teal',
      description: 'Learn about the science of life, from cells and DNA to ecosystems and evolution.',
    },
    {
      sortOrder: 8,
      slug: 'physics',
      name: 'Physics',
      icon: '\u269B\uFE0F',
      colorHex: '#EEF2FF',
      colorName: 'indigo',
      description: 'Understand the fundamental laws that govern the universe, from motion to quantum mechanics.',
    },
    {
      sortOrder: 9,
      slug: 'literature',
      name: 'Literature',
      icon: '\u{1F4DA}',
      colorHex: '#FFFBEB',
      colorName: 'amber',
      description: 'Explore classic and modern literary works, narrative techniques, and the power of language.',
    },
    {
      sortOrder: 10,
      slug: 'math-logic',
      name: 'Math & Logic',
      icon: '\u{1F522}',
      colorHex: '#ECFEFF',
      colorName: 'cyan',
      description: 'Sharpen your analytical thinking with practical math skills and logical reasoning.',
    },
    {
      sortOrder: 11,
      slug: 'dog-training',
      name: 'Dog Training',
      icon: '\u{1F415}',
      colorHex: '#FFF7ED',
      colorName: 'orange',
      description: 'Learn effective, science-based methods to train and build a strong bond with your dog.',
    },
    {
      sortOrder: 12,
      slug: 'style',
      name: 'Style',
      icon: '\u{1F457}',
      colorHex: '#FDF2F8',
      colorName: 'pink',
      description: 'Develop your personal style and learn to dress with confidence for any occasion.',
    },
    {
      sortOrder: 13,
      slug: 'voice',
      name: 'Voice',
      icon: '\u{1F399}\uFE0F',
      colorHex: '#F5F3FF',
      colorName: 'violet',
      description: 'Train your voice for clarity, resonance, and impact in speaking and singing.',
    },
    {
      sortOrder: 14,
      slug: 'intelligence-training',
      name: 'Intelligence Training',
      icon: '\u26A1',
      colorHex: '#FEFCE8',
      colorName: 'yellow',
      description: 'Boost cognitive abilities through targeted exercises in memory, focus, and problem-solving.',
    },
    {
      sortOrder: 15,
      slug: 'confident-parenting',
      name: 'Confident Parenting',
      icon: '\u{1F476}',
      colorHex: '#F0FDF4',
      colorName: 'green',
      description: 'Gain practical parenting skills to raise confident, resilient, and well-adjusted children.',
    },
  ];

  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: {
        name: topic.name,
        description: topic.description,
        icon: topic.icon,
        colorHex: topic.colorHex,
        colorName: topic.colorName,
        sortOrder: topic.sortOrder,
      },
      create: topic,
    });
  }

  console.log(`  Seeded ${topics.length} topics.`);
}

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------
async function seedCourses() {
  console.log('Seeding courses...');

  interface CourseInput {
    topicSlug: string;
    slug: string;
    title: string;
    description: string;
    level: string;
    isFree: boolean;
    sortOrder: number;
  }

  const courses: CourseInput[] = [
    // Communication Skills (7)
    { topicSlug: 'communication-skills', slug: 'talk-with-charisma', title: 'Talk With Charisma', description: 'Learn the three pillars of charisma and how to captivate any room with presence, power, and warmth.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'communication-skills', slug: 'speak-like-a-leader', title: 'Speak Like a Leader', description: 'Develop the vocal authority, framing techniques, and confident delivery that define great leaders.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'communication-skills', slug: 'handle-any-situation', title: 'Handle Any Situation', description: 'Master the art of navigating difficult conversations, pushback, and high-pressure communication moments.', level: 'advanced', isFree: false, sortOrder: 3 },
    { topicSlug: 'communication-skills', slug: 'conflict-resolution', title: 'Conflict Resolution', description: 'Turn disagreements into productive dialogue using proven de-escalation and mediation techniques.', level: 'intermediate', isFree: false, sortOrder: 4 },
    { topicSlug: 'communication-skills', slug: 'public-speaking-mastery', title: 'Public Speaking Mastery', description: 'Overcome stage fright and deliver presentations that inform, inspire, and move audiences to action.', level: 'intermediate', isFree: false, sortOrder: 5 },
    { topicSlug: 'communication-skills', slug: 'written-communication', title: 'Written Communication', description: 'Write emails, reports, and messages that are clear, concise, and impossible to misunderstand.', level: 'advanced', isFree: false, sortOrder: 6 },
    { topicSlug: 'communication-skills', slug: 'cross-cultural-communication', title: 'Cross-Cultural Communication', description: 'Navigate cultural differences in communication style, etiquette, and expectations with confidence.', level: 'advanced', isFree: false, sortOrder: 7 },

    // Psychology & Mindset (3)
    { topicSlug: 'psychology-mindset', slug: 'understanding-your-mind', title: 'Understanding Your Mind', description: 'Explore the basics of how your brain processes information, forms habits, and shapes your reality.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'psychology-mindset', slug: 'emotional-intelligence', title: 'Emotional Intelligence', description: 'Develop the ability to recognize, understand, and manage your emotions and those of others.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'psychology-mindset', slug: 'habit-and-behavior-change', title: 'Habit & Behavior Change', description: 'Use science-backed strategies to break bad habits, build good ones, and create lasting behavioral change.', level: 'advanced', isFree: false, sortOrder: 3 },

    // Personal Finance (4)
    { topicSlug: 'personal-finance', slug: 'money-basics', title: 'Money Basics', description: 'Build a solid financial foundation with budgeting, saving, and understanding how money works.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'personal-finance', slug: 'smart-investing', title: 'Smart Investing', description: 'Learn the principles of investing, from index funds to diversification, and grow your wealth over time.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'personal-finance', slug: 'credit-and-debt-mastery', title: 'Credit & Debt Mastery', description: 'Understand credit scores, manage debt strategically, and use credit as a tool rather than a trap.', level: 'intermediate', isFree: false, sortOrder: 3 },
    { topicSlug: 'personal-finance', slug: 'financial-freedom', title: 'Financial Freedom', description: 'Design a long-term financial plan that builds passive income and moves you toward true financial independence.', level: 'advanced', isFree: false, sortOrder: 4 },

    // Philosophy (3)
    { topicSlug: 'philosophy', slug: 'great-thinkers', title: 'Great Thinkers', description: 'Journey through the ideas of history\'s most influential philosophers, from Socrates to modern thinkers.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'philosophy', slug: 'ethics-and-morality', title: 'Ethics & Morality', description: 'Examine the frameworks that guide right and wrong, from utilitarianism to virtue ethics and beyond.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'philosophy', slug: 'eastern-philosophy', title: 'Eastern Philosophy', description: 'Discover the wisdom of Eastern traditions including Buddhism, Taoism, and Confucianism.', level: 'advanced', isFree: false, sortOrder: 3 },

    // Art & Culture (4)
    { topicSlug: 'art-culture', slug: 'art-history-essentials', title: 'Art History Essentials', description: 'Trace the evolution of art from ancient cave paintings to Renaissance masterpieces and modern movements.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'art-culture', slug: 'understanding-modern-art', title: 'Understanding Modern Art', description: 'Decode the movements, meaning, and methods behind modern and contemporary art.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'art-culture', slug: 'art-appreciation-skills', title: 'Art Appreciation Skills', description: 'Develop a trained eye for composition, technique, and meaning in any work of art you encounter.', level: 'advanced', isFree: false, sortOrder: 3 },
    { topicSlug: 'art-culture', slug: 'digital-art-and-design', title: 'Digital Art & Design', description: 'Explore the intersection of technology and creativity in digital illustration, design, and visual media.', level: 'intermediate', isFree: false, sortOrder: 4 },

    // Movie Knowledge (3)
    { topicSlug: 'movie-knowledge', slug: 'cinema-history', title: 'Cinema History', description: 'From silent films to streaming, explore the key moments and movements that shaped the film industry.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'movie-knowledge', slug: 'film-techniques', title: 'Film Techniques', description: 'Understand cinematography, editing, sound design, and the craft behind memorable movie moments.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'movie-knowledge', slug: 'world-cinema', title: 'World Cinema', description: 'Broaden your film horizons with influential cinema from Europe, Asia, Latin America, and Africa.', level: 'advanced', isFree: false, sortOrder: 3 },

    // Biology (3)
    { topicSlug: 'biology', slug: 'the-human-body', title: 'The Human Body', description: 'Discover how your body works, from major organ systems to the cellular processes that keep you alive.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'biology', slug: 'genetics-and-dna', title: 'Genetics & DNA', description: 'Unravel the code of life and understand how genes shape traits, health, and heredity.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'biology', slug: 'ecology-and-evolution', title: 'Ecology & Evolution', description: 'Explore how species evolve, interact, and shape the ecosystems that sustain life on Earth.', level: 'advanced', isFree: false, sortOrder: 3 },

    // Physics (4)
    { topicSlug: 'physics', slug: 'laws-of-motion', title: 'Laws of Motion', description: 'Understand Newton\'s laws and the fundamental principles that govern how objects move and interact.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'physics', slug: 'energy-and-waves', title: 'Energy & Waves', description: 'Explore the physics of energy, light, sound, and the wave phenomena that shape our world.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'physics', slug: 'thermodynamics', title: 'Thermodynamics', description: 'Learn the laws of heat, entropy, and energy transfer that drive everything from engines to stars.', level: 'intermediate', isFree: false, sortOrder: 3 },
    { topicSlug: 'physics', slug: 'modern-physics', title: 'Modern Physics', description: 'Dive into relativity, quantum mechanics, and the cutting-edge theories that redefine our understanding.', level: 'advanced', isFree: false, sortOrder: 4 },

    // Literature (3)
    { topicSlug: 'literature', slug: 'classic-literature', title: 'Classic Literature', description: 'Read and analyze timeless works from Shakespeare to Dostoevsky and discover why they still matter.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'literature', slug: 'storytelling-and-narrative', title: 'Storytelling & Narrative', description: 'Learn the techniques great writers use to craft compelling stories, characters, and emotional arcs.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'literature', slug: 'poetry-and-language', title: 'Poetry & Language', description: 'Appreciate the beauty of poetic form, meter, and figurative language across literary traditions.', level: 'advanced', isFree: false, sortOrder: 3 },

    // Math & Logic (3)
    { topicSlug: 'math-logic', slug: 'everyday-math', title: 'Everyday Math', description: 'Build confidence with the practical math skills you use daily, from percentages to mental arithmetic.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'math-logic', slug: 'logic-and-critical-thinking', title: 'Logic & Critical Thinking', description: 'Strengthen your reasoning skills with formal logic, argument analysis, and common fallacy detection.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'math-logic', slug: 'problem-solving-mastery', title: 'Problem-Solving Mastery', description: 'Tackle complex problems systematically using proven mathematical and logical frameworks.', level: 'advanced', isFree: false, sortOrder: 3 },

    // Dog Training (3)
    { topicSlug: 'dog-training', slug: 'puppy-basics', title: 'Puppy Basics', description: 'Start your puppy off right with foundational training in commands, house rules, and socialization.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'dog-training', slug: 'obedience-and-socialization', title: 'Obedience & Socialization', description: 'Build reliable obedience and healthy social skills so your dog thrives in any environment.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'dog-training', slug: 'advanced-training', title: 'Advanced Training', description: 'Master advanced commands, off-leash reliability, and behavior modification for challenging situations.', level: 'advanced', isFree: false, sortOrder: 3 },

    // Style (3)
    { topicSlug: 'style', slug: 'style-essentials', title: 'Style Essentials', description: 'Discover your personal style identity and learn the foundational rules of dressing well every day.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'style', slug: 'dressing-for-occasions', title: 'Dressing for Occasions', description: 'Navigate dress codes with confidence, from business formal to smart casual and everything in between.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'style', slug: 'personal-brand-through-style', title: 'Personal Brand & Style', description: 'Align your wardrobe with your personal brand to communicate authority, creativity, or approachability.', level: 'advanced', isFree: false, sortOrder: 3 },

    // Voice (4)
    { topicSlug: 'voice', slug: 'voice-fundamentals', title: 'Voice Fundamentals', description: 'Understand how your voice works and learn the basics of breath support, tone, and vocal health.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'voice', slug: 'singing-techniques', title: 'Singing Techniques', description: 'Develop pitch accuracy, range expansion, and stylistic control for confident singing.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'voice', slug: 'voice-in-practice', title: 'Voice in Practice', description: 'Apply vocal techniques to real-world scenarios like presentations, interviews, and recordings.', level: 'intermediate', isFree: false, sortOrder: 3 },
    { topicSlug: 'voice', slug: 'advanced-voice-mastery', title: 'Advanced Voice Mastery', description: 'Refine your instrument with advanced resonance, dynamics, and performance-level vocal control.', level: 'advanced', isFree: false, sortOrder: 4 },

    // Intelligence Training (3)
    { topicSlug: 'intelligence-training', slug: 'brain-basics', title: 'Brain Basics', description: 'Learn how your brain learns, remembers, and focuses so you can train it more effectively.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'intelligence-training', slug: 'cognitive-enhancement', title: 'Cognitive Enhancement', description: 'Use targeted exercises and techniques to improve memory, processing speed, and mental flexibility.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'intelligence-training', slug: 'peak-mental-performance', title: 'Peak Mental Performance', description: 'Optimize your cognitive output with advanced strategies for flow states, deep work, and mental endurance.', level: 'advanced', isFree: false, sortOrder: 3 },

    // Confident Parenting (4)
    { topicSlug: 'confident-parenting', slug: 'child-development-stages', title: 'Child Development Stages', description: 'Understand the key physical, emotional, and cognitive milestones from infancy through adolescence.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'confident-parenting', slug: 'positive-discipline', title: 'Positive Discipline', description: 'Set boundaries with empathy using discipline strategies that build cooperation instead of resentment.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'confident-parenting', slug: 'parenting-teens', title: 'Parenting Teens', description: 'Navigate the challenges of adolescence with strategies for communication, trust, and healthy boundaries.', level: 'intermediate', isFree: false, sortOrder: 3 },
    { topicSlug: 'confident-parenting', slug: 'building-strong-bonds', title: 'Building Strong Bonds', description: 'Create deep, lasting connections with your children through intentional quality time and emotional attunement.', level: 'advanced', isFree: false, sortOrder: 4 },
  ];

  for (const course of courses) {
    const topic = await prisma.topic.findUnique({ where: { slug: course.topicSlug } });
    if (!topic) {
      console.warn(`  Topic not found for slug: ${course.topicSlug}`);
      continue;
    }

    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {
        topicId: topic.id,
        title: course.title,
        description: course.description,
        level: course.level,
        lessonCount: 5,
        estimatedMinutes: 50,
        isFree: course.isFree,
        sortOrder: course.sortOrder,
      },
      create: {
        topicId: topic.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        level: course.level,
        lessonCount: 5,
        estimatedMinutes: 50,
        isFree: course.isFree,
        sortOrder: course.sortOrder,
      },
    });
  }

  console.log(`  Seeded ${courses.length} courses.`);
}

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------
async function seedAchievements() {
  console.log('Seeding achievements...');

  const achievements = [
    // Streak
    { sortOrder: 1, slug: 'first-step', name: 'First Step', description: 'Complete your first lesson', category: 'streak', tier: 'bronze', icon: '\u{1F463}', requirement: { type: 'lessons_completed', value: 1 } },
    { sortOrder: 2, slug: 'getting-warm', name: 'Getting Warm', description: '3-day learning streak', category: 'streak', tier: 'bronze', icon: '\u{1F525}', requirement: { type: 'streak_days', value: 3 } },
    { sortOrder: 3, slug: 'week-warrior', name: 'Week Warrior', description: '7-day learning streak', category: 'streak', tier: 'silver', icon: '\u2694\uFE0F', requirement: { type: 'streak_days', value: 7 } },
    { sortOrder: 4, slug: 'fortnight-fighter', name: 'Fortnight Fighter', description: '14-day learning streak', category: 'streak', tier: 'silver', icon: '\u{1F6E1}\uFE0F', requirement: { type: 'streak_days', value: 14 } },
    { sortOrder: 5, slug: 'monthly-master', name: 'Monthly Master', description: '30-day learning streak', category: 'streak', tier: 'gold', icon: '\u{1F451}', requirement: { type: 'streak_days', value: 30 } },
    { sortOrder: 6, slug: 'unstoppable', name: 'Unstoppable', description: '60-day learning streak', category: 'streak', tier: 'gold', icon: '\u{1F48E}', requirement: { type: 'streak_days', value: 60 } },
    { sortOrder: 7, slug: 'century-scholar', name: 'Century Scholar', description: '100-day learning streak', category: 'streak', tier: 'gold', icon: '\u{1F3C6}', requirement: { type: 'streak_days', value: 100 } },

    // Lesson
    { sortOrder: 8, slug: 'student', name: 'Student', description: 'Complete 5 lessons', category: 'lesson', tier: 'bronze', icon: '\u{1F4D6}', requirement: { type: 'lessons_completed', value: 5 } },
    { sortOrder: 9, slug: 'learner', name: 'Learner', description: 'Complete 10 lessons', category: 'lesson', tier: 'bronze', icon: '\u{1F4DA}', requirement: { type: 'lessons_completed', value: 10 } },
    { sortOrder: 10, slug: 'scholar', name: 'Scholar', description: 'Complete 25 lessons', category: 'lesson', tier: 'silver', icon: '\u{1F393}', requirement: { type: 'lessons_completed', value: 25 } },
    { sortOrder: 11, slug: 'academic', name: 'Academic', description: 'Complete 50 lessons', category: 'lesson', tier: 'silver', icon: '\u{1F3EB}', requirement: { type: 'lessons_completed', value: 50 } },
    { sortOrder: 12, slug: 'expert', name: 'Expert', description: 'Complete 100 lessons', category: 'lesson', tier: 'gold', icon: '\u{1F9D1}\u200D\u{1F393}', requirement: { type: 'lessons_completed', value: 100 } },
    { sortOrder: 13, slug: 'course-finisher', name: 'Course Finisher', description: 'Complete your first course', category: 'lesson', tier: 'bronze', icon: '\u2705', requirement: { type: 'courses_completed', value: 1 } },
    { sortOrder: 14, slug: 'curriculum', name: 'Curriculum', description: 'Complete 5 courses', category: 'lesson', tier: 'silver', icon: '\u{1F4CB}', requirement: { type: 'courses_completed', value: 5 } },
    { sortOrder: 15, slug: 'graduate', name: 'Graduate', description: 'Complete 15 courses', category: 'lesson', tier: 'gold', icon: '\u{1F389}', requirement: { type: 'courses_completed', value: 15 } },

    // Quiz
    { sortOrder: 16, slug: 'quiz-taker', name: 'Quiz Taker', description: 'Pass your first quiz', category: 'quiz', tier: 'bronze', icon: '\u2753', requirement: { type: 'quizzes_passed', value: 1 } },
    { sortOrder: 17, slug: 'sharp', name: 'Sharp', description: 'Pass 10 quizzes', category: 'quiz', tier: 'bronze', icon: '\u{1F52A}', requirement: { type: 'quizzes_passed', value: 10 } },
    { sortOrder: 18, slug: 'quiz-master', name: 'Quiz Master', description: 'Pass 25 quizzes', category: 'quiz', tier: 'silver', icon: '\u{1F9E0}', requirement: { type: 'quizzes_passed', value: 25 } },
    { sortOrder: 19, slug: 'perfect-score', name: 'Perfect Score', description: 'Get 3/3 on a quiz', category: 'quiz', tier: 'bronze', icon: '\u{1F4AF}', requirement: { type: 'perfect_quiz', value: 1 } },
    { sortOrder: 20, slug: 'perfect-streak', name: 'Perfect Streak', description: '5 perfect quizzes in a row', category: 'quiz', tier: 'silver', icon: '\u2B50', requirement: { type: 'perfect_quiz_streak', value: 5 } },
    { sortOrder: 21, slug: 'champion', name: 'Champion', description: 'Pass 50 quizzes', category: 'quiz', tier: 'gold', icon: '\u{1F3C5}', requirement: { type: 'quizzes_passed', value: 50 } },

    // Explorer
    { sortOrder: 22, slug: 'curious', name: 'Curious', description: 'Select 3 topics', category: 'explorer', tier: 'bronze', icon: '\u{1F50D}', requirement: { type: 'topics_selected', value: 3 } },
    { sortOrder: 23, slug: 'explorer', name: 'Explorer', description: 'Start a course in 3 different topics', category: 'explorer', tier: 'bronze', icon: '\u{1F9ED}', requirement: { type: 'topics_started', value: 3 } },
    { sortOrder: 24, slug: 'renaissance', name: 'Renaissance', description: 'Complete a course in 5 different topics', category: 'explorer', tier: 'silver', icon: '\u{1F3A8}', requirement: { type: 'topics_completed', value: 5 } },
    { sortOrder: 25, slug: 'polymath', name: 'Polymath', description: 'Complete a course in all 15 topics', category: 'explorer', tier: 'gold', icon: '\u{1F31F}', requirement: { type: 'topics_completed', value: 15 } },
    { sortOrder: 26, slug: 'daily-challenger', name: 'Daily Challenger', description: 'Answer 5 daily challenges', category: 'explorer', tier: 'bronze', icon: '\u{1F4C5}', requirement: { type: 'daily_challenges', value: 5 } },
    { sortOrder: 27, slug: 'challenge-streak', name: 'Challenge Streak', description: 'Answer daily challenge 7 days in a row', category: 'explorer', tier: 'silver', icon: '\u{1F517}', requirement: { type: 'daily_challenge_streak', value: 7 } },
    { sortOrder: 28, slug: 'referral-star', name: 'Referral Star', description: 'Invite 1 friend', category: 'explorer', tier: 'bronze', icon: '\u{1F48C}', requirement: { type: 'referrals', value: 1 } },
    { sortOrder: 29, slug: 'community-builder', name: 'Community Builder', description: 'Invite 5 friends', category: 'explorer', tier: 'silver', icon: '\u{1F91D}', requirement: { type: 'referrals', value: 5 } },
    { sortOrder: 30, slug: 'first-referral', name: 'Connector', description: 'Invite your first friend', category: 'social', tier: 'bronze', icon: '\u{1F91D}', requirement: { type: 'referrals', value: 1 } },
    { sortOrder: 31, slug: 'super-referrer', name: 'Advocate', description: 'Invite 5 friends', category: 'social', tier: 'silver', icon: '\u{1F4E3}', requirement: { type: 'referrals', value: 5 } },
    { sortOrder: 32, slug: 'ambassador', name: 'Ambassador', description: 'Invite 10 friends', category: 'social', tier: 'gold', icon: '\u{1F31F}', requirement: { type: 'referrals', value: 10 } },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { slug: achievement.slug },
      update: {
        name: achievement.name,
        description: achievement.description,
        category: achievement.category,
        tier: achievement.tier,
        icon: achievement.icon,
        requirement: achievement.requirement,
        sortOrder: achievement.sortOrder,
      },
      create: achievement,
    });
  }

  console.log(`  Seeded ${achievements.length} achievements.`);
}

// ---------------------------------------------------------------------------
// Word Games
// ---------------------------------------------------------------------------
async function seedWordGames() {
  console.log('Seeding word games...');

  // ---- Fill the Blank (slug kept as word-hunter) ----
  const wordHunterRounds = [
    {
      content: {
        sentence: "She spoke with great ___ , choosing each word carefully to avoid offending anyone.",
        options: ["aggression", "diplomacy", "haste", "confusion"],
        correctIndex: 1,
        explanation: "Diplomacy means tactful, careful communication — the other options contradict the context."
      },
      difficulty: 'easy',
    },
    {
      content: {
        sentence: "The new policy will ___ all employees, regardless of their department.",
        options: ["ignore", "affect", "create", "remove"],
        correctIndex: 1,
        explanation: "Affect means to have an impact on — the sentence describes a policy that applies to everyone."
      },
      difficulty: 'easy',
    },
    {
      content: {
        sentence: "A good leader knows how to ___ their team during difficult times.",
        options: ["abandon", "motivate", "confuse", "isolate"],
        correctIndex: 1,
        explanation: "Motivate means to inspire action and keep morale high — essential during difficult periods."
      },
      difficulty: 'easy',
    },
    {
      content: {
        sentence: "The scientist made a ___ discovery that changed our understanding of the universe.",
        options: ["trivial", "groundbreaking", "routine", "delayed"],
        correctIndex: 1,
        explanation: "Groundbreaking means revolutionary or pioneering — fitting for a discovery that changes understanding."
      },
      difficulty: 'easy',
    },
    {
      content: {
        sentence: "To ___ effectively, you must listen as much as you speak.",
        options: ["argue", "communicate", "interrupt", "compete"],
        correctIndex: 1,
        explanation: "Communication is a two-way process — listening is just as important as speaking."
      },
      difficulty: 'easy',
    },
    {
      content: {
        sentence: "The contract was ___ after both parties agreed to the new terms.",
        options: ["cancelled", "amended", "ignored", "printed"],
        correctIndex: 1,
        explanation: "Amended means formally changed or revised — the correct word when updating agreed terms."
      },
      difficulty: 'easy',
    },
    {
      content: {
        sentence: "She felt ___ after finishing the marathon — tired but proud.",
        options: ["energized", "exhausted", "bored", "anxious"],
        correctIndex: 1,
        explanation: "Exhausted means completely drained of energy — consistent with finishing a marathon and feeling tired."
      },
      difficulty: 'easy',
    },
    {
      content: {
        sentence: "The team reached a ___ after weeks of disagreement, finally agreeing on a plan.",
        options: ["conflict", "consensus", "crisis", "competition"],
        correctIndex: 1,
        explanation: "Consensus means general agreement — the result of resolving weeks of disagreement."
      },
      difficulty: 'medium',
    },
    {
      content: {
        sentence: "His ___ approach to problem-solving helped the team find creative solutions.",
        options: ["rigid", "analytical", "careless", "passive"],
        correctIndex: 1,
        explanation: "Analytical means breaking problems into parts to understand them — leads to creative, structured solutions."
      },
      difficulty: 'medium',
    },
    {
      content: {
        sentence: "The company decided to ___ its product line to reach new markets.",
        options: ["reduce", "expand", "copy", "delay"],
        correctIndex: 1,
        explanation: "Expand means to grow or extend — the correct word when a company is reaching new markets."
      },
      difficulty: 'medium',
    },
    {
      content: {
        sentence: "Reading regularly can ___ your vocabulary and improve your writing.",
        options: ["weaken", "enrich", "limit", "replace"],
        correctIndex: 1,
        explanation: "Enrich means to enhance or add value — regular reading adds depth to vocabulary."
      },
      difficulty: 'medium',
    },
    {
      content: {
        sentence: "The professor asked students to ___ their essays before submitting them.",
        options: ["delete", "revise", "forget", "copy"],
        correctIndex: 1,
        explanation: "Revise means to review and improve — standard advice before submitting written work."
      },
      difficulty: 'medium',
    },
    {
      content: {
        sentence: "A ___ mindset helps you grow from failure instead of being defeated by it.",
        options: ["fixed", "growth", "passive", "closed"],
        correctIndex: 1,
        explanation: "A growth mindset, coined by Carol Dweck, means believing abilities can be developed through effort."
      },
      difficulty: 'medium',
    },
    {
      content: {
        sentence: "The new manager worked hard to ___ trust with her team in the first month.",
        options: ["destroy", "build", "avoid", "hide"],
        correctIndex: 1,
        explanation: "Build trust is the standard phrase — establishing confidence through consistent actions."
      },
      difficulty: 'medium',
    },
    {
      content: {
        sentence: "To stay healthy, it's important to ___ a balanced diet and regular exercise.",
        options: ["ignore", "maintain", "replace", "avoid"],
        correctIndex: 1,
        explanation: "Maintain means to keep up consistently — the correct word for sustaining healthy habits."
      },
      difficulty: 'medium',
    },
    {
      content: {
        sentence: "The report was ___ with data that supported the team's conclusions.",
        options: ["empty", "filled", "replaced", "hidden"],
        correctIndex: 1,
        explanation: "Filled with data means packed or loaded — the sentence describes a report rich in supporting evidence."
      },
      difficulty: 'medium',
    },
    {
      content: {
        sentence: "When giving feedback, be ___ and focus on specific behaviors, not personality.",
        options: ["vague", "constructive", "harsh", "silent"],
        correctIndex: 1,
        explanation: "Constructive feedback aims to improve — specific and behavior-focused, not personal attacks."
      },
      difficulty: 'hard',
    },
    {
      content: {
        sentence: "The film received ___ reviews — critics and audiences loved it.",
        options: ["poor", "glowing", "mixed", "delayed"],
        correctIndex: 1,
        explanation: "Glowing reviews means extremely positive — consistent with both critics and audiences loving it."
      },
      difficulty: 'hard',
    },
    {
      content: {
        sentence: "She ___ her idea clearly, making sure everyone in the room understood the plan.",
        options: ["hid", "articulated", "forgot", "copied"],
        correctIndex: 1,
        explanation: "Articulated means expressed clearly and coherently — the right word for clear communication of an idea."
      },
      difficulty: 'hard',
    },
    {
      content: {
        sentence: "The children were ___ to learn that the school trip had been cancelled.",
        options: ["thrilled", "disappointed", "confused", "relieved"],
        correctIndex: 1,
        explanation: "Disappointed is the natural emotional response to a cancellation of something anticipated."
      },
      difficulty: 'hard',
    },
    {
      content: {
        sentence: "Good writing is ___ — every word earns its place.",
        options: ["verbose", "concise", "repetitive", "vague"],
        correctIndex: 1,
        explanation: "Concise means brief and clear — the hallmark of good writing where every word is necessary."
      },
      difficulty: 'hard',
    },
    {
      content: {
        sentence: "The negotiations were ___ , with both sides refusing to compromise.",
        options: ["productive", "tense", "brief", "friendly"],
        correctIndex: 1,
        explanation: "Tense means strained and uneasy — the right word when both sides refuse to compromise."
      },
      difficulty: 'hard',
    },
    {
      content: {
        sentence: "He ___ his mistake immediately and apologized to the team.",
        options: ["denied", "acknowledged", "repeated", "ignored"],
        correctIndex: 1,
        explanation: "Acknowledged means admitted or recognized — followed naturally by an apology."
      },
      difficulty: 'hard',
    },
    {
      content: {
        sentence: "The new law was designed to ___ the rights of all citizens equally.",
        options: ["remove", "protect", "ignore", "limit"],
        correctIndex: 1,
        explanation: "Protect means to safeguard — laws are designed to uphold and defend rights, not remove them."
      },
      difficulty: 'hard',
    },
    {
      content: {
        sentence: "A strong argument is built on ___ evidence, not assumptions.",
        options: ["weak", "credible", "vague", "outdated"],
        correctIndex: 1,
        explanation: "Credible evidence means reliable and trustworthy — the foundation of any strong argument."
      },
      difficulty: 'hard',
    },
  ];

  const wordHunter = await prisma.wordGame.upsert({
    where: { slug: 'word-hunter' },
    update: { name: 'Fill the Blank', description: 'Complete the sentence by choosing the right word', iconEmoji: '\u270F\uFE0F' },
    create: { slug: 'word-hunter', name: 'Fill the Blank', description: 'Complete the sentence by choosing the right word', iconEmoji: '\u270F\uFE0F' },
  });

  // Delete existing rounds to avoid duplicates, then re-create
  await prisma.wordGameRound.deleteMany({ where: { gameId: wordHunter.id } });
  for (const round of wordHunterRounds) {
    await prisma.wordGameRound.create({
      data: { gameId: wordHunter.id, content: round.content, difficulty: round.difficulty },
    });
  }

  // ---- Communication Sense ----
  const commSenseRounds = [
    {
      content: {
        optionA: "Your presentation was a disaster. You didn't prepare enough.",
        optionB: "The presentation had some rough spots \u2014 want to run through what worked and what we can tighten for next time?",
        effectiveOption: 'B',
        explanation: 'Option A attacks the person. Option B separates the work from the person and opens a constructive path forward.',
      },
      difficulty: 'easy',
    },
    {
      content: {
        optionA: 'I need this done by end of day or there will be consequences.',
        optionB: "Can you get this to me by end of day? It's blocking the rest of the team.",
        effectiveOption: 'B',
        explanation: 'Threats create resentment. Giving context for urgency creates buy-in.',
      },
      difficulty: 'easy',
    },
    {
      content: {
        optionA: 'As per my previous email, the deadline was clearly stated.',
        optionB: "Quick reminder \u2014 the deadline is Friday at 5pm. Let me know if anything's come up on your end.",
        effectiveOption: 'B',
        explanation: "'As per my previous email' is passive-aggressive. Option B is direct and collaborative.",
      },
      difficulty: 'easy',
    },
    {
      content: {
        optionA: 'I think maybe we could possibly consider potentially exploring this option.',
        optionB: "I recommend we explore this option \u2014 here's why.",
        effectiveOption: 'B',
        explanation: 'Stacking hedging language signals low confidence.',
      },
      difficulty: 'easy',
    },
    {
      content: {
        optionA: "We don't have the budget for that.",
        optionB: "Budget's tight this quarter, but let's look at what version of this we could do now and what we can build toward.",
        effectiveOption: 'B',
        explanation: 'Flat no closes the conversation. Option B keeps momentum.',
      },
      difficulty: 'easy',
    },
    {
      content: {
        optionA: "That's not what I meant and you completely misunderstood me.",
        optionB: "I may have been unclear \u2014 what I meant was...",
        effectiveOption: 'B',
        explanation: 'Blaming the listener creates defensiveness. Taking ownership keeps it productive.',
      },
      difficulty: 'medium',
    },
    {
      content: {
        optionA: 'I feel like you never listen to what I say in these meetings.',
        optionB: "In today's meeting I felt like my point about the deadline got skipped over \u2014 can we revisit it?",
        effectiveOption: 'B',
        explanation: "'You never' triggers defensiveness. Option B references a specific instance.",
      },
      difficulty: 'medium',
    },
    {
      content: {
        optionA: "Thanks for sending this over. I'll review it when I get a chance.",
        optionB: "Got it \u2014 I'll review this by Thursday and get you feedback.",
        effectiveOption: 'B',
        explanation: "'When I get a chance' gives no timeline. A specific commitment respects everyone's time.",
      },
      difficulty: 'medium',
    },
    {
      content: {
        optionA: "You always send things at the last minute. It's very frustrating.",
        optionB: "When I get materials the day before, it's hard to do a quality review. Could we aim for 48 hours ahead?",
        effectiveOption: 'B',
        explanation: "'You always' invites denial. Option B describes impact and makes a specific request.",
      },
      difficulty: 'medium',
    },
    {
      content: {
        optionA: "No worries! It's totally fine! Don't stress about it at all!",
        optionB: "No problem \u2014 let's make sure we're aligned on the timeline going forward.",
        effectiveOption: 'B',
        explanation: 'Over-reassurance avoids the underlying issue. Option B is warm but addresses the pattern.',
      },
      difficulty: 'medium',
    },
    {
      content: {
        optionA: 'I disagree with that approach entirely.',
        optionB: "I see it differently \u2014 here's my concern with that approach.",
        effectiveOption: 'B',
        explanation: "Flat disagreement closes dialogue. 'I see it differently' invites continued discussion.",
      },
      difficulty: 'medium',
    },
    {
      content: {
        optionA: 'This is wrong. Fix it.',
        optionB: "A few things to adjust here \u2014 let's walk through them so the fix is clear.",
        effectiveOption: 'B',
        explanation: 'Commands without context frustrate people.',
      },
      difficulty: 'medium',
    },
    {
      content: {
        optionA: 'Just let me know whenever you have time to chat.',
        optionB: 'Could we find 20 minutes this week? I want to walk you through the Q2 plan.',
        effectiveOption: 'B',
        explanation: 'Vague requests get deprioritized. A specific ask makes it easier to schedule.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        optionA: 'We need to circle back and take this offline to align on synergies.',
        optionB: "Let's schedule a separate meeting to work through the details.",
        effectiveOption: 'B',
        explanation: 'Jargon-heavy language obscures meaning.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        optionA: "That's a good idea, but...",
        optionB: "I like where you're going with that. What if we also considered...",
        effectiveOption: 'B',
        explanation: "'Good idea, but' negates the compliment. Option B builds on the idea.",
      },
      difficulty: 'hard',
    },
    {
      content: {
        optionA: "I'm sorry you feel that way.",
        optionB: "I'm sorry \u2014 I can see why that was frustrating.",
        effectiveOption: 'B',
        explanation: "'Sorry you feel that way' invalidates the emotion. Option B acknowledges it.",
      },
      difficulty: 'hard',
    },
    {
      content: {
        optionA: 'Can you maybe try to possibly get this to me earlier next time?',
        optionB: 'Going forward, could you send this 48 hours in advance?',
        effectiveOption: 'B',
        explanation: 'Layered hedging makes requests easy to ignore.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        optionA: 'The deadline moved. Not my decision.',
        optionB: "The deadline has moved to Friday. I know the timing isn't ideal \u2014 here's how I'd suggest we reprioritize.",
        effectiveOption: 'B',
        explanation: 'Distancing yourself from decisions undermines trust.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        optionA: 'Your work has been inconsistent lately.',
        optionB: "I've noticed the last two reports had some data gaps \u2014 want to walk me through your process so we can identify where things are slipping?",
        effectiveOption: 'B',
        explanation: 'Vague character assessments put people on the defensive.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        optionA: "We can't move forward without everyone's agreement.",
        optionB: "We need alignment on this \u2014 I'd like to hear any remaining concerns so we can address them and move forward.",
        effectiveOption: 'B',
        explanation: 'Option A creates a veto. Option B invites concerns while indicating forward motion.',
      },
      difficulty: 'hard',
    },
  ];

  const commSense = await prisma.wordGame.upsert({
    where: { slug: 'communication-sense' },
    update: { name: 'Communication Sense', description: 'Choose the more effective communication option', iconEmoji: '\u{1F4A1}' },
    create: { slug: 'communication-sense', name: 'Communication Sense', description: 'Choose the more effective communication option', iconEmoji: '\u{1F4A1}' },
  });

  await prisma.wordGameRound.deleteMany({ where: { gameId: commSense.id } });
  for (const round of commSenseRounds) {
    await prisma.wordGameRound.create({
      data: { gameId: commSense.id, content: round.content, difficulty: round.difficulty },
    });
  }

  // ---- Word Search ----
  const wordSearchRounds = [
    {
      content: {
        message: 'I want to make sure everyone on the team feels comfortable sharing their concerns before we finalize this decision.',
        conceptWords: ['psychological safety', 'inclusion', 'consensus'],
        distractorWords: ['competition', 'urgency', 'efficiency'],
        explanation: 'This message creates psychological safety by explicitly inviting dissent.',
      },
      difficulty: 'easy',
    },
    {
      content: {
        message: "I appreciate you raising this \u2014 let's explore what's behind the hesitation before we move forward.",
        conceptWords: ['curiosity', 'empathy', 'pause'],
        distractorWords: ['decisiveness', 'dismissal', 'persuasion'],
        explanation: 'Rather than pushing through resistance, this message slows down to understand it.',
      },
      difficulty: 'easy',
    },
    {
      content: {
        message: "Here's what I know, here's what I don't know, and here's what I'm going to find out.",
        conceptWords: ['transparency', 'honesty', 'clarity'],
        distractorWords: ['authority', 'certainty', 'expertise'],
        explanation: 'Separating known from unknown is a mark of intellectual honesty.',
      },
      difficulty: 'easy',
    },
    {
      content: {
        message: "I'm going to be direct with you because I think you can handle it and because I respect your time.",
        conceptWords: ['directness', 'respect', 'candor'],
        distractorWords: ['bluntness', 'impatience', 'authority'],
        explanation: 'Framing direct feedback as a sign of respect reframes honesty as care.',
      },
      difficulty: 'easy',
    },
    {
      content: {
        message: "Before I respond, help me understand \u2014 what outcome are you hoping for from this conversation?",
        conceptWords: ['intent', 'listening', 'alignment'],
        distractorWords: ['negotiation', 'assertiveness', 'closure'],
        explanation: 'This question resets the conversation toward shared goals.',
      },
      difficulty: 'easy',
    },
    {
      content: {
        message: "I made the wrong call on that. Here's what I'll do differently.",
        conceptWords: ['accountability', 'learning', 'ownership'],
        distractorWords: ['apology', 'delegation', 'justification'],
        explanation: 'Admitting error without excuse builds far more trust than deflecting blame.',
      },
      difficulty: 'medium',
    },
    {
      content: {
        message: 'Let me make sure I\'m understanding your concern correctly before I respond.',
        conceptWords: ['active listening', 'reflection', 'validation'],
        distractorWords: ['rebuttal', 'summarization', 'negotiation'],
        explanation: 'This is reflective listening in action.',
      },
      difficulty: 'medium',
    },
    {
      content: {
        message: "I'd rather we debate this hard now than discover the problem after we've committed.",
        conceptWords: ['premortem', 'rigor', 'healthy conflict'],
        distractorWords: ['consensus', 'speed', 'diplomacy'],
        explanation: 'Inviting upfront debate prevents costly downstream errors.',
      },
      difficulty: 'medium',
    },
    {
      content: {
        message: "You clearly put real thought into this \u2014 here's where I see it differently.",
        conceptWords: ['acknowledgment', 'respectful disagreement', 'diplomacy'],
        distractorWords: ['flattery', 'avoidance', 'confrontation'],
        explanation: 'Acknowledging effort before disagreeing disarms defensiveness.',
      },
      difficulty: 'medium',
    },
    {
      content: {
        message: 'What would make this a yes for you?',
        conceptWords: ['negotiation', 'curiosity', 'problem-solving'],
        distractorWords: ['pressure', 'compromise', 'deflection'],
        explanation: "Instead of defending your position, you explore what the other person needs.",
      },
      difficulty: 'medium',
    },
    {
      content: {
        message: 'I want to name what I\'m seeing so we can address it directly rather than dance around it.',
        conceptWords: ['naming', 'courage', 'directness'],
        distractorWords: ['accusation', 'gossip', 'formality'],
        explanation: 'Naming dynamics directly requires courage and builds trust.',
      },
      difficulty: 'medium',
    },
    {
      content: {
        message: "I notice we keep coming back to this issue \u2014 what if we treated it as the real problem instead of a side note?",
        conceptWords: ['pattern recognition', 'reframing', 'focus'],
        distractorWords: ['repetition', 'escalation', 'delegation'],
        explanation: 'Noticing recurring themes and surfacing them shows pattern recognition.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        message: "I'm asking everyone in this room to challenge the assumptions we've been making.",
        conceptWords: ['critical thinking', 'intellectual humility', 'rigor'],
        distractorWords: ['compliance', 'brainstorming', 'authority'],
        explanation: 'Questioning assumptions is the hallmark of rigorous thinking.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        message: "Here's the decision, here's why, and here's what we need from each of you going forward.",
        conceptWords: ['clarity', 'direction', 'alignment'],
        distractorWords: ['debate', 'consensus', 'autonomy'],
        explanation: 'Decision communication with rationale removes ambiguity.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        message: "What would you do if you knew you couldn't fail?",
        conceptWords: ['coaching', 'possibility', 'vision'],
        distractorWords: ['planning', 'caution', 'accountability'],
        explanation: 'A classic coaching question that removes fear as a constraint.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        message: "I hear the frustration \u2014 the system made this harder than it needed to be. Let's fix the system.",
        conceptWords: ['empathy', 'systemic thinking', 'validation'],
        distractorWords: ['blame', 'compliance', 'urgency'],
        explanation: 'Acknowledging frustration and redirecting it from blame to systemic improvement.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        message: "We don't have to agree on everything, but we do have to commit to the decision we land on.",
        conceptWords: ['alignment', 'commitment', 'unity'],
        distractorWords: ['agreement', 'compromise', 'obedience'],
        explanation: 'This separates alignment from agreement.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        message: 'I wanted to tell you directly rather than have you hear it from someone else.',
        conceptWords: ['respect', 'directness', 'transparency'],
        distractorWords: ['confidentiality', 'urgency', 'formality'],
        explanation: 'Going direct shows deep respect and builds trust.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        message: "What am I missing in how I'm thinking about this?",
        conceptWords: ['intellectual humility', 'openness', 'self-awareness'],
        distractorWords: ['indecision', 'deference', 'expertise'],
        explanation: 'Asking what you\'re missing is a powerful display of intellectual humility.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        message: "I'm going to give you the honest version, because the polished version won't actually help you.",
        conceptWords: ['candor', 'care', 'growth'],
        distractorWords: ['harshness', 'politeness', 'authority'],
        explanation: 'This frames radical honesty as an act of care.',
      },
      difficulty: 'hard',
    },
  ];

  const wordSearch = await prisma.wordGame.upsert({
    where: { slug: 'word-search' },
    update: { name: 'Word Search', description: 'Identify communication concepts in real messages', iconEmoji: '\u{1F50E}' },
    create: { slug: 'word-search', name: 'Word Search', description: 'Identify communication concepts in real messages', iconEmoji: '\u{1F50E}' },
  });

  await prisma.wordGameRound.deleteMany({ where: { gameId: wordSearch.id } });
  for (const round of wordSearchRounds) {
    await prisma.wordGameRound.create({
      data: { gameId: wordSearch.id, content: round.content, difficulty: round.difficulty },
    });
  }

  console.log('  Seeded 3 word games with 60 rounds total.');
}

// ---------------------------------------------------------------------------
// Daily Challenges
// ---------------------------------------------------------------------------
async function seedDailyChallenges() {
  console.log('Seeding daily challenges...');

  // Fetch all quiz questions and shuffle for variety
  const allQuestions = await prisma.quizQuestion.findMany({
    select: { id: true },
  })

  // Fisher-Yates shuffle
  for (let i = allQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
  }
  const questions = allQuestions.slice(0, Math.max(30, allQuestions.length))

  if (questions.length === 0) {
    console.log('  No quiz questions found, skipping daily challenges.');
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const question = questions[i % questions.length];

    await prisma.dailyChallenge.upsert({
      where: { date },
      update: { questionId: question.id },
      create: { date, questionId: question.id },
    });
  }

  console.log(`  Created/updated 30 daily challenges (today + 29 days).`);
}

// ---------------------------------------------------------------------------
// Blog Posts
// ---------------------------------------------------------------------------
async function seedBlogPosts() {
  console.log('Seeding blog posts...');

  const posts = [
    {
      slug: 'why-microlearning-works',
      title: 'Why Microlearning Works: The Science Behind Bite-Sized Lessons',
      excerpt:
        'Research shows that short, focused learning sessions boost retention by up to 80%. Here is why Smooqi is built around this principle.',
      topic: 'Learning Science',
      readingTime: 5,
      featured: true,
      publishedAt: new Date('2025-12-01'),
      content: `## The Problem with Traditional Learning

Most of us grew up with hour-long lectures and thick textbooks. But cognitive science tells a different story about how we actually learn best.

## What Is Microlearning?

Microlearning breaks complex topics into focused, bite-sized modules that take 5-10 minutes to complete. Each module targets a single concept or skill.

### Key Benefits

- **Higher retention**: Spaced repetition combined with short sessions dramatically improves long-term memory
- **Lower cognitive load**: Your working memory can only handle so much at once
- **Better engagement**: Short lessons feel achievable, keeping motivation high
- **Fits busy schedules**: Anyone can find 10 minutes in their day

## The Research

Studies from the Journal of Applied Psychology found that microlearning produces 17% more efficient knowledge transfer compared to traditional methods.

## How Smooqi Uses This

Every Smooqi lesson is designed as a series of swipeable slides, each focusing on one key idea. After the slides, a quick quiz reinforces what you learned. Over time, our spaced repetition system brings back concepts right before you would forget them.

## Start Learning Today

The best time to start building a learning habit is now. Pick a topic that interests you and try your first lesson.`,
    },
    {
      slug: 'building-a-learning-streak',
      title: 'How to Build a Learning Streak That Actually Sticks',
      excerpt:
        'Streaks are more than vanity metrics. Learn how daily consistency compounds into real knowledge over time.',
      topic: 'Productivity',
      readingTime: 4,
      featured: false,
      publishedAt: new Date('2025-12-15'),
      content: `## Why Streaks Matter

A learning streak is not just a number. It represents a habit forming in your brain. After 21 days of consistent practice, the neural pathways strengthen and learning becomes automatic.

## Tips for Maintaining Your Streak

1. **Set a daily reminder**: Choose a specific time each day for your lesson
2. **Start small**: Even one lesson per day counts
3. **Stack habits**: Pair your Smooqi session with an existing habit like morning coffee
4. **Forgive slip-ups**: Missing one day does not erase your progress

## The Compound Effect

Imagine learning just one new concept per day. That is 365 concepts per year, and over 1,000 in three years. Small, consistent efforts lead to extraordinary results.

## Smooqi Streaks

Smooqi tracks your daily streak automatically. Complete at least one lesson per day to keep it alive. Your streak badge appears on your profile and the leaderboard, motivating you and inspiring others.

## Get Started

Open Smooqi, pick a topic, and complete your first lesson today. Your future self will thank you.`,
    },
    {
      slug: 'top-5-topics-for-personal-growth',
      title: 'Top 5 Topics for Personal Growth in 2026',
      excerpt:
        'From psychology to personal finance, these are the most impactful subjects you can study this year.',
      topic: 'Personal Growth',
      readingTime: 6,
      featured: false,
      publishedAt: new Date('2026-01-10'),
      content: `## Why Personal Growth Matters

Investing in yourself is the highest-return investment you can make. Here are five topics that deliver outsized results.

## 1. Psychology & Mindset

Understanding how your mind works gives you superpowers. Learn about cognitive biases, emotional intelligence, and growth mindset to make better decisions every day.

## 2. Communication Skills

Whether in your career or personal life, clear and confident communication opens doors. Master active listening, persuasion, and public speaking fundamentals.

## 3. Personal Finance

Financial literacy is rarely taught in school, but it shapes your entire life. Learn budgeting, investing basics, and the power of compound interest.

## 4. Philosophy

The great thinkers asked questions we still wrestle with today. Studying philosophy sharpens your critical thinking and helps you live more intentionally.

## 5. Biology

Understanding the science of your own body helps you make better health, nutrition, and lifestyle choices. From genetics to neuroscience, biology is endlessly fascinating.

## Start Your Journey

All five of these topics are available on Smooqi with beginner-friendly courses. Pick the one that excites you most and dive in.`,
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        topic: post.topic,
        readingTime: post.readingTime,
        featured: post.featured,
        publishedAt: post.publishedAt,
      },
      create: post,
    });
  }

  console.log(`  Seeded ${posts.length} blog posts.`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('Starting seed...\n');

  await seedTopics();
  await seedCourses();
  await seedAchievements();
  await seedWordGames();
  await seedDailyChallenges();
  await seedBlogPosts();

  console.log('\nSeed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
