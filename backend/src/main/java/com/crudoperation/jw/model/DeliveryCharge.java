package com.crudoperation.jw.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class DeliveryCharge {

     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private int id;

     private String city;
     private float price;

    public DeliveryCharge(int id, String city, float price) {
        this.id = id;
        this.city = city;
        this.price = price;
    }

    public DeliveryCharge() {

    }

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



