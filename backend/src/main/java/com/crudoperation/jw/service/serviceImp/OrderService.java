package com.crudoperation.jw.service.serviceImp;

import com.crudoperation.jw.dto.OrderDto;
import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.exception.OurException;
import com.crudoperation.jw.model.Billing;
import com.crudoperation.jw.model.Order;
import com.crudoperation.jw.model.User;
import com.crudoperation.jw.repo.OrderRepository;
import com.crudoperation.jw.repo.UserRepository;
import com.crudoperation.jw.service.servicesInterface.OrderServiceImpl;
import com.crudoperation.jw.utils.OrderIdGenerator;
import com.crudoperation.jw.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService implements OrderServiceImpl {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    public Response addOrder(Order order) {
        Response response = new Response();
        try{
            int userId = order.getUser().getId();
            Optional<User> user = userRepository.findById(userId);
            if(user.isPresent()) {
                order.setUser(user.get());
            }
            Billing billing = order.getBilling();
            if(billing != null){
                order.setBilling(billing);
            }
            String orderId = OrderIdGenerator.generateOrderId();
            order.setOrderId(orderId);
            order.setOrderDate(LocalDate.now());
            order.setOrderStatus("PENDING");
            Order order1=orderRepository.save(order);
            OrderDto orderDto= Utils.mapOrderEntityToOrderDto(order1);
            response.setOrderDto(orderDto);
            response.setMessage("Success");
            response.setStatusCode(201);
        }catch(Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response getAllOrders() {
        Response response = new Response();
        try{
            List<Order> orders = orderRepository.findAll();
            List<OrderDto>orderDtoList=Utils.mapOrderListEntityToOrderListDTO(orders);
            response.setOrderDtoList(orderDtoList);

            response.setMessage("Success");
            response.setStatusCode(200);
        }catch(Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response updateOrder(Order order, int id) {
        Response response = new Response();
        try{
            Optional<Order> orderOptional = orderRepository.findById(id);
            if(orderOptional.isPresent()){
                Order order1 = orderOptional.get();
                order1.setOrderStatus(order.getOrderStatus());
                orderRepository.save(order1);
                response.setMessage("Success");
                response.setStatusCode(200);
            }
        }catch(Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response getOrderById(int id) {
        Response response = new Response();
        try{
            Optional<Order> orderOptional = orderRepository.findById(id);
            if(orderOptional.isPresent()){
                Order order1 = orderOptional.get();
                response.setOrderDto(Utils.mapOrderEntityToOrderDto(order1));
                response.setMessage("Success");
                response.setStatusCode(200);

            }
        }catch(OurException e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response updateStatus(int id, String status) {
        Response response=new Response();
        try{
            Optional<Order> orderOptional = orderRepository.findById(id);
            if(orderOptional.isPresent()){
                Order order1 = orderOptional.get();
                order1.setOrderStatus(status.toUpperCase());
                orderRepository.save(order1);
                response.setMessage("Success");
                response.setStatusCode(200);
            }
        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }


    public Response getAllOrdersByUserId(int userId) {
        Response response=new Response();
        try{
            List<Order> orders=orderRepository.findByUserId(userId);
            response.setOrderDtoList(Utils.mapOrderListEntityToOrderListDTO(orders));
            response.setMessage("Success");
            response.setStatusCode(200);

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response getOrderByOrderId(String orderId) {
        Response response=new Response();
        try{
            Optional<Order> orderOptional=orderRepository.findByOrderId(orderId);
            if(orderOptional.isPresent()){
                Order order1 = orderOptional.get();
                response.setOrderDto(Utils.mapOrderEntityToOrderDto(order1));
                response.setMessage("Success");
                response.setStatusCode(200);

            }

        }catch(Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response deleteOrder(int id) {
        Response response=new Response();
        try{
            Optional <Order> orderOptional=orderRepository.findById(id);
            if(orderOptional.isPresent()){
                Order order1 = orderOptional.get();
                orderRepository.delete(order1);
                response.setMessage("Success");
                response.setStatusCode(200);
            }
        }catch(Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }
}
