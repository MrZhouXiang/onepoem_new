package com.puyun.myshop.base.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.iuvei.framework.util.ObjectUtils;

/**
 * 时间转换工具类
 * 
 * @author zsw
 * 
 */
public class TimeConvertUtils
{
    private static final Logger LOG = LoggerFactory.getLogger(TimeConvertUtils.class);
    
    public static String getStringParameter(Object obj)
    {
        return getStringParameter(obj, null);
    }
    
    public static String getStringParameter(Object obj, String defaultValue)
    {
        if (obj == null)
            return defaultValue;
        return ObjectUtils.toString(obj);
    }
    
    public static Integer getIntParameter(Object obj)
    {
        return getIntParameter(obj, 0);
    }
    
    public static int getIntParameter(Object obj, int defaultValue)
    {
        Integer i = getIntegerParameter(obj);
        if (i == null)
        {
            LOG.warn("obj is null, return " + defaultValue);
            return defaultValue;
        }
        else
        {
            return i.intValue();
        }
    }
    
    public static Integer getIntegerParameter(Object obj)
    {
        return getIntegerParameter(obj, null);
    }
    
    public static Integer getIntegerParameter(Object obj, Integer defaultValue)
    {
        if (obj == null)
            return defaultValue;
        
        try
        {
            return ObjectUtils.toInteger(obj);
        }
        catch (NumberFormatException e)
        {
            LOG.warn("number format error ,return " + defaultValue);
            return defaultValue;
        }
    }
    
    /**
     * 时间的正则表达式
     * 
     * @return
     */
    public static boolean checkDate(String str)
    {
        // ^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$
        Pattern p = Pattern.compile("^\\d{4}(\\-|\\/|\\.)\\d{1,2}\\1\\d{1,2}$");
        Matcher m = p.matcher(str);
        return m.matches();
    }
    
}
