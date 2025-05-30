package com.crudoperation.jw.controller;

import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.OrderItem;
import com.crudoperation.jw.service.serviceImp.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orderItem")
public class OrderItemController {

    @Autowired
    private OrderItemService orderItemService;

    @PostMapping("/add/{orderId}")
    public ResponseEntity<Response>addOrderItem(@RequestBody OrderItem orderItem, @PathVariable int orderId) {
        System.out.println(orderItem.getOrder());
        return ResponseEntity.ok(orderItemService.addOrderItem(orderItem,orderId));
    }
    public ResponseEntity<Response>updateOrderItem(@RequestBody OrderItem orderItem, @PathVariable int orderId) {
        System.out.println(orderItem.getOrder());
        return null;
    }
}
