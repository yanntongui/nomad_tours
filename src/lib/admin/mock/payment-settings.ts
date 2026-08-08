import { PaymentSettings } from "@/lib/admin/types";

export const PAYMENT_SETTINGS: PaymentSettings = {
  fedapayEnabled: true,
  fedapayPublicKey: "pk_live_••••••••••••1234",
  fedapaySecretKey: "sk_live_••••••••••••5678",
  stripeEnabled: false,
  stripePublishableKey: "",
  stripeSecretKey: "",
  mobileMoneyMtnEnabled: true,
  mobileMoneyMtnNumber: "+229 97 00 00 00",
  mobileMoneyMoovEnabled: true,
  mobileMoneyMoovNumber: "+229 95 00 00 00",
  bankTransferEnabled: true,
  bankName: "Ecobank Bénin",
  bankIban: "BJ66 BJ0X XXXX XXXX XXXX XXXX XXX",
  bankBic: "ECOCBJBJ",
};
