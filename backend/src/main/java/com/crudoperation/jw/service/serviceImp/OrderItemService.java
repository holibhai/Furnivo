package com.crudoperation.jw.service.serviceImp;

import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.Order;
import com.crudoperation.jw.model.OrderItem;
import com.crudoperation.jw.repo.OrderItemRepository;
import com.crudoperation.jw.repo.OrderRepository;
import com.crudoperation.jw.service.servicesInterface.OrderItemServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderItemService implements OrderItemServiceImpl {

    @Autowired
    private OrderItemRepository repository;

    @Autowired
    private OrderRepository orderRepository;

    public Response addOrderItem(OrderItem orderItem,int orderId) {
        Response response = new Response();
        try{
            System.out.println("check");
            Optional<Order> order = orderRepository.findById(orderId);
            if(order.isPresent()){
                orderItem.setOrder(order.get());
            }
//            Order order = orderItem.getOrder();
//            orderItem.setOrder(order);
            repository.save(orderItem);
            response.setMessage("Success");
            response.setStatusCode(201);
        }catch(Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }


}
