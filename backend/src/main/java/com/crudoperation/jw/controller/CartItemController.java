package com.crudoperation.jw.controller;

import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.CartItem;
import com.crudoperation.jw.service.serviceImp.CartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cartItem")
public class CartItemController {

    @Autowired
    private CartItemService cartItemService;

    @PostMapping("/add")
    public ResponseEntity<Response> addCartItem(@RequestParam int productId,@RequestParam int quantity,@RequestParam int userId) {
        return ResponseEntity.ok(cartItemService.createCartItem(productId, quantity,userId));
    }

    @GetMapping("/get/{userId}")
    public ResponseEntity<Response> getItem(@PathVariable int userId) {
        return ResponseEntity.ok(cartItemService.getItems(userId));
    }
    @PostMapping("/incQuantity")
    public ResponseEntity<Response>incQuantity(@RequestParam int productId,@RequestParam int userId) {
        return ResponseEntity.ok(cartItemService.incQuantity(productId,userId));
    }

    @PostMapping("/decQuantity")
    public ResponseEntity<Response>decQuantity(@RequestParam int productId,@RequestParam int userId) {
        return ResponseEntity.ok(cartItemService.decQuantity(productId,userId));
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<Response>deleteItem(@PathVariable int userId) {
        return ResponseEntity.ok(cartItemService.deleteProduct(userId));
    }
    @DeleteMapping("/delete/cartItem/{productId}")
    public ResponseEntity<Response>deleteCartItem(@PathVariable int productId) {
        return ResponseEntity.ok(cartItemService.deleteCartItem(productId));
    }


}
