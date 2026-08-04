let scriptPromise: Promise<void> | null = null;

function loadScript(src: string): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
  return scriptPromise;
}

export interface RazorpayOptions {
  key: string;
  amount: number; // in rupees
  currency?: string;
  name: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  onSuccess: (paymentId: string) => void;
  onDismiss: () => void;
}

export async function openRazorpay(options: RazorpayOptions): Promise<void> {
  await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  const Razorpay = (window as unknown as {
    Razorpay: new (config: Record<string, unknown>) => { open: () => void };
  }).Razorpay;

  if (!Razorpay) {
    throw new Error("Razorpay SDK is not available");
  }

  const instance = new Razorpay({
    key: options.key,
    amount: Math.round(options.amount * 100),
    currency: options.currency || "INR",
    name: options.name,
    description: options.description,
    prefill: options.prefill,
    handler: (response: { razorpay_payment_id?: string }) => {
      if (response.razorpay_payment_id) {
        options.onSuccess(response.razorpay_payment_id);
      } else {
        options.onDismiss();
      }
    },
    modal: {
      ondismiss: options.onDismiss,
    },
  });

  instance.open();
}

export function isRazorpayConfigured(): boolean {
  return Boolean(import.meta.env.VITE_RAZORPAY_KEY_ID);
}
