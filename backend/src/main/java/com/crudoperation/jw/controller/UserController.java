package com.crudoperation.jw.controller;

import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.User;
import com.crudoperation.jw.service.serviceImp.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/getUsers")
    public ResponseEntity<Response>getUsers(){
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/getUser/{userId}")
    public ResponseEntity<Response>getUserById(@PathVariable("userId") int userId){
        return ResponseEntity.ok(userService.getUserById(userId));
    }
    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<Response>deleteUserById(@PathVariable int userId){
        return ResponseEntity.ok(userService.deleteUserAccount(userId));
    }

    @PutMapping("/updateUser/{userId}")
    public ResponseEntity<Response>update(@RequestPart User user, @RequestPart MultipartFile imageFile,@PathVariable int userId){
        System.out.println(imageFile.getOriginalFilename());
        System.out.println(user.getPassword());
        return ResponseEntity.ok(userService.updateUser(user,imageFile,userId));
    }

}
