package com.crudoperation.jw.utils;

import java.util.Random;

public class OrderIdGenerator {
    private static final Random random = new Random();

    public static String generateOrderId() {
        int number = 10000000 + random.nextInt(90000000); // Ensures 8 digits
        return String.valueOf(number);
    }
}
