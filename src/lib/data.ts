import { getSupabase, isSupabaseConfigured } from "./supabase";

export interface Service {
  id: string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  price: number;
  duration_minutes: number;
  icon: string;
  order_index: number;
  active: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title_en: string;
  title_hi: string;
  content_en: string;
  content_hi: string;
  category_en: string;
  category_hi: string;
  image_url: string | null;
  video_url: string | null;
  type: string;
  published: boolean;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  type: string;
  url: string;
  caption_en: string;
  caption_hi: string;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content_en: string;
  content_hi: string;
  rating: number;
  image_url: string | null;
  active: boolean;
}

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  dob: string | null;
  tob: string | null;
  pob: string | null;
  concern: string;
  service_id: string | null;
  service_title: string | null;
  amount: number;
  currency: string;
  payment_status: string;
  payment_id: string | null;
  status: string;
  created_at: string;
}

export interface Horoscope {
  id: string;
  rashi: string;
  period: string;
  text_en: string;
  text_hi: string;
  for_date: string;
}

async function from<T>(
  table: string,
  fallback: T[]
): Promise<T[]> {
  if (!isSupabaseConfigured()) return fallback;
  const { data, error } = await getSupabase().from(table).select("*");
  if (error) {
    console.error(`Failed to load ${table}:`, error.message);
    return fallback;
  }
  return (data as T[]) || fallback;
}

export const api = {
  services: (): Promise<Service[]> =>
    from<Service>("services", []),

  blog: (): Promise<BlogPost[]> =>
    from<BlogPost>("blog_posts", []),

  gallery: (): Promise<GalleryItem[]> =>
    from<GalleryItem>("gallery_items", []),

  testimonials: (): Promise<Testimonial[]> =>
    from<Testimonial>("testimonials", []),

  horoscopes: (): Promise<Horoscope[]> =>
    from<Horoscope>("horoscopes", []),

  createBooking: async (input: {
    name: string;
    phone: string;
    email?: string;
    dob?: string;
    tob?: string;
    pob?: string;
    concern: string;
    service_id?: string;
    service_title?: string;
    amount?: number;
  }): Promise<Booking | null> => {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await getSupabase()
      .from("bookings")
      .insert({
        ...input,
        amount: input.amount || 0,
        payment_status: input.amount ? "pending" : "unpaid",
        status: "pending",
      })
      .select()
      .single();
    if (error) {
      console.error("Failed to create booking:", error.message);
      throw new Error(error.message);
    }
    return data as Booking;
  },

  updateBooking: async (
    id: string,
    patch: Partial<Booking>
  ): Promise<boolean> => {
    if (!isSupabaseConfigured()) return false;
    const { error } = await getSupabase()
      .from("bookings")
      .update(patch)
      .eq("id", id);
    if (error) {
      console.error("Failed to update booking:", error.message);
      throw new Error(error.message);
    }
    return true;
  },

  deleteBooking: async (id: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) return false;
    const { error } = await getSupabase().from("bookings").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete booking:", error.message);
      throw new Error(error.message);
    }
    return true;
  },

  createLead: async (input: {
    name?: string;
    dob: string;
    tob?: string;
    pob?: string;
    result: unknown;
  }): Promise<void> => {
    if (!isSupabaseConfigured()) return;
    const { error } = await getSupabase().from("kundli_logs").insert(input);
    if (error) console.error("Failed to save kundli lead:", error.message);
  },

  createContact: async (input: {
    name: string;
    email?: string;
    message: string;
  }): Promise<void> => {
    if (!isSupabaseConfigured()) return;
    const { error } = await getSupabase().from("contact_messages").insert(input);
    if (error) console.error("Failed to save contact message:", error.message);
  },
};

export const OWNER_WHATSAPP =
  (import.meta.env.VITE_OWNER_WHATSAPP as string | undefined) || "";

export function whatsappLink(phone: string, message?: string) {
  const digits = phone.replace(/\D/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}
