import { OWNER_WHATSAPP } from "@/lib/data";

export default function WhatsAppButton() {
  if (!OWNER_WHATSAPP) return null;
  const digits = OWNER_WHATSAPP.replace(/\D/g, "");
  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 group-hover:opacity-50" />
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-500/30 transition-transform group-hover:scale-110">
        <svg viewBox="0 0 32 32" className="w-7 h-7 fill-current" aria-hidden="true">
          <path d="M16.003 3.5c-6.908 0-12.5 5.592-12.5 12.5 0 2.205.576 4.352 1.67 6.247L3.5 28.5l6.36-1.66a12.44 12.44 0 0 0 6.143 1.576c6.908 0 12.5-5.592 12.5-12.5s-5.592-12.5-12.5-12.5h-.003zm0 22.77c-1.88 0-3.723-.505-5.33-1.46l-.382-.227-3.776.985.996-3.68-.249-.388a10.22 10.22 0 0 1-1.56-5.45c0-5.67 4.614-10.283 10.283-10.283 5.67 0 10.284 4.613 10.284 10.283s-4.614 10.285-10.284 10.285h-.002zm5.641-7.704c-.308-.154-1.823-.9-2.105-1.002-.282-.103-.487-.154-.692.154-.205.308-.795.99-.974 1.193-.18.205-.36.23-.668.077-.308-.154-1.3-.48-2.476-1.528-.916-.816-1.535-1.824-1.715-2.13-.18-.31-.019-.477.135-.631.139-.139.308-.36.462-.54.154-.18.205-.308.308-.513.103-.206.052-.386-.025-.54-.077-.154-.692-1.667-.947-2.282-.25-.598-.504-.517-.692-.527h-.591c-.205 0-.539.077-.821.386s-1.078 1.054-1.078 2.57c0 1.516 1.105 2.98 1.26 3.185.154.206 2.176 3.322 5.272 4.658.736.318 1.31.508 1.758.65.739.235 1.411.202 1.943.122.593-.088 1.823-.745 2.08-1.465.257-.72.257-1.337.18-1.465-.077-.129-.282-.205-.59-.359z" />
        </svg>
      </span>
    </a>
  );
}
