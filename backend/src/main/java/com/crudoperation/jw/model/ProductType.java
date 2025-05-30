package com.crudoperation.jw.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;


@Entity
@Table(name = "productType")
public class ProductType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String productTypeName;
    private String description;

//    @ManyToOne
//    @JoinColumn(name = "catagorie_id",nullable = false)

    private String catagorie;


    public ProductType(int id, String productTypeName, String description, String catagorie) {
        this.id = id;
        this.productTypeName = productTypeName;
        this.description = description;
        this.catagorie = catagorie;

    }

    public ProductType() {

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
