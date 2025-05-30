package com.crudoperation.jw.service.serviceImp;

import com.crudoperation.jw.dto.ProductTypeDto;
import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.exception.OurException;
import com.crudoperation.jw.model.ProductType;
import com.crudoperation.jw.repo.ProductTypeRepository;
import com.crudoperation.jw.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductTypeService {

    @Autowired
    private ProductTypeRepository productTypeRepository;

    public Response addProductType(ProductType productType) {
        Response response = new Response();
        try{
            ProductType newProductType = productTypeRepository.save(productType);
            ProductTypeDto productTypeDto = Utils.mapProductTypeEntityToProductTypeDto(newProductType);
            response.setProductTypeDto(productTypeDto);
            response.setMessage("Product type added successfully");
            response.setStatusCode(200);

        }catch(Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response getProductType() {
        Response response = new Response();
        try{
            List<ProductType> productTypeList = productTypeRepository.findAll();
            List<ProductTypeDto> productTypeDtoList= Utils.mapProductTypeListEntityToProductTypeListDTO(productTypeList);
            response.setProductTypeDtoList(productTypeDtoList);
            response.setStatusCode(200);
            response.setMessage("Product type list successfully");

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response deleteProductType(int id) {
        Response response = new Response();
        try{
            Optional<ProductType> productTypeOptional = productTypeRepository.findById(id);
            if(productTypeOptional.isPresent()){
                ProductType productType = productTypeOptional.get();
                productTypeRepository.delete(productType);
            }
            response.setStatusCode(200);
            response.setMessage("Product type deleted successfully");

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response updateProductType(int id, ProductType productType) {
        Response response = new Response();
        try{
            Optional<ProductType> productTypeOptional = productTypeRepository.findById(id);

            if(productTypeOptional.isPresent()){
                 productTypeOptional.get().setProductTypeName(productType.getProductTypeName());
                 productTypeOptional.get().setDescription(productType.getDescription());
                 productTypeOptional.get().setCatagorie(productType.getCatagorie());
                 productTypeRepository.save(productTypeOptional.get());
                 response.setStatusCode(200);
                 response.setMessage("Product type updated successfully");
                 ProductTypeDto productTypeDto = Utils.mapProductTypeEntityToProductTypeDto(productTypeOptional.get());
                 response.setProductTypeDto(productTypeDto);

            }else{
                response.setStatusCode(404);
                response.setMessage("Product type not found");
            }
        }catch (OurException e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;

    }

    public Response getProductTypeByProductTypeName(String catagorie) {
        Response response = new Response();
        try{
                List<ProductType>productType=productTypeRepository.findByCatagorie(catagorie);
                List<ProductTypeDto>productTypeDtoList=Utils.mapProductTypeListEntityToProductTypeListDTO(productType);
                response.setProductTypeDtoList(productTypeDtoList);
                response.setStatusCode(200);
                response.setMessage("Product type found successfully");


        }catch (OurException e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }


    public Response getProductTypeById(int productTypeId) {
        Response response = new Response();
        try{
            Optional<ProductType> productTypeOptional = productTypeRepository.findById(productTypeId);
            if(productTypeOptional.isPresent()){
                ProductTypeDto productTypeDto = Utils.mapProductTypeEntityToProductTypeDto(productTypeOptional.get());
                response.setProductTypeDto(productTypeDto);
                response.setStatusCode(200);
                response.setMessage("Product type found successfully");

            }
        }catch (OurException e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }
}
