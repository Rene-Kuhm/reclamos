import { Button, Container, Title, Group, Paper } from '@mantine/core';
import { useAuthStore } from '../store/authStore';
import { ComplaintForm } from './ComplaintForm';
import { ComplaintList } from './ComplaintList';
import { IconLogout } from '@tabler/icons-react';

export function AdminDashboard() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <Container size="xl">
      <Paper p="md" radius="md" withBorder shadow="sm" mb="xl">
        <Group justify="space-between">
          <Title order={2} c="blue.7">Panel de Administración</Title>
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
      <ComplaintForm />
      <ComplaintList viewMode="admin" />
    </Container>
  );
}