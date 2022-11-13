import ApiManager from "./axios-config";
import authHeader from "./auth-header";
import axios from "axios";

const API_URL = " https://tlsapi.invgap.org/facilities/";

class FacilitiesService {
  getFacilities(params) {
    return ApiManager.get(API_URL, {
      headers: { Authorization: authHeader() },
      params,
    });
  }
  getSubFacilities(id) {
    const params = { id };
    return ApiManager.get(API_URL + "parent", {
      headers: { Authorization: authHeader() },
      params,
    });
  }
  // deleteFacility(id) {
  //   return ApiManager.delete(API_URL, {
  //     headers: { Authorization: authHeader() },
  //     data: { id },
  //   });
  // }
  getFacilityFields(params) {
    return ApiManager.get(API_URL + "facility-field", {
      headers: { Authorization: authHeader() },
      params,
    });
  }
  getFacilityFields1(params) {
    return ApiManager.get(API_URL + "print", {
      headers: { Authorization: authHeader() },
      params,
    });
  }
  postFacility(payload) {
    return ApiManager.post(API_URL, payload, {
      headers: { Authorization: authHeader() },
    });
  }
  putFacility(payload) {
    return ApiManager.put(API_URL, payload, {
      headers: { Authorization: authHeader() },
    });
  }
  importFacilities(payload) {
    return ApiManager.post(
      " https://tlsapi.invgap.org/facilities/" + "import",
      payload,
      {
        headers: { Authorization: authHeader() },
      }
    );
  }
  deletefacilityparam() {
    return ApiManager.get(API_URL + "delete", {
      headers: { Authorization: authHeader() },
    });
  }
  deleteFacility(payload) {
    return ApiManager.post(API_URL + "delete", payload, {
      headers: { Authorization: authHeader() },
    });
  }
}

export default new FacilitiesService();
