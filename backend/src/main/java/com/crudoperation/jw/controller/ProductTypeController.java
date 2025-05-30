package com.crudoperation.jw.controller;

import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.ProductType;
import com.crudoperation.jw.service.serviceImp.ProductTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/productType")
public class ProductTypeController {

    @Autowired
    private ProductTypeService productTypeService;

    @PostMapping("/add")
    public ResponseEntity<Response> addProductType(@RequestBody ProductType productType) {
        return ResponseEntity.ok(productTypeService.addProductType(productType));
    }

    @GetMapping("/get")
    public ResponseEntity<Response> getProductType() {
        return ResponseEntity.ok(productTypeService.getProductType());
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response> deleteProductType(@PathVariable int id) {
        return ResponseEntity.ok(productTypeService.deleteProductType(id));
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<Response> updateProductType(@PathVariable int id, @RequestBody ProductType productType) {
        return ResponseEntity.ok(productTypeService.updateProductType(id,productType));
    }
    @GetMapping("/getByName/{productTypeName}")
    public ResponseEntity<Response> getProductTypeByName(@PathVariable String productTypeName) {
        return ResponseEntity.ok(productTypeService.getProductTypeByProductTypeName(productTypeName));
    }
    @GetMapping("/get/{productTypeId}")
    public ResponseEntity<Response>getByProductTypeId(@PathVariable int productTypeId) {
        return ResponseEntity.ok(productTypeService.getProductTypeById(productTypeId));
    }

}
