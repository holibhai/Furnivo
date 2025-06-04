package com.crudoperation.jw.service.servicesInterface;

import com.crudoperation.jw.dto.Response;
import com.crudoperation.jw.model.Favaurite;

public interface FavouriteImpl {
    public Response addFavaurite(Favaurite favaurite, int userId);
    public Response getProducts(int userId);
    public Response deleteFav( int productId);
}
