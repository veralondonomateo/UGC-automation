export const whatsappTemplates = {
  contract_sent: (nombre: string, link: string) =>
    `Hola ${nombre} 👋 Te enviamos tu contrato de colaboración con Dermafol. Fírmalo aquí: ${link}`,
  order_sent: (nombre: string, tracking_url: string) =>
    `Hola ${nombre}, tu producto ya está en camino 📦 Seguimiento: ${tracking_url}`,
  order_delivered: (nombre: string, link: string) =>
    `Tu pedido llegó ${nombre} 🎉 Recuerda: tienes 4 días para subir tu video. Brief aquí: ${link}`,
  video_reminder: (nombre: string, link: string) =>
    `Hola ${nombre}, te recordamos que tu video vence mañana. Súbelo aquí: ${link}`,
  ad_working: (nombre: string, cpa: string) =>
    `¡Tu video está funcionando ${nombre}! 🔥 CPA: ${cpa}. Queremos seguir trabajando contigo. Te contactamos pronto.`,
  ad_not_working: (nombre: string, link: string) =>
    `Hola ${nombre}, tu video no alcanzó los resultados esperados esta vez. ¿Quieres intentarlo con un nuevo video? ${link}`,
}

export type TemplateKey = keyof typeof whatsappTemplates
