export const COLOMBIA_DEPARTMENTS = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá',
  'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba',
  'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena',
  'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda',
  'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca',
  'Vaupés', 'Vichada', 'Bogotá D.C.',
]

export const CPA_THRESHOLD = parseInt(process.env.CPA_THRESHOLD || '25000')

export const PIPELINE_STAGES = [
  { id: 'new_contact', label: 'Nuevo Contacto' },
  { id: 'contract_sent', label: 'Contrato Enviado' },
  { id: 'contract_signed', label: 'Contrato Firmado' },
  { id: 'order_processing', label: 'Pedido en Proceso' },
  { id: 'order_delivered', label: 'Pedido Entregado' },
  { id: 'waiting_video', label: 'Esperando Video' },
  { id: 'video_received', label: 'Video Recibido' },
  { id: 'ad_running', label: 'Ad Activo' },
  { id: 'results_working', label: 'Funcionando ✓' },
  { id: 'results_not_working', label: 'No Funcionó ✗' },
]

export const UGC_PIPELINE_STEPS = [
  { label: 'Registrado' },
  { label: 'Contrato firmado' },
  { label: 'Pedido enviado' },
  { label: 'Entregado' },
  { label: 'Video subido' },
  { label: 'Ad activo' },
  { label: 'Resultados' },
]
