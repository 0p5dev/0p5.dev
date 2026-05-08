export const useFetchUserData = async () => {
  const supabaseUser = useSupabaseUser();
  if (!supabaseUser.value) {
    return;
  }
  const userData = useUserData();
  try {
    const { user } = await $fetch<any>("/api/user", {
      credentials: "include",
    });
    if (user) {
      userData.value = user;
    }
  } catch (err: any) {
    console.error("Error fetching user data: ", err);
  }
};
