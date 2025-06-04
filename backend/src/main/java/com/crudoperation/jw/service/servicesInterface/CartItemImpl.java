package com.crudoperation.jw.service.servicesInterface;

import com.crudoperation.jw.dto.Response;

public interface CartItemImpl {

    public Response createCartItem(int productId, int quantity, int userId);
    public Response getItems(int userId);
    public Response incQuantity(int productId, int userId);
    public Response decQuantity(int productId, int userId);
    public Response deleteProduct(int userId);
    public Response deleteCartItem(int productId);
}
