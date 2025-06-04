package com.crudoperation.jw.service.servicesInterface;

import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.Order;

public interface OrderServiceImpl {
    public Response addOrder(Order order);
    public Response getAllOrders();
    public Response updateOrder(Order order, int id);
    public Response getOrderById(int id);
    public Response updateStatus(int id, String status);

    public Response getAllOrdersByUserId(int userId);
    public Response getOrderByOrderId(String orderId);
    public Response deleteOrder(int id);
}
