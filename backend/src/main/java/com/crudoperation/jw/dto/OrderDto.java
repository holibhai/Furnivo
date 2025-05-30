package com.crudoperation.jw.dto;

import com.crudoperation.jw.model.Billing;
import com.crudoperation.jw.model.OrderItem;
import com.crudoperation.jw.model.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderDto {

    private int id;
    private float netTotal;
    private float offer;
    private String deliveryType;
    private String OrderId;
    private List<OrderItem> orderItems;
    private User user;
    private Billing billing;
    private LocalDate orderDate;
    private String orderStatus;

    public OrderDto(int id, float netTotal, float offer, String deliveryType, String orderId, List<OrderItem> orderItems, User user, Billing billing, LocalDate orderDate, String orderStatus) {
        this.id = id;
        this.netTotal = netTotal;
        this.offer = offer;
        this.deliveryType = deliveryType;
        OrderId = orderId;
        this.orderItems = orderItems;
        this.user = user;
        this.billing = billing;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
    }

    public OrderDto() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public float getNetTotal() {
        return netTotal;
    }

    public void setNetTotal(float netTotal) {
        this.netTotal = netTotal;
    }

    public float getOffer() {
        return offer;
    }

    public void setOffer(float offer) {
        this.offer = offer;
    }


    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Billing getBilling() {
        return billing;
    }

    public void setBilling(Billing billing) {
        this.billing = billing;
    }

    public String getDeliveryType() {
        return deliveryType;
    }

    public void setDeliveryType(String deliveryType) {
        this.deliveryType = deliveryType;
    }

    public String getOrderId() {
        return OrderId;
    }

    public void setOrderId(String orderId) {
        OrderId = orderId;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }
}
