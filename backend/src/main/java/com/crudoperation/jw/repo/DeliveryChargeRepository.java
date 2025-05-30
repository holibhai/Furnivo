package com.crudoperation.jw.repo;

import com.crudoperation.jw.model.DeliveryCharge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeliveryChargeRepository extends JpaRepository<DeliveryCharge, Integer> {

    Optional<DeliveryCharge> findByCity(String city);
}
