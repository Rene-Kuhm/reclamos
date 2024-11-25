import React from 'react';
import { MantineProvider, AppShell, Text, Group, Title } from '@mantine/core';
import { useAuthStore } from './store/authStore';
import { LoginForm } from './components/LoginForm';
import { AdminDashboard } from './components/AdminDashboard';
import { TechnicianDashboard } from './components/TechnicianDashboard';
import '@mantine/core/styles.css';

export default function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <MantineProvider>
      <AppShell
        header={{ height: 80 }}
        footer={{ height: 50 }}
        bg="gray.1"
      >
        <AppShell.Header bg="blue.7" c="white">
          <Group h="100%" px="xl" justify="center">
            <Title order={1}>COSPEC COMUNICACIONES</Title>
          </Group>
        </AppShell.Header>

        <AppShell.Main pt={100} pb={70}>
          <div className="container mx-auto px-4">
            {!user ? (
              <LoginForm />
            ) : user.role === 'admin' ? (
              <AdminDashboard />
            ) : (
              <TechnicianDashboard />
            )}
          </div>
        </AppShell.Main>

        <AppShell.Footer bg="gray.2" p="md">
          <Text ta="center" size="sm" c="dimmed">
            Desarrollado por René Kuhm © 2024
          </Text>
        </AppShell.Footer>
      </AppShell>
    </MantineProvider>
  );
}