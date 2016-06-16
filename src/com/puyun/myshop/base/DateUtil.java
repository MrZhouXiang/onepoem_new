package com.puyun.myshop.base;

import java.util.Date;

public class DateUtil
{
    public static final String YYYY_MM_DD_HHMMSS = "yyyy-MM-dd HH:mm:ss";
    
    public static final String YYYY_MM_DD_HHMMSSSSS = "yyyyMMddHHmmssSSS";
    
    public static String getDate(String f)
    {
        java.text.DateFormat format1 = new java.text.SimpleDateFormat(f);
        String createDate = format1.format(new Date());
        return createDate;
    }
    
}
