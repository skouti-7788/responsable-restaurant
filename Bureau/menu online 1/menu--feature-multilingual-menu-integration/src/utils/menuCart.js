export const canSubmitMenuOrder = (tableToken) =>
  typeof tableToken === "string" && tableToken.trim().length > 0;

export const localizeCartLines = (
  cart,
  meals,
  unavailableMealLabel = "Unavailable dish"
) => {
  const mealsById = new Map(
    meals.map((meal) => [String(meal.id), meal])
  );

  return cart.map((line) => ({
    ...line,
    name:
      mealsById.get(String(line.productId))?.name ||
      line.fallbackName ||
      unavailableMealLabel,
  }));
};
