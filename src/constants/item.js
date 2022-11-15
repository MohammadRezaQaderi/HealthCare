/**
 * PQS field names
 * @type {Object}
 * @property {string} name - the name of the field
 * @property {string} label - the label of the field
 * @property {string} type - the type of the field
 * @property {string} state - the state of the field 
 * state property is used in backend to determine key of json must be send to backend
 */
export const fromPQSFields = [
  {
    id: "PQSPISCode",
    name: "PQS/PIS Code:",
    topic: "",
    type: "text",
    active: true,
    disabled: false,
    required: false,
    state: "PQSPISCode",
    params: [],
  },
  {
    id: "PQSPISType",
    name: "PQS/PIS-Type:",
    topic: "",
    type: "text",
    active: true,
    disabled: false,
    required: false,
    state: "PQSPISType",
    params: [],
  },
  {
    id: "PQSPISManufacturer",
    name: "PQS/PIS-Manufacturer",
    topic: "",
    type: "text",
    active: true,
    disabled: false,
    required: false,
    state: "PQSPISManufacturer",
    params: [],
  },

  {
    id: "PQSPISRefrigerantGas",
    name: "PQS/PIS-Refrigerant gas",
    topic: "",
    type: "text",
    active: true,
    disabled: false,
    required: false,
    state: "PQSPISRefrigerantGas",
    params: [],
  },
];
