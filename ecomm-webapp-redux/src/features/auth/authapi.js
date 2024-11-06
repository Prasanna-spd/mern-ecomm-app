export function createUser(userData) {
  return new Promise(async (resolve) => {
    const response = await fetch('https://mern-ecomm-app-9amd.onrender.com/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {'content-type': 'application/json',
        Authorization: `Bearer ${userData.token}`,
      },
    });
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data });
  });
}

// export function loginUser(loginInfo) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const response = await fetch('https://mern-ecomm-app-9amd.onrender.com/auth/login', {
//         method: 'POST',
//         body: JSON.stringify(loginInfo),
//         headers: { 'content-type': 'application/json' },
//       });
//       if (response.ok) {
//         const data = await response.json();
//         resolve({ data });
//       } else {
//         const error = await response.text();
//         reject(error);
//       }
//     } catch (error) {
//       reject( error );
//     }

//     // TODO: on server it will only return some info of user (not password)
//   });
// }


export function loginUser(loginInfo) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('https://mern-ecomm-app-9amd.onrender.com/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginInfo),
        headers: { 'content-type': 'application/json' },
        credentials:"include"
      });
      // 
      if (response) {
        // Check for empty response before parsing JSON

        const text = await response.text();
        if (text) {
          const data = JSON.parse(text);

          resolve({ data });
        } else {
          resolve({ data: null }); // Handle empty response
        }
      } else {
        const error = await response.text();
        console.log("this is the checkauth error ",error);
        reject(new Error(error));
      }
    } catch (error) {
      console.log("this is the checkauth error ",error);
      reject(new Error(error.message || 'Network Error'));
    }
  });
}



export function checkAuth(token) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('https://mern-ecomm-app-9amd.onrender.com/auth/check', {
        method: 'GET',
        credentials: 'include',
        headers: {
    Authorization: `Bearer ${token}`,
  },
    });
      if (response.ok) {
        const data = await response.json();
        console.log("this s  the ccheckkkauth data",data);
        resolve({ data });
      } else {
        const error = await response.text();
        console.log("this is the checkauth error ",error);
        reject(error);
      }
    } catch (error) {
      console.log("this is the checkauth actual error ",error);

      reject( error );
    }

    // TODO: on server it will only return some info of user (not password)
  });
}


export function signOut() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('https://mern-ecomm-app-9amd.onrender.com/auth/logout', {
        method: 'GET',
        credentials: 'include',
  //       headers: {
  //   // Authorization: `Bearer ${token}`,
  // },
    });
      // console.log(response,"thisis from signout",Cookies.get('token'));
      if (response.ok) {
        // Remove the token cookie on successful logout
        // console.log(response,"thisis from signout",Cookies.get('token'))
        // Cookies.remove('token'); // Clears the cookie named 'token'
        resolve({ data: 'success' });
      } else {
        const error = await response.text();
        reject(new Error(error));
      }
    } catch (error) {
      console.log(error)
      reject( error );
    }
  });
}