package com.crudoperation.jw.service.serviceImp;

import com.crudoperation.jw.model.Review;
import com.crudoperation.jw.repo.ReviewRepository;
import com.crudoperation.jw.service.servicesInterface.ReviewImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService implements ReviewImpl {

    @Autowired
    private ReviewRepository reviewRepository;

    public Review addReview(Review review) {
        review.setCreatedDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    public List<Review> getReviewsByUserId(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Review updateStatus(int id) {
        Optional<Review> review = reviewRepository.findById(id);
        if(review.isPresent()) {
            Review review1 = review.get();


            if (review1.getStatus().equals("not post")) {
                review1.setStatus("post");
                return reviewRepository.save(review1);


            }
            if (review1.getStatus().equals("post")) {
                review1.setStatus("not post");
                return reviewRepository.save(review1);
            }
        }

        return null;

    }

    public String deleteReview(int id) {
        Optional<Review> review = reviewRepository.findById(id);
        if(review.isPresent()) {
            reviewRepository.delete(review.get());
            return "success";
        }
        return "fail";
    }
}
