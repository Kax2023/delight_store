"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MessageSquare, Bell, MapPin, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

const PREF_KEYS = {
  emailPromos: "delight-pref-email-promos",
  smsPromos: "delight-pref-sms-promos",
  pushPromos: "delight-pref-push-promos",
  defaultAddress: "delight-pref-default-address",
  deliveryTime: "delight-pref-delivery-time",
};

export function SettingsSection() {
  const [emailPromos, setEmailPromos] = useState(true);
  const [smsPromos, setSmsPromos] = useState(false);
  const [pushPromos, setPushPromos] = useState(true);
  const [defaultAddress, setDefaultAddress] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setEmailPromos(localStorage.getItem(PREF_KEYS.emailPromos) !== "false");
    setSmsPromos(localStorage.getItem(PREF_KEYS.smsPromos) === "true");
    setPushPromos(localStorage.getItem(PREF_KEYS.pushPromos) !== "false");
    setDefaultAddress(localStorage.getItem(PREF_KEYS.defaultAddress) ?? "");
    setDeliveryTime(localStorage.getItem(PREF_KEYS.deliveryTime) ?? "");
  }, []);

  const savePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(PREF_KEYS.emailPromos, String(emailPromos));
        localStorage.setItem(PREF_KEYS.smsPromos, String(smsPromos));
        localStorage.setItem(PREF_KEYS.pushPromos, String(pushPromos));
        localStorage.setItem(PREF_KEYS.defaultAddress, defaultAddress);
        localStorage.setItem(PREF_KEYS.deliveryTime, deliveryTime);
      }
      toast.success("Preferences saved");
    } catch {
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={savePreferences} className="space-y-6">
      <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-800/50">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Communication preferences
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Choose how you want to receive offers and order updates.
        </p>
        <div className="mt-6 space-y-4">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200/70 bg-slate-50/50 p-4 dark:border-white/10 dark:bg-slate-800/30">
            <input
              type="checkbox"
              checked={emailPromos}
              onChange={(e) => setEmailPromos(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
            />
            <Mail className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Email — Promotional offers and order updates
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200/70 bg-slate-50/50 p-4 dark:border-white/10 dark:bg-slate-800/30">
            <input
              type="checkbox"
              checked={smsPromos}
              onChange={(e) => setSmsPromos(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
            />
            <MessageSquare className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              SMS — Order status and delivery alerts
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200/70 bg-slate-50/50 p-4 dark:border-white/10 dark:bg-slate-800/30">
            <input
              type="checkbox"
              checked={pushPromos}
              onChange={(e) => setPushPromos(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
            />
            <Bell className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Push notifications — Offers and reminders
            </span>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-800/50">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Delivery preferences
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Set your default address and preferred delivery time.
        </p>
        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="defaultAddress"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              <MapPin className="h-4 w-4" />
              Default delivery address
            </label>
            <Input
              id="defaultAddress"
              type="text"
              value={defaultAddress}
              onChange={(e) => setDefaultAddress(e.target.value)}
              placeholder="Enter your default address"
              className="w-full"
            />
          </div>
          <div>
            <label
              htmlFor="deliveryTime"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              <Clock className="h-4 w-4" />
              Preferred delivery time
            </label>
            <Input
              id="deliveryTime"
              type="text"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              placeholder="e.g. Morning (9–12), Afternoon (12–5)"
              className="w-full"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saving}
          className="bg-emerald-500/90 text-white hover:bg-emerald-500"
        >
          {saving ? "Saving..." : "Save preferences"}
        </Button>
      </div>
    </form>
  );
}
