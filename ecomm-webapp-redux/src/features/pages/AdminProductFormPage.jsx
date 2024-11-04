import ProductForm from "../../features/admin/components/ProductForms";
import NavBar from "../../features/navbar/navbar";
function AdminProductFormPage() {
    return ( 
        <div>
            <NavBar>
                <ProductForm></ProductForm>
            </NavBar>
        </div>
     );
}

export default AdminProductFormPage;