import { useRef, useState } from "react";
import { Text, View } from "react-native";
import { useAuth } from "../../app/Auth/AuthContext";
import PrimaryButton from "./PrimaryButton";

export default function LogoutButton({ allowUnrestored = false }) {
  const { logout, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pending = useRef(false);
  if (!isAuthenticated && !allowUnrestored) return null;
  async function submit() {
    if (pending.current) return;
    pending.current = true;
    setLoading(true);
    setError(null);
    try { await logout(); }
    catch (failure) { setError(failure.message); }
    finally { pending.current = false; setLoading(false); }
  }
  return (
    <View className="gap-2 p-4">
      {error && <Text accessibilityRole="alert" className="text-danger">{error}</Text>}
      <PrimaryButton title="Se déconnecter" variant="outline" loading={loading} onPress={submit} />
    </View>
  );
}
