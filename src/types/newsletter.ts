export interface Newsletter {
  id: string;
  subject: string;
  body: string;
  sent_at: string;
  recipient_count: number;
}

export interface SendNewsletterRequest {
  subject: string;
  body: string;
}

export interface SendNewsletterResponse {
  success?: boolean;
  error?: string;
  recipientCount?: number;
}

export interface SubscribersResponse {
  subscribers?: { id: string; email: string; created_at: string }[];
  count?: number;
  error?: string;
}
