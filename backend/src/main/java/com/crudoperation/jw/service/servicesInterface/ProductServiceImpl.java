package com.crudoperation.jw.service.servicesInterface;

import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.Product;
import org.springframework.web.multipart.MultipartFile;

public interface ProductServiceImpl {

    public Response addProduct(Product product, MultipartFile imagefile);
    public Product getProduct(int id);
    public Response getAllProduct();

    public Response updateProduct(Product product, MultipartFile imageFile, int productId);
    public Response checkQuantity(int id, int quantity);

    public Product getProductWithMinimumPrice();

    public Product getProductWithMaximumPrice();
    public Response getProductsByCatagorie(String catagorie);
    public Response getProductsByProductType(String productType);
    public Response deleteProduct(int id);
}
