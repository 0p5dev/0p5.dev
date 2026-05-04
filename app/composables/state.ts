export const useHasPaymentMethod = () => useState<boolean>("hasPaymentMethod", () => {
    const user = useSupabaseUser();
    // console.log("User in useHasPaymentMethod:", user.value);
    return !!user.value?.user_metadata?.app_user?.stripe_payment_method_id;
});

export const usePaymentMethodIsExpired = () => useState<boolean>("paymentMethodIsExpired", () => {
    const user = useSupabaseUser();
    const paymentMethod = user.value?.user_metadata?.app_user?.stripe_payment_method;
    if (!paymentMethod) {
        return false;
    }
    const currentDate = new Date();
    const expDate = new Date(paymentMethod.exp_year, paymentMethod.exp_month - 1);
    return expDate < currentDate;
});