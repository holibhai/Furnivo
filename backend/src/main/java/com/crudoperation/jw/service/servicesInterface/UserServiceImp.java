package com.crudoperation.jw.service.servicesInterface;

import com.crudoperation.jw.dto.LoginRequest;
import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.User;

import java.util.List;

public interface UserServiceImp {

    public Response  addUser(User user);
//    public Response  updateUser(User user,int userId);
    public Response  deleteUserAccount(int userId);
    public Response  getAllUsers();
    public Response  getUserById(int id);
    public Response authenticateUser(LoginRequest loginRequest);


}
