package com.crudoperation.jw.dto;

import com.crudoperation.jw.model.Role;
import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Lob;

import java.time.LocalDate;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserAccountDto {


    private int id;
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private Role role;
    private LocalDate date;
//    private Address addressUser;
    private String imageName;
    private String imageType;
    @Lob
    private byte[] imageData;


    public UserAccountDto(int id, String username, String password, String firstName, String lastName, Role role, LocalDate date, String imageName, String imageType, byte[] imageData) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.date = date;
        this.imageName = imageName;
        this.imageType = imageType;
        this.imageData = imageData;
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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}

