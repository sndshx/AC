import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  CheckCircle2,
  FileBarChart,
  LineChart,
  MessageSquareText,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards
} from "lucide-react";

export const trustedBrands = ["Northstar", "FluxBase", "Orbitly", "Clearbitz", "Leadforge"];

export const landingFeatures = [
  {
    title: "Content Creation Tracking",
    description: "Track article writing volume, revisions, publishing schedule, and quality metrics in one view.",
    icon: Bot
  },
  {
    title: "Daily Activity Tracking",
    description: "Capture daily and monthly marketing activity with automatic success and completion calculations.",
    icon: Activity
  },
  {
    title: "Team Management",
    description: "Assign owners, compare performance, manage roles, and keep every marketer accountable.",
    icon: Users
  },
  {
    title: "Calendar Integration",
    description: "Plan daily, weekly, and monthly campaigns with reminders for assigned events.",
    icon: CalendarDays
  },
  {
    title: "AI Performance Analysis",
    description: "Surface best send times, productivity dips, follow-up suggestions, and improvement tips.",
    icon: Sparkles
  },
  {
    title: "WhatsApp Health Monitoring",
    description: "Monitor active, warning, limited, and banned account states with health scores.",
    icon: ShieldCheck
  },
  {
    title: "Reports",
    description: "Generate daily, weekly, and monthly reports with export-ready operational metrics.",
    icon: FileBarChart
  },
  {
    title: "Analytics",
    description: "Explore message trends, team growth, productivity, AI scores, and completion patterns.",
    icon: LineChart
  },
  {
    title: "Notifications",
    description: "Alert teams about tasks, AI recommendations, remarks, calendar reminders, and WhatsApp risk.",
    icon: Bell
  },
  {
    title: "Task Management",
    description: "Assign, prioritize, complete, and review marketing tasks from a role-aware workspace.",
    icon: CheckCircle2
  }
];

export const pricingPlans = [
  {
    name: "Starter",
    price: "$49",
    description: "For solo operators validating outbound AI workflows.",
    features: ["3 users", "Activity tracking", "AI summaries", "CSV exports"]
  },
  {
    name: "Growth",
    price: "$149",
    description: "For teams running daily WhatsApp and multi-channel outreach.",
    features: ["25 users", "Role controls", "Calendar planning", "WhatsApp health", "Advanced reports"],
    featured: true
  },
  {
    name: "Scale",
    price: "Custom",
    description: "For agencies and enterprise teams needing strict control.",
    features: ["Unlimited users", "Audit logs", "Custom SLAs", "Neon PostgreSQL deployment", "Priority support"]
  }
];

export const faqItems = [
  {
    question: "Do admins and users share the same login page?",
    answer: "Yes. The login endpoint returns the role and redirects admins to the admin dashboard and users to their personal dashboard."
  },
  {
    question: "Can normal users create admin accounts?",
    answer: "No. New registrations default to User. Only an authenticated admin can create admins, promote users, disable accounts, or delete users."
  },
  {
    question: "Which database is this ready for?",
    answer: "The Prisma schema targets PostgreSQL and is ready for Neon by setting DATABASE_URL in the environment."
  },
  {
    question: "Can reports be exported?",
    answer: "Yes. The reporting API includes CSV, Excel-compatible, and PDF response formats that can be extended with richer document generation."
  }
];

export const adminNav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/activity-logs", label: "Activity Logs", icon: Activity },
  { href: "/admin/activity-logs/all-dates", label: "All Dates History", icon: CalendarDays },
  { href: "/admin/ai-insights", label: "AI Insights", icon: Sparkles },
  { href: "/admin/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/admin/marketing", label: "Marketing", icon: Bot },
  { href: "/admin/tasks", label: "Tasks", icon: CheckCircle2 },
  { href: "/admin/reports", label: "Reports", icon: FileBarChart },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export const userNav = [
  { href: "/user/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/user/activity-log", label: "Activity Log", icon: Activity },
  { href: "/user/ai-insights", label: "AI Insights", icon: Sparkles },
  { href: "/user/marketing", label: "Marketing", icon: Bot },
  { href: "/user/tasks", label: "Tasks", icon: CheckCircle2 },
  { href: "/user/reports", label: "Reports", icon: FileBarChart },
  { href: "/user/notifications", label: "Notifications", icon: Bell },
  { href: "/user/settings", label: "Settings", icon: Settings }
];

export const chartData = [
  { name: "Mon", messages: 820, replies: 240, tasks: 64, score: 82 },
  { name: "Tue", messages: 960, replies: 310, tasks: 71, score: 86 },
  { name: "Wed", messages: 1180, replies: 360, tasks: 88, score: 91 },
  { name: "Thu", messages: 1090, replies: 330, tasks: 79, score: 88 },
  { name: "Fri", messages: 1320, replies: 430, tasks: 94, score: 93 },
  { name: "Sat", messages: 760, replies: 190, tasks: 48, score: 79 },
  { name: "Sun", messages: 640, replies: 160, tasks: 39, score: 76 }
];

export const monthlyData = [
  { name: "Jan", growth: 14, messages: 18400, productivity: 78 },
  { name: "Feb", growth: 18, messages: 21100, productivity: 82 },
  { name: "Mar", growth: 23, messages: 24800, productivity: 86 },
  { name: "Apr", growth: 21, messages: 23600, productivity: 84 },
  { name: "May", growth: 32, messages: 30200, productivity: 91 },
  { name: "Jun", growth: 36, messages: 34800, productivity: 94 }
];

export const demoUsers = [
  {
    id: "usr_1",
    fullName: "Ava Sterling",
    email: "admin@aimarketing.local",
    role: "ADMIN",
    status: "ACTIVE",
    teamName: "Growth Command",
    aiScore: 96,
    whatsAppStatus: { status: "ACTIVE", healthScore: 98 }
  },
  {
    id: "usr_2",
    fullName: "Noah Patel",
    email: "user@aimarketing.local",
    role: "USER",
    status: "ACTIVE",
    teamName: "Outbound AI",
    aiScore: 91,
    whatsAppStatus: { status: "ACTIVE", healthScore: 94 }
  },
  {
    id: "usr_3",
    fullName: "Maya Chen",
    email: "maya@example.com",
    role: "USER",
    status: "ACTIVE",
    teamName: "Retention",
    aiScore: 84,
    whatsAppStatus: { status: "WARNING", healthScore: 72 }
  },
  {
    id: "usr_4",
    fullName: "Leo Martin",
    email: "leo@example.com",
    role: "USER",
    status: "DISABLED",
    teamName: "Agency Pods",
    aiScore: 67,
    whatsAppStatus: { status: "LIMITED", healthScore: 58 }
  }
];

export const moduleContent = {
  tasks: {
    title: "Task Assignment",
    description: "Assign owners, track priorities, review completion, and keep follow-ups moving.",
    icon: CheckCircle2,
    primaryAction: "New Task",
    columns: ["Task", "Owner", "Priority", "Status", "Due"],
    rows: [
      ["Warm lead follow-up", "Noah Patel", "High", "In progress", "Today"],
      ["Refresh outreach variant", "Maya Chen", "Medium", "Todo", "Tomorrow"],
      ["Review banned account logs", "Ava Sterling", "Urgent", "Blocked", "Jul 12"]
    ]
  },
  activity: {
    title: "Activity Tracking",
    description: "Review daily messages, monthly targets, replies, follow-ups, and performance scores.",
    icon: Activity,
    primaryAction: "Update Count",
    columns: ["User", "Daily", "Monthly", "Success", "Score"],
    rows: [
      ["Noah Patel", "148", "3,180", "31.1%", "91"],
      ["Maya Chen", "121", "2,740", "27.4%", "84"],
      ["Leo Martin", "64", "1,420", "19.8%", "67"]
    ]
  },
  calendar: {
    title: "Calendar Management",
    description: "Plan campaign windows, daily standups, review meetings, and assigned reminders.",
    icon: CalendarDays,
    primaryAction: "Create Event",
    columns: ["Event", "Assignee", "View", "Time", "Status"],
    rows: [
      ["Weekly AI review", "Growth Command", "Weekly", "10:00", "Scheduled"],
      ["Follow-up sprint", "Outbound AI", "Daily", "14:00", "Assigned"],
      ["Month-end report", "Admins", "Monthly", "16:30", "Draft"]
    ]
  },
  "ai-insights": {
    title: "AI Insights",
    description: "See summaries, risk alerts, productivity scoring, best-send windows, and follow-up suggestions.",
    icon: Bot,
    primaryAction: "Generate Insight",
    columns: ["Signal", "Owner", "Confidence", "Impact", "Action"],
    rows: [
      ["Best send time 10:00-11:30", "Noah Patel", "94%", "High", "Apply"],
      ["Inactive risk", "Leo Martin", "72%", "Medium", "Review"],
      ["Shorter CTA likely to improve replies", "Team", "87%", "High", "Test"]
    ]
  },
  whatsapp: {
    title: "WhatsApp Monitoring",
    description: "Track health score, account state, warning history, ban history, and message volume.",
    icon: MessageSquareText,
    primaryAction: "Run Health Check",
    columns: ["Account", "Status", "Health", "Daily", "Monthly"],
    rows: [
      ["Noah Patel", "Active", "94", "148", "3,180"],
      ["Maya Chen", "Warning", "72", "121", "2,740"],
      ["Leo Martin", "Limited", "58", "64", "1,420"]
    ]
  },
  reports: {
    title: "Reports",
    description: "Generate daily, weekly, and monthly reports with CSV, Excel, and PDF exports.",
    icon: FileBarChart,
    primaryAction: "Export Report",
    columns: ["Report", "Period", "Messages", "AI Score", "Format"],
    rows: [
      ["Daily team report", "Today", "6,770", "89", "CSV"],
      ["Weekly productivity", "This week", "41,980", "87", "PDF"],
      ["Monthly growth", "June", "34,800", "94", "Excel"]
    ]
  },
  analytics: {
    title: "Analytics",
    description: "Explore daily growth, team performance, AI trends, productivity, and message velocity.",
    icon: LineChart,
    primaryAction: "Create View",
    columns: ["Metric", "Current", "Previous", "Change", "Trend"],
    rows: [
      ["Daily growth", "+18%", "+12%", "+6%", "Up"],
      ["Productivity", "91", "84", "+7", "Up"],
      ["Completion", "88%", "82%", "+6%", "Up"]
    ]
  },
  notifications: {
    title: "Notifications",
    description: "Review assigned tasks, completed work, AI recommendations, WhatsApp warnings, and remarks.",
    icon: Bell,
    primaryAction: "Mark All Read",
    columns: ["Type", "Title", "Recipient", "Age", "State"],
    rows: [
      ["Task", "Warm lead follow-up", "Noah Patel", "12m", "Unread"],
      ["AI", "Best send time changed", "Team", "1h", "Unread"],
      ["WhatsApp", "Warning threshold hit", "Maya Chen", "3h", "Read"]
    ]
  },
  settings: {
    title: "Settings",
    description: "Manage workspace preferences, security defaults, integrations, exports, and alerts.",
    icon: Settings,
    primaryAction: "Save Settings",
    columns: ["Setting", "Scope", "Value", "Owner", "State"],
    rows: [
      ["JWT session lifetime", "Security", "7 days", "Admin", "Enabled"],
      ["WhatsApp warning threshold", "Monitoring", "75", "Admin", "Enabled"],
      ["Daily digest", "Notifications", "17:30", "Team", "Enabled"]
    ]
  },
  profile: {
    title: "Profile",
    description: "Manage your identity, role visibility, notification preferences, and team assignment.",
    icon: WalletCards,
    primaryAction: "Update Profile",
    columns: ["Field", "Value", "Visibility", "Owner", "State"],
    rows: [
      ["Full name", "Current user", "Team", "You", "Editable"],
      ["Email", "Signed-in email", "Private", "You", "Locked"],
      ["Role", "Role-based", "Workspace", "Admin", "Managed"]
    ]
  },
  users: {
    title: "User Management",
    description: "Search users, promote admins, disable accounts, review status, and inspect performance.",
    icon: Search,
    primaryAction: "Invite User",
    columns: ["User", "Role", "Status", "Team", "AI Score"],
    rows: []
  }
};

export type ModuleKey = keyof typeof moduleContent;
