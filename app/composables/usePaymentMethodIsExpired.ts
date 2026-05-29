export const usePaymentMethodIsExpired = (paymentMethod: any) => {
  const expired = ref<boolean>(false);

  const computeExpired = (pm: any) => {
    if (!pm) return false;
    const expYear = pm.exp_year;
    const expMonth = pm.exp_month;
    if (expYear == null || expMonth == null) return false;
    const now = new Date();
    const expDate = new Date(expYear, expMonth - 1);
    return expDate < now;
  };

  watch(
    () => unref(paymentMethod),
    (newVal) => {
      expired.value = computeExpired(newVal);
    },
    { immediate: true, deep: true },
  );

  return computed(() => expired.value);
};
