export function toCapitalizeFirstLetter(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toFormatedControlMode(mode) {
  if (mode === "semi_auto") {
    return "semi-auto";
  }
  return mode;
}
