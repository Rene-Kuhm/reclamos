import { TextInput, Textarea, Button, Paper, Title, Select, Group, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useComplaintStore } from '../store/complaintStore';
import { IconSend, IconPhone, IconUser, IconMapPin, IconClipboard } from '@tabler/icons-react';
import { sendWhatsAppNotification } from '../services/whatsapp';
import { useState } from 'react';

export function ComplaintForm() {
  const addComplaint = useComplaintStore((state) => state.addComplaint);
  const [notificationError, setNotificationError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      serviceType: '',
      phoneNumber: '',
      internetNumber: '',
      customerName: '',
      address: '',
      reason: '',
      receivedBy: '',
      time: new Date().toLocaleTimeString(),
    },
    validate: {
      serviceType: (value) => (!value ? 'Tipo de servicio requerido' : null),
      phoneNumber: (value) => (!value ? 'Número de teléfono requerido' : null),
      customerName: (value) => (!value ? 'Nombre del cliente requerido' : null),
      address: (value) => (!value ? 'Dirección requerida' : null),
      reason: (value) => (!value ? 'Motivo requerido' : null),
      receivedBy: (value) => (!value ? 'Nombre del receptor requerido' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      // Primero agregamos el reclamo al store
      addComplaint({
        ...values,
        date: new Date(),
        time: new Date().toLocaleTimeString(),
      });

      // Luego enviamos la notificación por WhatsApp
      await sendWhatsAppNotification({
        customerName: values.customerName,
        phoneNumber: values.phoneNumber,
        address: values.address,
        reason: values.reason,
        serviceType: values.serviceType,
      });

      setNotificationError(null);
      form.reset();
    } catch (error) {
      setNotificationError('Error al enviar la notificación por WhatsApp');
      console.error('Error:', error);
    }
  };

  const showInternetField = ['telefono_internet', 'fibra_optica', 'tv_fibra_optica'].includes(form.values.serviceType);

  return (
    <Paper radius="md" p="xl" withBorder shadow="sm" mb="xl">
      <Title order={3} mb="xl" c="blue.7">Nuevo Reclamo</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="md">
          <Group grow>
            <Select
              label="Servicio"
              placeholder="Seleccione el servicio"
              data={[
                { value: 'telefono', label: 'Teléfono' },
                { value: 'telefono_internet', label: 'Teléfono/Internet' },
                { value: 'fibra_optica', label: 'Fibra Óptica' },
                { value: 'tv', label: 'TV' },
                { value: 'tv_fibra_optica', label: 'TV/Fibra Óptica' },
              ]}
              required
              {...form.getInputProps('serviceType')}
            />
            <TextInput
              label="Número de Teléfono"
              placeholder="Ej: 3834123456"
              required
              leftSection={<IconPhone size={16} />}
              {...form.getInputProps('phoneNumber')}
            />
          </Group>

          {showInternetField && (
            <TextInput
              label="Número de Internet"
              placeholder="Número de servicio de internet"
              leftSection={<IconPhone size={16} />}
              {...form.getInputProps('internetNumber')}
            />
          )}

          <Group grow>
            <TextInput
              label="Nombre del Cliente"
              placeholder="Nombre completo"
              required
              leftSection={<IconUser size={16} />}
              {...form.getInputProps('customerName')}
            />
            <TextInput
              label="Recibido por"
              placeholder="Nombre del empleado"
              required
              leftSection={<IconUser size={16} />}
              {...form.getInputProps('receivedBy')}
            />
          </Group>

          <TextInput
            label="Dirección"
            placeholder="Dirección completa"
            required
            leftSection={<IconMapPin size={16} />}
            {...form.getInputProps('address')}
          />

          <Textarea
            label="Motivo del Reclamo"
            placeholder="Descripción detallada del problema"
            required
            minRows={3}
            leftSection={<IconClipboard size={16} />}
            {...form.getInputProps('reason')}
          />

          {notificationError && (
            <Text color="red" size="sm">
              {notificationError}
            </Text>
          )}

          <Button 
            type="submit" 
            size="md"
            leftSection={<IconSend size={20} />}
          >
            Registrar Reclamo
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}