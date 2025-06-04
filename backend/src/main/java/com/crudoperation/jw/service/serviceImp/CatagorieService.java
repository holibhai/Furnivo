package com.crudoperation.jw.service.serviceImp;

import com.crudoperation.jw.dto.CatagorieDto;
import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.exception.OurException;
import com.crudoperation.jw.model.Catagorie;
import com.crudoperation.jw.repo.CatagorieRepository;
import com.crudoperation.jw.service.servicesInterface.CategorieImpl;
import com.crudoperation.jw.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CatagorieService implements CategorieImpl {


    @Autowired
    private CatagorieRepository catagorieRepository;

    public Response add(Catagorie catagorie) {
        Response response = new Response();
        try{
            Catagorie catagorie1=catagorieRepository.save(catagorie);
            response.setMessage("Success");
            response.setStatusCode(200);
            CatagorieDto catagorieDto= Utils.mapCatagorieEntityToCatagorieDto(catagorie1);
            response.setCatagorieDto(catagorieDto);
        }catch(OurException e){
            response.setStatusCode(500);
            response.setMessage("Error");
        }
        return response;
    }
    public Response getCatagorie() {
        Response response = new Response();
//        List<Catagorie> catagorieList=new ArrayList<Catagorie>();
        try{
            List<Catagorie> catagories=catagorieRepository.findAll();
            List<CatagorieDto> catagorieDtoList=Utils.mapCatagorieListEntityToCatagorieListDTO(catagories);
            response.setCatagorieDtoList(catagorieDtoList);
            response.setMessage("Success");
            response.setStatusCode(200);

        }catch(OurException e){
            response.setStatusCode(500);
            response.setMessage("Error");

        }
        return response;
    }

    public Response updateCatagory(Catagorie catagorie, int id) {
        Response response = new Response();
        try{
            Optional<Catagorie> catagorie1=catagorieRepository.findById(id);
            if(catagorie1.isPresent()){
                Catagorie catagorie2=catagorie1.get();
                catagorie2.setCatagorieDescription(catagorie.getCatagorieDescription());
                catagorie2.setCatagorieType(catagorie.getCatagorieType());
                catagorieRepository.save(catagorie2);
                response.setMessage("Success");
                response.setStatusCode(200);

            }

        }catch (OurException e){
            response.setStatusCode(500);
            response.setMessage("Error");
        }
        return response;
    }

    public Response deleteCatagory(int id) {
        Response response = new Response();
        try{
            catagorieRepository.deleteById(id);
            response.setMessage("Success");
            response.setStatusCode(200);
        }catch (OurException e){
            response.setStatusCode(500);
            response.setMessage("Error");
        }
        return response;
    }

    public Response getCatagory(int id) {
        Response response=new Response();
        try{
            Optional<Catagorie>catagorie=catagorieRepository.findById(id);
            if(catagorie.isPresent()){
                response.setMessage("Success");
                response.setStatusCode(200);
                CatagorieDto catagorieDto=Utils.mapCatagorieEntityToCatagorieDto(catagorie.get());
                response.setCatagorieDto(catagorieDto);
            }
        }catch(OurException e){
            response.setStatusCode(500);
            response.setMessage("Error");
        }
        return response;
    }
}
