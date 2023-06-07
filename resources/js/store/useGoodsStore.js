import { create } from "zustand";

export const useGoodsStore = create((set) => ({
    goods: [],

    increaseItemAmount: (id) =>
        set((state) => ({ goods: state.goods.amount + 1 })),

    decreaseItemAmount: () =>
        set((state) => ({ goods: state.goods.amount - 1 })),
}));
