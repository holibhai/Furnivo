//package com.crudoperation.jw.model;
//
//import jakarta.persistence.*;
//import jakarta.persistence.criteria.Order;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Entity
//public class Cart {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private int id;
//
//    @OneToMany(mappedBy = "cart")
//    private List<CartItem> cartItems;
//
//    @OneToOne
//    @JoinColumn(name = "user_id",nullable = false)
//    private User user;
//
//    public Cart(int id, List<CartItem> cartItems, User user) {
//        this.id = id;
//        this.cartItems = cartItems;
//        this.user = user;
//    }
//
//    public Cart() {
//
//    }
//
//    public int getId() {
//        return id;
//    }
//
//    public void setId(int id) {
//        this.id = id;
//    }
//
//    public List<CartItem> getCartItems() {
//        return cartItems;
//    }
//
//    public void setCartItems(List<CartItem> cartItems) {
//        this.cartItems = cartItems;
//    }
//
//    public User getUser() {
//        return user;
//    }
//
//    public void setUser(User user) {
//        this.user = user;
//    }
//}
