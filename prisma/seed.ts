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
    { topicSlug: 'psychology-mindset', slug: 'habit-behavior-change', title: 'Habit & Behavior Change', description: 'Use science-backed strategies to break bad habits, build good ones, and create lasting behavioral change.', level: 'advanced', isFree: false, sortOrder: 3 },

    // Personal Finance (4)
    { topicSlug: 'personal-finance', slug: 'money-basics', title: 'Money Basics', description: 'Build a solid financial foundation with budgeting, saving, and understanding how money works.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'personal-finance', slug: 'smart-investing', title: 'Smart Investing', description: 'Learn the principles of investing, from index funds to diversification, and grow your wealth over time.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'personal-finance', slug: 'credit-debt-mastery', title: 'Credit & Debt Mastery', description: 'Understand credit scores, manage debt strategically, and use credit as a tool rather than a trap.', level: 'intermediate', isFree: false, sortOrder: 3 },
    { topicSlug: 'personal-finance', slug: 'financial-freedom', title: 'Financial Freedom', description: 'Design a long-term financial plan that builds passive income and moves you toward true financial independence.', level: 'advanced', isFree: false, sortOrder: 4 },

    // Philosophy (3)
    { topicSlug: 'philosophy', slug: 'great-thinkers', title: 'Great Thinkers', description: 'Journey through the ideas of history\'s most influential philosophers, from Socrates to modern thinkers.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'philosophy', slug: 'ethics-morality', title: 'Ethics & Morality', description: 'Examine the frameworks that guide right and wrong, from utilitarianism to virtue ethics and beyond.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'philosophy', slug: 'eastern-philosophy', title: 'Eastern Philosophy', description: 'Discover the wisdom of Eastern traditions including Buddhism, Taoism, and Confucianism.', level: 'advanced', isFree: false, sortOrder: 3 },

    // Art & Culture (4)
    { topicSlug: 'art-culture', slug: 'art-history-essentials', title: 'Art History Essentials', description: 'Trace the evolution of art from ancient cave paintings to Renaissance masterpieces and modern movements.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'art-culture', slug: 'understanding-modern-art', title: 'Understanding Modern Art', description: 'Decode the movements, meaning, and methods behind modern and contemporary art.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'art-culture', slug: 'art-appreciation-skills', title: 'Art Appreciation Skills', description: 'Develop a trained eye for composition, technique, and meaning in any work of art you encounter.', level: 'advanced', isFree: false, sortOrder: 3 },
    { topicSlug: 'art-culture', slug: 'digital-art-design', title: 'Digital Art & Design', description: 'Explore the intersection of technology and creativity in digital illustration, design, and visual media.', level: 'intermediate', isFree: false, sortOrder: 4 },

    // Movie Knowledge (3)
    { topicSlug: 'movie-knowledge', slug: 'cinema-history', title: 'Cinema History', description: 'From silent films to streaming, explore the key moments and movements that shaped the film industry.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'movie-knowledge', slug: 'film-techniques', title: 'Film Techniques', description: 'Understand cinematography, editing, sound design, and the craft behind memorable movie moments.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'movie-knowledge', slug: 'world-cinema', title: 'World Cinema', description: 'Broaden your film horizons with influential cinema from Europe, Asia, Latin America, and Africa.', level: 'advanced', isFree: false, sortOrder: 3 },

    // Biology (3)
    { topicSlug: 'biology', slug: 'the-human-body', title: 'The Human Body', description: 'Discover how your body works, from major organ systems to the cellular processes that keep you alive.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'biology', slug: 'genetics-dna', title: 'Genetics & DNA', description: 'Unravel the code of life and understand how genes shape traits, health, and heredity.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'biology', slug: 'ecology-evolution', title: 'Ecology & Evolution', description: 'Explore how species evolve, interact, and shape the ecosystems that sustain life on Earth.', level: 'advanced', isFree: false, sortOrder: 3 },

    // Physics (4)
    { topicSlug: 'physics', slug: 'laws-of-motion', title: 'Laws of Motion', description: 'Understand Newton\'s laws and the fundamental principles that govern how objects move and interact.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'physics', slug: 'energy-waves', title: 'Energy & Waves', description: 'Explore the physics of energy, light, sound, and the wave phenomena that shape our world.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'physics', slug: 'thermodynamics', title: 'Thermodynamics', description: 'Learn the laws of heat, entropy, and energy transfer that drive everything from engines to stars.', level: 'intermediate', isFree: false, sortOrder: 3 },
    { topicSlug: 'physics', slug: 'modern-physics', title: 'Modern Physics', description: 'Dive into relativity, quantum mechanics, and the cutting-edge theories that redefine our understanding.', level: 'advanced', isFree: false, sortOrder: 4 },

    // Literature (3)
    { topicSlug: 'literature', slug: 'classic-literature', title: 'Classic Literature', description: 'Read and analyze timeless works from Shakespeare to Dostoevsky and discover why they still matter.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'literature', slug: 'storytelling-narrative', title: 'Storytelling & Narrative', description: 'Learn the techniques great writers use to craft compelling stories, characters, and emotional arcs.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'literature', slug: 'poetry-language', title: 'Poetry & Language', description: 'Appreciate the beauty of poetic form, meter, and figurative language across literary traditions.', level: 'advanced', isFree: false, sortOrder: 3 },

    // Math & Logic (3)
    { topicSlug: 'math-logic', slug: 'everyday-math', title: 'Everyday Math', description: 'Build confidence with the practical math skills you use daily, from percentages to mental arithmetic.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'math-logic', slug: 'logic-critical-thinking', title: 'Logic & Critical Thinking', description: 'Strengthen your reasoning skills with formal logic, argument analysis, and common fallacy detection.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'math-logic', slug: 'problem-solving-mastery', title: 'Problem-Solving Mastery', description: 'Tackle complex problems systematically using proven mathematical and logical frameworks.', level: 'advanced', isFree: false, sortOrder: 3 },

    // Dog Training (3)
    { topicSlug: 'dog-training', slug: 'puppy-basics', title: 'Puppy Basics', description: 'Start your puppy off right with foundational training in commands, house rules, and socialization.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'dog-training', slug: 'obedience-socialization', title: 'Obedience & Socialization', description: 'Build reliable obedience and healthy social skills so your dog thrives in any environment.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'dog-training', slug: 'advanced-training', title: 'Advanced Training', description: 'Master advanced commands, off-leash reliability, and behavior modification for challenging situations.', level: 'advanced', isFree: false, sortOrder: 3 },

    // Style (3)
    { topicSlug: 'style', slug: 'style-essentials', title: 'Style Essentials', description: 'Discover your personal style identity and learn the foundational rules of dressing well every day.', level: 'beginner', isFree: true, sortOrder: 1 },
    { topicSlug: 'style', slug: 'dressing-for-occasions', title: 'Dressing for Occasions', description: 'Navigate dress codes with confidence, from business formal to smart casual and everything in between.', level: 'intermediate', isFree: false, sortOrder: 2 },
    { topicSlug: 'style', slug: 'personal-brand-style', title: 'Personal Brand & Style', description: 'Align your wardrobe with your personal brand to communicate authority, creativity, or approachability.', level: 'advanced', isFree: false, sortOrder: 3 },

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

  // ---- Word Hunter ----
  const wordHunterRounds = [
    {
      content: {
        sentence: 'Please revert back to me as soon as possible at your earliest convenience.',
        redundantWords: ['revert back', 'as soon as possible at your earliest convenience'],
        hint: "'Revert' already means 'go back'. And pick one urgency phrase.",
        explanation: "Redundant: 'back' (revert implies going back), and the double urgency is verbose.",
      },
      difficulty: 'easy',
    },
    {
      content: {
        sentence: 'I would like to personally invite you yourself to our upcoming future event.',
        redundantWords: ['personally', 'yourself', 'upcoming future'],
        hint: 'Inviting someone is already personal.',
        explanation: "Inviting someone is already personal. 'Yourself' adds no meaning. 'Upcoming' and 'future' mean the same thing.",
      },
      difficulty: 'easy',
    },
    {
      content: {
        sentence: 'The end result of the final outcome was completely and totally unexpected.',
        redundantWords: ['end result', 'final outcome', 'completely and totally'],
        hint: 'Results are always at the end.',
        explanation: 'Result is always an end. Outcome is always final. Completely and totally are synonyms stacked unnecessarily.',
      },
      difficulty: 'easy',
    },
    {
      content: {
        sentence: 'Please do not hesitate to feel free to reach out and contact me at any time.',
        redundantWords: ['do not hesitate to feel free to', 'reach out and contact'],
        hint: 'Two invitations to act and two ways to get in touch.',
        explanation: "'Don't hesitate' and 'feel free' say the same thing. 'Reach out' and 'contact' are synonymous.",
      },
      difficulty: 'easy',
    },
    {
      content: {
        sentence: 'We need to think about whether or not we should consider this new innovation.',
        redundantWords: ['whether or not', 'new innovation'],
        hint: "'Whether' already covers both sides.",
        explanation: "'Whether' already implies 'or not'. Innovation is always new.",
      },
      difficulty: 'easy',
    },
    {
      content: {
        sentence: 'I am absolutely certain that this is definitely true beyond any doubt.',
        redundantWords: ['absolutely', 'definitely', 'beyond any doubt'],
        hint: 'How many ways can you say you are sure?',
        explanation: 'Three certainty qualifiers pile on unnecessarily. One is enough.',
      },
      difficulty: 'medium',
    },
    {
      content: {
        sentence: 'Please advance forward to the next page and continue on with the exercise.',
        redundantWords: ['advance forward', 'continue on'],
        hint: 'Advancing is already moving forward.',
        explanation: "'Advance' means move forward. 'Continue' means keep going \u2014 'on' adds nothing.",
      },
      difficulty: 'medium',
    },
    {
      content: {
        sentence: 'The general consensus of opinion among most people is that this plan is viable.',
        redundantWords: ['general consensus of opinion', 'among most people'],
        hint: 'Consensus already covers most of these words.',
        explanation: 'Consensus already means general agreement of opinion.',
      },
      difficulty: 'medium',
    },
    {
      content: {
        sentence: 'We will meet together at 2pm to discuss and talk about the current existing problem.',
        redundantWords: ['meet together', 'discuss and talk about', 'current existing'],
        hint: 'Meeting is inherently together.',
        explanation: "Meeting is inherently together. Discuss and talk about overlap. Existing problems are current by definition.",
      },
      difficulty: 'medium',
    },
    {
      content: {
        sentence: 'Please be aware that there will be a small minor delay that may possibly occur.',
        redundantWords: ['small minor', 'may possibly'],
        hint: 'Small and minor say the same thing.',
        explanation: "Small and minor are synonyms. 'May' already implies possibility.",
      },
      difficulty: 'medium',
    },
    {
      content: {
        sentence: 'I have attached herewith the enclosed document for your reference and perusal.',
        redundantWords: ['herewith', 'enclosed', 'reference and perusal'],
        hint: 'How many ways can you say the document is included?',
        explanation: 'Herewith and enclosed both mean included. Reference and perusal overlap.',
      },
      difficulty: 'medium',
    },
    {
      content: {
        sentence: 'The reason why the project failed is because the team lacked sufficient enough resources.',
        redundantWords: ['the reason why...is because', 'sufficient enough'],
        hint: "You don't need both 'reason' and 'because'.",
        explanation: "'The reason is...' not 'the reason is because.' Sufficient already means enough.",
      },
      difficulty: 'hard',
    },
    {
      content: {
        sentence: 'Could you possibly maybe reconsider and think again about your initial first decision?',
        redundantWords: ['possibly maybe', 'reconsider and think again', 'initial first'],
        hint: 'Three pairs of doublings.',
        explanation: 'Three doublings: two hedge words, two reconsider synonyms, two first-ness words.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        sentence: 'We should proactively plan ahead and prepare in advance for the eventuality.',
        redundantWords: ['plan ahead', 'prepare in advance'],
        hint: 'Plans are inherently about the future.',
        explanation: 'Plans are inherently ahead. Preparation is inherently in advance.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        sentence: 'The two alternatives are mutually exclusive and cannot both coexist together at the same time.',
        redundantWords: ['both coexist together', 'at the same time'],
        hint: "'Coexist' already means existing together.",
        explanation: "'Coexist' means exist together at the same time \u2014 all three additions are redundant.",
      },
      difficulty: 'hard',
    },
    {
      content: {
        sentence: 'Let us collaborate together and work jointly in close proximity to finish this project.',
        redundantWords: ['collaborate together', 'work jointly', 'in close proximity'],
        hint: 'Collaborate means work together.',
        explanation: 'Collaborate means work together. Three synonymous phrases stack up unnecessarily.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        sentence: 'I am writing to inform you that I would like to let you know about a change.',
        redundantWords: ['I am writing to inform you that', 'I would like to let you know'],
        hint: 'Two throat-clearing phrases before the point.',
        explanation: 'Two announcement phrases before the actual content.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        sentence: 'Please RSVP back to us before the past deadline that has already elapsed.',
        redundantWords: ['RSVP back', 'past deadline that has already elapsed'],
        hint: "RSVP already means 'respond'.",
        explanation: "RSVP already means 'respond'. Past deadline already implies elapsed.",
      },
      difficulty: 'hard',
    },
    {
      content: {
        sentence: 'The new recruit who was recently hired joined our team staff members last week.',
        redundantWords: ['new recruit who was recently hired', 'team staff members'],
        hint: 'New recruit and recently hired say the same thing.',
        explanation: 'New recruit and recently hired say the same thing. Team and staff are the same group.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        sentence: 'Going forward into the future, we will completely eliminate and remove this process entirely.',
        redundantWords: ['going forward into the future', 'eliminate and remove', 'completely...entirely'],
        hint: 'Forward is into the future; eliminate and remove are the same.',
        explanation: 'Forward is into the future. Eliminate and remove are synonyms. Completely and entirely both mean fully.',
      },
      difficulty: 'hard',
    },
  ];

  const wordHunter = await prisma.wordGame.upsert({
    where: { slug: 'word-hunter' },
    update: { name: 'Word Hunter', description: 'Find and eliminate redundant words and phrases', iconEmoji: '\u{1F3AF}' },
    create: { slug: 'word-hunter', name: 'Word Hunter', description: 'Find and eliminate redundant words and phrases', iconEmoji: '\u{1F3AF}' },
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
        conceptWords: ['psychological safety', 'inclusion', 'consensus', 'vulnerability', 'trust'],
        explanation: 'This message creates psychological safety by explicitly inviting dissent.',
      },
      difficulty: 'easy',
    },
    {
      content: {
        message: "I appreciate you raising this \u2014 let's explore what's behind the hesitation before we move forward.",
        conceptWords: ['curiosity', 'empathy', 'pause', 'discovery', 'openness'],
        explanation: 'Rather than pushing through resistance, this message slows down to understand it.',
      },
      difficulty: 'easy',
    },
    {
      content: {
        message: "Here's what I know, here's what I don't know, and here's what I'm going to find out.",
        conceptWords: ['transparency', 'accountability', 'honesty', 'clarity', 'ownership'],
        explanation: 'Separating known from unknown is a mark of intellectual honesty.',
      },
      difficulty: 'easy',
    },
    {
      content: {
        message: "I'm going to be direct with you because I think you can handle it and because I respect your time.",
        conceptWords: ['directness', 'respect', 'candor', 'trust', 'efficiency'],
        explanation: 'Framing direct feedback as a sign of respect reframes honesty as care.',
      },
      difficulty: 'easy',
    },
    {
      content: {
        message: "Before I respond, help me understand \u2014 what outcome are you hoping for from this conversation?",
        conceptWords: ['intent', 'listening', 'alignment', 'questioning', 'understanding'],
        explanation: 'This question resets the conversation toward shared goals.',
      },
      difficulty: 'easy',
    },
    {
      content: {
        message: "I made the wrong call on that. Here's what I'll do differently.",
        conceptWords: ['accountability', 'learning', 'ownership', 'growth', 'resilience'],
        explanation: 'Admitting error without excuse builds far more trust than deflecting blame.',
      },
      difficulty: 'medium',
    },
    {
      content: {
        message: 'Let me make sure I\'m understanding your concern correctly before I respond.',
        conceptWords: ['active listening', 'reflection', 'empathy', 'validation', 'clarity'],
        explanation: 'This is reflective listening in action.',
      },
      difficulty: 'medium',
    },
    {
      content: {
        message: "I'd rather we debate this hard now than discover the problem after we've committed.",
        conceptWords: ['premortem', 'conflict', 'rigor', 'safety', 'honesty'],
        explanation: 'Inviting upfront debate prevents costly downstream errors.',
      },
      difficulty: 'medium',
    },
    {
      content: {
        message: "You clearly put real thought into this \u2014 here's where I see it differently.",
        conceptWords: ['acknowledgment', 'respect', 'disagreement', 'diplomacy', 'persuasion'],
        explanation: 'Acknowledging effort before disagreeing disarms defensiveness.',
      },
      difficulty: 'medium',
    },
    {
      content: {
        message: 'What would make this a yes for you?',
        conceptWords: ['negotiation', 'curiosity', 'listening', 'empathy', 'problem-solving'],
        explanation: "Instead of defending your position, you explore what the other person needs.",
      },
      difficulty: 'medium',
    },
    {
      content: {
        message: 'I want to name what I\'m seeing so we can address it directly rather than dance around it.',
        conceptWords: ['directness', 'naming', 'courage', 'transparency', 'trust'],
        explanation: 'Naming dynamics directly requires courage and builds trust.',
      },
      difficulty: 'medium',
    },
    {
      content: {
        message: "I notice we keep coming back to this issue \u2014 what if we treated it as the real problem instead of a side note?",
        conceptWords: ['pattern recognition', 'reframing', 'insight', 'questioning', 'focus'],
        explanation: 'Noticing recurring themes and surfacing them shows pattern recognition.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        message: "I'm asking everyone in this room to challenge the assumptions we've been making.",
        conceptWords: ['critical thinking', 'assumptions', 'intellectual humility', 'curiosity', 'rigor'],
        explanation: 'Questioning assumptions is the hallmark of rigorous thinking.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        message: "Here's the decision, here's why, and here's what we need from each of you going forward.",
        conceptWords: ['clarity', 'alignment', 'direction', 'ownership', 'communication'],
        explanation: 'Decision communication with rationale removes ambiguity.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        message: "What would you do if you knew you couldn't fail?",
        conceptWords: ['coaching', 'possibility', 'reframing', 'ambition', 'vision'],
        explanation: 'A classic coaching question that removes fear as a constraint.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        message: "I hear the frustration \u2014 the system made this harder than it needed to be. Let's fix the system.",
        conceptWords: ['empathy', 'systemic thinking', 'accountability', 'problem-solving', 'validation'],
        explanation: 'Acknowledging frustration and redirecting it from blame to systemic improvement.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        message: "We don't have to agree on everything, but we do have to commit to the decision we land on.",
        conceptWords: ['alignment', 'commitment', 'trust', 'accountability', 'unity'],
        explanation: 'This separates alignment from agreement.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        message: 'I wanted to tell you directly rather than have you hear it from someone else.',
        conceptWords: ['respect', 'directness', 'trust', 'transparency', 'honesty'],
        explanation: 'Going direct shows deep respect and builds trust.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        message: "What am I missing in how I'm thinking about this?",
        conceptWords: ['intellectual humility', 'curiosity', 'openness', 'learning', 'self-awareness'],
        explanation: 'Asking what you\'re missing is a powerful display of intellectual humility.',
      },
      difficulty: 'hard',
    },
    {
      content: {
        message: "I'm going to give you the honest version, because the polished version won't actually help you.",
        conceptWords: ['candor', 'care', 'trust', 'directness', 'growth'],
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
// Talk With Charisma (full lesson/slide/quiz content)
// ---------------------------------------------------------------------------
async function seedTalkWithCharisma() {
  console.log('Seeding Talk With Charisma course content...');

  const course = await prisma.course.findUnique({ where: { slug: 'talk-with-charisma' } });
  if (!course) {
    console.warn('  Course "talk-with-charisma" not found. Skipping lesson seeding.');
    return;
  }

  // ---- Lesson 1: The Charisma Foundation ----
  const lesson1 = await upsertLesson(course.id, 'charisma-foundation', 'The Charisma Foundation', 1, 10);

  await upsertSlides(lesson1.id, [
    {
      slideOrder: 1,
      title: 'What Is Charisma?',
      content:
        'Charisma is not a mysterious gift that some people are born with and others are not. Research by Dr. Olivia Fox Cabane and others has shown that charisma is a learnable skill built on three core components: Presence, Power, and Warmth. Presence means being fully engaged in the current moment and making the person in front of you feel like the only person in the room. Power is the perception that you can influence the world around you, communicated through confident body language and calm authority. Warmth is the signal that you care about others and will use your power in their interest. When all three components work together, people perceive you as magnetic, trustworthy, and compelling.',
    },
    {
      slideOrder: 2,
      title: 'The Presence Mistake',
      content:
        'Most people think they are present in conversations, but their minds are actually racing ahead to what they will say next, checking their phone in their pocket, or scanning the room. This lack of presence is the single biggest charisma killer. When you are not fully present, other people can sense it instantly through micro-expressions, delayed reactions, and generic responses. True presence means giving someone your complete, undivided attention. It means making eye contact, pausing before you respond, and genuinely absorbing what the other person is saying. The irony is that presence requires no talent, just intention, yet it is the rarest quality in modern conversation.',
    },
    {
      slideOrder: 3,
      title: 'The Power Signal',
      content:
        'Power in the context of charisma does not mean dominance or aggression. It is the quiet confidence that communicates competence and reliability. You signal power through your physicality: taking up an appropriate amount of space, moving slowly and deliberately rather than fidgeting, and speaking with a measured pace. People who rush their words or shrink their posture are unconsciously telling the room that they do not feel secure. Power is also communicated through stillness. When someone asks you a question, the charismatic response is to pause, consider, and then answer, rather than blurting out the first thing that comes to mind. This calm deliberateness signals that you are in control of yourself and the situation.',
    },
    {
      slideOrder: 4,
      title: 'Warmth Is the Multiplier',
      content:
        'Power without warmth creates fear, not charisma. People may respect a powerful person, but they will not feel drawn to them unless they also sense genuine care. Warmth is the quality that makes others feel safe in your presence. It is communicated through facial expressions, particularly a genuine smile, through vocal tone that is inviting rather than flat, and through the content of your words when you show real curiosity about others. Warmth is the multiplier because it transforms power from intimidating to inspiring. A leader who is both powerful and warm becomes someone people want to follow, not someone they feel forced to obey. The key is that warmth must be authentic. Fake warmth is detected almost instantly and destroys trust.',
    },
    {
      slideOrder: 5,
      title: 'Your Charisma Practice',
      content:
        'Charisma is a muscle that strengthens with deliberate practice. Start with a simple daily exercise: in your next three conversations, focus entirely on being present. Put your phone away, make comfortable eye contact, and pause one full second before responding to anything someone says. Notice how the quality of the interaction changes. Then layer in power by standing or sitting tall, keeping your movements slow and intentional, and lowering the pitch of your voice slightly. Finally, add warmth by asking one genuine follow-up question that shows you were truly listening. Over time, these three practices will become second nature, and others will begin to experience you as naturally charismatic, not because you changed who you are, but because you started showing up fully.',
    },
  ]);

  await upsertQuizQuestions(lesson1.id, course.id, [
    {
      sortOrder: 1,
      question: 'Which three components make up charisma according to Dr. Olivia Fox Cabane?',
      optionA: 'Confidence, humor, and intelligence',
      optionB: 'Presence, power, and warmth',
      optionC: 'Energy, focus, and positivity',
      optionD: 'Appearance, voice, and personality',
      correctAnswer: 'B',
      explanation: 'Dr. Cabane identifies Presence, Power, and Warmth as the three pillars that together create the perception of charisma.',
    },
    {
      sortOrder: 2,
      question: 'What is the biggest charisma killer?',
      optionA: 'Talking too much',
      optionB: 'Being shy',
      optionC: 'Not being present',
      optionD: 'Lacking confidence',
      correctAnswer: 'C',
      explanation: 'Lack of presence is the single biggest charisma killer because people can instantly sense when you are not fully engaged.',
    },
    {
      sortOrder: 3,
      question: "Why is warmth described as 'the multiplier'?",
      optionA: 'It makes you more attractive',
      optionB: 'It makes powerful people more approachable and less intimidating',
      optionC: 'It increases conversation length',
      optionD: 'It compensates for lack of intelligence',
      correctAnswer: 'B',
      explanation: 'Warmth transforms power from intimidating to inspiring, making others feel safe and drawn to follow rather than fear.',
    },
  ]);

  // ---- Lesson 2: First Impressions That Last ----
  const lesson2 = await upsertLesson(course.id, 'first-impressions', 'First Impressions That Last', 2, 10);

  await upsertSlides(lesson2.id, [
    {
      slideOrder: 1,
      title: 'The 7-Second Window',
      content:
        'Research in social psychology consistently shows that people form first impressions in less than seven seconds. In that brief window, others are making snap judgments about your competence, trustworthiness, and likability based on your appearance, posture, facial expression, and energy. These initial impressions are remarkably sticky due to a phenomenon called the primacy effect: the first information we receive about someone carries disproportionate weight in our ongoing perception of them. This means the first few seconds of any encounter are worth more than the next thirty minutes. Understanding this is not about being fake; it is about being intentional with the signals you send in those critical opening moments.',
    },
    {
      slideOrder: 2,
      title: 'The Entry Statement',
      content:
        'How you physically enter a room sets the tone for every interaction that follows. Most people shuffle in distracted, looking at their phone, or scanning for familiar faces with anxious eyes. The charismatic entry is different: pause at the doorway for a beat, stand tall, take a breath, and then walk in with purpose. Your pace should be unhurried but deliberate. Your facial expression should be relaxed and open, with a slight, genuine smile. Make eye contact with people as you move through the space. This is not arrogance. It is the physical expression of someone who is comfortable in their own skin and glad to be there. People notice confident entries, even if they could not articulate what was different about yours.',
    },
    {
      slideOrder: 3,
      title: 'The Handshake & Name Lock',
      content:
        'A handshake is still one of the most powerful first-impression tools in professional and social settings. The ideal handshake is firm but not crushing, with full palm contact and accompanied by eye contact and a genuine smile. But the real secret is what comes next: the Name Lock. When someone tells you their name, repeat it back immediately. Say it out loud in your greeting and then use it once more in the first minute of conversation. This simple technique accomplishes two things: it helps you actually remember the name through the spacing effect, and it makes the other person feel seen and valued. People love hearing their own name, and using it early signals that you are paying attention and that they matter to you.',
    },
    {
      slideOrder: 4,
      title: 'The First Question',
      content:
        'Most first conversations follow a predictable script: "What do you do?" followed by a dry exchange of job titles. This question often puts people on the defensive or triggers a rehearsed elevator pitch. A more charismatic alternative is to ask something like "What is keeping you busy these days?" or "What are you most excited about right now?" These questions invite people to share what they actually care about, rather than just their professional identity. They also signal that you are interested in the person, not just their resume. The quality of your first question determines the quality of the conversation that follows. Ask something that gives the other person permission to be interesting, and they almost always will be.',
    },
    {
      slideOrder: 5,
      title: 'The Halo Effect',
      content:
        'The Halo Effect is a well-documented cognitive bias in which a positive impression in one area influences our perception of someone in completely unrelated areas. When you make a strong first impression, people will unconsciously assume you are also smarter, funnier, more competent, and more trustworthy than someone who made a neutral or negative first impression. This bias works in your favor long after the initial meeting. People will interpret your future words and actions through a positive lens, giving you the benefit of the doubt and remembering your contributions more favorably. This is why first impressions pay such enormous long-term dividends: they do not just shape one moment, they create a filter through which everything else is perceived.',
    },
  ]);

  await upsertQuizQuestions(lesson2.id, course.id, [
    {
      sortOrder: 1,
      question: 'How long does it take to form a first impression?',
      optionA: '30 seconds',
      optionB: '2 minutes',
      optionC: 'Less than 7 seconds',
      optionD: 'One minute',
      correctAnswer: 'C',
      explanation: 'Research shows people form first impressions in less than seven seconds based on visual and behavioral cues.',
    },
    {
      sortOrder: 2,
      question: "What is the recommended alternative to 'What do you do?'",
      optionA: 'Where are you from?',
      optionB: "What's keeping you busy these days?",
      optionC: 'How long have you been here?',
      optionD: 'Do you know many people here?',
      correctAnswer: 'B',
      explanation: 'This question invites people to share what they actually care about rather than just their job title.',
    },
    {
      sortOrder: 3,
      question: 'What psychological phenomenon makes a great first impression pay long-term dividends?',
      optionA: 'Recency effect',
      optionB: 'Confirmation bias',
      optionC: 'Halo effect',
      optionD: 'Social proof',
      correctAnswer: 'C',
      explanation: 'The Halo Effect causes a positive impression in one area to positively influence perception in unrelated areas.',
    },
  ]);

  // ---- Lesson 3: The Art of Active Listening ----
  const lesson3 = await upsertLesson(course.id, 'active-listening', 'The Art of Active Listening', 3, 10);

  await upsertSlides(lesson3.id, [
    {
      slideOrder: 1,
      title: 'Why Listening Is a Superpower',
      content:
        'In a world where everyone is competing to be heard, the person who truly listens holds a rare advantage. Most people think of conversation as a performance, but the real impact comes from reception, not transmission. When you genuinely listen to someone, you make them feel understood, and feeling understood is one of the deepest human needs. People who are skilled listeners are consistently rated as more charismatic, more intelligent, and more likable than those who dominate conversations. The paradox is clear: you become more interesting by being more interested. Listening is not passive. It is an active, demanding skill that requires focus, patience, and genuine curiosity about the person in front of you.',
    },
    {
      slideOrder: 2,
      title: 'The Listen-to-Respond Trap',
      content:
        'Most people do not listen to understand. They listen to respond. While the other person is talking, they are half-present at best, mentally tracking keywords and composing their next statement. You can see this pattern in conversations everywhere: the slight glazing of the eyes, the premature head nodding, the way someone cuts in the moment there is a pause. This is not listening. It is waiting for your turn to talk. The listen-to-respond trap is so common because our brains are wired to prioritize our own perspective. Breaking this habit requires conscious effort. The next time someone is speaking to you, notice where your attention goes. If you catch yourself rehearsing your response, gently bring your focus back to their words, their tone, and the emotion behind what they are saying.',
    },
    {
      slideOrder: 3,
      title: 'Reflective Listening',
      content:
        'Reflective listening is the technique of mirroring back what someone has said to you, either by paraphrasing their words or reflecting the emotion you detected. FBI hostage negotiators use this technique extensively because it is one of the fastest ways to build trust and rapport, even with someone who is hostile. The technique is simple: after someone shares something meaningful, you respond with a brief reflection. For example, "It sounds like that deadline really caught you off guard" or "So what you are saying is that the team needs more clarity before moving forward." This accomplishes three things: it proves you were actually listening, it gives the speaker a chance to correct any misunderstanding, and it makes them feel heard. Feeling heard is often more valuable to people than getting their way.',
    },
    {
      slideOrder: 4,
      title: 'The Follow-Up Question',
      content:
        'The follow-up question is where active listening becomes visible and powerful. Anyone can ask generic questions, but only someone who was truly paying attention can ask a specific follow-up question that references exactly what the speaker just said. For example, if someone tells you about a challenging project launch, a generic response would be "That sounds tough." A powerful follow-up would be "You mentioned the timeline got compressed in the last week \u2014 what drove that decision?" This kind of question sends an unmistakable signal: I was listening to every word you said, and I care enough to dig deeper. Specific follow-up questions are the single most impactful tool in a charismatic listener\'s toolkit because they simultaneously validate the speaker and deepen the conversation.',
    },
    {
      slideOrder: 5,
      title: 'Your Listening Practice',
      content:
        'Here is your active listening challenge for this week. In at least one conversation each day, commit to following these steps. First, put away all distractions. No phone, no glancing at a screen, no multitasking. Second, focus entirely on the other person while they speak. Notice their words, their tone, and their body language. Third, when they finish a thought, pause for two seconds before responding. Use that pause to formulate a response that references something specific they said. Fourth, ask one genuine follow-up question that shows you absorbed the details of their story. Track how these conversations feel different from your usual interactions. Most people who try this exercise are surprised at how much richer and more meaningful their conversations become within just a few days.',
    },
  ]);

  await upsertQuizQuestions(lesson3.id, course.id, [
    {
      sortOrder: 1,
      question: "What does 'listening to respond' mean?",
      optionA: 'Listening to find the best answer',
      optionB: 'Being half-present, mentally tracking keywords to compose your next statement',
      optionC: 'Repeating back what someone said',
      optionD: 'Asking clarifying questions',
      correctAnswer: 'B',
      explanation: 'Listening to respond means you are not truly absorbing what the person says, just waiting for your turn to talk.',
    },
    {
      sortOrder: 2,
      question: 'What technique do FBI negotiators use to build trust?',
      optionA: 'Mirroring body language',
      optionB: 'Agreeing with everything',
      optionC: 'Reflective listening',
      optionD: 'Staying silent',
      correctAnswer: 'C',
      explanation: 'FBI negotiators use reflective listening, mirroring back words and emotions, as one of the fastest ways to build trust.',
    },
    {
      sortOrder: 3,
      question: 'What makes a follow-up question a powerful signal of active listening?',
      optionA: 'It keeps the conversation going',
      optionB: 'It shows you remember things in general',
      optionC: "It references the speaker's exact words and details",
      optionD: 'It demonstrates your own knowledge',
      correctAnswer: 'C',
      explanation: "Specific follow-up questions that reference the speaker's exact words prove you were truly listening and validate the speaker.",
    },
  ]);

  // ---- Lesson 4: Storytelling for Connection ----
  const lesson4 = await upsertLesson(course.id, 'storytelling-connection', 'Storytelling for Connection', 4, 10);

  await upsertSlides(lesson4.id, [
    {
      slideOrder: 1,
      title: 'Stories Are How Humans Connect',
      content:
        'Human brains are wired for narrative. Neuroscience research has shown that when someone tells a compelling story, the brains of the listeners actually synchronize with the storyteller through a process called neural coupling. This means that stories do not just transfer information; they create shared experience. Facts and data engage the analytical parts of the brain, but stories activate the sensory cortex, the motor cortex, and the emotional centers all at once. This is why you can forget a statistic five minutes after hearing it, but a well-told story stays with you for years. In conversation, the person who can tell a good story does not just hold attention. They create connection at a neurological level that no amount of clever argument can match.',
    },
    {
      slideOrder: 2,
      title: 'The 3-Part Story Structure',
      content:
        'Every compelling story, from Hollywood screenplays to the anecdotes you tell at dinner, follows the same fundamental structure: Setup, Conflict, and Resolution. The Setup establishes the context, the characters, and the stakes so your listener understands the world of the story. The Conflict is the engine that drives everything forward. It is the obstacle, the surprise, the tension that makes people lean in and wonder what happens next. Without conflict, there is no story, just a sequence of events. The Resolution is the payoff where the conflict is addressed and the lesson or insight emerges. Most people in everyday conversation skip the setup and rush past the conflict to get to the resolution. Resist this urge. The power of a story lives in the tension, so let your listener sit in the conflict before you resolve it.',
    },
    {
      slideOrder: 3,
      title: 'Specificity Is Everything',
      content:
        'The difference between a forgettable anecdote and a vivid, memorable story is almost always specificity. Vague stories say things like "I was at a restaurant and something funny happened." Vivid stories say things like "I was sitting at a tiny corner table at this Italian place in the East Village, the kind where your elbows touch the couple next to you." Specific details trigger the sensory parts of the brain. They make your listener see, hear, and feel the scene. You do not need many details, just a few carefully chosen ones that paint a picture. Names, places, colors, textures, sounds, the exact words someone said. These details do not just make the story more interesting. They make it more believable and more emotionally resonant because they signal that this actually happened, that it mattered enough for you to remember the specifics.',
    },
    {
      slideOrder: 4,
      title: 'The Vulnerability Move',
      content:
        'Counter-intuitively, the stories that connect people most powerfully are not stories of triumph and success. They are stories of failure, embarrassment, and struggle. When you share a moment where you were wrong, scared, or humbled, you give the other person permission to be human too. This is the vulnerability move, and it is one of the most potent connection tools available. Vulnerability-based stories work because they signal trust. By sharing something that could make you look bad, you are implicitly saying "I trust you enough to show you my real self." Research consistently shows that people who display appropriate vulnerability are rated as more likable, more authentic, and more charismatic than those who present a polished, perfect image. The key word is appropriate. The vulnerability should be relevant to the moment and shared with genuine intent, not as a performance or a manipulation.',
    },
    {
      slideOrder: 5,
      title: 'The One-Sentence Story Pitch',
      content:
        'Great storytellers know how to hook their audience before the story even begins. The one-sentence story pitch is a single line that creates curiosity and makes people want to hear more. It works by establishing a gap between what the listener knows and what they want to know. For example, instead of launching into a long story, you might say "So I ended up in a meeting with the CEO wearing two different shoes, and it turned out to be the best thing that ever happened to me." That single sentence creates a question in the listener\'s mind that demands an answer. Practice crafting these hooks for your best stories. Think about what element of the story is most surprising or intriguing, and lead with that. A strong opening line is like a promise: it tells your listener that what follows will be worth their attention, and it gives them a reason to lean in rather than check out.',
    },
  ]);

  await upsertQuizQuestions(lesson4.id, course.id, [
    {
      sortOrder: 1,
      question: 'What is the engine of any compelling story?',
      optionA: 'A happy ending',
      optionB: 'Conflict or tension',
      optionC: 'Impressive achievements',
      optionD: 'Detailed background information',
      correctAnswer: 'B',
      explanation: 'Conflict is the engine that drives a story forward and makes people lean in to find out what happens next.',
    },
    {
      sortOrder: 2,
      question: 'Why does specificity make stories more powerful?',
      optionA: 'It makes the story more credible',
      optionB: 'It fills time effectively',
      optionC: 'It triggers sensory memory and makes listeners see and feel the scene',
      optionD: 'It shows you have a clear memory',
      correctAnswer: 'C',
      explanation: 'Specific details activate the sensory parts of the brain, making the story vivid and emotionally resonant.',
    },
    {
      sortOrder: 3,
      question: 'Why do vulnerability-based stories connect better?',
      optionA: 'They are more relatable in general',
      optionB: 'They signal trust and create authentic connection',
      optionC: 'They are more entertaining',
      optionD: 'They are easier to remember',
      correctAnswer: 'B',
      explanation: 'Sharing vulnerability signals trust and gives others permission to be authentic, creating deeper connection.',
    },
  ]);

  // ---- Lesson 5: Body Language Mastery ----
  const lesson5 = await upsertLesson(course.id, 'body-language-mastery', 'Body Language Mastery', 5, 10);

  await upsertSlides(lesson5.id, [
    {
      slideOrder: 1,
      title: 'Your Body Is Always Talking',
      content:
        'Whether you realize it or not, your body is constantly broadcasting information about your internal state. Before you speak a single word, your posture, gestures, facial expressions, and movement have already told the room a story about your confidence, mood, and intentions. Research suggests that non-verbal signals account for a significant portion of how people interpret your communication, often carrying more weight than the words themselves. This is because body language is harder to fake than speech, so people instinctively trust physical signals over verbal ones when the two conflict. If you say "I am excited about this project" while slouching with crossed arms and avoiding eye contact, people will believe your body, not your words. Mastering body language means ensuring that your physical signals amplify rather than undermine your message.',
    },
    {
      slideOrder: 2,
      title: 'The Power Posture',
      content:
        'Social psychologist Amy Cuddy popularized the concept of power posing, the idea that expanding your body into open, space-claiming postures can influence both how others perceive you and how you feel internally. High-power body language is characterized by expansion: shoulders back, chest open, feet planted, and arms uncrossed. Low-power body language does the opposite: shoulders hunched, arms wrapped around yourself, legs crossed tightly, taking up as little space as possible. Regardless of the debate about hormonal effects, the observable truth is that people who take up more space are consistently perceived as more confident and authoritative. Practice standing and sitting in open, expanded positions. Notice how it changes the way people respond to you and how it affects your own internal sense of confidence.',
    },
    {
      slideOrder: 3,
      title: 'Eye Contact That Connects',
      content:
        'Eye contact is one of the most powerful non-verbal tools available to you, but it must be calibrated correctly. Too little eye contact signals discomfort, dishonesty, or disinterest. Too much can feel aggressive or unsettling. The sweet spot for comfortable, connecting eye contact is around sixty to seventy percent of the time during a conversation. This means holding eye contact while the other person is speaking, breaking naturally when you are thinking or gathering your thoughts, and re-establishing it when you make an important point. The quality of your eye contact matters as much as the quantity. Soft, engaged eyes communicate warmth and interest. Hard, unblinking eyes communicate intensity or threat. Practice making eye contact that feels like attention rather than surveillance, and you will notice conversations becoming warmer and more connected.',
    },
    {
      slideOrder: 4,
      title: 'The Mirroring Effect',
      content:
        'Mirroring is the unconscious tendency to copy the posture, gestures, and expressions of the person you are interacting with. It happens naturally when two people are in rapport, and it is one of the strongest signals of social connection. When you deliberately and subtly mirror someone, matching their posture, leaning when they lean, adopting a similar energy level, you accelerate the rapport-building process. The key word is subtle. Obvious mimicry feels mocking, but gentle, delayed mirroring feels natural and builds trust at a subconscious level. You can also use mirroring diagnostically: if you shift your posture and the other person mirrors you back within a few seconds, it is a strong signal that you have established rapport. Mirroring works because of a deep neurological mechanism. Our mirror neurons fire both when we perform an action and when we observe someone else performing it, creating a shared experience.',
    },
    {
      slideOrder: 5,
      title: 'Moving With Intention',
      content:
        'The speed and quality of your movement communicate volumes about your internal state. Rapid, jerky, or fidgety movement signals anxiety, impatience, or low status. Slow, deliberate, purposeful movement signals confidence, calm, and authority. Watch any leader, actor, or public figure who commands a room, and you will notice they move with intention. They do not rush. They do not fidget. Every gesture has a purpose, and every step is placed deliberately. This does not mean moving in slow motion. It means eliminating unnecessary movement, the hair touching, the weight shifting, the pen clicking, and replacing it with stillness. When you do move, move with purpose. Turn your whole body to face someone instead of just turning your head. Gesture to emphasize a point and then let your hands return to rest. Walk at a pace that says you are in no rush because you know exactly where you are going.',
    },
  ]);

  await upsertQuizQuestions(lesson5.id, course.id, [
    {
      sortOrder: 1,
      question: 'What does high-power body language physically do?',
      optionA: 'Makes you physically smaller',
      optionB: 'Contracts your posture inward',
      optionC: 'Expands your posture, taking up more space',
      optionD: 'Primarily slows your breathing',
      correctAnswer: 'C',
      explanation: 'High-power body language is characterized by expansion: open posture, shoulders back, and taking up more space.',
    },
    {
      sortOrder: 2,
      question: 'What is the ideal percentage of eye contact during conversation?',
      optionA: '30-40%',
      optionB: '100%',
      optionC: '60-70%',
      optionD: '50%',
      correctAnswer: 'C',
      explanation: 'Around 60-70% eye contact is the sweet spot, enough to signal engagement without feeling aggressive.',
    },
    {
      sortOrder: 3,
      question: 'What does deliberate mirroring accomplish in conversation?',
      optionA: 'It confuses the other person',
      optionB: 'It makes you appear to be in agreement',
      optionC: 'It increases connection and rapport at a subconscious level',
      optionD: 'It primarily signals that you are paying attention',
      correctAnswer: 'C',
      explanation: 'Subtle mirroring activates mirror neurons and accelerates rapport-building, creating a sense of shared experience.',
    },
  ]);

  console.log('  Seeded 5 lessons, 25 slides, and 15 quiz questions for Talk With Charisma.');
}

// ---------------------------------------------------------------------------
// Helper: upsert a lesson
// ---------------------------------------------------------------------------
async function upsertLesson(courseId: string, slug: string, title: string, sortOrder: number, estimatedMinutes: number) {
  // Lesson doesn't have a unique slug constraint globally, so find by courseId + slug combo
  const existing = await prisma.lesson.findFirst({
    where: { courseId, slug },
  });

  if (existing) {
    return prisma.lesson.update({
      where: { id: existing.id },
      data: { title, sortOrder, estimatedMinutes },
    });
  }

  return prisma.lesson.create({
    data: { courseId, slug, title, sortOrder, estimatedMinutes },
  });
}

// ---------------------------------------------------------------------------
// Helper: upsert slides for a lesson
// ---------------------------------------------------------------------------
async function upsertSlides(lessonId: string, slides: { slideOrder: number; title: string; content: string }[]) {
  // Delete existing slides and re-create to ensure idempotency
  await prisma.slide.deleteMany({ where: { lessonId } });

  for (const slide of slides) {
    await prisma.slide.create({
      data: {
        lessonId,
        slideOrder: slide.slideOrder,
        slideType: 'lesson',
        title: slide.title,
        content: slide.content,
      },
    });
  }
}

// ---------------------------------------------------------------------------
// Helper: upsert quiz questions for a lesson
// ---------------------------------------------------------------------------
async function upsertQuizQuestions(
  lessonId: string,
  courseId: string,
  questions: {
    sortOrder: number;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: string;
    explanation: string;
  }[],
) {
  // Delete existing quiz questions for this lesson and re-create
  await prisma.quizQuestion.deleteMany({ where: { lessonId } });

  for (const q of questions) {
    await prisma.quizQuestion.create({
      data: {
        lessonId,
        courseId,
        type: 'multiple_choice',
        question: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        sortOrder: q.sortOrder,
      },
    });
  }
}

// ---------------------------------------------------------------------------
// Daily Challenges
// ---------------------------------------------------------------------------
async function seedDailyChallenges() {
  console.log('Seeding daily challenges...');

  // Fetch first 30 quiz questions to use as daily challenges
  const questions = await prisma.quizQuestion.findMany({
    take: 30,
    orderBy: { sortOrder: 'asc' },
    select: { id: true },
  });

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
  await seedTalkWithCharisma();
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
