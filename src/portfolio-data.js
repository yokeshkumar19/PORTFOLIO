/**
 * PORTFOLIO DATA CONFIGURATION
 * Personal Portfolio for YK. — Designer & Developer
 */

export const portfolioData = {
  profile: {
    brandName: "YK",
    dot: ".",
    fullName: "YOKESHKUMAR N",
    photo: "/assets/yokeshkumar-profile.jpg",
    education: "Undergraduate Engineering Student",
    college: "Rajalakshmi Institute of Technology",
    title: "Yokeshkumar N — Designer & Developer",
    heroLabel: "DESIGNER / DEVELOPER / STUDENT",
    heroHeadingLines: [
      "BUILDING",
      "DIGITAL THINGS",
      "THAT MATTER."
    ],
    heroSupportingText: "I design and build digital experiences that solve real problems — from useful student tools to AI-powered ideas.",
    heroPrimaryCta: "EXPLORE MY WORK ↘",
    heroSecondaryCta: "MORE ABOUT ME ↗",
    email: "yokeshkumar192007@gmail.com",
    campusEmail: "yokeshkumar.250408@aids.ritchennai.edu.in",
    github: "https://github.com/yokeshkumar19",
    linkedin: "https://www.linkedin.com/in/yokesh-kumar-9597b0394/",
    aboutHeadline: "CURIOUS BY NATURE. BUILDER BY CHOICE.",
    aboutBio: "I'm Yokeshkumar N, an undergraduate engineering student at Rajalakshmi Institute of Technology passionate about software development, UI/UX design, and AI applications.",
    aboutSubBio: "Whether building real-time tracking tools for my campus or designing experimental AI study workflows, I care deeply about solving real human friction with speed, clarity, and aesthetic intent.",
    careerObjective: "To develop innovative and user-friendly software solutions, enhance my technical skills, and build technology that solves real-world problems.",
    interests: [
      "Software Development",
      "UI/UX Design",
      "Artificial Intelligence",
      "App Development"
    ],
    technicalInterests: [
      "React",
      "TypeScript",
      "Firebase",
      "AI Integration",
      "Figma"
    ]
  },

  projects: [
    {
      id: "rit-bustrack",
      number: "01",
      name: "RIT BusTrack",
      status: "BUILT & WORKING",
      statusType: "live", // Green beacon
      category: "PRODUCT DESIGN / DEVELOPMENT",
      description: "A college bus-tracking application designed to help students follow bus routes and access live journey information.",
      coverImage: "/assets/rit_bustrack.svg",
      hoverImage: "/assets/rit_bustrack.svg",
      role: "Mobile App Architecture & Frontend Development",
      timeline: "College Campus Transit",
      challenge: "Students on campus frequently missed college buses or waited unnecessarily at stops due to uncertain schedules and zero live visibility on bus transit locations without depending on manual phone calls.",
      solution: "Engineered a dedicated Android application bringing live bus tracking, route progressions, stop catalogs, driver trip consoles, and student pickup requests into a unified, reliable mobile experience.",
      techStack: ["React", "TypeScript", "Firebase Firestore", "Firebase Auth", "Capacitor", "Android"],
      deliverables: ["Live GPS Map Tracking", "Driver Trip Activation", "Student Commuter Feed", "Institutional Email Auth"],
      liveUrl: "/rit-bustrack.html",
      apkUrl: "https://drive.google.com/file/d/1ktA_iCK7zsgUa-DeUGg_S3tz9vdBIFUm/view?usp=drivesdk"
    },
    {
      id: "plantcare-ai",
      number: "02",
      name: "PlantCare AI",
      status: "BUILT · AI TESTING IN PROGRESS",
      statusType: "testing", // Amber beacon
      category: "AI PRODUCT / MOBILE APP",
      description: "PlantCare AI is an application designed to help users understand plant-care needs and access AI-assisted guidance. The application integrates the Groq API to provide AI-powered responses. AI testing and validation remain in progress due to API usage limits.",
      coverImage: "/assets/plantcare_ai.svg",
      hoverImage: "/assets/plantcare_ai.svg",
      role: "Frontend Engineer & Product Designer",
      timeline: "Built · AI Testing in Progress",
      challenge: "Houseplant owners and home gardeners frequently misdiagnose early signs of leaf degradation, chlorosis, and fungal infections, leading to premature plant death without accessible botanical guidance.",
      solution: "Built a cross-platform mobile application combining leaf photo capture with cloud-accelerated Groq vision inference (Qwen 3.8-27B) to deliver structured condition assessments, confidence ratings, and actionable treatment steps.",
      techStack: ["React 19", "TypeScript", "Groq API", "Qwen 3.8-27B", "FastAPI", "Capacitor"],
      deliverables: ["Groq Vision Leaf Diagnosis", "Categorized Horticultural Guides", "FastAPI Microservice", "Filterable Scan History"],
      liveUrl: "/plantcare-ai.html",
      apkUrl: "https://drive.google.com/file/d/1Sqq17KnPD7ZMvYl0dKIWxv4k4rCMscyQ/view?usp=drivesdk"
    },
    {
      id: "notes-to-quiz-ai",
      number: "03",
      name: "Notes-to-Quiz AI",
      status: "IN PROGRESS",
      statusType: "progress", // Purple/violet beacon
      category: "AI PRODUCT / EDUCATION",
      description: "An AI-powered study tool exploring how notes and syllabus topics can become important questions and practice quizzes.",
      coverImage: "/assets/notes_to_quiz.svg",
      hoverImage: "/assets/notes_to_quiz.svg",
      role: "Full-Stack AI Engineering & UX",
      timeline: "Active Development",
      challenge: "Reviewing dense lecture PDFs and college syllabi before exams is tedious. Students lack an effortless way to test their retention against specific curriculum benchmarks.",
      solution: "Developing an intelligent study companion that parses lecture slides and syllabus objectives into targeted conceptual questions, multiple-choice quizzes, and instant AI rationale.",
      techStack: ["Next.js / React", "LLM APIs", "LangChain", "Tailwind CSS", "PDF Parser"],
      deliverables: ["Syllabus Extractor Pipeline", "Dynamic Quiz Generator", "Instant AI Explanations", "Adaptive Revision Tracking"],
      liveUrl: "#"
    }
  ],

  process: [
    {
      step: "01",
      title: "Discover",
      summary: "Observing real student friction and gathering authentic user requirements before touching any code."
    },
    {
      step: "02",
      title: "Design",
      summary: "Wireframing tactile, accessible interfaces with clear information hierarchies and editorial typography."
    },
    {
      step: "03",
      title: "Build",
      summary: "Writing clean, semantic frontend code with responsive layouts, fluid scaling, and smooth motion."
    },
    {
      step: "04",
      title: "Refine",
      summary: "Testing with actual peers, refining micro-interactions, and optimizing performance across every device."
    }
  ],

  contact: {
    headline: "HAVE AN IDEA?",
    supportingText: "Let's make something useful.",
    email: "yokeshkumar192007@gmail.com",
    campusEmail: "yokeshkumar.250408@aids.ritchennai.edu.in",
    github: "https://github.com/yokeshkumar19",
    linkedin: "https://www.linkedin.com/in/yokesh-kumar-9597b0394/"
  }
};
