import { Table, Badge, Text, Modal, Button, Textarea, Group, Paper, Title, ActionIcon, Tooltip, Select } from '@mantine/core';
import { useComplaintStore } from '../store/complaintStore';
import { useState } from 'react';
import { IconFileSpreadsheet, IconNotes, IconTrash } from '@tabler/icons-react';
import { utils, writeFile } from 'xlsx';
import { TechnicianType } from '../types/complaint';

interface ComplaintListProps {
  viewMode: 'admin' | 'technician';
}

export function ComplaintList({ viewMode }: ComplaintListProps) {
  const { complaints, updateComplaintStatus, deleteComplaint, deleteAllComplaints } = useComplaintStore();
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState<TechnicianType | ''>('');
  const [viewingNotes, setViewingNotes] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportConfirm, setShowExportConfirm] = useState(false);

  const handleStatusUpdate = (status: 'en_proceso' | 'resuelto') => {
    if (selectedComplaintId && selectedTechnician) {
      updateComplaintStatus(selectedComplaintId, status, technicianNotes, selectedTechnician as TechnicianType);
      setSelectedComplaintId(null);
      setTechnicianNotes('');
      setSelectedTechnician('');
    }
  };

  const handleExportAndDelete = () => {
    exportToExcel();
    deleteAllComplaints();
    setShowExportConfirm(false);
  };

  const getServiceLabel = (serviceType: string) => {
    const labels: Record<string, string> = {
      'telefono': 'Teléfono',
      'telefono_internet': 'Teléfono/Internet',
      'fibra_optica': 'Fibra Óptica',
      'tv': 'TV',
      'tv_fibra_optica': 'TV/Fibra Óptica',
    };
    return labels[serviceType] || serviceType;
  };

  const exportToExcel = () => {
    const data = complaints.map(complaint => ({
      'Servicio': getServiceLabel(complaint.serviceType),
      'Teléfono': complaint.phoneNumber,
      'Internet': complaint.internetNumber || 'N/A',
      'Cliente': complaint.customerName,
      'Dirección': complaint.address,
      'Motivo': complaint.reason,
      'Recibido por': complaint.receivedBy,
      'Fecha': new Date(complaint.date).toLocaleDateString(),
      'Hora': complaint.time,
      'Estado': getStatusText(complaint.status),
      'Técnico': complaint.technicianName || 'N/A',
      'Notas Técnicas': complaint.technicianNotes || 'N/A'
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Reclamos');
    writeFile(wb, `reclamos_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'red';
      case 'en_proceso':
        return 'yellow';
      case 'resuelto':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente';
      case 'en_proceso':
        return 'En Proceso';
      case 'resuelto':
        return 'Resuelto';
      default:
        return 'Desconocido';
    }
  };

  const selectedComplaint = complaints.find(c => c.id === selectedComplaintId);

  return (
    <Paper radius="md" p="xl" withBorder>
      <Group justify="space-between" mb="xl">
        <Title order={3}>Lista de Reclamos</Title>
        {viewMode === 'admin' && (
          <Group>
            <Button
              leftSection={<IconFileSpreadsheet size={20} />}
              onClick={() => setShowExportConfirm(true)}
              variant="light"
              color="blue"
            >
              Exportar a Excel
            </Button>
          </Group>
        )}
      </Group>
      
      <Table>
        <thead>
          <tr>
            <th>Servicio</th>
            <th>Cliente</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Estado</th>
            <th>Fecha y Hora</th>
            <th>Técnico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {complaints.length === 0 ? (
            <tr>
              <td colSpan={8}>
                <Text align="center" c="dimmed">No hay reclamos registrados</Text>
              </td>
            </tr>
          ) : (
            complaints.map((complaint) => (
              <tr key={complaint.id}>
                <td>{getServiceLabel(complaint.serviceType)}</td>
                <td>{complaint.customerName}</td>
                <td>{complaint.phoneNumber}</td>
                <td>{complaint.address}</td>
                <td>
                  <Badge color={getStatusColor(complaint.status)}>
                    {getStatusText(complaint.status)}
                  </Badge>
                </td>
                <td>
                  {new Date(complaint.date).toLocaleDateString()} {complaint.time}
                </td>
                <td>{complaint.technicianName || '-'}</td>
                <td>
                  <Group gap="xs">
                    {viewMode === 'technician' && complaint.status !== 'resuelto' && (
                      <Button
                        size="xs"
                        onClick={() => setSelectedComplaintId(complaint.id)}
                      >
                        Actualizar Estado
                      </Button>
                    )}
                    {complaint.technicianNotes && (
                      <Tooltip label="Ver notas técnicas">
                        <ActionIcon
                          color="blue"
                          onClick={() => setViewingNotes(complaint.technicianNotes)}
                        >
                          <IconNotes size={20} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                    {viewMode === 'admin' && (
                      <Tooltip label="Eliminar reclamo">
                        <ActionIcon
                          color="red"
                          onClick={() => setShowDeleteConfirm(complaint.id)}
                        >
                          <IconTrash size={20} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </Group>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal de confirmación de eliminación */}
      <Modal
        opened={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirmar eliminación"
        size="sm"
      >
        <Text mb="xl">¿Está seguro que desea eliminar este reclamo?</Text>
        <Group justify="flex-end">
          <Button variant="light" onClick={() => setShowDeleteConfirm(false)}>
            Cancelar
          </Button>
          <Button
            color="red"
            onClick={() => {
              deleteComplaint(showDeleteConfirm as string);
              setShowDeleteConfirm(false);
            }}
          >
            Eliminar
          </Button>
        </Group>
      </Modal>

      {/* Modal de confirmación de exportación */}
      <Modal
        opened={showExportConfirm}
        onClose={() => setShowExportConfirm(false)}
        title="Confirmar exportación"
        size="sm"
      >
        <Text mb="xl">¿Desea exportar los reclamos a Excel y eliminarlos del sistema?</Text>
        <Group justify="flex-end">
          <Button variant="light" onClick={() => setShowExportConfirm(false)}>
            Cancelar
          </Button>
          <Button color="blue" onClick={handleExportAndDelete}>
            Exportar y Eliminar
          </Button>
        </Group>
      </Modal>

      {/* Modal de actualización de estado */}
      <Modal
        opened={!!selectedComplaintId}
        onClose={() => {
          setSelectedComplaintId(null);
          setTechnicianNotes('');
          setSelectedTechnician('');
        }}
        title="Actualizar Estado del Reclamo"
        size="lg"
      >
        {selectedComplaint && (
          <>
            <Text size="sm" mb="xs"><strong>Cliente:</strong> {selectedComplaint.customerName}</Text>
            <Text size="sm" mb="xs"><strong>Teléfono:</strong> {selectedComplaint.phoneNumber}</Text>
            {selectedComplaint.internetNumber && (
              <Text size="sm" mb="xs"><strong>Internet:</strong> {selectedComplaint.internetNumber}</Text>
            )}
            <Text size="sm" mb="xs"><strong>Dirección:</strong> {selectedComplaint.address}</Text>
            <Text size="sm" mb="lg"><strong>Motivo:</strong> {selectedComplaint.reason}</Text>
            
            <Select
              label="Técnico Asignado"
              placeholder="Seleccione el técnico"
              data={[
                { value: 'René', label: 'René' },
                { value: 'Roman', label: 'Roman' },
                { value: 'Dalmiro', label: 'Dalmiro' },
                { value: 'Oscar', label: 'Oscar' },
                { value: 'René y Roman', label: 'René y Roman' },
                { value: 'Roman y Oscar', label: 'Roman y Oscar' },
              ]}
              value={selectedTechnician}
              onChange={(value) => setSelectedTechnician(value as TechnicianType)}
              required
              mb="md"
            />
            
            <Textarea
              label="Notas Técnicas"
              placeholder="Ingrese sus notas sobre el trabajo realizado"
              value={technicianNotes}
              onChange={(e) => setTechnicianNotes(e.currentTarget.value)}
              minRows={3}
              mb="xl"
              required
            />
            <Group justify="flex-end">
              <Button
                variant="outline"
                onClick={() => handleStatusUpdate('en_proceso')}
                color="yellow"
                disabled={!technicianNotes || !selectedTechnician}
              >
                En Proceso
              </Button>
              <Button
                onClick={() => handleStatusUpdate('resuelto')}
                color="green"
                disabled={!technicianNotes || !selectedTechnician}
              >
                Marcar como Resuelto
              </Button>
            </Group>
          </>
        )}
      </Modal>

      {/* Modal de visualización de notas */}
      <Modal
        opened={!!viewingNotes}
        onClose={() => setViewingNotes(null)}
        title="Notas Técnicas"
        size="md"
      >
        <Text>{viewingNotes}</Text>
      </Modal>
    </Paper>
  );
}