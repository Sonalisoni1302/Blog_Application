import axios from 'axios';

export const filterPagination = async ({ create_new_arr = false, state, data, page, countRoute, data_to_send = {}, user = undefined }) => {
  let obj;
  let totalDocs;

  let headers = {};

  if(user){
    headers.headers = {
      'Authorization' : `Bearer ${user}`
    }
  }

  // Always fetch the totalDocs count
  await axios
    .post(process.env.REACT_APP_SERVER_DOMAIN + countRoute, data_to_send, headers)
    .then(({ data: { totalDocs: count } }) => {
      totalDocs = count;
    })
    .catch(err => {
      console.log(err);
    });

  if (state !== null && !create_new_arr) {
    obj = { ...state, results: [...state.results, ...data], page, totalDocs };
  } else {
    obj = { results: data, page: 1, totalDocs };
  }

  return obj;
};
