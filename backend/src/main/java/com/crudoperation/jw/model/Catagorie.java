package com.crudoperation.jw.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "catagorie")
public class Catagorie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String catagorieType;
    private String catagorieId;
    private String catagorieDescription;

//    @OneToMany(mappedBy = "catagorie", cascade = CascadeType.ALL)
//    private List<ProductType>productTypes;

    public Catagorie(int id, String catagorieType, String catagorieId, String catagorieDescription) {
        this.id = id;
        this.catagorieType = catagorieType;
        this.catagorieId = catagorieId;
        this.catagorieDescription = catagorieDescription;
//        this.productTypes = productTypes;
    }

    public Catagorie() {

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCatagorieType() {
        return catagorieType;
    }

    public void setCatagorieType(String catagorieType) {
        this.catagorieType = catagorieType;
    }

    public String getCatagorieId() {
        return catagorieId;
    }

    public void setCatagorieId(String catagorieId) {
        this.catagorieId = catagorieId;
    }

    public String getCatagorieDescription() {
        return catagorieDescription;
    }

    public void setCatagorieDescription(String catagorieDescription) {
        this.catagorieDescription = catagorieDescription;
    }

//    public List<ProductType> getProductTypes() {
//        return productTypes;
//    }
//
//    public void setProductTypes(List<ProductType> productTypes) {
//        this.productTypes = productTypes;
//    }
}
