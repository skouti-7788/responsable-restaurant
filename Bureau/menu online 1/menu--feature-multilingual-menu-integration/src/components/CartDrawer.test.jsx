import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CartDrawer from "./CartDrawer";

describe("CartDrawer generic QR behavior", () => {
  it("disables order submission when there is no table-specific QR token", () => {
    const onPlaceOrder = vi.fn();

    render(
      <CartDrawer
        open
        cart={[
          {
            id: "line-1",
            name: "Soup",
            qty: 1,
            price: 10,
            notes: "",
          },
        ]}
        orderAllowed={false}
        subtotal={10}
        tax={0.9}
        total={10.9}
        onClose={vi.fn()}
        onInc={vi.fn()}
        onDec={vi.fn()}
        onNotes={vi.fn()}
        onRemove={vi.fn()}
        onPlaceOrder={onPlaceOrder}
        submitting={false}
        error={null}
      />
    );

    const submitButton = screen.getByRole("button", {
      name: /ordering requires a table-specific qr code/i,
    });

    expect(screen.getByRole("status")).toHaveTextContent(
      "Ordering requires a table-specific QR code."
    );
    expect(submitButton).toBeDisabled();
    fireEvent.click(submitButton);
    expect(onPlaceOrder).not.toHaveBeenCalled();
  });
});
