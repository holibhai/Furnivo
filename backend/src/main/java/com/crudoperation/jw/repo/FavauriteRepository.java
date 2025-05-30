package com.crudoperation.jw.repo;

import com.crudoperation.jw.model.Favaurite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavauriteRepository extends JpaRepository<Favaurite, Integer> {
    List<Favaurite> findByUserId(int userId);
}
