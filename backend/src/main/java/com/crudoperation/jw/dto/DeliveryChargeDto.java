package com.crudoperation.jw.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class DeliveryChargeDto {

    private int id;
    private String city;
    private float price;

    public DeliveryChargeDto(int id, String city, float price) {
        this.id = id;
        this.city = city;
        this.price = price;
    }
    public DeliveryChargeDto() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }
}
