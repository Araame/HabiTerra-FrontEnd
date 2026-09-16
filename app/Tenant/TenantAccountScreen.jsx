import { useState } from "react";
import { Alert } from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import FormField from "../../components/common/FormField";
import PrimaryButton from "../../components/common/PrimaryButton";
import SegmentedControl from "../../components/common/SegmentedControl";
import PropertyMiniCard from "../../components/property/PropertyMiniCard";
import { getProperty } from "./tenantMocks";

export default function TenantAccountScreen({ navigation, route }) {
  const property = getProperty(route.params?.propertyId);
  const [mode, setMode] = useState("register");
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const fields = [
    {
      key: "firstName",
      label: "Prénom",
      placeholder: "Aminata",
      autoComplete: "given-name",
    },
    {
      key: "lastName",
      label: "Nom",
      placeholder: "Diallo",
      autoComplete: "family-name",
    },
    {
      key: "phone",
      label: "Téléphone",
      placeholder: "+221 77 000 00 00",
      keyboardType: "phone-pad",
      autoComplete: "tel",
    },
    {
      key: "email",
      label: "Email",
      placeholder: "aminata@exemple.com",
      keyboardType: "email-address",
      autoCapitalize: "none",
      autoComplete: "email",
    },
    {
      key: "password",
      label: "Mot de passe",
      placeholder: "Mot de passe",
      secureTextEntry: true,
      autoCapitalize: "none",
      autoComplete: mode === "register" ? "new-password" : "current-password",
    },
  ].filter(
    (field) => mode === "register" || ["email", "password"].includes(field.key),
  );
  function submit() {
    const nextErrors = {};
    fields.forEach(({ key }) => {
      if (!values[key].trim()) nextErrors[key] = "Ce champ est requis.";
    });
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      nextErrors.email = "Saisissez une adresse email valide.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    Alert.alert(
      "Parcours de démonstration",
      "Aucun compte ne sera créé et aucune connexion ne sera effectuée.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Prévisualiser la suite",
          onPress: () =>
            navigation.navigate("TenantProfile", {
              propertyId: property.id,
              applicationFlow: true,
            }),
        },
      ],
    );
  }
  return (
    <ScreenLayout
      header={
        <ScreenHeader
          title="Mon compte"
          subtitle="Continuez pour candidater"
          onBack={() => navigation.goBack()}
        />
      }
    >
      <PropertyMiniCard
        {...property}
        introduction="Créez un compte pour postuler à "
      />
      <SegmentedControl
        options={[
          { value: "register", label: "Créer un compte" },
          { value: "login", label: "Se connecter" },
        ]}
        selectedValue={mode}
        onChange={(value) => {
          setMode(value);
          setErrors({});
        }}
      />
      {fields.map(({ key, ...field }) => (
        <FormField
          key={key}
          {...field}
          value={values[key]}
          onChangeText={(value) => setValues({ ...values, [key]: value })}
          error={errors[key]}
        />
      ))}
      <PrimaryButton
        title={mode === "register" ? "Créer mon compte" : "Se connecter"}
        icon="arrow-forward"
        onPress={submit}
      />
    </ScreenLayout>
  );
}
