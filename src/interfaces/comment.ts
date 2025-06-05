export interface User {
  id: string;
  full_name: string;
  image: string;
}

export interface Comment {
  id?: string;
  patient_id?:number;
  doctor_id?:number;
  rating?: any;
  patient?: User;
  feedback: string;
  created_at?: string; // ISO string or pre-formatted string
}
