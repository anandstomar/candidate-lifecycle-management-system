// Role-specific prompts for MCQ generation
export const rolePrompts = {
  'full-stack developer': {
    description: 'Full-stack development covering both frontend and backend technologies',
    topics: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'SQL', 'REST APIs', 'Git', 'Deployment', 'System Design'],
    prompt: `Generate multiple choice questions for a Full-Stack Developer position with difficulty level.
    
    Focus on topics like:
    - Frontend: JavaScript, React, HTML/CSS, State Management
    - Backend: Node.js, Express, Database design, API development
    - DevOps: Git, Deployment, Basic server management
    - System Design: Architecture patterns, Scalability, Performance
    
    For each question, provide:
    1. A clear and relevant question
    2. 4 options (A, B, C, D)
    3. The correct answer (0, 2, 3, or 4 corresponding to A, B, C, D)
    4. A brief explanation of why the answer is correct
    5. A category (e.g., "JavaScript", "React", "Node.js", "Database", "System Design", etc.)
    
    Format the response as a JSON array.`
  },
  
  'frontend developer': {
    description: 'Frontend development focusing on user interface and user experience',
    topics: ['JavaScript', 'React', 'Vue', 'Angular', 'HTML', 'CSS', 'TypeScript', 'State Management', 'Web Performance', 'Accessibility'],
    prompt: `Generate multiple choice questions for a Frontend Developer position with difficulty level.
    
    Focus on topics like:
    - JavaScript fundamentals and ES6+ features
    - React/Vue/Angular frameworks and concepts
    - HTML5, CSS3, and responsive design
    - State management (Redux, Context API, etc.)
    - Web performance optimization
    - Accessibility (a11y) standards
    - Modern build tools and bundlers
    
    For each question, provide:
    1. A clear and relevant question
    2. 4 options (A, B, C, D)
    3. The correct answer (0, 1, 2, or 3 corresponding to A, B, C, D)
    4. A brief explanation of why the answer is correct
    5. A category (e.g., "JavaScript", "React", "CSS", "Performance", "Accessibility", etc.)
    
    Format the response as a JSON array.`
  },
  
  'backend developer': {
    description: 'Backend development focusing on server-side logic and database management',
    topics: ['Node.js', 'Express', 'Python', 'Java', 'C#', 'Databases', 'APIs', 'Authentication', 'Security', 'Performance'],
    prompt: `Generate multiple choice questions for a Backend Developer position with difficulty level.
    
    Focus on topics like:
    - Server-side programming (Node.js, Python, Java, etc.)
    - Database design and optimization (SQL, NoSQL)
    - API design and RESTful principles
    - Authentication and authorization
    - Security best practices
    - Performance optimization and caching
    - Microservices architecture
    - Testing and debugging
    
    For each question, provide:
    1. A clear and relevant question
    2. 4 options (A, B, C, D)
    3. The correct answer (0, 1, 2, or 3 corresponding to A, B, C, D)
    4. A brief explanation of why the answer is correct
    5. A category (e.g., "Node.js", "Database", "API Design", "Security", "Performance", etc.)
    
    Format the response as a JSON array.`
  },
  
  'devops engineer': {
    description: 'DevOps engineering focusing on deployment, automation, and infrastructure',
    topics: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Networking', 'Monitoring', 'Infrastructure as Code', 'Security'],
    prompt: `Generate multiple choice questions for a DevOps Engineer position with difficulty level.
    
    Focus on topics like:
    - Containerization (Docker, Kubernetes)
    - Cloud platforms (AWS, Azure, GCP)
    - CI/CD pipelines and automation
    - Infrastructure as Code (Terraform, CloudFormation)
    - Linux system administration
    - Networking and security
    - Monitoring and logging
    - Performance optimization
    
    For each question, provide:
    1. A clear and relevant question
    2. 4 options (A, B, C, D)
    3. The correct answer (0, 1, 2, or 3 corresponding to A, B, C, D)
    4. A brief explanation of why the answer is correct
    5. A category (e.g., "Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Networking", etc.)
    
    Format the response as a JSON array.`
  },
  
  'data scientist': {
    description: 'Data science focusing on analytics, machine learning, and statistical modeling',
    topics: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization', 'Big Data', 'Deep Learning', 'NLP'],
    prompt: `Generate multiple choice questions for a Data Scientist position with difficulty level.
    
    Focus on topics like:
    - Python programming for data science
    - Statistical analysis and hypothesis testing
    - Machine learning algorithms and concepts
    - Data preprocessing and feature engineering
    - Data visualization and storytelling
    - SQL and database querying
    - Big data technologies (Spark, Hadoop)
    - Deep learning and neural networks
    
    For each question, provide:
    1. A clear and relevant question
    2. 4 options (A, B, C, D)
    3. The correct answer (0, 1, 2, or 3 corresponding to A, B, C, D)
    4. A brief explanation of why the answer is correct
    5. A category (e.g., "Python", "Statistics", "Machine Learning", "SQL", "Data Visualization", etc.)
    
    Format the response as a JSON array.`
  },
  
  'mobile developer': {
    description: 'Mobile app development for iOS and Android platforms',
    topics: ['React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin', 'Mobile UI/UX', 'App Store', 'Performance'],
    prompt: `Generate multiple choice questions for a Mobile Developer position with difficulty level.
    
    Focus on topics like:
    - Cross-platform development (React Native, Flutter)
    - Native development (iOS/Swift, Android/Kotlin)
    - Mobile UI/UX design principles
    - App performance optimization
    - App store deployment and guidelines
    - Mobile security and data handling
    - Push notifications and background tasks
    - Testing and debugging mobile apps
    
    For each question, provide:
    1. A clear and relevant question
    2. 4 options (A, B, C, D)
    3. The correct answer (0, 1, 2, or 3 corresponding to A, B, C, D)
    4. A brief explanation of why the answer is correct
    5. A category (e.g., "React Native", "Flutter", "iOS", "Android", "Mobile UI", "Performance", etc.)
    
    Format the response as a JSON array.`
  }
};

// Supported difficulty levels with descriptions
export const difficultyLevels = {
  'beginner': {
    description: 'Basic concepts and fundamentals',
    examples: 'Simple syntax, basic concepts, introductory topics'
  },
  'easy': {
    description: 'Basic to intermediate concepts',
    examples: 'Common patterns, basic implementations'
  },
  'moderate': {
    description: 'Intermediate level concepts',
    examples: 'Practical scenarios, common use cases'
  },
  'intermediate': {
    description: 'Intermediate to advanced concepts',
    examples: 'Complex scenarios, optimization, best practices'
  },
  'hard': {
    description: 'Advanced concepts and complex scenarios',
    examples: 'Advanced patterns, performance optimization, edge cases'
  },
  'advanced': {
    description: 'Expert-level concepts',
    examples: 'System design, architecture, complex algorithms'
  },
  'expert': {
    description: 'Expert-level and specialized topics',
    examples: 'Advanced system design, complex architectures, specialized knowledge'
  }
};

export const getRolePrompt = (role, count = 5, difficulty = 'intermediate') => {
  const roleConfig = rolePrompts[role.toLowerCase()];
  const difficultyConfig = difficultyLevels[difficulty.toLowerCase()] || difficultyLevels['intermediate'];
  
  if (!roleConfig) {
    // Default prompt for unknown roles
    return `Generate ${count} multiple choice questions for a ${role} position with ${difficulty} difficulty level.
    
    Difficulty Level: ${difficultyConfig.description}
    Focus on: ${difficultyConfig.examples}
    
    IMPORTANT: You must respond with ONLY a valid JSON array. No other text.
    
    For each question, provide:
    1. A clear and relevant question
    2. 4 options (A, B, C, D)
    3. The correct answer as a NUMBER (0, 1, 2, or 3 corresponding to A, B, C, D)
    4. A brief explanation of why the answer is correct
    5. A category relevant to ${role} responsibilities
    
    Example format:
    [
      {
        "question": "What is the purpose of useEffect in React?",
        "options": [
          "To handle form submissions",
          "To perform side effects in functional components",
          "To create new components",
          "To style components"
        ],
        "correctOption": 1,
        "explanation": "useEffect is a React Hook that lets you perform side effects in functional components.",
        "category": "React"
      }
    ]
    
    Respond with ONLY the JSON array, no other text.`;
  }
  
  const basePrompt = roleConfig.prompt.replace('multiple choice questions', `${count} multiple choice questions`).replace('difficulty level', `${difficulty} difficulty level`);
  
  return `${basePrompt}

Difficulty Level: ${difficultyConfig.description}
Focus on: ${difficultyConfig.examples}

IMPORTANT: You must respond with ONLY a valid JSON array. No other text.

Example format:
[
  {
    "question": "What is the purpose of useEffect in React?",
    "options": [
      "To handle form submissions",
      "To perform side effects in functional components", 
      "To create new components",
      "To style components"
    ],
    "correctOption": 1,
    "explanation": "useEffect is a React Hook that lets you perform side effects in functional components.",
    "category": "React"
  }
]

Respond with ONLY the JSON array, no other text.`;
};

export const getAvailableRoles = () => {
  return Object.keys(rolePrompts).map(role => ({
    role,
    description: rolePrompts[role].description,
    topics: rolePrompts[role].topics
  }));
};

export const getAvailableDifficulties = () => {
  return Object.keys(difficultyLevels).map(difficulty => ({
    difficulty,
    description: difficultyLevels[difficulty].description,
    examples: difficultyLevels[difficulty].examples
  }));
}; 