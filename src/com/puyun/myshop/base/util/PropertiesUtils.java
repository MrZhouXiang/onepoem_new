package com.puyun.myshop.base.util;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.Properties;

public class PropertiesUtils {  
/**
 * 取得属性文件
 * @param fileName 文件名
 * @return
 */
    public static Properties getProperties(String fileName){  
    	
        Properties prop = new Properties();  
        String savePath = PropertiesUtils.class.getResource(fileName).getPath(); 
        try {  
            InputStream in =new BufferedInputStream(new FileInputStream(savePath));    
            prop.load(in);  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
        return prop;  
    }  
    /** 
     * 写入properties信息 
     * @param key 名称 
     * @param value 值 
     * @param fileName 文件名
     */ 
    public static void modifyProperties(String key, String value,String fileName) {  
        try {  
            // 从输入流中读取属性列表（键和元素对）  
            Properties prop = getProperties(fileName);  
            prop.setProperty(key, value);  
            String path = PropertiesUtils.class.getResource(fileName).getPath();  
            FileOutputStream outputFile = new FileOutputStream(path);  
            prop.store(outputFile, "modify");  
            outputFile.close();  
            outputFile.flush();  
        } catch (Exception e) {  
        	e.printStackTrace();
        }  
    }  
}  