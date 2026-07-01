package com.mycarworkshop.backend.controller;

import com.mycarworkshop.backend.dto.ReviewDTO;
import com.mycarworkshop.backend.service.ReviewService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private static final Logger logger = LoggerFactory.getLogger(ReviewController.class);

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<ReviewDTO>> getAllReviews() {
        try {
            return ResponseEntity.ok(reviewService.getAllReviews());
        } catch (Exception e) {
            logger.error("ERRORE durante il recupero delle recensioni: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(@RequestBody ReviewDTO reviewDTO) {
        try {
            if (reviewDTO.getAuthorName() == null || reviewDTO.getAuthorName().trim().isEmpty() ||
                    reviewDTO.getRating() == null || reviewDTO.getRating() < 1 || reviewDTO.getRating() > 5 ||
                    reviewDTO.getComment() == null || reviewDTO.getComment().trim().isEmpty()) {
                logger.error("ERRORE durante la creazione della recensione: Dati non validi.");
                return ResponseEntity.badRequest().build();
            }
            return ResponseEntity.ok(reviewService.createReview(reviewDTO));
        } catch (Exception e) {
            logger.error("ERRORE durante la creazione della recensione: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
