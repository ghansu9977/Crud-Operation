import { Route, Routes } from "react-router-dom"
import AddProduct from "./AddProduct"
import ViewProduct from "./ViewProduct"
import UpdateProduct from "./UpdateProduct"
import ViewProductDetail from "./View"
import UploadExcel from "./UploadExcel"

const AllRoute = ()=>{
    return(<>
        <Routes>
        <Route  path="/" element={<ViewProduct />} />
        <Route  path="/Add-Product" element={<AddProduct />} />
        <Route  path="/update-product/:id" element={<UpdateProduct />} />
        <Route path="/view-product/:id" element={<ViewProductDetail />} />
        <Route path="/Upload-Excel" element={<UploadExcel />} />
        </Routes>
    </>
    )
}   
export default AllRoute