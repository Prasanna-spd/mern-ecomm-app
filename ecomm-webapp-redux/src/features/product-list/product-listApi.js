// A mock function to mimic making an async request for data


// const token = Cookies.get('jwt');
export function createProduct(product) {
  return new Promise(async (resolve) => {
    const response = await fetch('https://mern-ecomm-app-9amd.onrender.com/products', {
      method: 'POST',
      body: JSON.stringify(product),
      headers: { 'content-type': 'application/json' },
      credentials: 'include'
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function updateProduct(update) {
  return new Promise(async (resolve) => {
    const response = await fetch(
      'https://mern-ecomm-app-9amd.onrender.com/products/' + update.id,
      {
        method: 'PUT',
        body: JSON.stringify(update),
        headers: { 'content-type': 'application/json' ,
        // Authorization: `Bearer ${token}`
        },
        credentials: 'include'
      }
    );
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data });
  });
}

export function fetchProductById(id,token) {
  return new Promise(async (resolve) =>{
    //TODO: we will not hard-code server URL here
    const response = await fetch('https://mern-ecomm-app-9amd.onrender.com/products/'+id,{
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

export function fetchProductsByFilters(filter,sort,pagination,admin,token) {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
// pagination = {_page:1,_limit=10}
  // TODO : on server we will support multi values in filter
  // TODO : Server will filter deleted products in case of non-admin
  let queryString = '';
  for(let key in filter){
    const categoryValues = filter[key];
    if(categoryValues.length){
      const lastCategoryValue = categoryValues[categoryValues.length-1]
      queryString += `${key}=${lastCategoryValue}&`
    }
  }
  for(let key in sort){
    queryString += `${key}=${sort[key]}`
  }
  if(admin){
    queryString += `admin=true`;
  }
  console.log(pagination)
  for(let key in pagination){
    queryString += `${key}=${pagination[key]}&`
  }
  console.log(token,"this is from productlist api")
  return new Promise(async (resolve) =>{
    //TODO: we will not hard-code server URL here
    const response = await fetch('https://mern-ecomm-app-9amd.onrender.com/products?'+queryString,{
      method: 'GET',
        credentials: 'include',
        headers: {
    Authorization: `Bearer ${token}`,
  },
    }) 
    const data = await response.json()
    console.log(data,"product-listapi response")
    const totalItems = data.totalItems
    resolve({data:{products:data.products,totalItems:+totalItems}})
  }
  );
}

export function fetchCategories(token) {
  
  return new Promise(async (resolve) =>{
    const response = await fetch('https://mern-ecomm-app-9amd.onrender.com/categories',
      {
        method: 'GET',
        credentials: 'include',
        headers: {
    Authorization: `Bearer ${token}`,
  },
      }
    ) 
    const data = await response.json()
    resolve({data})
  }
  );
}

export function fetchBrands(token) {
  return new Promise(async (resolve) =>{
    const response = await fetch('https://mern-ecomm-app-9amd.onrender.com/brands',{
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