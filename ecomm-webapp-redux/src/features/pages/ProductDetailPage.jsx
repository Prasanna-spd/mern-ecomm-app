import React from 'react'
import Navbar from '../navbar/navbar'
import ProductDetails from '../product-list/components/ProductDetails'

const ProductDetailPage = () => {
  return (
   <>
    <Navbar>
        <ProductDetails></ProductDetails>
    </Navbar>
   </>
  )
}

export default ProductDetailPage