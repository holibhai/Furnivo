package com.crudoperation.jw.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.apache.catalina.User;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class BillingDto {

    private int id;
    private String firstName;
    private String lastName;
    private String email;
    private String mobileNumber;
    private User user;

    public BillingDto(int id, String firstName, String lastName, String email, String mobileNumber, User user) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.user = user;
    }
    public BillingDto() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
