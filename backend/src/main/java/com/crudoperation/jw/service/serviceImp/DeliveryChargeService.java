package com.crudoperation.jw.service.serviceImp;

import com.crudoperation.jw.dto.DeliveryChargeDto;
import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.DeliveryCharge;
import com.crudoperation.jw.repo.DeliveryChargeRepository;
import com.crudoperation.jw.service.servicesInterface.DeliveryChargeServiceImpl;
import com.crudoperation.jw.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeliveryChargeService implements DeliveryChargeServiceImpl {

    @Autowired
    private DeliveryChargeRepository deliveryChargeRepository;

    public Response createDeliveryCharge(DeliveryCharge deliveryCharge) {
        Response response = new Response();
        try{
            deliveryChargeRepository.save(deliveryCharge);
            response.setMessage("Success");
            response.setStatusCode(201);
        }catch(Exception e){
             response.setStatusCode(500);
             response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response getAllDeliveryDetails() {
        Response response = new Response();
        try{
            List<DeliveryCharge> deliveryChargeList = deliveryChargeRepository.findAll();
            List<DeliveryChargeDto>deliveryChargeDtos= Utils.mapDeliveryChargeListEntityToDeliveryChargeListDTO(deliveryChargeList);
            response.setDeliveryChargeDtoList(deliveryChargeDtos);
            response.setStatusCode(200);
            response.setMessage("Success");
        }catch(Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response getPriceOfCity(String city) {
        Response response = new Response();
        try{
            Optional<DeliveryCharge>deliveryCharge=deliveryChargeRepository.findByCity(city);
            if(deliveryCharge.isPresent()){
                response.setStatusCode(200);
                response.setMessage("Success");
                DeliveryChargeDto deliveryChargeDto=Utils.mapDeliveryChargeEntityToDeliveryChargeDto(deliveryCharge.get());
                response.setDeliveryChargeDto(deliveryChargeDto);
            }
        }catch(Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response updateCharge(DeliveryCharge deliveryCharge, int id) {
        Response response = new Response();
        return response;
    }

    public Response deleteCharge(int id) {
        Response response = new Response();

        return response;
    }
}
