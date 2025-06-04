package com.crudoperation.jw.repo;

import com.crudoperation.jw.model.Order;
import com.crudoperation.jw.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {




}
