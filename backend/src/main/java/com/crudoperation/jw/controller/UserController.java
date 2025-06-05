package com.crudoperation.jw.controller;

import com.crudoperation.jw.dto.Password;
import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.User;
import com.crudoperation.jw.service.serviceImp.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

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
    public ResponseEntity<Response> update(
            @RequestPart User user,
            @RequestPart(required = false) MultipartFile imageFile,
            @PathVariable int userId) {

        if (imageFile != null && !imageFile.isEmpty()) {
            System.out.println("Uploaded file name: " + imageFile.getOriginalFilename());
        } else {
            System.out.println("No image file uploaded.");
        }


        return ResponseEntity.ok(userService.updateUser(user, imageFile, userId));
    }



    @PutMapping("/updateDate/{userId}/{date}")
    public ResponseEntity<Response>updateDate(@PathVariable int userId,@PathVariable LocalDate date){
        System.out.println(date);
        return ResponseEntity.ok(userService.addDate(userId,date));
    }

    @PutMapping("/changePassword/{userId}")
    public ResponseEntity<Response>changePassword(@PathVariable int userId,@RequestBody Password password){
         return ResponseEntity.ok(userService.changePassword(userId,password));
    }


}
