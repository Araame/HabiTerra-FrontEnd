import { useEffect, useState } from "react";
import { Text } from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import PrimaryButton from "../../components/common/PrimaryButton";
import FormField from "../../components/common/FormField";

export default function VerificationScreen({ navigation, flow }) {
  const [code, setCode] = useState("");
  const [now, setNow] = useState(Date.now());
  const { registration, timing, phase, error } = flow;
  const verified = !!registration.registrationToken;
  const busy = !!phase;
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => { if (verified) setCode(""); }, [verified]);
  const expires = Math.max(0, Math.ceil(((timing?.expiresAt ?? 0) - now) / 1000));
  const cooldown = Math.max(0, Math.ceil(((timing?.resendAt ?? 0) - now) / 1000));
  const minutes = String(Math.floor(expires / 60)).padStart(2, "0");
  const seconds = String(expires % 60).padStart(2, "0");
  async function submit() {
    if (await flow.verify(code)) {
      setCode("");
      navigation.navigate("CompleteProfile");
    }
  }
  return (
    <ScreenLayout primaryHeader={false} header={
      <ScreenHeader title="Vérification" variant="light" onBack={() => navigation.goBack()} />
    }>
      <Text className="mt-5 text-center font-bold text-3xl text-primary">HabiTerra</Text>
      <Text className="text-center font-semibold text-2xl text-text">
        {verified ? "Identifiant vérifié" : "Code de vérification"}
      </Text>
      <Text className="text-center font-sans text-sm leading-6 text-muted">
        {verified ? "Votre identifiant est vérifié. Vous pouvez compléter votre profil."
          : `Nous avons envoyé un code ${registration.identifier.includes("@") ? "à" : "au"} ${registration.identifier}`}
      </Text>
      {!verified && <>
        <FormField
          label="Code de vérification à 6 chiffres"
          value={code}
          onChangeText={text => setCode(text.replace(/\D/g, "").slice(0, 6))}
          disabled={busy || expires === 0}
          keyboardType="number-pad"
          maxLength={6}
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="000000"
          style={{ textAlign: "center", fontSize: 24, letterSpacing: 8 }}
        />
        <Text className="text-center font-sans text-sm text-muted">
          {expires > 0 ? `Le code expire dans ${minutes}:${seconds}` : "Le code a expiré ou n’est plus utilisable. Demandez un nouveau code."}
        </Text>
      </>}
      {error && <Text accessibilityRole="alert" className="font-sans text-sm text-danger">{error}</Text>}
      <>
        <PrimaryButton
          title={phase === "verify" ? "Vérification…" : verified ? "Compléter mon profil" : "Vérifier"}
          loading={phase === "verify"}
          disabled={busy || (!verified && (!/^[0-9]{6}$/.test(code) || expires === 0))}
          onPress={submit} />
        {!verified && <PrimaryButton variant="outline"
          title={phase === "resend" ? "Envoi du code…" : cooldown > 0 ? `Renvoyer le code dans ${cooldown} s` : "Renvoyer le code"}
          loading={phase === "resend"} disabled={busy || cooldown > 0}
          onPress={() => { setCode(""); flow.resend(); }} />}
      </>
    </ScreenLayout>
  );
}
