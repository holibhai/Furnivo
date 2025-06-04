package com.crudoperation.jw.service.servicesInterface;

import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.Billing;

public interface BillingServiceImp {

    public Response addBill(Billing billing);
    public Response deleteBilling(int id);
}
