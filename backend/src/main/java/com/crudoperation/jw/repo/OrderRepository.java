package com.crudoperation.jw.repo;


import com.crudoperation.jw.model.Order;
import com.crudoperation.jw.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    Optional<Order> findById(int id);
    List<Order> findByUserId(int userId);
    Optional<Order> findByOrderId(String orderId);


}
