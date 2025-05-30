package com.crudoperation.jw.repo;

import com.crudoperation.jw.model.Billing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillingRepository extends JpaRepository<Billing, Integer> {
    List<Billing> findByUserId(int userId);
}
