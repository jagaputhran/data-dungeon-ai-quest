
export interface WorkflowMission {
  id: number;
  name: string;
  description: string;
  requiredNodes: string[];
  baseScore: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  skills: string[];
}

export const workflowMissions: WorkflowMission[] = [
  {
    id: 1,
    name: "Simple API to Database",
    description: "Pull data from a REST API and store it in a database. Learn the basics of HTTP requests and data insertion.",
    requiredNodes: ["HTTP Request", "Set", "Database"],
    baseScore: 100,
    difficulty: "Beginner",
    skills: ["REST APIs", "Data Mapping", "Database Operations"]
  },
  {
    id: 2,
    name: "CSV Transform & Load",
    description: "Read a CSV file, transform the data using mapping rules, and load it into multiple destinations.",
    requiredNodes: ["CSV Read", "Set", "Filter", "Database", "Webhook"],
    baseScore: 150,
    difficulty: "Beginner",
    skills: ["File Processing", "Data Transformation", "Multi-destination Loading"]
  },
  {
    id: 3,
    name: "Productboard to Snowflake Pipeline",
    description: "Extract feature data from Productboard API with pagination, map fields, and load into Snowflake warehouse.",
    requiredNodes: ["HTTP Request", "Set", "If", "Snowflake", "Slack"],
    baseScore: 200,
    difficulty: "Intermediate",
    skills: ["API Pagination", "Field Mapping", "Data Warehousing", "Notifications"]
  },
  {
    id: 4,
    name: "Multi-Source Data Merge",
    description: "Combine data from multiple APIs, resolve conflicts, and create a unified dataset.",
    requiredNodes: ["HTTP Request", "Merge", "Set", "Code", "Database"],
    baseScore: 250,
    difficulty: "Intermediate",
    skills: ["Data Merging", "Conflict Resolution", "Custom Logic", "Data Quality"]
  },
  {
    id: 5,
    name: "Real-time Event Processing",
    description: "Process streaming events, apply business rules, and trigger automated actions based on conditions.",
    requiredNodes: ["Webhook", "Switch", "Function", "Email", "Slack", "Database"],
    baseScore: 300,
    difficulty: "Advanced",
    skills: ["Event Processing", "Business Rules", "Automation", "Real-time Processing"]
  },
  {
    id: 6,
    name: "AI-Enhanced Data Pipeline",
    description: "Use AI/ML models to enrich data, detect anomalies, and generate insights before storing results.",
    requiredNodes: ["HTTP Request", "OpenAI", "Set", "If", "Database", "Email"],
    baseScore: 350,
    difficulty: "Advanced",
    skills: ["AI Integration", "Anomaly Detection", "Data Enrichment", "Intelligence Automation"]
  },
  {
    id: 7,
    name: "Error Handling & Retry Logic",
    description: "Build robust workflows with comprehensive error handling, retry mechanisms, and monitoring.",
    requiredNodes: ["HTTP Request", "Set", "If", "Wait", "Error Trigger", "Slack"],
    baseScore: 400,
    difficulty: "Expert",
    skills: ["Error Handling", "Retry Logic", "Monitoring", "Reliability Engineering"]
  },
  {
    id: 8,
    name: "Master ETL Orchestrator",
    description: "Create a complex orchestration workflow that manages multiple sub-workflows, handles dependencies, and provides comprehensive monitoring.",
    requiredNodes: ["Execute Workflow", "Wait", "Set", "If", "Database", "Webhook", "Slack"],
    baseScore: 500,
    difficulty: "Expert",
    skills: ["Workflow Orchestration", "Dependency Management", "Complex Logic", "Enterprise ETL"]
  }
];
