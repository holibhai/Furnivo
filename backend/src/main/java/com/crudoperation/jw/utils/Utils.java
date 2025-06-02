package com.crudoperation.jw.utils;

import com.crudoperation.jw.dto.*;
import com.crudoperation.jw.model.*;

import java.util.List;
import java.util.stream.Collectors;

public class Utils {

    public static UserAccountDto mapUserEntityToUserDTO(User user){
        UserAccountDto userAccountDto = new UserAccountDto();
        userAccountDto.setId(user.getId());
        userAccountDto.setUsername(user.getUsername());
        userAccountDto.setPassword(user.getPassword());
        userAccountDto.setFirstName(user.getFirstName());
        userAccountDto.setLastName(user.getLastName());
        userAccountDto.setRole(user.getRole());
        userAccountDto.setImageData(user.getImageData());
        userAccountDto.setImageName(user.getImageName());
        userAccountDto.setImageType(user.getImageType());
        userAccountDto.setDate(user.getRegisterDate());

        return userAccountDto;
    }

//    public static AddressDto mapAddressEntityToAddressDto(Address address){
//        AddressDto addressDto = new AddressDto();
//        addressDto.setCity(address.getCity());
//        addressDto.setState(address.getState());
//        addressDto.setZip(address.getZip());
//        addressDto.setStreet(address.getStreet());
//
//        return addressDto;
//    }

    public static ProductDto mapProductEntityToProductDto(Product product) {
        ProductDto productDto = new ProductDto();

        productDto.setId(product.getId());
        productDto.setProductName(product.getProductName());
        productDto.setProductDescription(product.getProductDescription());
        productDto.setProductPrice(product.getProductPrice());
        productDto.setDiscount(product.getDiscount());
        productDto.setProductQuantity(product.getProductQuantity());
        productDto.setWidth(product.getWidth());
        productDto.setHeight(product.getHeight());
        productDto.setDepth(product.getDepth());
        productDto.setWarrantyInf(product.getWarrantyInf());
        productDto.setDescription(product.getDescription());
        productDto.setDate(product.getDate());
        productDto.setProductType(product.getProductType());
        productDto.setCategory(product.getCategory());
        productDto.setImageName(product.getImageName());
        productDto.setImageType(product.getImageType());
        productDto.setImageData(product.getImageData());

        return productDto;
    }


    public static CatagorieDto mapCatagorieEntityToCatagorieDto(Catagorie catagorie){
        CatagorieDto catagorieDto=new CatagorieDto();
        catagorieDto.setId(catagorie.getId());
        catagorieDto.setCatagorieDescription(catagorie.getCatagorieDescription());
        catagorieDto.setCatagorieType(catagorie.getCatagorieType());
        return catagorieDto;

    }

    public static ProductTypeDto mapProductTypeEntityToProductTypeDto(ProductType productType){
        ProductTypeDto productTypeDto=new ProductTypeDto();
        productTypeDto.setProductTypeName(productType.getProductTypeName());
        productTypeDto.setDescription(productType.getDescription());
        productTypeDto.setId(productType.getId());
        productTypeDto.setCatagorie(productType.getCatagorie());
        return productTypeDto;
    }
    public static CartItemDto mapCartItemEntityToCartItemDto(CartItem cartItem){
        CartItemDto cartItemDto=new CartItemDto();
        cartItemDto.setId(cartItem.getId());
        cartItemDto.setQuantity(cartItem.getQuantity());
        cartItemDto.setProductId(cartItem.getProductId());
        return cartItemDto;
    }
    public static DeliveryChargeDto mapDeliveryChargeEntityToDeliveryChargeDto(DeliveryCharge deliveryCharge){
        DeliveryChargeDto deliveryChargeDto=new DeliveryChargeDto();
        deliveryChargeDto.setId(deliveryCharge.getId());
        deliveryChargeDto.setCity(deliveryCharge.getCity());
        deliveryChargeDto.setPrice(deliveryCharge.getPrice());
        return deliveryChargeDto;
    }
    public static OrderDto mapOrderEntityToOrderDto(Order order){
        OrderDto orderDto=new OrderDto();
        orderDto.setId(order.getId());
        orderDto.setBilling(order.getBilling());
        orderDto.setOrderItems(order.getOrderItems());
        orderDto.setNetTotal(order.getNetTotal());
        orderDto.setOrderId(order.getOrderId());
        orderDto.setOrderDate(order.getOrderDate());
        orderDto.setOrderStatus(order.getOrderStatus());
        orderDto.setOffer(order.getOffer());
//         orderDto.setUser(order.getUser());
        return orderDto;
    }
    public static BillingDto mapBillingEntityToBillingDto(Billing billing){
        BillingDto billingDto=new BillingDto();
        billingDto.setId(billing.getId());
        billingDto.setEmail(billing.getEmail());
        billingDto.setFirstName(billing.getFirstName());
        billingDto.setLastName(billing.getLastName());
        return billingDto;
    }
    public static FavauriteDto mapFavauriteEntityToFavauriteDto(Favaurite favaurite){
        FavauriteDto favauriteDto=new FavauriteDto();
        favauriteDto.setId(favaurite.getId());
        favauriteDto.setUser(favaurite.getUser());
        favauriteDto.setProductId(favaurite.getProductId());
        return favauriteDto;
    }
    public static List<ProductDto> mapProductListEntityToProductListDTO(List<Product> productList) {
        return productList.stream().map(Utils::mapProductEntityToProductDto).collect(Collectors.toList());
    }
    public static List<CatagorieDto> mapCatagorieListEntityToCatagorieListDTO(List<Catagorie> catagorieList) {
        return catagorieList.stream().map(Utils:: mapCatagorieEntityToCatagorieDto).collect(Collectors.toList());
    }
    public static List<ProductTypeDto>mapProductTypeListEntityToProductTypeListDTO(List<ProductType> productTypeList) {
        return productTypeList.stream().map(Utils::mapProductTypeEntityToProductTypeDto).collect(Collectors.toList());
    }
    public static List<CartItemDto>mapCartItemListEntityToCartItemListDTO(List<CartItem> cartItemList) {
        return cartItemList.stream().map(Utils::mapCartItemEntityToCartItemDto).collect(Collectors.toList());
    }
    public static List<DeliveryChargeDto>mapDeliveryChargeListEntityToDeliveryChargeListDTO(List<DeliveryCharge> deliveryChargeList) {
        return deliveryChargeList.stream().map(Utils::mapDeliveryChargeEntityToDeliveryChargeDto).collect(Collectors.toList());
    }

    public static List<OrderDto>mapOrderListEntityToOrderListDTO(List<Order> orderList) {
        return orderList.stream().map(Utils::mapOrderEntityToOrderDto).collect(Collectors.toList());
    }
    public static List<BillingDto>mapBillingListEntityToBillingListDTO(List<Billing> billingList) {
        return billingList.stream().map(Utils::mapBillingEntityToBillingDto).collect(Collectors.toList());
    }
    public static List<FavauriteDto>mapFavauriteEntityToFavauriteListDTO(List<Favaurite> favauriteList) {
        return favauriteList.stream().map(Utils::mapFavauriteEntityToFavauriteDto).collect(Collectors.toList());
    }


}
