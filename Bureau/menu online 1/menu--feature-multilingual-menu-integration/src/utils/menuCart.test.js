import { describe, expect, it } from "vitest";
import { canSubmitMenuOrder, localizeCartLines } from "./menuCart";

describe("canSubmitMenuOrder", () => {
  it("allows table-specific menus and blocks generic menus", () => {
    expect(canSubmitMenuOrder("existing-qr-token")).toBe(true);
    expect(canSubmitMenuOrder("")).toBe(false);
    expect(canSubmitMenuOrder("   ")).toBe(false);
    expect(canSubmitMenuOrder(null)).toBe(false);
  });
});

describe("localizeCartLines", () => {
  it("derives current localized meal names by stable ID and preserves cart data", () => {
    const cart = [{
      id: "line-1",
      productId: 7,
      fallbackName: "Chicken tagine",
      qty: 2,
      price: 12,
      notes: "No spice",
    }];

    expect(localizeCartLines(cart, [{ id: 7, name: "طاجين الدجاج" }])).toEqual([{
      ...cart[0],
      name: "طاجين الدجاج",
    }]);
  });

  it("uses a safe label if a cart meal is no longer available", () => {
    expect(localizeCartLines([
      { productId: 99, fallbackName: "Old name", qty: 1 },
      { productId: 100, qty: 1 },
    ], [], "Plat indisponible")).toEqual([
      { productId: 99, fallbackName: "Old name", qty: 1, name: "Old name" },
      { productId: 100, qty: 1, name: "Plat indisponible" },
    ]);
  });
});
