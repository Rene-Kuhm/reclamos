import axios from 'axios';

// Reemplaza con tu API key de TextBelt
const API_KEY = 'textbelt_test_key'; // Usa 'textbelt_test_key' para pruebas (limitado a 1 SMS por día)

// Reemplaza con tu número de teléfono (con código de país)
const TECHNICIAN_PHONE = '549XXXXXXXXXX'; // Ejemplo: 5492334423707

export const sendSMSNotification = async (complaint: {
  customerName: string;
  phoneNumber: string;
  address: string;
  reason: string;
  serviceType: string;
}) => {
  try {
    const message = `Nuevo Reclamo - ` +
      `Cliente: ${complaint.customerName}, ` +
      `Tel: ${complaint.phoneNumber}, ` +
      `Dir: ${complaint.address}, ` +
      `Servicio: ${complaint.serviceType}, ` +
      `Motivo: ${complaint.reason}`;

    const response = await axios.post('https://textbelt.com/text', {
      phone: TECHNICIAN_PHONE,
      message: message,
      key: API_KEY,
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al enviar SMS');
    }

    return response.data;
  } catch (error) {
    console.error('Error sending SMS notification:', error);
    throw error;
  }
};