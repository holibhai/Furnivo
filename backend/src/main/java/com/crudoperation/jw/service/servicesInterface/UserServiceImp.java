package com.crudoperation.jw.service.servicesInterface;

import com.crudoperation.jw.dto.LoginRequest;
import com.crudoperation.jw.dto.Password;
import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public interface UserServiceImp {

    public Response  addUser(User user);
//    public Response  updateUser(User user,int userId);
    public Response  deleteUserAccount(int userId);
    public Response  getAllUsers();
    public Response  getUserById(int id);
    public Response authenticateUser(LoginRequest loginRequest);
    public Response updateUser(User user, MultipartFile imageFile, int userId);
    public Response addDate(int userId, LocalDate date);
    public Response changePassword(int userId, Password password);


}
