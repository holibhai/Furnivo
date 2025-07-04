package com.crudoperation.jw.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "delivery")
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String deliveryType;
    private String location;
    private String deliveryDate;
    private String pickUpOrderNotes;
    private String receiverFirstName;
    private String receiverLastName;
    private String city;
    private String receiverMobileNumber;
    private String streetAddress1;
    private String streetAddress2;
    private String deliveryOrderNotes;


    @OneToOne(mappedBy = "delivery",cascade = CascadeType.ALL)
    @JsonIgnore
    private Billing billing;




    public Delivery() {

    }

    public Delivery(int id, String deliveryType, String location, String deliveryDate, String pickUpOrderNotes, String receiverFirstName, String receiverLastName, String city, String receiverMobileNumber, String streetAddress1, String streetAddress2, String deliveryOrderNotes, Billing billing) {
        this.id = id;
        this.deliveryType = deliveryType;
        this.location = location;
        this.deliveryDate = deliveryDate;
        this.pickUpOrderNotes = pickUpOrderNotes;
        this.receiverFirstName = receiverFirstName;
        this.receiverLastName = receiverLastName;
        this.city = city;
        this.receiverMobileNumber = receiverMobileNumber;
        this.streetAddress1 = streetAddress1;
        this.streetAddress2 = streetAddress2;
        this.deliveryOrderNotes = deliveryOrderNotes;
        this.billing = billing;
    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDeliveryType() {
        return deliveryType;
    }

    public void setDeliveryType(String deliveryType) {
        this.deliveryType = deliveryType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(String deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public String getPickUpOrderNotes() {
        return pickUpOrderNotes;
    }

    public void setPickUpOrderNotes(String pickUpOrderNotes) {
        this.pickUpOrderNotes = pickUpOrderNotes;
    }

    public String getReceiverFirstName() {
        return receiverFirstName;
    }

    public void setReceiverFirstName(String receiverFirstName) {
        this.receiverFirstName = receiverFirstName;
    }

    public String getReceiverLastName() {
        return receiverLastName;
    }

    public void setReceiverLastName(String receiverLastName) {
        this.receiverLastName = receiverLastName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getReceiverMobileNumber() {
        return receiverMobileNumber;
    }

    public void setReceiverMobileNumber(String receiverMobileNumber) {
        this.receiverMobileNumber = receiverMobileNumber;
    }

    public String getStreetAddress1() {
        return streetAddress1;
    }

    public void setStreetAddress1(String streetAddress1) {
        this.streetAddress1 = streetAddress1;
    }

    public String getStreetAddress2() {
        return streetAddress2;
    }

    public void setStreetAddress2(String streetAddress2) {
        this.streetAddress2 = streetAddress2;
    }

    public String getDeliveryOrderNotes() {
        return deliveryOrderNotes;
    }

    public void setDeliveryOrderNotes(String deliveryOrderNotes) {
        this.deliveryOrderNotes = deliveryOrderNotes;
    }

    public Billing getBilling() {
        return billing;
    }

    public void setBilling(Billing billing) {
        this.billing = billing;
    }
}
