import React from 'react'
import Navbar from '../navbar/navbar'
import ProductList from '../product-list/components/ProductList'
import { Link } from "react-router-dom";

const Home = () => {
  return (
   <>
    <Navbar>
        <ProductList></ProductList>
    </Navbar>
   </>
  )
}

export default Home