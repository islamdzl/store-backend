
declare global {
  interface Store {
    name: string;
    description: string;
    banner?: string;
    contact: Store.Contact
  }
  
  namespace Store {
    interface Contact {
      phone1?: string;
      phone2?: string;
      email?: string;
      location?: string;
    }
  }
}