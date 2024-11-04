import Cookies from 'js-cookie';

const token = Cookies.get('token');



export function createOrder(order) {
  console.log(order,"from ordrapi")
  return new Promise(async (resolve) => {
    const response = await fetch('http://localhost:8080/orders/', {
      method: 'POST',
      body: JSON.stringify(order),
      credentials:"include",
      // headers: {  },
      headers: {'content-type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
    });
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data });
  });
}


export function updateOrder(order) {
  return new Promise(async (resolve) => {
    const response = await fetch('http://localhost:8080/orders/'+order.id, {
      method: 'PUT',
      body: JSON.stringify(order),
      credentials:"include",
      // headers: {  },
      headers: {'content-type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchAllOrders(sort, pagination) {
 let queryString = '';

 for (let key in sort) {
  queryString += `${key}=${sort[key]}&`;
}
  for (let key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }

  return new Promise(async (resolve) => {
    //TODO: we will not hard-code server URL here
    const response = await fetch(
      'http://localhost:8080/orders?' + queryString
    );
    const data = await response.json();
    const totalOrders = await response.headers.get('X-Total-Count');
    resolve({ data: { orders: data, totalOrders: +totalOrders } });
  });
}