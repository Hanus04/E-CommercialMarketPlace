import { Redirect, Stack } from "expo-router"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"

export default function AuthRoutesLayout() {
  const user = useSelector((state: RootState) => state.user.currentUser)

  if (user) return <Redirect href="/(auth)/sign-in" />

  return <Stack screenOptions={{ headerShown: false }} />
}
