export type ServiceType = 'telefono' | 'telefono_internet' | 'fibra_optica' | 'tv' | 'tv_fibra_optica';
export type TechnicianType = 'René' | 'Roman' | 'Dalmiro' | 'Oscar' | 'René y Roman' | 'Roman y Oscar';

export interface Complaint {
  id: string;
  serviceType: ServiceType;
  phoneNumber: string;
  internetNumber?: string;
  customerName: string;
  address: string;
  reason: string;
  receivedBy: string;
  date: Date;
  time: string;
  status: 'pendiente' | 'en_proceso' | 'resuelto';
  technicianNotes?: string;
  technicianName?: TechnicianType;
  updatedAt: Date;
}