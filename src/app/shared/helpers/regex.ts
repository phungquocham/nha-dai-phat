export const REGEX = {
  PHONE: /^0[0-9]{9}$/,
  NUMBER: /^[0-9]*$/,
  NUMBER_TYPE_FLOOR_POSITIVE: /^[+]?([0-9]*[.])?[0-9]+$/,
  NUMBER_LENGTH_6: /^[0-9]{6}$/,
  EMAIL: /^(?=[a-z0-9][a-z0-9@._%+-]{5,253}$)[a-z0-9._%+-]{1,64}@(?:(?=[a-z0-9-]{1,63}\.)[a-z0-9]+(?:-[a-z0-9]+)*\.){1,8}[a-z]{2,63}$/
};
export const numericNumberReg = '^-?[0-9]\\d*(\\.\\d{1,2})?$';
