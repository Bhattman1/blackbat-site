/* eslint-disable no-unused-vars */
(function (global) {
  var STORAGE_KEY = "blackbatCareerResult";
  var ANSWERS_KEY = "blackbatCareerAnswers";

  var careerPaths = {
    "soc-analyst": {
      id: "soc-analyst",
      title: "SOC Analyst / Blue Team",
      description:
        "Protect systems, monitor threats, and investigate suspicious activity across an organisation.",
      tags: ["Defend", "Monitor", "Investigate", "Respond"],
      icon: "shield-check",
      visual: "shield-laptop",
      specializationTitle: "SOC & Blue Team Practice",
      steps: [
        {
          num: "01",
          title: "Learn Networking",
          description: "Understand how systems communicate and where attacks show up.",
          icon: "network",
        },
        {
          num: "02",
          title: "Get comfortable with Linux",
          description: "Build command-line confidence for log review and triage.",
          icon: "terminal",
        },
        {
          num: "03",
          title: "Explore security tools",
          description: "Learn SIEM, monitoring, and analysis basics.",
          icon: "shield",
        },
      ],
    },
    pentester: {
      id: "pentester",
      title: "Penetration Tester",
      description:
        "Find weaknesses before attackers do: ethical hacking, reporting, and remediation guidance.",
      tags: ["Test", "Exploit", "Report", "Improve"],
      icon: "bug",
      visual: "bug-target",
      specializationTitle: "Offensive Security & Labs",
      steps: [
        {
          num: "01",
          title: "Networking & web basics",
          description: "Learn how apps and networks are exposed on the internet.",
          icon: "globe",
        },
        {
          num: "02",
          title: "Linux & scripting",
          description: "Automate recon and get comfortable in a pentest environment.",
          icon: "terminal",
        },
        {
          num: "03",
          title: "Try guided labs",
          description: "Practice on legal platforms with walkthroughs and write-ups.",
          icon: "target",
        },
      ],
    },
    forensics: {
      id: "forensics",
      title: "Digital Forensics / IR",
      description:
        "Reconstruct incidents, preserve evidence, and help teams recover from breaches.",
      tags: ["Investigate", "Evidence", "Timeline", "Recover"],
      icon: "file-search",
      visual: "search-doc",
      specializationTitle: "Forensics & Incident Response",
      steps: [
        {
          num: "01",
          title: "Security fundamentals",
          description: "Understand attacks, logs, and common incident patterns.",
          icon: "shield",
        },
        {
          num: "02",
          title: "Operating system basics",
          description: "Know where artifacts live on Windows and Linux.",
          icon: "terminal",
        },
        {
          num: "03",
          title: "Intro to forensics tools",
          description: "Practice disk, memory, and log analysis workflows.",
          icon: "search",
        },
      ],
    },
    "cloud-security": {
      id: "cloud-security",
      title: "Cloud Security",
      description:
        "Secure cloud workloads, identities, and data across modern infrastructure.",
      tags: ["Cloud", "Identity", "Config", "Compliance"],
      icon: "cloud",
      visual: "cloud-lock",
      specializationTitle: "Cloud & Identity Security",
      steps: [
        {
          num: "01",
          title: "Networking foundations",
          description: "VPCs, DNS, and how traffic flows in the cloud.",
          icon: "network",
        },
        {
          num: "02",
          title: "Cloud fundamentals",
          description: "Core services, shared responsibility, and IAM basics.",
          icon: "cloud",
        },
        {
          num: "03",
          title: "Hardening & monitoring",
          description: "Learn logging, alerts, and secure configuration patterns.",
          icon: "lock",
        },
      ],
    },
    "security-engineer": {
      id: "security-engineer",
      title: "Security Engineer",
      description:
        "Design and build secure systems: tooling, automation, and defensive architecture.",
      tags: ["Build", "Automate", "Architect", "Scale"],
      icon: "database",
      visual: "code-shield",
      specializationTitle: "Security Engineering Projects",
      steps: [
        {
          num: "01",
          title: "Strong IT fundamentals",
          description: "Networking, Linux, and how production systems are run.",
          icon: "network",
        },
        {
          num: "02",
          title: "Learn to code",
          description: "Scripting for automation and security tooling.",
          icon: "code",
        },
        {
          num: "03",
          title: "Build small projects",
          description: "Parsers, dashboards, or hardening scripts you can show.",
          icon: "code",
        },
      ],
    },
    grc: {
      id: "grc",
      title: "GRC / Security Governance",
      description:
        "Align security with business risk: policies, audits, frameworks, and compliance.",
      tags: ["Policy", "Risk", "Audit", "Frameworks"],
      icon: "file-shield",
      visual: "doc-shield",
      specializationTitle: "GRC & Frameworks",
      steps: [
        {
          num: "01",
          title: "Security fundamentals",
          description: "Learn core concepts teams expect you to speak about.",
          icon: "shield",
        },
        {
          num: "02",
          title: "Frameworks overview",
          description: "Explore NIST, ISO, and common compliance language.",
          icon: "book-open",
        },
        {
          num: "03",
          title: "Risk & documentation",
          description: "Practice writing controls, risks, and simple policies.",
          icon: "file-text",
        },
      ],
    },
  };

  var quizQuestions = [
    {
      id: "experience",
      question: "What's your current level?",
      description:
        "No worries. There's no right or wrong answer. This helps us tailor the best path for you.",
      options: [
        {
          value: "beginner",
          title: "Complete beginner",
          description: "I'm new to cybersecurity and not sure where to start.",
          icon: "sprout",
          scores: { "soc-analyst": 1, grc: 1 },
        },
        {
          value: "some-it",
          title: "Some IT knowledge",
          description:
            "I have basic IT knowledge such as networking, Linux, or programming.",
          icon: "laptop",
          scores: {
            "security-engineer": 2,
            "cloud-security": 2,
            "soc-analyst": 1,
          },
        },
        {
          value: "learning",
          title: "Already learning",
          description:
            "I'm already studying cybersecurity or working on related projects.",
          icon: "book-open",
          scores: {
            pentester: 2,
            forensics: 2,
            "soc-analyst": 2,
          },
        },
        {
          value: "working",
          title: "Working in IT / Cyber",
          description:
            "I'm in the industry and looking to advance my career.",
          icon: "briefcase",
          scores: {
            "security-engineer": 2,
            grc: 2,
            "cloud-security": 1,
            pentester: 1,
          },
        },
      ],
    },
    {
      id: "interest",
      question: "What type of work sounds most interesting?",
      description: "Pick what you'd enjoy doing day to day. We'll map it to a path.",
      options: [
        {
          value: "blue-team",
          title: "Blue Team / SOC",
          description: "Monitoring, detection, and defending live environments.",
          icon: "shield-check",
          scores: { "soc-analyst": 4 },
        },
        {
          value: "red-team",
          title: "Red Team / Pentesting",
          description: "Finding vulnerabilities and thinking like an attacker.",
          icon: "bug",
          scores: { pentester: 4 },
        },
        {
          value: "forensics",
          title: "Forensics & IR",
          description: "Investigating incidents and piecing together what happened.",
          icon: "file-search",
          scores: { forensics: 4 },
        },
        {
          value: "cloud",
          title: "Cloud Security",
          description: "Securing AWS, Azure, GCP, and cloud-native apps.",
          icon: "cloud",
          scores: { "cloud-security": 4 },
        },
        {
          value: "engineering",
          title: "Security Engineering",
          description: "Building tools, automation, and secure architecture.",
          icon: "database",
          scores: { "security-engineer": 4 },
        },
        {
          value: "grc",
          title: "GRC & Governance",
          description: "Risk, compliance, audits, and security policy.",
          icon: "file-shield",
          scores: { grc: 4 },
        },
      ],
    },
    {
      id: "preference",
      question: "Do you prefer defending, investigating, building, or testing?",
      description: "Your instinct here helps weight hands-on vs strategic paths.",
      options: [
        {
          value: "defend",
          title: "Defending",
          description: "Stopping attacks and keeping systems safe.",
          icon: "shield",
          scores: { "soc-analyst": 3, "cloud-security": 1 },
        },
        {
          value: "investigate",
          title: "Investigating",
          description: "Digging into alerts, logs, and incident timelines.",
          icon: "search",
          scores: { forensics: 3, "soc-analyst": 2 },
        },
        {
          value: "build",
          title: "Building",
          description: "Creating secure systems, scripts, and tooling.",
          icon: "code",
          scores: { "security-engineer": 3, "cloud-security": 2 },
        },
        {
          value: "test",
          title: "Testing",
          description: "Breaking things ethically to improve security.",
          icon: "target",
          scores: { pentester: 3 },
        },
      ],
    },
    {
      id: "technical",
      question: "How comfortable are you with technical tools?",
      description: "Be honest. We'll suggest a pace that matches your starting point.",
      options: [
        {
          value: "low",
          title: "Still getting started",
          description: "I'm learning terminals, networking, and basic tools.",
          icon: "sprout",
          scores: { grc: 2, "soc-analyst": 1 },
        },
        {
          value: "medium",
          title: "Comfortable with basics",
          description: "I can follow labs and use CLI when guided.",
          icon: "laptop",
          scores: { "soc-analyst": 2, forensics: 1, "cloud-security": 1 },
        },
        {
          value: "high",
          title: "Confident troubleshooting",
          description: "I debug issues and learn new tools quickly.",
          icon: "terminal",
          scores: {
            pentester: 2,
            "security-engineer": 2,
            forensics: 1,
          },
        },
        {
          value: "expert",
          title: "Very hands-on",
          description: "I script, automate, and enjoy deep technical work.",
          icon: "code",
          scores: {
            "security-engineer": 3,
            pentester: 2,
            "cloud-security": 2,
          },
        },
      ],
    },
    {
      id: "goal",
      question: "What is your main goal right now?",
      description: "We'll align next steps with what you're optimising for.",
      options: [
        {
          value: "first-role",
          title: "Land my first cyber role",
          description: "Build skills and credibility for entry-level jobs.",
          icon: "briefcase",
          scores: { "soc-analyst": 2, grc: 1, "cloud-security": 1 },
        },
        {
          value: "cert",
          title: "Pass a certification",
          description: "Security+, Network+, or similar structured prep.",
          icon: "book-open",
          scores: { "soc-analyst": 2, grc: 2 },
        },
        {
          value: "switch",
          title: "Switch careers into cyber",
          description: "Structured learning from another field.",
          icon: "sprout",
          scores: { "soc-analyst": 2, grc: 1, pentester: 1 },
        },
        {
          value: "advance",
          title: "Advance in my current path",
          description: "Level up specialisation or move into a new niche.",
          icon: "rocket",
          scores: {
            pentester: 2,
            "security-engineer": 2,
            forensics: 2,
          },
        },
      ],
    },
  ];

  var defaultResources = [
    {
      name: "TryHackMe",
      description: "Guided rooms for networking, Linux, and blue team basics.",
      href: "https://tryhackme.com/",
      icon: "laptop",
      external: true,
    },
    {
      name: "YouTube",
      description: "Free explainers. Pair short videos with daily practice.",
      href: "https://www.youtube.com/results?search_query=cybersecurity+beginner",
      icon: "play",
      external: true,
    },
    {
      name: "Blackbat",
      description: "Daily quizzes and cert prep. Five minutes at a time.",
      href: "index.html#get-the-app",
      icon: "bat",
      external: false,
    },
  ];

  var roadmapWeeks = [
    {
      week: "Week 1",
      title: "Networking Fundamentals",
      hours: "4-6 hrs",
      level: "Beginner",
      icon: "network",
      active: true,
    },
    {
      week: "Week 2",
      title: "Linux Fundamentals",
      hours: "4-6 hrs",
      level: "Beginner",
      icon: "terminal",
    },
    {
      week: "Week 3",
      title: "Security Fundamentals",
      hours: "4-6 hrs",
      level: "Beginner",
      icon: "shield",
    },
    {
      week: "Week 4",
      title: "Web Security",
      hours: "4-6 hrs",
      level: "Beginner",
      icon: "globe",
    },
    {
      week: "Weeks 5-8",
      title: "Specialisation & Practice",
      hours: "8-12 hrs",
      level: "Intermediate",
      icon: "laptop",
      dynamicTitle: true,
    },
    {
      week: "Weeks 9-12",
      title: "Career Preparation",
      hours: "6-10 hrs",
      level: "Intermediate",
      icon: "briefcase",
    },
  ];

  function computeResult(answers) {
    var totals = {};
    Object.keys(careerPaths).forEach(function (id) {
      totals[id] = 0;
    });

    quizQuestions.forEach(function (q) {
      var selected = answers[q.id];
      if (!selected) return;
      var option = q.options.find(function (o) {
        return o.value === selected;
      });
      if (!option || !option.scores) return;
      Object.keys(option.scores).forEach(function (pathId) {
        totals[pathId] = (totals[pathId] || 0) + option.scores[pathId];
      });
    });

    var bestId = "soc-analyst";
    var bestScore = -1;
    Object.keys(totals).forEach(function (id) {
      if (totals[id] > bestScore) {
        bestScore = totals[id];
        bestId = id;
      }
    });

    return {
      pathId: bestId,
      path: careerPaths[bestId],
      scores: totals,
      answers: answers,
      computedAt: new Date().toISOString(),
    };
  }

  function saveResult(result) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    } catch (e) {
      /* ignore */
    }
  }

  function loadResult() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.pathId || !careerPaths[parsed.pathId]) return null;
      parsed.path = careerPaths[parsed.pathId];
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function saveAnswers(answers) {
    try {
      localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
    } catch (e) {
      /* ignore */
    }
  }

  function loadAnswers() {
    try {
      var raw = localStorage.getItem(ANSWERS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function getFallbackResult() {
    return {
      pathId: "soc-analyst",
      path: careerPaths["soc-analyst"],
      scores: {},
      answers: {},
      computedAt: null,
      fallback: true,
    };
  }

  global.BlackbatCareer = {
    STORAGE_KEY: STORAGE_KEY,
    careerPaths: careerPaths,
    quizQuestions: quizQuestions,
    defaultResources: defaultResources,
    roadmapWeeks: roadmapWeeks,
    computeResult: computeResult,
    saveResult: saveResult,
    loadResult: loadResult,
    saveAnswers: saveAnswers,
    loadAnswers: loadAnswers,
    getFallbackResult: getFallbackResult,
  };
})(typeof window !== "undefined" ? window : globalThis);
