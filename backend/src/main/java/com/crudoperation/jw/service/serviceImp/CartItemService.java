package com.crudoperation.jw.service.serviceImp;

import com.crudoperation.jw.dto.CartItemDto;
import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.CartItem;
import com.crudoperation.jw.model.Product;
import com.crudoperation.jw.model.User;
import com.crudoperation.jw.repo.CartItemRepository;
import com.crudoperation.jw.repo.ProductRepository;
import com.crudoperation.jw.repo.UserRepository;
import com.crudoperation.jw.service.servicesInterface.CartItemImpl;
import com.crudoperation.jw.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartItemService implements CartItemImpl {

    @Autowired
    public CartItemRepository cartItemRepository;

    @Autowired
    public UserRepository userRepository;

    @Autowired
    public ProductRepository productRepository;


    public Response createCartItem(int productId, int quantity,int userId) {
        Response response = new Response();
        try{
            List<CartItem> cartItem = cartItemRepository.findByUserId(userId);

            for (CartItem cartItem1 : cartItem) {
                if (cartItem1.getProductId() == productId) {
                    cartItem1.setQuantity(cartItem1.getQuantity() + quantity);
                    Optional<User> user = userRepository.findById(userId);
                    if (user.isPresent()) {
                        cartItem1.setUser(user.get());
                    }
                    cartItemRepository.save(cartItem1);
                    response.setMessage("Successfully updated cart item");
                    response.setStatusCode(200);
                    return response;
                }
            }


            CartItem cartItem2 = new CartItem();
            cartItem2.setProductId(productId);
            cartItem2.setQuantity(quantity);
            cartItem2.setUser(userRepository.findById(userId).get());
            cartItemRepository.save(cartItem2);
            response.setStatusCode(201);
            response.setMessage("Successfully created cart item");

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response getItems(int userId) {
        Response response = new Response();
        try{
            List <CartItem> cartItem = cartItemRepository.findByUserId(userId);
            List <CartItemDto> cartItemDtos= Utils.mapCartItemListEntityToCartItemListDTO(cartItem);
            response.setStatusCode(200);
            response.setMessage("Successfully get cart items");
            response.setCartItemDtoList(cartItemDtos);

        }catch(Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response incQuantity(int productId, int userId) {
        Response response = new Response();
        try{
            List<CartItem> cartItem = cartItemRepository.findByUserId(userId);
            for (CartItem cartItem1 : cartItem) {
                if (cartItem1.getProductId() == productId) {
                    cartItem1.setQuantity(cartItem1.getQuantity()+1);
                    cartItemRepository.save(cartItem1);
                }
            }
            response.setStatusCode(200);
            response.setMessage("Successfully updated cart item");
        }catch(Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }
    public Response decQuantity(int productId, int userId) {
        Response response = new Response();
        try{
            List<CartItem> cartItem = cartItemRepository.findByUserId(userId);
            for (CartItem cartItem1 : cartItem) {
                if (cartItem1.getProductId() == productId) {
                    cartItem1.setQuantity(cartItem1.getQuantity()-1);
                    cartItemRepository.save(cartItem1);
                }
            }
            response.setStatusCode(200);
            response.setMessage("Successfully updated cart item");
        }catch(Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response deleteProduct(int userId) {
        Response response=new Response();

        try{
            List<CartItem>cartItems=cartItemRepository.findByUserId(userId);
            for (CartItem cartItem1 : cartItems) {
                if (cartItem1.getUser().getId() == userId) {
                    cartItemRepository.delete(cartItem1);
                    response.setStatusCode(200);
                    response.setMessage("Successfully deleted cart item");
                }
            }

        }catch(Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response deleteCartItem(int productId) {
        Response response=new Response();
        try{
            Optional<CartItem>cartItem=cartItemRepository.findById(productId);
            if(cartItem.isPresent()){
                cartItemRepository.delete(cartItem.get());
                response.setStatusCode(200);
                response.setMessage("Successfully deleted cart item");
            }

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }
}
