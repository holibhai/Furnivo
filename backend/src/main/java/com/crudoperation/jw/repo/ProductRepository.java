package com.crudoperation.jw.repo;

import com.crudoperation.jw.model.Catagorie;
import com.crudoperation.jw.model.Product;
import jdk.jfr.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Locale;

@Repository
public interface ProductRepository extends JpaRepository<Product,Integer> {

    @Query("SELECT p.productQuantity FROM Product p WHERE p.id = :id")
    int findProductQuantityById(@Param("id") int id);

    Product findTopByOrderByProductPriceAsc();
    Product findTopByOrderByProductPriceDesc();

    List<Product> findProductByCategory(String category);
    List<Product> findProductByProductType(String productType);



}
