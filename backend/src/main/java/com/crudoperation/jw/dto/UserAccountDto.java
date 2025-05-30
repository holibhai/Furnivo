package com.crudoperation.jw.dto;

import com.crudoperation.jw.model.Role;
import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Lob;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserAccountDto {


    private int id;
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private Role role;
//    private Address addressUser;
    private String imageName;
    private String imageType;
    @Lob
    private byte[] imageData;



//    private AddressDto address;

    public UserAccountDto(int id, String username, String password, String firstName, String lastName, Role role, String imageName, String imageType, byte[] imageData) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.imageName = imageName;
        this.imageType = imageType;
        this.imageData = imageData;
//        this.address = address;
    }

    public
    UserAccountDto() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

//    public AddressDto getAddress() {
//        return address;
//    }
//
//    public void setAddress(AddressDto address) {
//        this.address = address;
//    }



    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public String getImageType() {
        return imageType;
    }

    public void setImageType(String imageType) {
        this.imageType = imageType;
    }

    public byte[] getImageData() {
        return imageData;
    }

    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }
}

