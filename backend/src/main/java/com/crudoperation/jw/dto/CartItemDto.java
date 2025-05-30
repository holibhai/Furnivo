package com.crudoperation.jw.dto;

import com.crudoperation.jw.model.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CartItemDto {
    private int id;
    private int quantity;
    private int productId;
    private User user;

    public CartItemDto(int id, int quantity, int productId, User user) {
        this.id = id;
        this.quantity = quantity;
        this.productId = productId;
        this.user = user;
    }
    public CartItemDto() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
