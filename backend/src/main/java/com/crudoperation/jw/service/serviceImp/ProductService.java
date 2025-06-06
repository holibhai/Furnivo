package com.crudoperation.jw.service.serviceImp;

import com.crudoperation.jw.dto.ProductDto;
import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.exception.OurException;
import com.crudoperation.jw.model.Catagorie;
import com.crudoperation.jw.model.Product;
import com.crudoperation.jw.repo.ProductRepository;
import com.crudoperation.jw.service.servicesInterface.ProductServiceImpl;
import com.crudoperation.jw.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService implements ProductServiceImpl {

    @Autowired
    private ProductRepository productRepository;

     @Override
    public Response addProduct(Product product, MultipartFile imagefile) {
        Response response = new Response();
        System.out.println(product.getProductQuantity());
        System.out.println(product.getProductName());
        System.out.println(product.getProductDescription());
        try {
            System.out.println("dcniece");
            if (imagefile != null && !imagefile.isEmpty()) {
                product.setImageName(imagefile.getOriginalFilename());
                product.setImageType(imagefile.getContentType());
                product.setImageData(imagefile.getBytes());
                product.setDate(new Date());
                productRepository.save(product);
                response.setStatusCode(200);
                response.setMessage("Product added successfully");
            } else {
                response.setStatusCode(400);
                response.setMessage("Image file is empty");
            }


        } catch (OurException e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return response;
    }

    @Override
    public Product getProduct(int id) {
        Optional<Product> product = productRepository.findById(id);
        return product.orElse(null);
    }

    @Override
    public Response getAllProduct() {
        Response response = new Response();
        try {
            List<Product> products = productRepository.findAll();
            List<ProductDto> productDtos = Utils.mapProductListEntityToProductListDTO(products);
            response.setStatusCode(200);
            response.setMessage("Product list successfully");
            response.setProductDtoList(productDtos);
        } catch (OurException e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;

    }

    @Override
    public Response updateProduct(Product product, MultipartFile imageFile, int productId) {
        Response response = new Response();

        try {
            Optional<Product> productOptional = productRepository.findById(productId);
            if (productOptional.isEmpty()) {
                response.setStatusCode(404);
                response.setMessage("Product not found");
                return response;
            }

            Product existingProduct = productOptional.get();

            // Update image if provided
            if (imageFile != null && !imageFile.isEmpty()) {
                existingProduct.setImageName(imageFile.getOriginalFilename());
                existingProduct.setImageType(imageFile.getContentType());
                existingProduct.setImageData(imageFile.getBytes());
            }

            // Update product fields
            existingProduct.setProductName(product.getProductName());
            existingProduct.setProductPrice(product.getProductPrice());
            existingProduct.setDiscount(product.getDiscount());
            existingProduct.setProductQuantity(product.getProductQuantity());
            existingProduct.setProductType(product.getProductType());
            existingProduct.setDate(product.getDate());
            existingProduct.setDescription(product.getDescription());
            existingProduct.setDepth(product.getDepth());
            existingProduct.setHeight(product.getHeight());
            existingProduct.setWidth(product.getWidth());
            existingProduct.setCategory(product.getCategory());
            existingProduct.setWarrantyInf(product.getWarrantyInf());

            productRepository.save(existingProduct);

            response.setStatusCode(200);
            response.setMessage("Product updated successfully");

        } catch (OurException e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        } catch (IOException e) {
            response.setStatusCode(500);
            response.setMessage("Failed to process image");
        }

        return response;
    }


    @Override
    public Response checkQuantity(int id, int quantity) {
        Response response = new Response();
        try {
            int count = productRepository.findProductQuantityById(id);
            if (count > quantity) {
                response.setStatusCode(200);
                response.setMessage("product available");
            } else {
                response.setStatusCode(400);
                response.setMessage("product not available");
                ProductDto productDto = new ProductDto();
                productDto.setProductQuantity(count);
                response.setProductDto(productDto);
            }
        } catch (OurException e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());

        }
        return response;
    }

    @Override
    public Product getProductWithMinimumPrice() {
        return productRepository.findTopByOrderByProductPriceAsc();
    }

    @Override
    public Product getProductWithMaximumPrice() {
        return productRepository.findTopByOrderByProductPriceDesc();
    }

    @Override
    public Response getProductsByCatagorie(String catagorie) {
        Response response = new Response();
        try {
            List<Product> products = productRepository.findProductByCategory(catagorie);
            List<ProductDto> productDtos = Utils.mapProductListEntityToProductListDTO(products);
            response.setStatusCode(200);
            response.setMessage("Product list successfully");
            response.setProductDtoList(productDtos);

        } catch (OurException e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    @Override
    public Response getProductsByProductType(String productType) {
        Response response = new Response();
        try {
            List<Product> products = productRepository.findProductByProductType(productType);
            List<ProductDto> productDtos = Utils.mapProductListEntityToProductListDTO(products);
            response.setStatusCode(200);
            response.setMessage("Product list successfully");
            response.setProductDtoList(productDtos);
        } catch (OurException e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());

        }
        return response;
    }

    @Override
    public Response deleteProduct(int id) {
        Response response = new Response();
        try{
            productRepository.deleteById(id);
            response.setStatusCode(200);
            response.setMessage("Product deleted successfully");
        }catch (OurException e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

}



