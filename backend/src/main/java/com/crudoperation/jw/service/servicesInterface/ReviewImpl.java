package com.crudoperation.jw.service.servicesInterface;

import com.crudoperation.jw.model.Review;

import java.util.List;

public interface ReviewImpl {
    public Review addReview(Review review);

    public List<Review> getReviewsByProductId(Long productId);

    public List<Review> getReviewsByUserId(Long userId);
    public List<Review> getAllReviews();
    public Review updateStatus(int id);
    public String deleteReview(int id);
}
