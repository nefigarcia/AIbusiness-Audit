import { z } from "zod";

export const auditFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "Please enter a valid phone number"
    ),
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(200, "Business name too long"),
  industry: z.enum(
    ["HEALTHCARE", "LEGAL", "REAL_ESTATE", "CONTRACTOR", "LOCAL_SERVICE", "OTHER"],
    { error: () => "Please select an industry" }
  ),
  companySize: z.enum(["SOLO", "SMALL", "MEDIUM", "LARGE", "ENTERPRISE"], {
    error: () => "Please select a company size",
  }),
  mainChallenge: z
    .string()
    .min(10, "Please describe your challenge in at least 10 characters")
    .max(1000, "Description too long"),
});

export type AuditFormInput = z.infer<typeof auditFormSchema>;

export const vapiWebhookSchema = z.object({
  type: z.string(),
  call: z
    .object({
      id: z.string(),
      status: z.string().optional(),
      transcript: z.string().optional(),
      summary: z.string().optional(),
      endedReason: z.string().optional(),
      duration: z.number().optional(),
      recordingUrl: z.string().optional(),
      artifact: z
        .object({
          transcript: z.string().optional(),
          recordingUrl: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  message: z
    .object({
      type: z.string().optional(),
      transcript: z.string().optional(),
    })
    .optional(),
});

export const reportGenerateSchema = z.object({
  sessionId: z.string().cuid(),
  internalSecret: z.string(),
});
