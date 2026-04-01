export const whatsappTemplates = {
  contract_sent: (nombre: string, link: string) =>
    `Hola ${nombre} 💕✨\n\nTe enviamos tu contrato de colaboración con Fem Probiotics 🌸💼\nPuedes firmarlo fácilmente aquí 👉 ${link}\n\n¡Estamos felices de tenerte con nosotras! 💖💫`,
  order_sent: (nombre: string) =>
    `Hola ${nombre} 💕, tu producto ya está en camino 📦✨\n\nRecuerda que no debes pagar absolutamente nada al recibirlo 🙌\nY una vez te llegue, tienes hasta 3 días para enviarnos los contenidos 💖\n\nTambién te compartimos algunas referencias de videos para que te inspires 🎥✨\nLa idea es que sean cortos, naturales y súper persuasivos, al estilo Fem 🌸\n\n¡Estamos felices de tenerte con nosotras! 💫`,
  order_delivered: (nombre: string) =>
    `Tu pedido ya llegó ${nombre} 🎉✨\n\nRecuerda que tienes hasta 3 días para enviarnos tu video por acá por WhatsApp 📲💖\n\nLa idea es que sea corto, natural y súper auténtico, mostrando tu experiencia con Fem 🌸\n\n¡Estamos atentas a tu contenido! 💫`,
  video_reminder: (nombre: string) =>
    `Hola ${nombre} 💕, te recordamos que tu video vence mañana ⏰✨\n\nPor favor envíanoslo por acá por WhatsApp 📲💖\n\n¡Estamos atentas a tu contenido! 🌸💫`,
  ad_working: () =>
    `¡Tu video está funcionando! 🔥 Queremos seguir trabajando contigo. Te contactamos pronto.`,
  ad_not_working: (nombre: string) =>
    `Hola ${nombre} 💕, esta vez tu video no alcanzó los resultados esperados 📊\n\nPero tranquila ✨, sabemos que puedes hacerlo increíble 🌸\n¿Te gustaría intentarlo con un nuevo video? 🎥💖\n\n¡Estamos aquí para apoyarte! 💫`,
}

export type TemplateKey = keyof typeof whatsappTemplates
