package com.crudoperation.jw.controller;

import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.Billing;
import com.crudoperation.jw.service.serviceImp.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/billing")
public class BillingController {




    @Autowired
    private BillingService billingService;

    @PostMapping("/add")
    public ResponseEntity<Response>addBilling(@RequestBody  Billing billing){
         return ResponseEntity.ok(billingService.addBill(billing));
    }
    public ResponseEntity<Response>deleteBilling(@PathVariable int id){
        return ResponseEntity.ok(billingService.deleteBilling(id));
    }
}




