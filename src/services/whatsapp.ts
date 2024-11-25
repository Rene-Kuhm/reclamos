import axios from 'axios';

// Reemplaza con tu número de teléfono (con código de país, sin '+' ni espacios)
const TECHNICIAN_PHONE = '549XXXXXXXXXX'; // Ejemplo: 5492334423707
// Reemplaza con tu API Key de CallMeBot
const API_KEY = 'XXXXXX'; 

export const sendWhatsAppNotification = async (complaint: {
  customerName: string;
  phoneNumber: string;
  address: string;
  reason: string;
  serviceType: string;
}) => {
  try {
    const message = `🔔 *NUEVO RECLAMO COSPEC*\n\n` +
      `👤 *Cliente:* ${complaint.customerName}\n` +
      `📞 *Teléfono:* ${complaint.phoneNumber}\n` +
      `📍 *Dirección:* ${complaint.address}\n` +
      `🔧 *Servicio:* ${complaint.serviceType}\n` +
      `📝 *Motivo:* ${complaint.reason}\n\n` +
      `⏰ *Fecha:* ${new Date().toLocaleDateString()}\n` +
      `⌚ *Hora:* ${new Date().toLocaleTimeString()}`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${TECHNICIAN_PHONE}&text=${encodedMessage}&apikey=${API_KEY}`;

    const response = await axios.get(url);

    if (!response.data.includes('Message Queued')) {
      throw new Error('Error al enviar el mensaje de WhatsApp');
    }

    return response.data;
  } catch (error) {
    console.error('Error enviando notificación de WhatsApp:', error);
    throw error;
  }
};