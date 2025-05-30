package com.crudoperation.jw.dto;

import com.crudoperation.jw.model.ProductType;
import com.fasterxml.jackson.annotation.JsonInclude;

import javax.management.relation.Role;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {

    private UserAccountDto userAccount;
    private int statusCode;
    private String message;
    private String token;
    private Role role;

    private List<UserAccountDto> userAccountDtoList;
    //  private List<AddressDto>addressDtoList;
    private UserAccountDto userAccountDto;
    //  private AddressDto addressDto;
    private ProductDto productDto;
    private List<ProductDto> productDtoList;
    private CatagorieDto catagorieDto;
    private List<CatagorieDto> catagorieDtoList;
    private ProductTypeDto productTypeDto;
    private List<ProductTypeDto> productTypeDtoList;
    private CartItemDto cartItemDto;
    private List<CartItemDto> cartItemDtoList;
    private BillingDto billingDto;
    private DeliveryDto deliveryDto;
    private DeliveryChargeDto deliveryChargeDto;
    private List<DeliveryChargeDto> deliveryChargeDtoList;
    private OrderDto orderDto;
    private List<OrderDto> orderDtoList;
    private FavauriteDto favauriteDto;
    private List<FavauriteDto> favauriteDtoList;

    public Response(UserAccountDto userAccount, int statusCode, String message, String token, Role role, List<UserAccountDto> userAccountDtoList, UserAccountDto userAccountDto, ProductDto productDto, List<ProductDto> productDtoList, CatagorieDto catagorieDto, List<CatagorieDto> catagorieDtoList, ProductTypeDto productTypeDto, List<ProductTypeDto> productTypeDtoList, CartItemDto cartItemDto, List<CartItemDto> cartItemDtoList, BillingDto billingDto, DeliveryDto deliveryDto, DeliveryChargeDto deliveryChargeDto, List<DeliveryChargeDto> deliveryChargeDtoList, OrderDto orderDto, List<OrderDto> orderDtoList, FavauriteDto favauriteDto, List<FavauriteDto> favauriteDtoList) {
        this.userAccount = userAccount;
        this.statusCode = statusCode;
        this.message = message;
        this.token = token;
        this.role = role;
        this.userAccountDtoList = userAccountDtoList;
//        this.addressDtoList = addressDtoList;
        this.userAccountDto = userAccountDto;
//        this.addressDto = addressDto;
        this.productDto = productDto;
        this.productDtoList = productDtoList;
        this.catagorieDto = catagorieDto;
        this.catagorieDtoList = catagorieDtoList;
        this.productTypeDto = productTypeDto;
        this.productTypeDtoList = productTypeDtoList;
        this.cartItemDto = cartItemDto;
        this.cartItemDtoList = cartItemDtoList;
        this.billingDto = billingDto;
        this.deliveryDto = deliveryDto;
        this.deliveryChargeDto = deliveryChargeDto;
        this.deliveryChargeDtoList = deliveryChargeDtoList;
        this.orderDto = orderDto;
        this.orderDtoList = orderDtoList;
        this.favauriteDto = favauriteDto;
        this.favauriteDtoList = favauriteDtoList;
    }

    public Response(){}


    public UserAccountDto getUserAccount() {
        return userAccount;
    }

    public void setUserAccount(UserAccountDto userAccount) {
        this.userAccount = userAccount;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public List<UserAccountDto> getUserAccountDtoList() {
        return userAccountDtoList;
    }

    public void setUserAccountDtoList(List<UserAccountDto> userAccountDtoList) {
        this.userAccountDtoList = userAccountDtoList;
    }

//    public List<AddressDto> getAddressDtoList() {
//        return addressDtoList;
//    }
//
//    public void setAddressDtoList(List<AddressDto> addressDtoList) {
//        this.addressDtoList = addressDtoList;
//    }

    public UserAccountDto getUserAccountDto() {
        return userAccountDto;
    }

    public void setUserAccountDto(UserAccountDto userAccountDto) {
        this.userAccountDto = userAccountDto;
    }

//    public AddressDto getAddressDto() {
//        return addressDto;
//    }
//
//    public void setAddressDto(AddressDto addressDto) {
//        this.addressDto = addressDto;
//    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public ProductDto getProductDto() {
        return productDto;
    }

    public void setProductDto(ProductDto productDto) {
        this.productDto = productDto;
    }

    public List<ProductDto> getProductDtoList() {
        return productDtoList;
    }

    public void setProductDtoList() {
        this.productDtoList = productDtoList;
    }

    public CatagorieDto getCatagorieDto() {
        return catagorieDto;
    }

    public void setCatagorieDto(CatagorieDto catagorieDto) {
        this.catagorieDto = catagorieDto;
    }

    public List<CatagorieDto> getCatagorieDtoList() {
        return catagorieDtoList;
    }

    public void setCatagorieDtoList(List<CatagorieDto> catagorieDtoList) {
        this.catagorieDtoList = catagorieDtoList;
    }

    public ProductTypeDto getProductTypeDto() {
        return productTypeDto;
    }

    public void setProductTypeDto(ProductTypeDto productTypeDto) {
        this.productTypeDto = productTypeDto;
    }

    public void setProductDtoList(List<ProductDto> productDtoList) {
        this.productDtoList = productDtoList;
    }

    public List<ProductTypeDto> getProductTypeDtoList() {
        return productTypeDtoList;
    }

    public void setProductTypeDtoList(List<ProductTypeDto> productTypeDtoList) {
        this.productTypeDtoList = productTypeDtoList;
    }

    public CartItemDto getCartItemDto() {
        return cartItemDto;
    }

    public void setCartItemDto(CartItemDto cartItemDto) {
        this.cartItemDto = cartItemDto;
    }

    public List<CartItemDto> getCartItemDtoList() {
        return cartItemDtoList;
    }

    public void setCartItemDtoList(List<CartItemDto> cartItemDtoList) {
        this.cartItemDtoList = cartItemDtoList;
    }

    public BillingDto getBillingDto() {
        return billingDto;
    }

    public void setBillingDto(BillingDto billingDto) {
        this.billingDto = billingDto;
    }

    public DeliveryDto getDeliveryDto() {
        return deliveryDto;
    }

    public void setDeliveryDto(DeliveryDto deliveryDto) {
        this.deliveryDto = deliveryDto;
    }

    public DeliveryChargeDto getDeliveryChargeDto() {
        return deliveryChargeDto;
    }

    public void setDeliveryChargeDto(DeliveryChargeDto deliveryChargeDto) {
        this.deliveryChargeDto = deliveryChargeDto;
    }

    public List<DeliveryChargeDto> getDeliveryChargeDtoList() {
        return deliveryChargeDtoList;
    }

    public void setDeliveryChargeDtoList(List<DeliveryChargeDto> deliveryChargeDtoList) {
        this.deliveryChargeDtoList = deliveryChargeDtoList;
    }

    public OrderDto getOrderDto() {
        return orderDto;
    }

    public void setOrderDto(OrderDto orderDto) {
        this.orderDto = orderDto;
    }

    public List<OrderDto> getOrderDtoList() {
        return orderDtoList;
    }

    public void setOrderDtoList(List<OrderDto> orderDtoList) {
        this.orderDtoList = orderDtoList;
    }

    public FavauriteDto getFavauriteDto() {
        return favauriteDto;
    }

    public void setFavauriteDto(FavauriteDto favauriteDto) {
        this.favauriteDto = favauriteDto;
    }

    public List<FavauriteDto> getFavauriteDtoList() {
        return favauriteDtoList;
    }

    public void setFavauriteDtoList(List<FavauriteDto> favauriteDtoList) {
        this.favauriteDtoList = favauriteDtoList;
    }
}
