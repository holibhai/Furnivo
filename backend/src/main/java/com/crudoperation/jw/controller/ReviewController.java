package com.crudoperation.jw.controller;


import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.Review;
import com.crudoperation.jw.service.serviceImp.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.ResponseCache;
import java.util.List;

@RestController
@RequestMapping("/api/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/add")
    public Review addReview(@RequestBody Review review) {
        return reviewService.addReview(review);
    }
    @GetMapping("/getAll")
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @GetMapping("/product/{productId}")
    public List<Review> getReviewsByProduct(@PathVariable Long productId) {
        return reviewService.getReviewsByProductId(productId);
    }

    @GetMapping("/user/{userId}")
    public List<Review> getReviewsByUser(@PathVariable Long userId) {
        return reviewService.getReviewsByUserId(userId);
    }
    @PutMapping("/status/{id}")
    public Review updateReviewStatus(@PathVariable int id) {
        System.out.println(id);

        return reviewService.updateStatus(id);
    }
    @DeleteMapping("/delete/{id}")
    public String deleteReview(@PathVariable int id) {
        return reviewService.deleteReview(id);
    }
}
