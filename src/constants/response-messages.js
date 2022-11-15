/**
 * @constant responseMessages - Response messages for the application
 * @type {Object}
 * get status from request and then get message from this object
 */
export const responseMessages = {
  //series 2xx
  200: {
    fa: "Success",
  },
  201: {
    fa: "Created successfully",
  },
  202: {
    fa: "Request accepted",
  },
  203: {
    fa: "Information is not authoritative",
  },
  204: {
    fa: "No content",
  },

  //series 4xx
  400: {
    fa: "Request is not valid",
  },
  401: {
    fa: "Not authorized",
  },
  403: {
    fa: "Cannot access",
  },
  404: {
    fa: "No valid entry found",
  },
  406: {
    fa: "Imported file is not valid",
  },

  //series 5xx
  500: {
    fa: "Server error",
  },
 

  //default
  success: { fa: "Succesfull" },
  failed: { fa: "Request failed" },
};
