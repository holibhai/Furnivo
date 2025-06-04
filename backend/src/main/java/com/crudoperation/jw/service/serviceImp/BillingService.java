package com.crudoperation.jw.service.serviceImp;

import com.crudoperation.jw.dto.BillingDto;
import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.Billing;
import com.crudoperation.jw.model.Delivery;
import com.crudoperation.jw.model.User;
import com.crudoperation.jw.repo.BillingRepository;
import com.crudoperation.jw.repo.DeliveryRepository;
import com.crudoperation.jw.repo.UserRepository;
import com.crudoperation.jw.service.servicesInterface.BillingServiceImp;
import com.crudoperation.jw.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BillingService implements BillingServiceImp {

    @Autowired
    private BillingRepository billingRepository;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private UserRepository userRepository;

    public Response addBill(Billing billing) {
        Response response = new Response();
        try{
            Delivery delivery = billing.getDelivery();
            if(delivery !=null){
                Delivery delivery1=deliveryRepository.save(delivery);
                billing.setDelivery(delivery1);

            }
            int userId = billing.getUser().getId();
            Optional<User> user=userRepository.findById(userId);
            if(user.isPresent()){
                User user1=user.get();
                billing.setUser(user1);
            }

            Billing billing1=billingRepository.save(billing);
            BillingDto billingDto= Utils.mapBillingEntityToBillingDto(billing1);
            response.setBillingDto(billingDto);
            response.setMessage("Successfully added billing");
            response.setStatusCode(201);
        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response deleteBilling(int id) {
        Response response = new Response();
        try{

        }catch(Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }
}
