package com.crudoperation.jw.service.servicesInterface;

import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.DeliveryCharge;

public interface DeliveryChargeServiceImpl {

    public Response createDeliveryCharge(DeliveryCharge deliveryCharge);
    public Response getAllDeliveryDetails();
    public Response getPriceOfCity(String city);
    public Response updateCharge(DeliveryCharge deliveryCharge, int id);
    public Response deleteCharge(int id);
}
