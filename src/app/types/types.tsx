export interface Speciality {
    id: number;
    name: string;
  }
  
  export interface Role {
    id: number;
    name: string;
  }
  
  export interface User {
    id: number; // asumiendo que tienes un campo id
    username: string;
    password: string;
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
    speciality: { id: number; name: string } | undefined; // O el tipo que sea adecuado
    notes: string;
    roles: Role[]; // Aquí aseguramos que roles es un arreglo de objetos Role
    color: string;
}

  export interface EditableUser {
    id: string;
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
    notes: string;
    color?: string;
    // Hacer password opcional ya que no se edita en el formulario
    password?: string;
    // La especialidad y roles también pueden ser opcionales en el formulario si no se editan
    speciality?: string;
    roles?: { id: number; name: string }[];
    
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
