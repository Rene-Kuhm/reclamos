import { TextInput, PasswordInput, Button, Paper, Title, Text, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import { IconUser, IconLock } from '@tabler/icons-react';

export function LoginForm() {
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState('');

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (!value ? 'Usuario requerido' : null),
      password: (value) => (!value ? 'Contraseña requerida' : null),
    },
  });

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      await login(values.username, values.password);
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <Box maw={400} mx="auto">
      <Paper radius="md" p="xl" withBorder shadow="md">
        <Title order={2} mb="xl" ta="center" c="blue.7">Sistema de Reclamos</Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Usuario"
            placeholder="Su usuario"
            required
            leftSection={<IconUser size={16} />}
            {...form.getInputProps('username')}
          />
          <PasswordInput
            label="Contraseña"
            placeholder="Su contraseña"
            required
            mt="md"
            leftSection={<IconLock size={16} />}
            {...form.getInputProps('password')}
          />
          {error && (
            <Text color="red" size="sm" mt="sm">
              {error}
            </Text>
          )}
          <Button type="submit" fullWidth mt="xl" size="md">
            Ingresar
          </Button>
        </form>
      </Paper>
    </Box>
  );
}