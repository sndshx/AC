import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[0-9]/, "Password must include a number");

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2).max(120),
    email: z.string().email(),
    password: passwordSchema,
    confirmPassword: z.string(),
    role: z.enum(["ADMIN", "USER"]).optional()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export const updateUserSchema = z.object({
  fullName: z.string().min(2).max(120).optional(),
  role: z.enum(["ADMIN", "USER"]).optional(),
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
  teamName: z.string().max(120).optional().nullable()
});

export const taskSchema = z.object({
  title: z.string().min(2).max(160),
  description: z.string().max(1000).optional(),
  assignedToId: z.string().min(1),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM")
});

export const activitySchema = z.object({
  dailyMessagesSent: z.number().int().min(0),
  monthlyMessagesSent: z.number().int().min(0),
  successfulReplies: z.number().int().min(0),
  failedReplies: z.number().int().min(0),
  pendingFollowUps: z.number().int().min(0),
  completedFollowUps: z.number().int().min(0),
  dailyTarget: z.number().int().min(1),
  monthlyTarget: z.number().int().min(1)
});

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  company: z.string().max(120).optional(),
  message: z.string().min(10).max(2000)
});
