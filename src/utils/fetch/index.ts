export type MethodType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

async function fetchAPI(
  endpoint: string,
  method: MethodType,
  data?: any,
  headers?: any
) {
  const options: any = {
    method,
    headers: headers || {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify({ ...data });
  }

  const response = await fetch(`${endpoint}`, options);

  return response.json();
}

export default fetchAPI;

// function wait(delay) {
//   return new Promise((resolve) => setTimeout(resolve, delay));
// }

// export async function retryFetch(
//   data,
//   endpoint,
//   method,
//   tries,
//   delay,
//   headers
// ) {
//   const options = {
//     method,
//     headers: headers
//       ? headers
//       : {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//     body: JSON.stringify({ ...data }),
//   };

//   async function onError(err) {
//     triesLeft = tries - 1;
//     if (!triesLeft) {
//       throw err;
//     }
//     await wait(delay);
//     return await fetchAPI(data, endpoint, method, tries, delay, headers);
//   }

//   try {
//     return await fetch(`${BASE_URL}${endpoint}`, options);
//   } catch (err_1) {
//     return onError(err_1);
//   }
// }
