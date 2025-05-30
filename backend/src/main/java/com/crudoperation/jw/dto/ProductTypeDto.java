package com.crudoperation.jw.dto;

import com.crudoperation.jw.model.Catagorie;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductTypeDto {

    private int id;
    private String productTypeName;
    private String description;
    private String catagorie;

    public ProductTypeDto(int id, String productTypeName, String description, String catagorie) {
        this.id = id;
        this.productTypeName = productTypeName;
        this.description = description;
        this.catagorie = catagorie;
    }

    public ProductTypeDto() {

    }
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getProductTypeName() {
        return productTypeName;
    }

    public void setProductTypeName(String productTypeName) {
        this.productTypeName = productTypeName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCatagorie() {
        return catagorie;
    }

    public void setCatagorie(String catagorie) {
        this.catagorie = catagorie;
    }
}






//
//private int id;
//private String productTypeName;
//private String description;
//
//@ManyToOne
//@JoinColumn(name = "catagorie_id",nullable = false)
//
//private Catagorie catagorie;