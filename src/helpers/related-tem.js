export const relatedFields = {
  IsItFunctioning: ["ReasonsForNotFunctioning", "NotInUseSince"],
};

export const isRelatedFieldOk = (currentFieldStateName, fieldsValue) => {
  for (const key in relatedFields) {
    const fields = relatedFields[key];
    if (fields.indexOf(currentFieldStateName) >= 0) {
      
      if (fieldsValue[key] !== undefined && fieldsValue[key] !== null) {
        return !fieldsValue[key];
      } else {
        return false;
      }
    }
  }
  return true;
};
