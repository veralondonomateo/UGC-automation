export type UGCStatus = 'active' | 'inactive' | 'pending';
export type ContractType = 'initial' | 'paid';
export type ContractStatus = 'pending' | 'signed' | 'rejected';
export type OrderStatus = 'pending' | 'sent' | 'in_transit' | 'delivered';
export type VideoStatus = 'pending' | 'uploaded' | 'late';
export type CampaignStatus = 'running' | 'paused' | 'completed' | 'failed';
export type CampaignResult = 'working' | 'not_working' | 'pending';
export type NotificationChannel = 'whatsapp' | 'in_app';
export type NotificationStatus = 'sent' | 'failed' | 'pending';

export interface UGC {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  department: string;
  instagram_handle?: string;
  tiktok_handle?: string;
  status: UGCStatus;
  score: number;
  created_at: string;
}

export interface Contract {
  id: string;
  ugc_id: string;
  type: ContractType;
  status: ContractStatus;
  signed_at?: string;
  content_url?: string;
  signer_ip?: string;
  created_at: string;
}

export interface Order {
  id: string;
  ugc_id: string;
  mastershop_order_id?: string;
  product_name: string;
  status: OrderStatus;
  tracking_url?: string;
  sent_at?: string;
  delivered_at?: string;
}

export interface Video {
  id: string;
  ugc_id: string;
  drive_url: string;
  upload_date: string;
  deadline: string;
  status: VideoStatus;
}

export interface Campaign {
  id: string;
  video_id: string;
  ugc_id: string;
  meta_campaign_id?: string;
  meta_ad_id?: string;
  start_date: string;
  end_date?: string;
  status: CampaignStatus;
  cpa?: number;
  impressions?: number;
  clicks?: number;
  spend?: number;
  result: CampaignResult;
}

export interface Notification {
  id: string;
  ugc_id: string;
  type: string;
  message: string;
  channel: NotificationChannel;
  sent_at: string;
  status: NotificationStatus;
}

export interface Brief {
  id: string;
  title: string;
  description: string;
  reference_urls: string[];
  do_list: string[];
  dont_list: string[];
  created_at: string;
}

export interface AnalyticsData {
  total_active_ugcs: number;
  videos_running_this_week: number;
  average_cpa: number;
  best_ugc: { name: string; cpa: number } | null;
  conversion_rate: number;
  spend_results: { date: string; spend: number; results: number }[];
}
