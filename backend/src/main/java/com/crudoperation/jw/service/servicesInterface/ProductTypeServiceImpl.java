package com.crudoperation.jw.service.servicesInterface;

import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.ProductType;

public interface ProductTypeServiceImpl {
    public Response addProductType(ProductType productType);
    public Response getProductType();
    public Response deleteProductType(int id);
    public Response updateProductType(int id, ProductType productType);
    public Response getProductTypeByProductTypeName(String catagorie);
    public Response getProductTypeById(int productTypeId);
}
