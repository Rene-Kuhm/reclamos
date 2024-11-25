import { Button, Container, Title, Group, Paper } from '@mantine/core';
import { useAuthStore } from '../store/authStore';
import { ComplaintList } from './ComplaintList';
import { IconLogout } from '@tabler/icons-react';

export function TechnicianDashboard() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <Container size="xl">
      <Paper p="md" radius="md" withBorder shadow="sm" mb="xl">
        <Group justify="space-between">
          <Title order={2} c="blue.7">Panel de Técnico</Title>
          <Button 
            onClick={logout} 
            color="red" 
            variant="light"
            leftSection={<IconLogout size={20} />}
          >
            Cerrar Sesión
          </Button>
        </Group>
      </Paper>
      <ComplaintList viewMode="technician" />
    </Container>
  );
}