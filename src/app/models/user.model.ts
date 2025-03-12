export interface User {
    name: string;
    age: number;
    mail: string;
    password: string;
    available?: boolean; // Opcional, ya que el backend lo define por defecto como true
  }
  