
declare global {
  interface Store {
    name: string;
    description: string;
    contact: Store.Contact;
    media: Store.Media;
    pixels: Store.Pixels;
    private?: Store.Private;
  }
  
  namespace Store {
    interface Private {
      admins: string[];
      superAdmins?: string[]
    }

    interface Pixels {
      facebook: string[];
      tiktok: string[];
    }
    interface Contact {
      phone1?: string;
      phone2?: string;
      email?: string;
      location?: string;
    }
    interface Media {
      tiktok?: string;
      facebook?: string;
      instagram?: string;
    }

    interface Update extends Omit<Partial<Store>, ''> {
      logo?: string;
      banner?: string;
      pixels: Store.Pixels;
      private: {
        admins: string[]
      }
    }
  }
}