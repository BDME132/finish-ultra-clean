export interface Newsletter {
  id: string;
  subject: string;
  body: string;
  sent_at: string;
  recipient_count: number;
  slug?: string | null;
  is_published?: boolean | null;
  published_at?: string | null;
}

export interface SendNewsletterRequest {
  subject: string;
  body: string;
  /** When true, publish this issue to the public /newsletter archive */
  publishToArchive?: boolean;
  /** Optional URL slug; auto-generated from subject if omitted when publishing */
  archiveSlug?: string | null;
}

export interface SendNewsletterResponse {
  success?: boolean;
  error?: string;
  recipientCount?: number;
}

export interface SubscribersResponse {
  subscribers?: { id: string; email: string; created_at: string }[];
  newsletters?: Newsletter[];
  count?: number;
  error?: string;
}
