package com.crudoperation.jw.service.serviceImp;

import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.Delivery;
import com.crudoperation.jw.repo.DeliveryRepository;
import com.crudoperation.jw.service.servicesInterface.DeliveryServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeliveryService implements DeliveryServiceImpl {

    @Autowired
    private DeliveryRepository deliveryRepository;

    public Response addDeliveryType(Delivery delivery) {
        Response response = new Response();
        try{
            deliveryRepository.save(delivery);
            response.setMessage("Success");
            response.setStatusCode(201);
        }catch (Exception e){
           response.setStatusCode(500);
           response.setMessage(e.getMessage());
        }
        return response;
    }
}
