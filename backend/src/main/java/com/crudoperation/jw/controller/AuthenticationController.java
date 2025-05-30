package com.crudoperation.jw.controller;

import com.crudoperation.jw.dto.LoginRequest;
import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.service.serviceImp.UserService;
import com.crudoperation.jw.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/authentication")
public class AuthenticationController {


    private UserService userService;

    public AuthenticationController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<Response>registerUser(@RequestBody User user){
        return ResponseEntity.ok(userService.addUser(user));
    }
    @PostMapping("/login")
    public ResponseEntity<Response>loginUser(@RequestBody LoginRequest loginRequest){
        return ResponseEntity.ok(userService.authenticateUser(loginRequest));
    }

}
