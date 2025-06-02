package com.crudoperation.jw.controller;

import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.Favaurite;
import com.crudoperation.jw.service.serviceImp.FavauriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favaurite")
public class FavauriteController {

    @Autowired
    private FavauriteService favauriteService;

    @PostMapping("/add/{userId}")
    public ResponseEntity<Response>addFavaurite(@RequestBody Favaurite favaurite,@PathVariable int userId){
        return ResponseEntity.ok(favauriteService.addFavaurite(favaurite,userId));

    }
    @GetMapping("/get/{userId}")
    public ResponseEntity<Response>getFavaurite(@PathVariable int userId){
        return ResponseEntity.ok(favauriteService.getProducts(userId));
    }
    @DeleteMapping("/delete/{productId}")
    public ResponseEntity<Response>deleteFavaurite(@PathVariable int productId){
        return ResponseEntity.ok(favauriteService.deleteFav(productId));
    }

}
