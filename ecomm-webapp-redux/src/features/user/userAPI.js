
export function fetchLoggedInUserOrders(token) {
    return new Promise(async (resolve) =>{
      const response = await fetch('https://mern-ecomm-app-9amd.onrender.com/orders/own/',{
        method: 'GET',
        credentials: 'include',
        headers: {
    Authorization: `Bearer ${token}`,
  },
    })
      const data = await response.json()
      resolve({data})
    }
    );
  }

  export function fetchLoggedInUser(token) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('https://mern-ecomm-app-9amd.onrender.com/users/own',{
        method: 'GET',
        credentials: 'include',
        headers: {
    Authorization: `Bearer ${token}`,
  },
    });
        if (!response.ok) { // Check if the response status is not OK (200-299)
          const errorText = await response.text();
          reject(new Error(errorText)); // Reject the promise with an error
          return;
        }
        const data = await response.json();
        console.log(data, "response from user backend");
        resolve({ data });
      } catch (error) {
        reject(error); // Reject the promise with the caught error
      }
    });
  }
  
  
  export function updateUser(update) {
    return new Promise(async (resolve) => {
      const response = await fetch('https://mern-ecomm-app-9amd.onrender.com/users/'+update.id, {
        method: 'PUT',
        body: JSON.stringify(update),
        credentials:"include",
      // headers: {  },
      headers: {'content-type': 'application/json',
    Authorization: `Bearer ${update.token}`,
  },
      });
      const data = await response.json();
      // TODO: on server it will only return some info of user (not password)
      resolve({ data });
    });
  }