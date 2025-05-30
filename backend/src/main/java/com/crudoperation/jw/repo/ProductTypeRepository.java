package com.crudoperation.jw.repo;

import com.crudoperation.jw.dto.ProductTypeDto;
import com.crudoperation.jw.model.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductTypeRepository extends JpaRepository<ProductType, Integer> {
    List<ProductType> findByCatagorie(String catagorie);
}
