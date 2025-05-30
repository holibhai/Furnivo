package com.crudoperation.jw.service.serviceImp;

import com.crudoperation.jw.dto.LoginRequest;
import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.dto.UserAccountDto;
import com.crudoperation.jw.exception.OurException;
import com.crudoperation.jw.model.Billing;
import com.crudoperation.jw.model.Role;
//import com.crudoperation.jw.repo.AddressRepository;
import com.crudoperation.jw.repo.BillingRepository;
import com.crudoperation.jw.repo.UserRepository;
import com.crudoperation.jw.model.User;
import com.crudoperation.jw.service.servicesInterface.UserServiceImp;
import com.crudoperation.jw.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserServiceImp {



    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;
    //    @Autowired
//    private AddressRepository addressRepository;
    @Autowired
    private BillingRepository billingRepository;





    public Response addUser(User user) {
        Response response=new Response();
        try{
            if(user.getRole()==null){
                user.setRole(Role.valueOf("USER"));
            }
            if(userRepository.existsByUsername(user.getUsername())){
                throw new OurException("User already exists");
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
//            Address address = user.getAddress();
//            if(address != null) {
//                address.setUser(user);
//            }

            User savedUser = userRepository.save(user);
            UserAccountDto userAccountDto= Utils.mapUserEntityToUserDTO(savedUser);
            response.setStatusCode(200);
            response.setMessage("User added successfully");
            response.setUserAccountDto(userAccountDto);

        }catch (OurException e){
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        }
        return response;
    }



    public Response authenticateUser(LoginRequest loginRequest) {
        Response response=new Response();
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
            User user = (User) userRepository.findByUsername(loginRequest.getUsername()).orElseThrow(() -> new OurException("user Not found"));
            String token = jwtService.generateToken(user);
            response.setStatusCode(200);
            response.setMessage("User authenticated successfully");
            response.setToken(token);

            UserAccountDto userAccountDto= Utils.mapUserEntityToUserDTO(user);
            response.setUserAccountDto(userAccountDto);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error Occurred During USer Login " + e.getMessage());
        }
        return response;
    }


    public Response getAllUsers() {
        Response response=new Response();
        try {
            List<User> users = userRepository.findAll();

            List<UserAccountDto> userAccountDtoList = new ArrayList<>();

            for (User user : users) {
                UserAccountDto userAccountDto = Utils.mapUserEntityToUserDTO(user);
                userAccountDtoList.add(userAccountDto);
            }
            response.setStatusCode(200);
            response.setMessage("Users found");
            response.setUserAccountDtoList(userAccountDtoList);
        }catch (OurException e){
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        }
        return response;


    }

    public Response getUserById(int userId) {
        Response response=new Response();
        try{
            User user = userRepository.findById(userId).orElseThrow(() -> new OurException("user Not found"));
            UserAccountDto userAccountDto = Utils.mapUserEntityToUserDTO(user);
            response.setUserAccountDto(userAccountDto);
            response.setStatusCode(200);
            response.setMessage("UserId has founded");

        }catch (OurException e){
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response deleteUserAccount(int userId) {
        Response response=new Response();
        try {
            Optional<User> user = userRepository.findById(userId);
            if(user.isPresent()){
                List<Billing> billings = billingRepository.findByUserId(userId);
                billingRepository.deleteAll(billings); // பில் entries delete செய்கிறோம்
                userRepository.deleteById(userId);
                response.setStatusCode(200);
                response.setMessage("User deleted successfully");
            }
        }catch (OurException e){
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response updateUser(User user, MultipartFile imageFile, int userId) {
        Response response=new Response();
        try{
            User userEntity = userRepository.findById(userId).orElseThrow(() -> new OurException("user Not found"));
            if(imageFile != null){
                userEntity.setImageData(imageFile.getBytes());
                userEntity.setImageName(imageFile.getOriginalFilename());
                userEntity.setImageType(imageFile.getContentType());
            }
            userEntity.setUsername(user.getUsername());
//            userEntity.setPassword(passwordEncoder.encode(user.getPassword()));

            userEntity.setFirstName(user.getFirstName());
            userEntity.setLastName(user.getLastName());



            userRepository.save(userEntity);
            UserAccountDto userAccountDto = Utils.mapUserEntityToUserDTO(userEntity);
            response.setUserAccountDto(userAccountDto);
            response.setStatusCode(200);
            response.setMessage("User updated successfully");

        }catch (OurException | IOException e){
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        }
        return response;

    }
}
