import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Complaint, ServiceType, TechnicianType } from '../types/complaint';

interface ComplaintState {
  complaints: Complaint[];
  addComplaint: (complaint: {
    serviceType: ServiceType;
    phoneNumber: string;
    internetNumber?: string;
    customerName: string;
    address: string;
    reason: string;
    receivedBy: string;
    date: Date;
    time: string;
  }) => void;
  updateComplaintStatus: (
    id: string, 
    status: 'pendiente' | 'en_proceso' | 'resuelto', 
    notes?: string,
    technicianName?: TechnicianType
  ) => void;
  deleteComplaint: (id: string) => void;
  deleteAllComplaints: () => void;
}

export const useComplaintStore = create<ComplaintState>()(
  persist(
    (set) => ({
      complaints: [],
      addComplaint: (complaintData) => set((state) => ({
        complaints: [
          {
            ...complaintData,
            id: Date.now().toString(),
            status: 'pendiente',
            updatedAt: new Date(),
          },
          ...state.complaints,
        ],
      })),
      updateComplaintStatus: (id, status, notes, technicianName) => set((state) => ({
        complaints: state.complaints.map((complaint) =>
          complaint.id === id
            ? {
                ...complaint,
                status,
                technicianNotes: notes || complaint.technicianNotes,
                technicianName: technicianName || complaint.technicianName,
                updatedAt: new Date(),
              }
            : complaint
        ),
      })),
      deleteComplaint: (id) => set((state) => ({
        complaints: state.complaints.filter((complaint) => complaint.id !== id),
      })),
      deleteAllComplaints: () => set({ complaints: [] }),
    }),
    {
      name: 'complaints-storage',
    }
  )
);