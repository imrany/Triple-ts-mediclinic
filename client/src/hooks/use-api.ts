import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  Patient,
  Staff,
  AppointmentWithStaff,
  PatientWithAppointments,
  CreatePatientPayload,
  CreateAppointmentPayload,
  CreateStaffPayload,
} from "@/lib/types";

// ── Patients ──────────────────────────────────────────────

export function usePatients() {
  return useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: () => api.get<Patient[]>("/patients"),
  });
}

export function usePatient(id: string) {
  return useQuery<PatientWithAppointments[]>({
    queryKey: ["patients", id],
    queryFn: () => api.get<PatientWithAppointments[]>(`/patients/${id}`),
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePatientPayload) =>
      api.post<{ message: string; patient: Patient }>("/patients", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["patients"] }),
  });
}

export function useUpdatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePatientPayload> }) =>
      api.patch<{ message: string }>(`/patients/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["patients"] }),
  });
}

export function useDeletePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<{ message: string }>(`/patients/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["patients"] }),
  });
}

// ── Appointments ──────────────────────────────────────────

export function useAppointments() {
  return useQuery<AppointmentWithStaff[]>({
    queryKey: ["appointments"],
    queryFn: () => api.get<AppointmentWithStaff[]>("/appointments"),
  });
}

export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAppointmentPayload) =>
      api.post<{ message: string }>("/appointments", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
}

// ── Staff ─────────────────────────────────────────────────

export function useStaffList() {
  return useQuery<Staff[]>({
    queryKey: ["staff"],
    queryFn: () => api.get<Staff[]>("/staff"),
  });
}

export function useCreateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStaffPayload) =>
      api.post<{ message: string }>("/staff", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useUpdateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateStaffPayload> }) =>
      api.patch<{ message: string }>(`/staff/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useDeleteStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<{ message: string }>(`/staff/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}
