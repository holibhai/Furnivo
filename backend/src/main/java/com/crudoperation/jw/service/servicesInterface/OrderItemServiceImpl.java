package com.crudoperation.jw.service.servicesInterface;

import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.OrderItem;

public interface OrderItemServiceImpl {
    public Response addOrderItem(OrderItem orderItem, int orderId);
}
