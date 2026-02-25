import { create } from 'zustand';

export const useOrderStore = create((set) => ({
  // Step data
  selectedBrand: null,
  amount: null,
  senderEmail: '',
  recipientEmail: '',
  recipientName: '',
  personalMessage: '',
  hasVideoMessage: false,
  videoRecorded: false,

  // Post-payment order
  paidOrder: null,

  // Actions
  setBrand: (brand) => set({ selectedBrand: brand }),
  setAmount: (amount) => set({ amount }),
  setRecipient: ({ senderEmail, email, name, message }) =>
    set({ senderEmail, recipientEmail: email, recipientName: name, personalMessage: message }),
  setVideo: ({ hasVideoMessage, videoRecorded }) =>
    set({ hasVideoMessage, videoRecorded }),
  setPaidOrder: (order) => set({ paidOrder: order }),
  reset: () =>
    set({
      selectedBrand: null,
      amount: null,
      senderEmail: '',
      recipientEmail: '',
      recipientName: '',
      personalMessage: '',
      hasVideoMessage: false,
      videoRecorded: false,
      paidOrder: null,
    }),
}));
