package com.crudoperation.jw.dto;

import java.util.List;

public class StripeRequest {
    private List<LineItemDTO> lineItems;
    private String customerEmail;
    private String successUrl;
    private String cancelUrl;
    private Long orderId;
    private Long offerAmount; // Added field for discount in cents

    // Getters and Setters
    public List<LineItemDTO> getLineItems() {
        return lineItems;
    }

    public void setLineItems(List<LineItemDTO> lineItems) {
        this.lineItems = lineItems;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getSuccessUrl() {
        return successUrl;
    }

    public void setSuccessUrl(String successUrl) {
        this.successUrl = successUrl;
    }

    public String getCancelUrl() {
        return cancelUrl;
    }

    public void setCancelUrl(String cancelUrl) {
        this.cancelUrl = cancelUrl;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getOfferAmount() {
        return offerAmount;
    }

    public void setOfferAmount(Long offerAmount) {
        this.offerAmount = offerAmount;
    }

    // Nested Classes
    public static class LineItemDTO {
        private int quantity;
        private PriceDataDTO priceData;

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

        public PriceDataDTO getPriceData() {
            return priceData;
        }

        public void setPriceData(PriceDataDTO priceData) {
            this.priceData = priceData;
        }

        public static class PriceDataDTO {
            private String currency;
            private long unitAmount;
            private ProductDataDTO productData;

            public String getCurrency() {
                return currency;
            }

            public void setCurrency(String currency) {
                this.currency = currency;
            }

            public long getUnitAmount() {
                return unitAmount;
            }

            public void setUnitAmount(long unitAmount) {
                this.unitAmount = unitAmount;
            }

            public ProductDataDTO getProductData() {
                return productData;
            }

            public void setProductData(ProductDataDTO productData) {
                this.productData = productData;
            }

            public static class ProductDataDTO {
                private String name;

                public String getName() {
                    return name;
                }

                public void setName(String name) {
                    this.name = name;
                }
            }
        }
    }
}
