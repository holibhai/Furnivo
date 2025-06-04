package com.crudoperation.jw.service.serviceImp;

import com.crudoperation.jw.dto.FavauriteDto;
import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.Favaurite;
import com.crudoperation.jw.model.User;
import com.crudoperation.jw.repo.FavauriteRepository;
import com.crudoperation.jw.repo.UserRepository;
import com.crudoperation.jw.service.servicesInterface.FavouriteImpl;
import com.crudoperation.jw.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FavauriteService implements FavouriteImpl {

    @Autowired
    private FavauriteRepository favauriteRepository;

    @Autowired
    private UserRepository userRepository;

    public Response addFavaurite(Favaurite favaurite,int userId) {
        Response response = new Response();
        try{
            List<Favaurite> favaurites = favauriteRepository.findByUserId(userId);
            if (favaurites.size() > 0) {
                for (Favaurite f : favaurites) {
                    if (f.getProductId() == favaurite.getProductId()) {
                        response.setMessage("product already exist");
                        response.setStatusCode(200);
                        return response;
                    }
                }
            }
            favaurite.setUser(userRepository.findById(userId).get());
            Favaurite favaurite1 = favauriteRepository.save(favaurite);
            FavauriteDto favauriteDto = Utils.mapFavauriteEntityToFavauriteDto(favaurite1);
            response.setFavauriteDto(favauriteDto);
            response.setMessage("Success");
            response.setStatusCode(201);

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response getProducts(int userId) {
        Response response = new Response();
        try{
            List<Favaurite> favaurites = favauriteRepository.findByUserId(userId);
            List<FavauriteDto>favauriteDtoList=Utils.mapFavauriteEntityToFavauriteListDTO(favaurites);
            response.setFavauriteDtoList(favauriteDtoList);
            response.setMessage("Success");
            response.setStatusCode(200);
        }catch(Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response deleteFav( int productId) {
        Response response = new Response();
        try{
            Optional<Favaurite> favaurite=favauriteRepository.findById(productId);
            if(favaurite.isPresent()){
                favauriteRepository.delete(favaurite.get());
                response.setMessage("Success");
                response.setStatusCode(200);
            }
        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }
}
