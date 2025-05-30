package com.crudoperation.jw.controller;

import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.Catagorie;
import com.crudoperation.jw.service.serviceImp.CatagorieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/catagorie")
public class CatagorieController {

    @Autowired
    private CatagorieService catagorieService;

    @PostMapping("/add")
    public ResponseEntity<Response> addCatagorie(@RequestBody Catagorie catagorie){
        return ResponseEntity.ok(catagorieService.add(catagorie));
    }
    @GetMapping("/get")
    public ResponseEntity<Response> getGatagorie(){
         return ResponseEntity.ok(catagorieService.getCatagorie());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Response> updateCatagorie(@RequestBody Catagorie catagorie,@PathVariable int id){
        return ResponseEntity.ok(catagorieService.updateCatagory(catagorie,id));
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response> deleteCatagorie(@PathVariable int id){
        return ResponseEntity.ok(catagorieService.deleteCatagory(id));
    }
    @GetMapping("/get/{id}")
    public ResponseEntity<Response>getCatagorie(@PathVariable int id){
        return ResponseEntity.ok(catagorieService.getCatagory(id));
    }
}
