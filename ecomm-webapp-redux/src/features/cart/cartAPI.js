
export function addToCart(item, token) {
  return new Promise(async (resolve, reject) => {
    console.log(token,"token")
    try {
      const response = await fetch('https://mern-ecomm-app-9amd.onrender.com/cart', {
        method: 'POST',
        body: JSON.stringify(item),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Server should only return necessary info about the user
      resolve({ data });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      reject(error);
    }
  });
}

export function fetchItemsByUserId(token) {
  return new Promise(async (resolve) => {
    //TODO: we will not hard-code server URL here
    const response = await fetch('https://mern-ecomm-app-9amd.onrender.com/cart',{
        method: 'GET',
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
    Authorization: `Bearer ${token}`,}});
    console.log(response);
    const data = await response.json();
    resolve({ data });
  });
}

export function updateCart(update) {
  return new Promise(async (resolve) => {
    const response = await fetch('https://mern-ecomm-app-9amd.onrender.com/cart/' + update.id, {
      method: 'PUT',
      body: JSON.stringify(update),
      credentials: 'include',
      headers: { 'content-type': 'application/json',
      // Authorization: `Bearer ${token}`,
       },
    });
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data });
  });
}

export function deleteItemFromCart(itemId,token) {
  return new Promise(async (resolve) => {
    const response = await fetch('https://mern-ecomm-app-9amd.onrender.com/cart/' + itemId, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
       },
    });
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data: { id: itemId } });
  });
}

export function resetCart(token) {
  // get all items of user's cart - and then delete each
  return new Promise(async (resolve) => {
    const response = await fetchItemsByUserId();
    const items = response.data;
    for (let item of items) {
      await deleteItemFromCart(item.id,token);
    }
    resolve({status:'success'})
  });
}