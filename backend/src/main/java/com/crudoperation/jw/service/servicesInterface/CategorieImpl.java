package com.crudoperation.jw.service.servicesInterface;

import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.Catagorie;

public interface CategorieImpl {
    public Response add(Catagorie catagorie);
    public Response getCatagorie();

    public Response updateCatagory(Catagorie catagorie, int id);
    public Response deleteCatagory(int id);
    public Response getCatagory(int id);
}
