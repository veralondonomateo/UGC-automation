import { subDays, addDays } from 'date-fns'

const now = new Date()
const d = (days: number) => subDays(now, days).toISOString()
const f = (days: number) => addDays(now, days).toISOString()

// ─── UGCs ────────────────────────────────────────────────────────────────────
export const mockUGCs = [
  {
    id: 'ugc-001',
    full_name: 'Valentina Rodríguez',
    phone: '+57 312 456 7890',
    email: 'valentina@demo.co',
    address: 'Calle 80 #45-12, Apto 301',
    city: 'Medellín',
    department: 'Antioquia',
    instagram_handle: 'vale.rodriguez',
    tiktok_handle: 'valero_ugc',
    status: 'active',
    score: 85,
    created_at: d(20),
  },
  {
    id: 'ugc-002',
    full_name: 'Camila Moreno',
    phone: '+57 300 987 6543',
    email: 'camila@demo.co',
    address: 'Carrera 15 #72-40',
    city: 'Bogotá',
    department: 'Bogotá D.C.',
    instagram_handle: 'cami.moreno_',
    tiktok_handle: '',
    status: 'active',
    score: 62,
    created_at: d(14),
  },
  {
    id: 'ugc-003',
    full_name: 'Daniela Ospina',
    phone: '+57 321 111 2233',
    email: 'daniela@demo.co',
    address: 'Av. 6N #23-15',
    city: 'Cali',
    department: 'Valle del Cauca',
    instagram_handle: 'dani.ospina',
    tiktok_handle: 'dani_ospina_co',
    status: 'active',
    score: 91,
    created_at: d(30),
  },
  {
    id: 'ugc-004',
    full_name: 'Sofía Martínez',
    phone: '+57 315 333 4455',
    email: 'sofia@demo.co',
    address: 'Calle 10 #22-30',
    city: 'Barranquilla',
    department: 'Atlántico',
    instagram_handle: 'sofi.mtz',
    tiktok_handle: '',
    status: 'pending',
    score: 10,
    created_at: d(3),
  },
  {
    id: 'ugc-005',
    full_name: 'Laura Jiménez',
    phone: '+57 304 777 8899',
    email: 'laura@demo.co',
    address: 'Carrera 50 #66-33',
    city: 'Pereira',
    department: 'Risaralda',
    instagram_handle: 'laurajco',
    tiktok_handle: 'lauraj_ugc',
    status: 'inactive',
    score: 40,
    created_at: d(45),
  },
]

// ─── CONTRACTS ───────────────────────────────────────────────────────────────
export const mockContracts = [
  {
    id: 'con-001',
    ugc_id: 'ugc-001',
    type: 'initial',
    status: 'signed',
    signed_at: d(18),
    content_url: null,
    signer_ip: '181.52.100.22',
    created_at: d(20),
  },
  {
    id: 'con-002',
    ugc_id: 'ugc-002',
    type: 'initial',
    status: 'signed',
    signed_at: d(12),
    content_url: null,
    signer_ip: '190.24.150.11',
    created_at: d(14),
  },
  {
    id: 'con-003',
    ugc_id: 'ugc-003',
    type: 'initial',
    status: 'signed',
    signed_at: d(28),
    content_url: null,
    signer_ip: '200.122.50.9',
    created_at: d(30),
  },
  {
    id: 'con-004',
    ugc_id: 'ugc-004',
    type: 'initial',
    status: 'pending',
    signed_at: null,
    content_url: null,
    signer_ip: null,
    created_at: d(3),
  },
  {
    id: 'con-005',
    ugc_id: 'ugc-005',
    type: 'initial',
    status: 'signed',
    signed_at: d(43),
    content_url: null,
    signer_ip: '181.11.22.33',
    created_at: d(45),
  },
]

// ─── ORDERS ──────────────────────────────────────────────────────────────────
export const mockOrders = [
  {
    id: 'ord-001',
    ugc_id: 'ugc-001',
    mastershop_order_id: 'MS-10234',
    product_name: 'Dermafol Serum 30ml',
    status: 'delivered',
    tracking_url: 'https://track.servientrega.com/MS-10234',
    sent_at: d(16),
    delivered_at: d(13),
    created_at: d(17),
  },
  {
    id: 'ord-002',
    ugc_id: 'ugc-002',
    mastershop_order_id: 'MS-10301',
    product_name: 'Dermafol Kit Completo',
    status: 'in_transit',
    tracking_url: 'https://track.servientrega.com/MS-10301',
    sent_at: d(5),
    delivered_at: null,
    created_at: d(6),
  },
  {
    id: 'ord-003',
    ugc_id: 'ugc-003',
    mastershop_order_id: 'MS-10178',
    product_name: 'Dermafol Serum 30ml',
    status: 'delivered',
    tracking_url: 'https://track.servientrega.com/MS-10178',
    sent_at: d(26),
    delivered_at: d(23),
    created_at: d(27),
  },
  {
    id: 'ord-004',
    ugc_id: 'ugc-005',
    mastershop_order_id: 'MS-10099',
    product_name: 'Dermafol Serum 30ml',
    status: 'delivered',
    tracking_url: 'https://track.servientrega.com/MS-10099',
    sent_at: d(41),
    delivered_at: d(38),
    created_at: d(42),
  },
]

// ─── VIDEOS ──────────────────────────────────────────────────────────────────
export const mockVideos = [
  {
    id: 'vid-001',
    ugc_id: 'ugc-001',
    drive_url: 'https://drive.google.com/file/d/demo001/view',
    upload_date: d(11),
    deadline: d(9),
    status: 'uploaded',
    created_at: d(11),
  },
  {
    id: 'vid-002',
    ugc_id: 'ugc-003',
    drive_url: 'https://drive.google.com/file/d/demo003/view',
    upload_date: d(20),
    deadline: d(19),
    status: 'uploaded',
    created_at: d(20),
  },
  {
    id: 'vid-003',
    ugc_id: 'ugc-003',
    drive_url: 'https://drive.google.com/file/d/demo003b/view',
    upload_date: d(5),
    deadline: d(4),
    status: 'uploaded',
    created_at: d(5),
  },
  {
    id: 'vid-004',
    ugc_id: 'ugc-005',
    drive_url: 'https://drive.google.com/file/d/demo005/view',
    upload_date: d(35),
    deadline: d(34),
    status: 'uploaded',
    created_at: d(35),
  },
]

// ─── CAMPAIGNS ───────────────────────────────────────────────────────────────
export const mockCampaigns = [
  {
    id: 'camp-001',
    video_id: 'vid-001',
    ugc_id: 'ugc-001',
    meta_campaign_id: 'META-C-1001',
    meta_ad_id: 'META-A-2001',
    start_date: d(9),
    end_date: d(2),
    status: 'completed',
    cpa: 18500,
    impressions: 142300,
    clicks: 4820,
    spend: 89130,
    result: 'working',
    created_at: d(9),
  },
  {
    id: 'camp-002',
    video_id: 'vid-002',
    ugc_id: 'ugc-003',
    meta_campaign_id: 'META-C-1002',
    meta_ad_id: 'META-A-2002',
    start_date: d(18),
    end_date: d(11),
    status: 'completed',
    cpa: 32000,
    impressions: 98000,
    clicks: 2100,
    spend: 67200,
    result: 'not_working',
    created_at: d(18),
  },
  {
    id: 'camp-003',
    video_id: 'vid-003',
    ugc_id: 'ugc-003',
    meta_campaign_id: 'META-C-1003',
    meta_ad_id: 'META-A-2003',
    start_date: d(3),
    end_date: null,
    status: 'running',
    cpa: 21400,
    impressions: 55600,
    clicks: 1940,
    spend: 41516,
    result: 'pending',
    created_at: d(3),
  },
  {
    id: 'camp-004',
    video_id: 'vid-004',
    ugc_id: 'ugc-005',
    meta_campaign_id: 'META-C-998',
    meta_ad_id: 'META-A-1998',
    start_date: d(33),
    end_date: d(26),
    status: 'completed',
    cpa: 41000,
    impressions: 61000,
    clicks: 900,
    spend: 36900,
    result: 'not_working',
    created_at: d(33),
  },
]

// ─── NOTIFICATIONS ───────────────────────────────────────────────────────────
export const mockNotifications = [
  {
    id: 'notif-001',
    ugc_id: 'ugc-001',
    type: 'contract_sent',
    message: 'Hola Valentina 👋 Te enviamos tu contrato de colaboración con Dermafol. Fírmalo aquí: https://demo.co/ugc/ugc-001/contract/con-001',
    channel: 'whatsapp',
    sent_at: d(20),
    status: 'sent',
  },
  {
    id: 'notif-002',
    ugc_id: 'ugc-001',
    type: 'order_sent',
    message: 'Hola Valentina, tu producto ya está en camino 📦 Seguimiento: https://track.servientrega.com/MS-10234',
    channel: 'whatsapp',
    sent_at: d(16),
    status: 'sent',
  },
  {
    id: 'notif-003',
    ugc_id: 'ugc-001',
    type: 'order_delivered',
    message: 'Tu pedido llegó Valentina 🎉 Recuerda: tienes 4 días para subir tu video. Brief aquí: https://demo.co/ugc/ugc-001/brief',
    channel: 'whatsapp',
    sent_at: d(13),
    status: 'sent',
  },
  {
    id: 'notif-004',
    ugc_id: 'ugc-001',
    type: 'ad_working',
    message: '¡Tu video está funcionando Valentina! 🔥 CPA: $18,500. Queremos seguir trabajando contigo. Te contactamos pronto.',
    channel: 'whatsapp',
    sent_at: d(2),
    status: 'sent',
  },
  {
    id: 'notif-005',
    ugc_id: 'ugc-003',
    type: 'ad_not_working',
    message: 'Hola Daniela, tu video no alcanzó los resultados esperados esta vez. ¿Quieres intentarlo con un nuevo video? https://demo.co/ugc/ugc-003',
    channel: 'whatsapp',
    sent_at: d(11),
    status: 'sent',
  },
  {
    id: 'notif-006',
    ugc_id: 'ugc-002',
    type: 'contract_sent',
    message: 'Hola Camila 👋 Te enviamos tu contrato de colaboración con Dermafol. Fírmalo aquí: https://demo.co/ugc/ugc-002/contract/con-002',
    channel: 'whatsapp',
    sent_at: d(14),
    status: 'sent',
  },
]

// ─── BRIEFS ──────────────────────────────────────────────────────────────────
export const mockBriefs = [
  {
    id: 'brief-001',
    title: 'Video UGC — Dermafol Serum Anti-caída',
    description: 'Crea un video auténtico de 30-60 segundos mostrando tu experiencia con el serum Dermafol. El video debe sentirse natural y genuino, como si lo estuvieras compartiendo con tus seguidores.',
    reference_urls: [
      'https://www.tiktok.com/@dermafol_oficial',
      'https://www.instagram.com/dermafol/',
    ],
    do_list: [
      'Muestra el producto claramente al inicio del video',
      'Habla de un resultado específico que notaste (ej: menos caída, más brillo)',
      'Filma en un espacio con buena iluminación natural',
      'Usa un tono cercano y conversacional',
      'Incluye close-up del producto y de tu cabello',
    ],
    dont_list: [
      'No uses fondos desordenados o con ruido',
      'No menciones marcas competidoras',
      'No hagas claims médicos (ej: "cura la alopecia")',
      'No uses filtros fuertes que alteren el color del producto',
    ],
    created_at: d(25),
  },
]

// ─── SETTINGS ────────────────────────────────────────────────────────────────
export const mockSettings = [
  { id: 'set-001', key: 'cpa_threshold', value: '25000', updated_at: d(30) },
]

// ─── Joined mock (for pages that do select with relations) ────────────────────
export function getMockUGCWithRelations(id: string) {
  const ugc = mockUGCs.find(u => u.id === id)
  if (!ugc) return null
  return {
    ...ugc,
    contracts: mockContracts.filter(c => c.ugc_id === id),
    orders: mockOrders.filter(o => o.ugc_id === id),
    videos: mockVideos.filter(v => v.ugc_id === id),
    campaigns: mockCampaigns.filter(c => c.ugc_id === id),
    notifications: mockNotifications.filter(n => n.ugc_id === id),
  }
}

export function getAllUGCsWithRelations() {
  return mockUGCs.map(ugc => ({
    ...ugc,
    contracts: mockContracts.filter(c => c.ugc_id === ugc.id),
    orders: mockOrders.filter(o => o.ugc_id === ugc.id),
    videos: mockVideos.filter(v => v.ugc_id === ugc.id),
    campaigns: mockCampaigns.filter(c => c.ugc_id === ugc.id),
    notifications: mockNotifications.filter(n => n.ugc_id === ugc.id),
  }))
}
