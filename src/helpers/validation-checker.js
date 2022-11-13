import { separator } from "../helpers/separator";
import { seperator } from "../helpers/seperator";
export const hasValidationError = (value, validation) => {
  if (typeof value !== "string" && typeof value !== "number") return false;

  const _value = value.replaceAll(" ", "");
  if (validation === undefined || !_value) return false;
  if (validation.min !== -1 && validation.min > _value) {
    return `value must greater than ${separator(validation.min)}`;
  }
  if (validation.max !== -1 && validation.max < _value) {
    return `value must less than ${separator(validation.max)}`;
  }
 console.log(_value.split("."));
  if (
    validation.float &&
    _value.includes(seperator()) &&
    _value.split(seperator())[1].length > validation.floating
  ) {
    return `value must has ${validation.floating} decimals`;
  }
  // if (
  //   validation.digits !== -1 &&
  //   _value
  //     .toString()
  //     .replaceAll(",", "")
  //     .replaceAll(".", "")
  //     .replaceAll(":", "").length >
  //     validation.digits + (validation.floating > 0 ? validation.floating : 0)
  // ) {
  //   return `value must be ${validation.digits} digits`;
  // }
  return false;
};

export const timeValidationError = (value) => {
  const isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(
    value
  );

  if (isValid) {
    return false;
  }
  return "value must be in (hh:mm) format!";
};
