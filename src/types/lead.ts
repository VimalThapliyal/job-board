export interface Lead {
  id?: string;
  jobId: string;
  jobTitle: string;
  company: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  coverLetter: string;
  resumeUrl: string;
  status: "new" | "qualified" | "contacted" | "sold" | "rejected";
  qualificationScore: number;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string;
  userAgent: string;
}

export interface Company {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  leadPricing: {
    junior: number; // $50
    mid: number; // $100
    senior: number; // $150
    lead: number; // $200
  };
  autoPurchase: boolean;
  maxBudget: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id?: string;
  leadId: string;
  companyId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  completedAt?: Date;
}

export interface LeadScore {
  score: number; // 0-100
  level: "junior" | "mid" | "senior" | "lead";
  price: number;
  reasoning: string[];
}

export interface LeadStats {
  totalLeads: number;
  qualifiedLeads: number;
  soldLeads: number;
  totalRevenue: number;
  averageLeadPrice: number;
  conversionRate: number;
}
