package com.crudoperation.jw.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Lob;

import java.util.Date;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductDto {

    private int id;
    private String ProductName;
    private String ProductDescription;
    private float ProductPrice;
    private float discount;
    private int ProductQuantity;
    private String width;
    private String height;
    private String depth;
    private String warrantyInf;
    private String Description;
    private Date date;
    private String productType;
    private String category;
    private String imageName;
    private String imageType;
    @Lob
    private byte[] imageData;

    public ProductDto(int id, String productName, String productDescription, float productPrice, float discount, int productQuantity, String width, String height, String depth, String warrantyInf, String description, Date date, String productType, String category, String imageName, String imageType, byte[] imageData) {
        this.id = id;
        ProductName = productName;
        ProductDescription = productDescription;
        ProductPrice = productPrice;
        this.discount = discount;
        ProductQuantity = productQuantity;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.warrantyInf = warrantyInf;
        Description = description;
        this.date = date;
        this.productType = productType;
        this.category = category;
        this.imageName = imageName;
        this.imageType = imageType;
        this.imageData = imageData;
    }
    public ProductDto() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getProductName() {
        return ProductName;
    }

    public void setProductName(String productName) {
        ProductName = productName;
    }

    public String getProductDescription() {
        return ProductDescription;
    }

    public void setProductDescription(String productDescription) {
        ProductDescription = productDescription;
    }

    public float getProductPrice() {
        return ProductPrice;
    }

    public void setProductPrice(float productPrice) {
        ProductPrice = productPrice;
    }

    public float getDiscount() {
        return discount;
    }

    public void setDiscount(float discount) {
        this.discount = discount;
    }

    public int getProductQuantity() {
        return ProductQuantity;
    }

    public void setProductQuantity(int productQuantity) {
        ProductQuantity = productQuantity;
    }

    public String getWidth() {
        return width;
    }

    public void setWidth(String width) {
        this.width = width;
    }

    public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    public String getDepth() {
        return depth;
    }

    public void setDepth(String depth) {
        this.depth = depth;
    }

    public String getWarrantyInf() {
        return warrantyInf;
    }

    public void setWarrantyInf(String warrantyInf) {
        this.warrantyInf = warrantyInf;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String description) {
        Description = description;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getProductType() {
        return productType;
    }

    public void setProductType(String productType) {
        this.productType = productType;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public String getImageType() {
        return imageType;
    }

    public void setImageType(String imageType) {
        this.imageType = imageType;
    }

    public byte[] getImageData() {
        return imageData;
    }

    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }
}
