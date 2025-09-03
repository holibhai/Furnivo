//package com.crudoperation.jw.controller;
//
//import com.crudoperation.jw.dto.StripeRequest;
//import com.stripe.Stripe;
//import com.stripe.exception.StripeException;
//import com.stripe.model.checkout.Session;
//import com.stripe.param.checkout.SessionCreateParams;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.*;
//
//@RestController
//@RequestMapping("/api/payment")
//public class StripeController {
//
//    @Value("${stripe.api.key}")
//    private String stripeApiKey;
//
//    @PostMapping("/create-checkout-session")
//    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody StripeRequest request) {
//        Stripe.apiKey = stripeApiKey;
//
//        try {
//            List<SessionCreateParams.LineItem> sessionLineItems = new ArrayList<>();
//            String currency = "lkr";
//            Long offerAmount = request.getOfferAmount(); // in cents
//            boolean offerApplied = false;
//
//            for (int i = 0; i < request.getLineItems().size(); i++) {
//                StripeRequest.LineItemDTO item = request.getLineItems().get(i);
//                long unitAmount = item.getPriceData().getUnitAmount(); // in cents
//                int quantity = item.getQuantity();
//
//                currency = item.getPriceData().getCurrency(); // assume same for all
//
//                // Apply discount to the first item only
//                if (!offerApplied && offerAmount != null && offerAmount > 0 && offerAmount < (unitAmount * quantity)) {
//                    long totalItemAmount = unitAmount * quantity;
//                    long adjustedTotal = totalItemAmount - offerAmount;
//
//                    // Distribute adjusted total back to unitAmount
//                    unitAmount = adjustedTotal / quantity;
//                    offerApplied = true;
//                }
//
//                sessionLineItems.add(
//                        SessionCreateParams.LineItem.builder()
//                                .setQuantity((long) quantity)
//                                .setPriceData(
//                                        SessionCreateParams.LineItem.PriceData.builder()
//                                                .setCurrency(currency)
//                                                .setUnitAmount(unitAmount)
//                                                .setProductData(
//                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
//                                                                .setName(item.getPriceData().getProductData().getName())
//                                                                .build()
//                                                )
//                                                .build()
//                                )
//                                .build()
//                );
//            }
//
//            // Create session
//            SessionCreateParams params = SessionCreateParams.builder()
//                    .addAllLineItem(sessionLineItems)
//                    .setMode(SessionCreateParams.Mode.PAYMENT)
//                    .setCustomerEmail(request.getCustomerEmail())
//                    .setSuccessUrl(request.getSuccessUrl())
//                    .setCancelUrl(request.getCancelUrl())
//                    .build();
//
//            Session session = Session.create(params);
//
//            Map<String, String> responseData = new HashMap<>();
//            responseData.put("id", session.getId());
//
//            return ResponseEntity.ok(responseData);
//        } catch (StripeException e) {
//            e.printStackTrace();
//            return ResponseEntity.status(500).body(Collections.singletonMap("error", "Failed to create Stripe session"));
//        }
//    }
//}
