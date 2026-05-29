export const useUserData = () =>
  useState<any>("userData", () => {
    return {};
  });

export const useHasPaymentMethod = () => {
  const hasPaymentMethod = useState<boolean>("hasPaymentMethod", () => false);
  const userData = useUserData();

  watch(
    () => userData.value?.stripe_payment_method_id,
    (id) => {
      hasPaymentMethod.value = !!id;
    },
    { immediate: true },
  );

  return hasPaymentMethod;
};
