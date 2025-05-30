package com.crudoperation.jw.dto;

import com.crudoperation.jw.model.User;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class FavauriteDto {

    private int id;
    private int productId;
    private User user;

    public FavauriteDto(int id, int productId, User user) {
        this.id = id;
        this.productId = productId;
        this.user = user;
    }

    public FavauriteDto() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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
