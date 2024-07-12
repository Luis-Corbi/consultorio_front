export interface Speciality {
    id: number;
    name: string;
  }
  
  export interface Role {
    id: number;
    name: string;
  }
  
  export interface User {
    id: number;
    username: string;
    name: string;
    lastname: string;
    DNI: string;
    telephone: string;
    email: string;
    address: string;
    gender: string;
    birth_date: string;
    health_insurance: string;
    health_insurance_number: string;
    licence_number: string;
    speciality: Speciality;
    notes: string;
    roles: Role[];
  }
  
  export interface Appointment {
    id?: number;
    professional: number;
    patient: number;
    date: string;
    hour: string;
    status: string;
    notes: string;
  }
  