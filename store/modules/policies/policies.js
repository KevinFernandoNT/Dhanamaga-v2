import { actionType } from "./actions.js";
import { authAxios } from "../../api";

//get sample lessons of home screen
export const getPoliciesDetails = (policies) => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionType.POLICIES_LOADING, payload: true });
      const res = await authAxios.post("api/v1/policies", policies);
      if (res) {
        dispatch({ type: actionType.POLICIES_SUCCESS, payload: res.data });
        return res.data;
      }
    } catch (err) {
      if (err.response) {
        dispatch({ type: actionType.POLICIES_FAILED, payload: err.response });
      }
    }
  };
};
